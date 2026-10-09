import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getDatabase, 
  ref, 
  push, 
  set, 
  get, 
  remove,
  query, 
  limitToLast, 
  onValue, 
  Database 
} from "firebase/database";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User, 
  Auth 
} from "firebase/auth";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

// User provided Firebase configuration for scamshield-9621b
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDqFHd9wKzXR6yYotqmo6F4MgdgOuF7gY8",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "scamshield-9621b.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "scamshield-9621b",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "scamshield-9621b.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "254971834134",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:254971834134:web:6d1881c7d9dc3bae296a37",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-YLCSM4VQD4",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://scamshield-9621b-default-rtdb.firebaseio.com"
};

// Singleton Firebase initialization
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

let rtdb: Database | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;
let analytics: Analytics | null = null;

try {
  rtdb = getDatabase(app);
} catch (err) {
  console.warn("Could not initialize Realtime Database client:", err);
}

try {
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: "select_account" });
} catch (err) {
  console.warn("Could not initialize Firebase Auth:", err);
}

// Client-side Analytics initialization
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((err) => {
    console.debug("Firebase Analytics client notice:", err);
  });
}

// -------------------------------------------------------------
// DATA INTERFACES
// -------------------------------------------------------------

export interface ThreatReport {
  id?: string;
  type: "url" | "message" | "qr" | "omni";
  target: string;
  riskScore: number;
  riskLevel: "SAFE" | "SUSPICIOUS" | "HIGH_RISK";
  summary: string;
  flags: string[];
  userNotes?: string;
  reportedBy?: {
    uid?: string;
    displayName?: string;
    email?: string;
    photoURL?: string;
  };
  timestamp: string | number;
}

export interface UserScanRecord {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  type: "url" | "message" | "qr" | "omni";
  target: string;
  riskScore: number;
  riskLevel: "SAFE" | "SUSPICIOUS" | "HIGH_RISK";
  summary: string;
  flags: string[];
  metrics?: {
    domainTrust?: number;
    protocolSecurity?: number;
    linguisticUrgency?: number;
    impersonationRisk?: number;
    zeroTrustScore?: number;
  };
  timestamp: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: "admin" | "analyst" | "citizen";
  totalScans: number;
  lastLogin: string;
  joinedAt: string;
}

export interface SocialStory {
  id: string;
  title: string;
  authorName: string;
  authorEmail?: string;
  authorPhoto?: string;
  userId?: string;
  scamType: "UPI_FRAUD" | "PHISHING_LINK" | "ELECTRICITY_BILL" | "WHATSAPP_CALL" | "JOB_SCAM" | "CUSTOMS_PARCEL" | "OTHER";
  lossAmount?: string;
  status: "PREVENTED" | "LOSS_INCURRED";
  story: string;
  lessonLearned: string;
  likesCount: number;
  likedBy?: string[];
  timestamp: string;
  verified?: boolean;
}

let localReportsCache: ThreatReport[] = [];
let localStoriesCache: SocialStory[] = [];
let localUserScansCache: { [userId: string]: UserScanRecord[] } = {};

// Helper to run promise with strict timeout
function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 2500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Timeout")), timeoutMs))
  ]);
}

// -------------------------------------------------------------
// GLOBAL THREAT REPORTS
// -------------------------------------------------------------

