export type Language = "en" | "hi";
export type Theme = "light" | "green" | "purple" | "yellow" | "black";

export const translations = {
  en: {
    // Header & Meta
    appName: "ScamShield",
    appTag: "AI",
    trackLabel: "IEEE Track 04.1",
    teamLabel: "Team D43M0N$",
    headerSubtitle: "Pre-Click Zero-Trust Phishing & UPI Fraud Defense Platform",
    rtdbLive: "Live Telemetry",
    zeroTrustStatus: "Zero-Trust Active",
    signIn: "Sign in with Google",
    signOut: "Sign out",
    connecting: "Connecting...",

    // Workspace & Banner
    workspaceSub: "Zero-Trust Security Console",
    workspaceGreetingMorning: "Good morning",
    workspaceGreetingAfternoon: "Good afternoon",
    workspaceGreetingEvening: "Good evening",
    workspaceAnalyst: "Analyst",
    bannerNew: "IEEE Track 04.1",
    bannerText: "The Scam That Almost Worked · Pre-Click Fraud Interception",

    // Simplified Main Navigation
    navScanner: "Threat Scanner",
    navScannerUrl: "Website Link",
    navScannerMessage: "SMS / Message",
    navScannerQr: "QR Code & UPI",
    navSimulator: "Attack Simulator",
    navHistory: "Scan History",
    navSocial: "Community Stories",
    navDocs: "Documentation",
    navDocsProblem: "1. Problem Brief",
    navDocsArchitecture: "2. Architecture",
    navDocsEngines: "3. Detection Engines",
    navDocsBenchmark: "4. Benchmark",
    navDocsLegal: "5. Helplines & Law",
    navAbout: "About Team",
    navAdmin: "Admin Console",

    // Presets (Hackathon Demo Cards)
    presetsTitle: "Live Hackathon Presets:",
    presetSbiTitle: "Fake SBI Bank Clone",
    presetSbiDesc: "sbl-kyc-update.xyz · Homograph & Typosquatting",
    presetDiscomTitle: "Hindi Discom Bill SMS",
    presetDiscomDesc: "Urgent power cutoff alert · Manufactured Panic",
    presetReverseQrTitle: "Reverse UPI QR Trap",
    presetReverseQrDesc: "Scan to receive ₹5,000 · Reverse Debit Fraud",
    presetLegitTitle: "Official Bank Alert",
    presetLegitDesc: "onlinesbi.sbi · Verified Authentic Domain",

    // Scanner Inputs
    modeUrl: "Website Link",
    modeMessage: "SMS / Message",
    modeQr: "QR Code & UPI",
    inputUrlPlaceholder: "Paste suspicious URL (e.g. http://sbl-kyc-update.xyz/login.php)...",
    inputMessagePlaceholder: "Paste message text in English, Hindi, or Hinglish (e.g., 'Account blocked, update KYC')...",
    inputQrPlaceholder: "Paste upi://pay intent string or upload a QR image...",
    uploadQrBtn: "Upload QR Image",
    qrDecodedSuccess: "QR code successfully decoded!",
    qrDecodeFail: "No valid QR code found in this image.",
    clearBtn: "Clear",
    analyzeBtn: "Inspect Threat",
    analyzingBtn: "Analyzing Threat Vector...",

    // Results
    verdictSafe: "Verified Authentic",
    verdictSuspicious: "Suspicious Activity",
    verdictScam: "Critical Scam Detected",
    threatScoreLabel: "Threat Risk Index",
    zeroTrustScoreLabel: "Zero-Trust Trust Score",
    metricDomain: "Domain Authenticity",
    metricProtocol: "Protocol Security",
    metricUrgency: "Linguistic Urgency",
    metricImpersonation: "Impersonation Vector",
    flagsTitle: "Detected Technical Red Flags",
    remediationTitle: "Immediate Action & Protection",
    helpline1930: "National Cyber Crime Helpline: 1930 · cybercrime.gov.in",

    // Scan History
    historyTitle: "Personal Scan History",
    historySubtitle: "Real-time record of all threats analyzed in your secure workspace",
    historyEmpty: "No previous scans recorded yet. Use the Threat Scanner to inspect links, SMS, or QR codes.",
    historySignInPrompt: "Sign in with Google to sync your scan history across all your devices.",
    historyFilterAll: "All Scans",
    historyFilterScams: "Scams Blocked",
    historyFilterSafe: "Verified Safe",
    clearHistoryBtn: "Clear History",

    // Social Stories
    socialTitle: "Scam Awareness Stories",
    socialSubtitle: "Real experiences shared by citizens to prevent cyber financial loss",
    shareStoryBtn: "Share Your Story",
    socialFilterAll: "All Stories",
    socialFilterPrevented: "Shielded in Time",
    socialFilterLoss: "Loss Incurred",
    helpfulBtn: "Helpful",
    shareModalTitle: "Share Scam Incident to Protect Others",
    modalTitleLabel: "Incident Title",
    modalTypeLabel: "Scam Category",
    modalAmountLabel: "Amount Involved (e.g. ₹5,000)",
    modalStatusLabel: "Outcome",
    modalStoryLabel: "What happened? (Describe the scam)",
    modalLessonLabel: "What lesson did you learn? (Advice for others)",
    modalSubmitBtn: "Publish Story to Awareness Wall",

    // Simulation
    simTitle: "Attack Progression Anatomy",
    simSubtitle: "Analysis of the 4-stage attack sequence from IEEE Track 04.1 ('The Scam That Almost Worked')",
    simStage1: "01. Initial Contact",
    simStage1Sub: "Unsolicited message from unknown number",
    simStage2: "02. Psychological Pressure",
    simStage2Sub: "Manufactured panic & 24h deadline",
    simStage3: "03. Credential Harvesting",
    simStage3Sub: "Pixel-perfect cloned banking page",
    simStage4: "04. Capital Extraction",
    simStage4Sub: "Irreversible UPI transfer to mule account",
    simInterceptTitle: "ScamShield Autonomous Interception Moment",
    simInterceptDesc: "ScamShield analyzes incoming signals before user interaction. The NLP engine detects panic triggers, while the Link Inspector catches homograph typosquatting.",
    simNeutralized: "Attack Sequence Neutralized Before Funds Transfer",

    // Documentation Page
    docsTitle: "ScamShield AI Documentation",
    docsSubtitle: "Architecture, Detection Engines & Evaluation for IEEE Hackathon 2026",
    downloadDocx: "Download Word (.DOCX)",
    downloadMd: "Download Markdown (.MD)",

    // About Team Page
    aboutTitle: "About Team D43M0N$",
    aboutSubtitle: "IEEE Student Branch, VIT Bhopal (STB11518) · Track 04 Cybersecurity",
    aboutMission: "Our Mission: Shifting cyber defense in India from reactive post-theft disputes to autonomous, pre-click Zero-Trust protection.",

    // Admin Console
    adminTitle: "Admin & Operations Console",
    adminSubtitle: "Manage users, monitor network threat logs, and moderate scam awareness stories",
    adminTabUsers: "User Accounts",
    adminTabLogs: "Threat Scan Logs",
    adminTabStories: "Stories Moderation",
    adminTabBroadcast: "Live Threat Broadcast",

    // Themes
    themeCleanLight: "Clean Light",
    themeGlassMint: "Mint Glass",
    themeLavender: "Lavender Frost",
    themeSolarAmber: "Solar Amber",
    themeObsidianDark: "Obsidian Dark",

    // Footer
    footerRights: "ScamShield AI · IEEE VIT Bhopal Hackathon 2026 · Team D43M0N$"
  },

  hi: {
    // Header & Meta
    appName: "स्कैमशील्ड",
    appTag: "एआई",
    trackLabel: "IEEE ट्रैक 04.1",
    teamLabel: "टीम D43M0N$",
    headerSubtitle: "क्लिक-पूर्व ज़ीरो-ट्रस्ट फ़िशिंग और यूपीआई फ्रॉड सुरक्षा मंच",
    rtdbLive: "लाइव टेलीमेट्री",
    zeroTrustStatus: "ज़ीरो-ट्रस्ट सक्रिय",
    signIn: "गूगल से लॉगिन",
    signOut: "लॉगआउट",
    connecting: "कनेक्ट हो रहा है...",

    // Workspace & Banner
    workspaceSub: "ज़ीरो-ट्रस्ट सुरक्षा कंसोल",
    workspaceGreetingMorning: "सुप्रभात",
    workspaceGreetingAfternoon: "शुभ दोपहर",
    workspaceGreetingEvening: "शुभ संध्या",
    workspaceAnalyst: "विश्लेषक",
    bannerNew: "IEEE ट्रैक 04.1",
    bannerText: "वह घोटाला जो लगभग सफल हो गया था · क्लिक-पूर्व सुरक्षा",

    // Simplified Main Navigation
    navScanner: "खतरा स्कैनर",
    navScannerUrl: "वेबसाइट लिंक",
    navScannerMessage: "एसएमएस / संदेश",
    navScannerQr: "क्यूआर कोड व यूपीआई",
    navSimulator: "हमला सिमुलेटर",
    navHistory: "स्कैन इतिहास",
    navSocial: "जागरूकता मंच",
    navDocs: "दस्तावेज़",
    navDocsProblem: "1. समस्या विवरण",
    navDocsArchitecture: "2. आर्किटेक्चर",
    navDocsEngines: "3. डिटेक्शन इंजन",
    navDocsBenchmark: "4. मॉडल बेंचमार्क",
    navDocsLegal: "5. हेल्पलाइन व कानून",
    navAbout: "टीम परिचय",
    navAdmin: "एडमिन पैनल",

    // Presets
    presetsTitle: "लाइव हैकाथॉन उदाहरण:",
    presetSbiTitle: "नकली एसबीआई लिंक",
    presetSbiDesc: "sbl-kyc-update.xyz · अक्षरों का छल (होमोग्राफ)",
    presetDiscomTitle: "बिजली बिल एसएमएस (हिंदी)",
    presetDiscomDesc: "आज रात बिजली काटने की फर्जी धमकी",
    presetReverseQrTitle: "रिवर्स यूपीआई घोटाला",
    presetReverseQrDesc: "₹5,000 पाने के लिए स्कैन करें · उल्टा डेबिट जाल",
    presetLegitTitle: "आधिकारिक बैंक लिंक",
    presetLegitDesc: "onlinesbi.sbi · सत्यापित सुरक्षित डोमेन",

    // Scanner Inputs
    modeUrl: "वेबसाइट लिंक",
    modeMessage: "एसएमएस / संदेश",
    modeQr: "क्यूआर कोड व यूपीआई",
    inputUrlPlaceholder: "जांचने के लिए लिंक पेस्ट करें (उदा. http://sbl-kyc-update.xyz/login.php)...",
    inputMessagePlaceholder: "हिंदी, हिंग्लिश या अंग्रेजी में आया संदेश पेस्ट करें...",
    inputQrPlaceholder: "upi://pay स्ट्रिंग पेस्ट करें या क्यूआर छवि अपलोड करें...",
    uploadQrBtn: "क्यूआर छवि अपलोड करें",
    qrDecodedSuccess: "क्यूआर कोड सफलतापूर्वक पढ़ा गया!",
    qrDecodeFail: "छवि से क्यूआर कोड नहीं पढ़ा जा सका।",
    clearBtn: "साफ़ करें",
    analyzeBtn: "खतरा जांचें",
    analyzingBtn: "विश्लेषण जारी है...",

    // Results
    verdictSafe: "सत्यापित सुरक्षित",
    verdictSuspicious: "संदिग्ध गतिविधि",
    verdictScam: "गंभीर घोटाला मिला",
    threatScoreLabel: "खतरा जोखिम सूचकांक",
    zeroTrustScoreLabel: "ज़ीरो-ट्रस्ट विश्वसनीयता",
    metricDomain: "डोमेन प्रामाणिकता",
    metricProtocol: "प्रोटोकॉल सुरक्षा",
    metricUrgency: "भाषाई हड़बड़ाहट",
    metricImpersonation: "फर्जी पहचान जोखिम",
    flagsTitle: "पहचाने गए तकनीकी खतरे",
    remediationTitle: "तत्काल सुरक्षा कार्रवाई",
    helpline1930: "राष्ट्रीय साइबर अपराध हेल्पलाइन: 1930 · cybercrime.gov.in",

    // Scan History
    historyTitle: "व्यक्तिगत स्कैन इतिहास",
    historySubtitle: "फ़ायरबेस रीयल-टाइम डेटाबेस में सुरक्षित आपके पूर्व स्कैन",
    historyEmpty: "अभी तक कोई स्कैन दर्ज नहीं है। वेबसाइट, संदेश या क्यूआर कोड जांचने के लिए स्कैनर का उपयोग करें।",
    historySignInPrompt: "सभी उपकरणों पर अपने स्कैन सुरक्षित रखने के लिए गूगल से लॉगिन करें।",
    historyFilterAll: "सभी स्कैन",
    historyFilterScams: "रोके गए घोटाले",
    historyFilterSafe: "सत्यापित सुरक्षित",
    clearHistoryBtn: "इतिहास साफ़ करें",

    // Social Stories
    socialTitle: "नागरिक घोटाला जागरूकता मंच",
    socialSubtitle: "वित्तीय धोखाधड़ी से बचाव हेतु नागरिकों द्वारा साझा किए गए वास्तविक अनुभव",
    shareStoryBtn: "अपना अनुभव साझा करें",
    socialFilterAll: "सभी अनुभव",
    socialFilterPrevented: "समय रहते बचाव",
    socialFilterLoss: "वित्तीय नुकसान",
    helpfulBtn: "मददगार",
    shareModalTitle: "दूसरों को सतर्क करने हेतु अनुभव साझा करें",
    modalTitleLabel: "घटना का शीर्षक",
    modalTypeLabel: "घोटाले का प्रकार",
    modalAmountLabel: "शामिल राशि (उदा. ₹5,000)",
    modalStatusLabel: "परिणाम",
    modalStoryLabel: "क्या हुआ था? (विस्तार से बताएं)",
    modalLessonLabel: "आपने क्या सीखा? (दूसरों के लिए सलाह)",
    modalSubmitBtn: "मंच पर प्रकाशित करें",

    // Simulation
    simTitle: "साइबर हमले की प्रगति का विश्लेषण",
    simSubtitle: "IEEE ट्रैक 04.1 ('वह घोटाला जो लगभग सफल हो गया था') के 4 चरणों का विस्तृत विश्लेषण",
    simStage1: "01. प्रारंभिक संपर्क",
    simStage1Sub: "अज्ञात नंबर से संदेश",
    simStage2: "02. मनोवैज्ञानिक दबाव",
    simStage2Sub: "डर का माहौल और 24 घंटे की फर्जी समय सीमा",
    simStage3: "03. क्रेडेंशियल की चोरी",
    simStage3Sub: "बैंक की हूबहू नकली क्लोन वेबसाइट",
    simStage4: "04. धन की निकासी",
    simStage4Sub: "यूपीआई के माध्यम से खाते से तत्काल निकासी",
    simInterceptTitle: "स्कैमशील्ड एआई का स्वचालित हस्तक्षेप क्षण",
    simInterceptDesc: "उपयोगकर्ता द्वारा क्लिक करने से पहले ही स्कैमशील्ड खतरे को पहचान लेता है।",
    simNeutralized: "पैसे कटने से पहले ही हमला पूरी तरह विफल",

    // Documentation Page
    docsTitle: "स्कैमशील्ड एआई तकनीकी दस्तावेज़",
    docsSubtitle: "IEEE हैकाथॉन 2026 हेतु आर्किटेक्चर, डिटेक्शन इंजन और मूल्यांकन",
    downloadDocx: "वर्ड फ़ाइल डाउनलोड (.DOCX)",
    downloadMd: "मार्कडाउन डाउनलोड (.MD)",

    // About Team Page
    aboutTitle: "टीम D43M0N$ के बारे में",
    aboutSubtitle: "IEEE स्टूडेंट ब्रांच, VIT भोपाल (STB11518) · ट्रैक 04 साइबर सुरक्षा",
    aboutMission: "हमारा लक्ष्य: भारत में साइबर सुरक्षा को नुकसान के बाद की रिपोर्टिंग से हटाकर क्लिक-पूर्व ज़ीरो-ट्रस्ट सुरक्षा में बदलना।",

    // Admin Console
    adminTitle: "एडमिन व संचालन कंसोल",
    adminSubtitle: "उपयोगकर्ता प्रबंधन, खतरा लॉग्स की निगरानी और सामाजिक पोस्ट्स का मॉडरेशन",
    adminTabUsers: "उपयोगकर्ता खाते",
    adminTabLogs: "खतरा स्कैन लॉग्स",
    adminTabStories: "पोस्ट मॉडरेशन",
    adminTabBroadcast: "लाइव खतरा प्रसारण",

    // Themes
    themeCleanLight: "क्लीन लाइट",
    themeGlassMint: "मिंट ग्लास",
    themeLavender: "लैवेंडर फ्रॉस्ट",
    themeSolarAmber: "सोलर एम्बर",
    themeObsidianDark: "ऑब्सिडियन डार्क",

    // Footer
    footerRights: "स्कैमशील्ड एआई · IEEE VIT भोपाल हैकाथॉन 2026 · टीम D43M0N$"
  }
};
