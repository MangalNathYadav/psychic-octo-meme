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

// Seed telemetry reports
const initialSeedReports: ThreatReport[] = [
  {
    id: "sample-1",
    type: "url",
    target: "http://sbl-kyc-update.xyz/login.php",
    riskScore: 94,
    riskLevel: "HIGH_RISK",
    summary: "SBI Typosquatting domain (<7 days old) harvesting credentials with unverified SSL certificate.",
    flags: ["Domain Age < 7 Days", "Known Typosquatting Pattern", "Missing EV SSL", "High Urgency Action"],
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    userNotes: "Received via SMS alleging YONO account block."
  },
  {
    id: "sample-2",
    type: "qr",
    target: "upi://pay?pa=scammer89@ybl&pn=Electricity%20Dept&am=1&cu=INR",
    riskScore: 88,
    riskLevel: "HIGH_RISK",
    summary: "Reverse QR Scam: Payee claims Electricity Dept but routes to individual VPA with auto-debit request.",
    flags: ["Payee Name Mismatch", "Reverse Charge Vector", "Unregistered Merchant VPA"],
    timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    userNotes: "Electricity bill disconnection warning pasted on door."
  },
  {
    id: "sample-3",
    type: "message",
    target: "Dear customer your SBI Netbanking is blocked. Update Pan card click here immediately.",
    riskScore: 91,
    riskLevel: "HIGH_RISK",
    summary: "Classic panic-induction social engineering attempting credential harvesting under 24hr threat.",
    flags: ["Urgency Score: 92/100", "Authority Impersonation: State Bank of India", "Panic Trigger: Blocked Account"],
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    userNotes: "SMS sent from unknown 10-digit number +91-9876543210"
  },
  {
    id: "sample-4",
    type: "url",
    target: "https://www.onlinesbi.sbi/",
    riskScore: 4,
    riskLevel: "SAFE",
    summary: "Legitimate State Bank of India secure portal with authentic certificate and trusted TLD.",
    flags: ["Verified Official Domain", "Valid EV SSL Certificate", "Established Domain Age (>15 yrs)"],
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    userNotes: "Official NetBanking URL check."
  }
];

// Seed initial social awareness stories
const initialSeedStories: SocialStory[] = [
  {
    id: "story-1",
    title: "Fake BESCOM Electricity Disconnection SMS at 9:15 PM",
    authorName: "Rohan Sharma",
    userId: "demo-user-1",
    scamType: "ELECTRICITY_BILL",
    lossAmount: "₹0 (Shielded by ScamShield)",
    status: "PREVENTED",
    story: "Received an SMS stating our power will be disconnected at 9:30 PM due to unpaid bill of ₹2,850. The message had a link to a site claiming to be BESCOM. I pasted the link into ScamShield and it immediately flagged the .live domain and unverified personal UPI handle. Called our electricity board helpline the next morning and confirmed my bills were already fully cleared!",
    lessonLearned: "Utilities never threaten immediate disconnection via random 10-digit mobile SMS. Always cross-check on official portal or bill receipt.",
    likesCount: 38,
    likedBy: [],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    verified: true
  },
  {
    id: "story-2",
    title: "OLX Buyer sent 'Scan this QR to Receive Advance' Trap",
    authorName: "Pooja V.",
    userId: "demo-user-2",
    scamType: "UPI_FRAUD",
    lossAmount: "₹5,000 Lost",
    status: "LOSS_INCURRED",
    story: "I listed a sofa on OLX. A buyer agreed immediately and sent a QR code on WhatsApp saying 'Scan to receive ₹5,000 token advance'. I scanned on PhonePe and it prompted me for my UPI PIN. He kept saying 'Yes ma'am, enter PIN to approve credit'. The moment I entered PIN, ₹5,000 was debited. Lodged a complaint on 1930 within 45 minutes.",
    lessonLearned: "NEVER enter UPI PIN to receive money! Entering your PIN ONLY debits your account. Scanning a QR code can never deposit funds into your wallet.",
    likesCount: 64,
    likedBy: [],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    verified: true
  },
  {
    id: "story-3",
    title: "WhatsApp Video Call posing as CBI Officer (Digital Arrest)",
    authorName: "Anand M.",
    userId: "demo-user-3",
    scamType: "WHATSAPP_CALL",
    lossAmount: "₹0 (Shielded in time)",
    status: "PREVENTED",
    story: "Got a video call from an account with CBI insignia. They claimed my Aadhaar was linked to money laundering in Mumbai and threatened 'digital arrest' unless I transferred security deposit to an RBI verification account. My daughter stopped me and showed me the official advisory that police never conducts digital arrests via Skype/WhatsApp.",
    lessonLearned: "No Indian law enforcement agency or court conducts trials or arrests over video calls. Hang up and dial 1930 immediately.",
    likesCount: 82,
    likedBy: [],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    verified: true
  }
];

let localReportsCache: ThreatReport[] = [...initialSeedReports];
let localStoriesCache: SocialStory[] = [...initialSeedStories];
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
      const list = stored ? JSON.parse(stored) : [...initialSeedStories];
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
  const defaultProfiles: UserProfile[] = [
    {
      uid: "user-lead-1",
      displayName: "Aastik Tripathi (Lead)",
      email: "aastik.tripathi2026@vitbhopal.ac.in",
      role: "admin",
      totalScans: 48,
      lastLogin: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      joinedAt: "2026-09-28T10:00:00.000Z"
    },
    {
      uid: "user-fullstack-2",
      displayName: "Yash Raj Kushwaha",
      email: "yashrajkushwaha92@gmail.com",
      role: "admin",
      totalScans: 62,
      lastLogin: new Date().toISOString(),
      joinedAt: "2026-09-28T10:00:00.000Z"
    },
    {
      uid: "user-nlp-3",
      displayName: "Palak Kalra",
      email: "palak.kalra2026@vitbhopal.ac.in",
      role: "analyst",
      totalScans: 35,
      lastLogin: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      joinedAt: "2026-09-29T14:30:00.000Z"
    },
    {
      uid: "user-qr-4",
      displayName: "Mangal Nath Yadav",
      email: "mangal.nath2026@vitbhopal.ac.in",
      role: "analyst",
      totalScans: 41,
      lastLogin: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      joinedAt: "2026-09-29T16:00:00.000Z"
    }
  ];

  if (rtdb) {
    try {
      const usersRef = ref(rtdb, "user_profiles");
      const snapshot = await withTimeout(get(usersRef), 2000);
      if (snapshot.exists()) {
        const val = snapshot.val();
        const list: UserProfile[] = Object.values(val);
        if (list.length > 0) return list;
      }
    } catch (e) {}
  }

  return defaultProfiles;
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