export async function saveThreatReport(report: Omit<ThreatReport, "id" | "timestamp"> & { timestamp?: any }) {
  const newReport: ThreatReport = {
    ...report,
    id: `rep-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toISOString()
  };

  if (rtdb) {
    try {
      const reportsRef = ref(rtdb, "threat_reports");
      const newRef = push(reportsRef);
      await withTimeout(set(newRef, { ...newReport, id: newRef.key }), 2500);
      return { id: newRef.key, success: true, storage: "realtime-database" };
    } catch (err: any) {
      console.warn("RTDB write fallback:", err?.message || err);
    }
  }

  localReportsCache.unshift(newReport);
  return { id: newReport.id, success: true, storage: "cache-resilient" };
}

export async function getRecentThreatReports(count: number = 10): Promise<ThreatReport[]> {
  if (rtdb) {
    try {
      const reportsRef = query(ref(rtdb, "threat_reports"), limitToLast(count));
      const snapshot = await withTimeout(get(reportsRef), 2500);
      if (snapshot.exists()) {
        const val = snapshot.val();
        const list: ThreatReport[] = Object.keys(val).map(key => ({
          ...val[key],
          id: key
        }));
        list.reverse();
        if (list.length > 0) return list;
      }
    } catch (err: any) {
      console.warn("RTDB query notice:", err?.message || err);
    }
  }

  return localReportsCache.slice(0, count);
}

export function subscribeToRealtimeThreatReports(
  callback: (reports: ThreatReport[]) => void
): () => void {
  if (!rtdb) {
    callback(localReportsCache);
    return () => {};
  }

  try {
    const reportsRef = query(ref(rtdb, "threat_reports"), limitToLast(20));
    const unsubscribe = onValue(
      reportsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const list: ThreatReport[] = Object.keys(val).map(key => ({
            ...val[key],
            id: key
          }));
          list.reverse();
          callback(list);
        } else {
          callback(localReportsCache);
        }
      },
      (error) => {
        console.warn("Realtime listener error:", error);
        callback(localReportsCache);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn("Failed to set up Realtime listener:", err);
    callback(localReportsCache);
    return () => {};
  }
}

// -------------------------------------------------------------
// USER SPECIFIC SCANS & HISTORY (Task 2)
// -------------------------------------------------------------

export async function saveUserScanRecord(userId: string, scanData: Omit<UserScanRecord, "id" | "timestamp" | "userId">): Promise<UserScanRecord> {
  const newScan: UserScanRecord = {
    ...scanData,
    id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    userId,
    timestamp: new Date().toISOString()
  };

  // Sync to local memory cache
  if (!localUserScansCache[userId]) {
    localUserScansCache[userId] = [];
  }
  localUserScansCache[userId].unshift(newScan);

  // Sync to localStorage
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(`scamshield_history_${userId}`);
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newScan);
      localStorage.setItem(`scamshield_history_${userId}`, JSON.stringify(list.slice(0, 50)));
    } catch (e) {
      console.warn("localStorage write notice:", e);
    }
  }

  // Sync to Firebase RTDB under users/{userId}/scans
  if (rtdb) {
    try {
      const userScansRef = ref(rtdb, `users/${userId}/scans`);
      const newRef = push(userScansRef);
      await withTimeout(set(newRef, { ...newScan, id: newRef.key }), 2500);
      newScan.id = newRef.key || newScan.id;
    } catch (err) {
      console.warn("RTDB user scan write notice:", err);
    }
  }

  return newScan;
}

export function subscribeToUserScans(userId: string, callback: (scans: UserScanRecord[]) => void): () => void {
  // Try localStorage first for instant render
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(`scamshield_history_${userId}`);
      if (stored) {
        callback(JSON.parse(stored));
      } else if (localUserScansCache[userId]) {
        callback(localUserScansCache[userId]);
      }
    } catch (e) {}
  }

  if (!rtdb) {
    callback(localUserScansCache[userId] || []);
    return () => {};
  }

  try {
    const userScansRef = query(ref(rtdb, `users/${userId}/scans`), limitToLast(50));
    const unsubscribe = onValue(
      userScansRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const list: UserScanRecord[] = Object.keys(val).map(key => ({
            ...val[key],
            id: key
          }));
          list.reverse();
          localUserScansCache[userId] = list;
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(`scamshield_history_${userId}`, JSON.stringify(list));
            } catch (e) {}
          }
          callback(list);
        } else {
          callback(localUserScansCache[userId] || []);
        }
      },
      (err) => {
        console.warn("User scans listener notice:", err);
        callback(localUserScansCache[userId] || []);
      }
    );
    return unsubscribe;
  } catch (err) {
    callback(localUserScansCache[userId] || []);
    return () => {};
  }
}

export async function deleteUserScanRecord(userId: string, scanId: string): Promise<void> {
  if (localUserScansCache[userId]) {
    localUserScansCache[userId] = localUserScansCache[userId].filter(s => s.id !== scanId);
  }
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(`scamshield_history_${userId}`);
      if (stored) {
        const list = JSON.parse(stored).filter((s: any) => s.id !== scanId);
        localStorage.setItem(`scamshield_history_${userId}`, JSON.stringify(list));
      }
    } catch (e) {}
  }

  if (rtdb) {
    try {
      const scanRef = ref(rtdb, `users/${userId}/scans/${scanId}`);
      await withTimeout(remove(scanRef), 2000);
    } catch (err) {
      console.warn("RTDB delete notice:", err);
    }
  }
}

// -------------------------------------------------------------
// SOCIAL AWARENESS STORIES (Task 3)
// -------------------------------------------------------------

export async function saveSocialStory(storyData: Omit<SocialStory, "id" | "timestamp" | "likesCount" | "likedBy">): Promise<SocialStory> {
  const newStory: SocialStory = {
    ...storyData,
    id: `story-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    likesCount: 0,
    likedBy: [],
    timestamp: new Date().toISOString(),
    verified: false
  };

  localStoriesCache.unshift(newStory);

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("scamshield_social_stories");
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newStory);
      localStorage.setItem("scamshield_social_stories", JSON.stringify(list));
    } catch (e) {}
  }

  if (rtdb) {
    try {
      const storiesRef = ref(rtdb, "social_stories");
      const newRef = push(storiesRef);
      await withTimeout(set(newRef, { ...newStory, id: newRef.key }), 2500);
      newStory.id = newRef.key || newStory.id;
    } catch (err) {
      console.warn("RTDB story write notice:", err);
    }
  }

  return newStory;
}

