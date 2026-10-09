export interface NlpAnalysisResult {
  message: string;
  detectedLanguage: "English" | "Hindi" | "Hinglish" | "Mixed";
  urgencyScore: number; // 0 - 100
  impersonationScore: number; // 0 - 100
  scamCategory: 
    | "KYC_EXPIRY_FRAUD"
    | "ELECTRICITY_UTILITY_SCAM"
    | "REVERSE_UPI_COLLECT"
    | "DIGITAL_ARREST_IMPERSONATION"
    | "JOB_TASK_FRAUD"
    | "LOTTERY_REWARD_BAIT"
    | "GENERAL_PHISHING"
    | "LEGITIMATE_NOTIFICATION";
  riskTier: "SAFE" | "SUSPICIOUS" | "HIGH_RISK";
  compositeNlpScore: number; // 0 - 100
  detectedKeywords: string[];
  psychologicalTriggers: string[];
  impersonatedEntity: string | null;
  explanationEn: string;
  explanationHi: string;
  recommendedAction: string;
}

// Multilingual dictionaries for Indian cyber fraud patterns
const URGENCY_TRIGGERS: { [word: string]: number } = {
  // English
  "immediately": 25,
  "within 24 hours": 35,
  "urgent": 20,
  "today": 15,
  "tonight": 25,
  "last notice": 30,
  "final warning": 35,
  "action required": 20,
  "suspended": 25,
  "blocked": 30,
  "deactivated": 25,
  "before 9:30 pm": 35,
  "by tonight": 30,
  "disconnect": 30,
  "penalty": 20,
  "fine": 20,
  
  // Hindi (Devanagari)
  "तुरंत": 25,
  "आज रात": 30,
  "24 घंटे में": 35,
  "अंतिम चेतावनी": 35,
  "काट दी जाएगी": 35,
  "बंद कर दिया जाएगा": 30,
  "अवरुद्ध": 25,
  "जुर्माना": 20,
  "तत्काल": 25,
  "चेतावनी": 20,

  // Hinglish
  "turant": 25,
  "aaj raat": 30,
  "24 ghante": 35,
  "band ho jayega": 30,
  "block ho jayega": 30,
  "kat di jayegi": 35,
  "jaldi kare": 20,
  "antim chetavani": 35,
  "disconnect ho jayega": 30,
};

const AUTHORITY_KEYWORDS: { [entity: string]: RegExp[] } = {
  "State Bank of India (SBI/YONO)": [/sbi/i, /yono/i, /state bank/i, /एसबीआई/i],
  "Reserve Bank of India (RBI)": [/rbi/i, /reserve bank/i, /आरबीआई/i],
  "State Electricity Department / Discom": [/electricity/i, /power/i, /bijli/i, /discom/i, /bescom/i, /msedcl/i, /uppcl/i, /बिजली/i],
  "TRAI / Department of Telecommunications": [/trai/i, /telecom/i, /sim block/i, /sim card/i, /दूरसंचार/i],
  "India Post / Postal Service": [/india post/i, /speed post/i, /post office/i, /भारतीय डाक/i],
  "Police / Cyber Crime / CBI / Customs": [/cbi/i, /customs/i, /police/i, /cyber cell/i, /digital arrest/i, /warrant/i, /कोर्ट/i, /पुलिस/i],
  "HDFC Bank": [/hdfc/i],
  "Income Tax Department": [/income tax/i, /it department/i, /refund approval/i, /आयकर/i],
};

const CATEGORY_RULES = [
  {
    category: "ELECTRICITY_UTILITY_SCAM" as const,
    patterns: [
      /electricity bill/i, /power will be disconnected/i, /bijli.*kat/i, /bill update/i,
      /electricity officer/i, /बिजली बिल/i, /लाइट काट/i, /power supply/i
    ]
  },
  {
    category: "KYC_EXPIRY_FRAUD" as const,
    patterns: [
      /kyc/i, /pan card update/i, /aadhaar/i, /yono blocked/i, /netbanking.*suspend/i,
      /account block/i, /केवाईसी/i, /पैन कार्ड/i, /खाता बंद/i
    ]
  },
  {
    category: "REVERSE_UPI_COLLECT" as const,
    patterns: [
      /scan.*receive/i, /scan.*cashback/i, /enter pin to get/i, /claim refund/i,
      /qr.*paise milenge/i, /रिफंड पाने के लिए क्यूआर स्कैन/i, /पिन दर्ज करें/i
    ]
  },
  {
    category: "DIGITAL_ARREST_IMPERSONATION" as const,
    patterns: [
      /cbi/i, /digital arrest/i, /customs.*parcel/i, /narcotics/i, /money laundering/i,
      /arrest warrant/i, /police station/i, /डिजिटल अरेस्ट/i, /वारंट/i
    ]
  },
  {
    category: "JOB_TASK_FRAUD" as const,
    patterns: [
      /part time job/i, /earn.*per day/i, /like youtube videos/i, /telegram task/i,
      /daily income/i, /घर बैठे कमाएं/i, /टास्क पूरा करें/i
    ]
  },
  {
    category: "LOTTERY_REWARD_BAIT" as const,
    patterns: [
      /kbc lottery/i, /won.*crore/i, /won.*lakh/i, /lucky winner/i, /lottery ticket/i,
      /लॉटरी जीती/i, /इनाम/i
    ]
  }
];