export function subscribeToSocialStories(callback: (stories: SocialStory[]) => void): () => void {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("scamshield_social_stories");
      if (stored) {
        callback(JSON.parse(stored));
      } else {
        callback(localStoriesCache);
      }
    } catch (e) {
      callback(localStoriesCache);
    }
  } else {
    callback(localStoriesCache);
  }

  if (!rtdb) {
    return () => {};
  }

  try {
    const storiesRef = query(ref(rtdb, "social_stories"), limitToLast(50));
    const unsubscribe = onValue(
      storiesRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const list: SocialStory[] = Object.keys(val).map(key => ({
            ...val[key],
            id: key
          }));
          list.reverse();
          localStoriesCache = list;
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("scamshield_social_stories", JSON.stringify(list));
            } catch (e) {}
          }
          callback(list);
        } else {
          callback(localStoriesCache);
        }
      },
      (err) => {
        console.warn("Social stories listener notice:", err);
        callback(localStoriesCache);
      }
    );
    return unsubscribe;
  } catch (err) {
    callback(localStoriesCache);
    return () => {};
  }
}

export async function toggleLikeSocialStory(storyId: string, userId: string): Promise<void> {
  const story = localStoriesCache.find(s => s.id === storyId);
  if (story) {
    if (!story.likedBy) story.likedBy = [];
    const hasLiked = story.likedBy.includes(userId);
    if (hasLiked) {
      story.likedBy = story.likedBy.filter(id => id !== userId);
      story.likesCount = Math.max(0, story.likesCount - 1);
    } else {
      story.likedBy.push(userId);
      story.likesCount += 1;
    }

    if (rtdb) {
      try {
        const storyRef = ref(rtdb, `social_stories/${storyId}`);
        await withTimeout(set(storyRef, story), 2000);
      } catch (e) {}
    }
  }
}

export async function deleteSocialStory(storyId: string): Promise<void> {
  localStoriesCache = localStoriesCache.filter(s => s.id !== storyId);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("scamshield_social_stories", JSON.stringify(localStoriesCache));
    } catch (e) {}
  }
  if (rtdb) {
    try {
      const storyRef = ref(rtdb, `social_stories/${storyId}`);
      await withTimeout(remove(storyRef), 2000);
    } catch (e) {}
  }
}

export async function verifySocialStory(storyId: string, verified: boolean): Promise<void> {
  const story = localStoriesCache.find(s => s.id === storyId);
  if (story) {
    story.verified = verified;
    if (rtdb) {
      try {
        const storyRef = ref(rtdb, `social_stories/${storyId}`);
        await withTimeout(set(storyRef, story), 2000);
      } catch (e) {}
    }
  }
}

// -------------------------------------------------------------
// USER PROFILE & ADMIN CONSOLE (Task 7)
// -------------------------------------------------------------

export async function syncUserProfile(user: User): Promise<void> {
  const profile: UserProfile = {
    uid: user.uid,
    displayName: user.displayName || user.email?.split("@")[0] || "SecOps User",
    email: user.email || "",
    photoURL: user.photoURL || "",
    role: (user.email?.includes("admin") || user.email?.includes("yashraj") || user.email?.includes("aastik")) ? "admin" : "analyst",
    totalScans: localUserScansCache[user.uid]?.length || 1,
    lastLogin: new Date().toISOString(),
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString()
  };

  if (rtdb) {
    try {
      const userRef = ref(rtdb, `user_profiles/${user.uid}`);
      await withTimeout(set(userRef, profile), 2000);
    } catch (e) {}
  }
}

export async function getAllUsersForAdmin(): Promise<UserProfile[]> {
  if (rtdb) {
    try {
      const usersRef = ref(rtdb, "user_profiles");
      const snapshot = await withTimeout(get(usersRef), 2000);
      if (snapshot.exists()) {
        const val = snapshot.val();
        const list: UserProfile[] = Object.values(val);
        return list;
      }
    } catch (e) {}
  }

  return [];
}

export async function updateUserRole(uid: string, role: "admin" | "analyst" | "citizen"): Promise<boolean> {
  if (rtdb) {
    try {
      const userRef = ref(rtdb, `user_profiles/${uid}/role`);
      await withTimeout(set(userRef, role), 2000);
      return true;
    } catch (e) {
      console.warn("Error updating user role in RTDB:", e);
    }
  }
  return true;
}

// -------------------------------------------------------------
// AUTH HELPERS
// -------------------------------------------------------------

export async function signInWithGoogle(): Promise<User | null> {
  if (!auth || !googleProvider) {
    throw new Error("Firebase Auth is not initialized");
  }
  const result = await signInWithPopup(auth, googleProvider);
  if (result.user) {
    syncUserProfile(result.user);
  }
  return result.user;
}

export async function signOutUser(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

export function subscribeToAuthChanges(callback: (user: User | null) => void): () => void {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      syncUserProfile(user);
    }
    callback(user);
  });
}

export { app, rtdb, auth, analytics };