export function analyzeMessage(text: string): NlpAnalysisResult {
  const normalized = text.trim();
  const lower = normalized.toLowerCase();

  // 1. Language detection
  const hasDevanagari = /[\u0900-\u097F]/.test(normalized);
  const hinglishTokens = ["aapka", "karein", "turant", "jayega", "jayegi", "paise", "bijli", "khata", "bill", "dhanyawad"];
  const hasHinglish = hinglishTokens.some(token => lower.includes(token));

  let detectedLanguage: "English" | "Hindi" | "Hinglish" | "Mixed" = "English";
  if (hasDevanagari && /[a-zA-Z]/.test(normalized)) {
    detectedLanguage = "Mixed";
  } else if (hasDevanagari) {
    detectedLanguage = "Hindi";
  } else if (hasHinglish) {
    detectedLanguage = "Hinglish";
  }

  // 2. Urgency calculation
  let urgencyRaw = 0;
  const psychologicalTriggers: string[] = [];

  for (const [trigger, weight] of Object.entries(URGENCY_TRIGGERS)) {
    if (lower.includes(trigger.toLowerCase()) || normalized.includes(trigger)) {
      urgencyRaw += weight;
      psychologicalTriggers.push(trigger);
    }
  }

  // Cap urgency at 100
  const urgencyScore = Math.min(100, urgencyRaw);

  // 3. Authority Impersonation
  let impersonationScore = 0;
  let impersonatedEntity: string | null = null;

  for (const [entity, patterns] of Object.entries(AUTHORITY_KEYWORDS)) {
    const matches = patterns.some(p => p.test(normalized));
    if (matches) {
      impersonatedEntity = entity;
      impersonationScore = 85;
      psychologicalTriggers.push(`Authority Pretended: ${entity}`);
      break;
    }
  }

  // 4. Scam Category Classification
  let scamCategory: NlpAnalysisResult["scamCategory"] = "GENERAL_PHISHING";
  for (const rule of CATEGORY_RULES) {
    if (rule.patterns.some(p => p.test(normalized))) {
      scamCategory = rule.category;
      break;
    }
  }

  // Check for legitimate notifications
  const isLegitStatement = (lower.includes("statement") || lower.includes("debited by") || lower.includes("credited by")) &&
                           !lower.includes("click") && !lower.includes("http") && !lower.includes("block") && urgencyScore < 20;

  if (isLegitStatement) {
    scamCategory = "LEGITIMATE_NOTIFICATION";
  }

  // 5. Composite NLP Score
  let compositeNlpScore = 0;
  if (scamCategory === "LEGITIMATE_NOTIFICATION") {
    compositeNlpScore = 5;
  } else {
    compositeNlpScore = Math.min(100, Math.round((urgencyScore * 0.45) + (impersonationScore * 0.45) + (psychologicalTriggers.length * 5)));
  }

  // Determine Risk Tier
  let riskTier: "SAFE" | "SUSPICIOUS" | "HIGH_RISK" = "SAFE";
  if (compositeNlpScore >= 65) {
    riskTier = "HIGH_RISK";
  } else if (compositeNlpScore >= 35) {
    riskTier = "SUSPICIOUS";
  }

  // 6. Plain explanations
  let explanationEn = "";
  let explanationHi = "";
  let recommendedAction = "";

  if (riskTier === "HIGH_RISK") {
    explanationEn = `CRITICAL SOCIAL ENGINEERING: This message exploits psychological fear and artificial urgency (${urgencyScore}% urgency index) while impersonating ${impersonatedEntity || "an official institution"}. Legitimate banks and utilities never threaten disconnection or account freezing via SMS with arbitrary external links.`;
    explanationHi = `गंभीर सामाजिक इंजीनियरिंग खतरा: यह संदेश डर और झूठी जल्दबाजी (${urgencyScore}% तत्परता स्तर) पैदा कर रहा है तथा ${impersonatedEntity || "आधिकारिक संस्था"} की नकल कर रहा है। कोई भी बैंक या बिजली विभाग एसएमएस में धमकी देकर खाता या बिजली बंद नहीं करता।`;
    recommendedAction = "DO NOT click any link, DO NOT call back the sender number, and DO NOT share OTP/UPI PIN. Report immediately to Cyber Helpline 1930.";
  } else if (riskTier === "SUSPICIOUS") {
    explanationEn = `SUSPICIOUS: The message contains pressuring keywords and informal wording atypical for institutional alerts. Exercise caution.`;
    explanationHi = `संदिग्ध: संदेश में दबाव डालने वाले शब्द और अनौपचारिक भाषा शामिल है। कृपया आधिकारिक ऐप पर सीधे जाकर जांचें।`;
    recommendedAction = "Verify by logging into your official bank application directly. Do not use phone numbers or links provided in the SMS.";
  } else {
    explanationEn = `SAFE NOTIFICATION: Routine transactional or informational update without manipulative urgency triggers or impersonation indicators.`;
    explanationHi = `सुरक्षित सूचना: सामान्य लेनदेन या जानकारी सम्बन्धी संदेश जिसमें किसी प्रकार का दबाव या धोखाधड़ी का प्रयास नहीं पाया गया।`;
    recommendedAction = "No defensive action required. Retain for your accounting records.";
  }

  return {
    message: normalized,
    detectedLanguage,
    urgencyScore,
    impersonationScore,
    scamCategory,
    riskTier,
    compositeNlpScore,
    detectedKeywords: psychologicalTriggers,
    psychologicalTriggers,
    impersonatedEntity,
    explanationEn,
    explanationHi,
    recommendedAction
  };
}
