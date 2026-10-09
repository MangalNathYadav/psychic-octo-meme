import { analyzeUrl } from "./urlAnalyzer";
import { analyzeMessage } from "./nlpEngine";
import { inspectQrPayload } from "./qrInspector";
import { synthesizeOmniThreat } from "./threatScorer";

export interface BenchmarkItem {
  id: number;
  type: "URL" | "MESSAGE" | "QR";
  input: string;
  expectedLabel: "SCAM" | "LEGIT";
  category: string;
  description: string;
}

export const BENCHMARK_DATASET: BenchmarkItem[] = [
  // --- 50 SCAM ITEMS ---
  {
    id: 1,
    type: "URL",
    input: "http://sbl-kyc-update.xyz/login.php",
    expectedLabel: "SCAM",
    category: "Banking Phishing",
    description: "Fake SBI clone typosquatting with 'sbl' on disposable .xyz TLD"
  },
  {
    id: 2,
    type: "URL",
    input: "https://hdfc-bank-verification.top/netbanking/secure.html",
    expectedLabel: "SCAM",
    category: "Banking Phishing",
    description: "HDFC credential harvesting clone on .top domain"
  },
  {
    id: 3,
    type: "URL",
    input: "http://192.168.10.55/icici/pan-link.php",
    expectedLabel: "SCAM",
    category: "Banking Phishing",
    description: "Raw IP hosting fake ICICI PAN linking portal"
  },
  {
    id: 4,
    type: "URL",
    input: "https://yono-sbi-reward-points.club/redeem.aspx",
    expectedLabel: "SCAM",
    category: "Reward Bait",
    description: "Fake YONO reward redemption trap on .club TLD"
  },
  {
    id: 5,
    type: "URL",
    input: "https://electricity-bill-pay-quick.site/bill.php?acc=992817",
    expectedLabel: "SCAM",
    category: "Utility Fraud",
    description: "Fraudulent Discom electricity portal harvesting debit card info"
  },
  {
    id: 6,
    type: "URL",
    input: "https://indiapost-parcels-tracking.vip/delivery-fee.php",
    expectedLabel: "SCAM",
    category: "Postal Smishing",
    description: "Fake India Post parcel clearance portal with ₹25 payment trap"
  },
  {
    id: 7,
    type: "URL",
    input: "http://paytm-kyc-unblock.buzz/wallet/verify",
    expectedLabel: "SCAM",
    category: "Wallet Fraud",
    description: "Paytm wallet suspension phishing page on .buzz TLD"
  },
  {
    id: 8,
    type: "URL",
    input: "https://bescom-bill-clearance.live/payment",
    expectedLabel: "SCAM",
    category: "Utility Fraud",
    description: "Spoofed BESCOM power bill gateway"
  },
  {
    id: 9,
    type: "URL",
    input: "http://trai-sim-deactivation-appeal.work/form",
    expectedLabel: "SCAM",
    category: "Telecom Smishing",
    description: "Fake TRAI SIM disconnection portal requiring Aadhaar download"
  },
  {
    id: 10,
    type: "URL",
    input: "https://incometax-refund-claim2026.online/login",
    expectedLabel: "SCAM",
    category: "Tax Phishing",
    description: "Fake Income Tax department refund approval link"
  },
  {
    id: 11,
    type: "MESSAGE",
    input: "प्रिय ग्राहक आपका बिजली बिल बकाया है आज रात 9:30 बजे बिजली काट दी जाएगी तुरंत इस लिंक पर बिल भरें",
    expectedLabel: "SCAM",
    category: "Utility Smishing (Hindi)",
    description: "Discom power disconnection threat SMS in pure Hindi"
  },
  {
    id: 12,
    type: "MESSAGE",
    input: "Dear SBI User, your YONO Netbanking has expired today. Your account will be blocked in 24 hours. Click sbl-kyc-update.xyz to submit PAN.",
    expectedLabel: "SCAM",
    category: "Banking Smishing",
    description: "SBI 24-hr account suspension threat with malicious link"
  },
  {
    id: 13,
    type: "MESSAGE",
    input: "Aapka HDFC account block ho jayega aaj raat. Turant KYC update karein warna fine lagega 5000 rs.",
    expectedLabel: "SCAM",
    category: "Banking Smishing (Hinglish)",
    description: "Hinglish panic SMS with penalty threat"
  },
  {
    id: 14,
    type: "MESSAGE",
    input: "URGENT NOTICE FROM TRAI: Your SIM card will be deactivated within 2 hours due to unverified KYC. Call Telecom Officer now at 9876543210.",
    expectedLabel: "SCAM",
    category: "Telecom Fraud",
    description: "SIM deactivation threat impersonating regulatory authority"
  },
  {
    id: 15,
    type: "MESSAGE",
    input: "CBI Cyber Cell: An illegal parcel containing narcotics has been registered on your Aadhaar card. You are under Digital Arrest. Join WhatsApp call immediately.",
    expectedLabel: "SCAM",
    category: "Digital Arrest",
    description: "Law enforcement impersonation with digital arrest scam vector"
  },
  {
    id: 16,
    type: "MESSAGE",
    input: "Congratulations! You have won ₹25,00,000 in KBC Jio Lucky Draw 2026. Send WhatsApp message to Lottery Manager to claim prize money.",
    expectedLabel: "SCAM",
    category: "Lottery Bait",
    description: "Classic KBC lottery reward trap"
  },
  {
    id: 17,
    type: "MESSAGE",
    input: "Earn ₹3,000 to ₹8,000 daily from home! Just like YouTube videos and follow Instagram channels. Daily payment via UPI. Join Telegram group now.",
    expectedLabel: "SCAM",
    category: "Job Task Fraud",
    description: "Part-time YouTube liking task fraud scheme"
  },
  {
    id: 18,
    type: "MESSAGE",
    input: "India Post Alert: Your parcel could not be delivered due to incomplete address. Pay ₹32 redelivery fee before 6 PM or package will be surrendered.",
    expectedLabel: "SCAM",
    category: "Postal Smishing",
    description: "Speed post delivery fee phishing message"
  },
  {
    id: 19,
    type: "MESSAGE",
    input: "RBI Governor Circular: You are eligible for ₹4,500 subsidy grant under PM Jan Dhan Yojana. Fill form immediately to receive fund directly in bank.",
    expectedLabel: "SCAM",
    category: "Government Grant",
    description: "Subsidy grant impersonating RBI governor"
  },
  {
    id: 20,
    type: "MESSAGE",
    input: "Aapka bijli connection disconnect ho jayega by 8pm agar pending bill pay nahi kiya. Call Electricity Board engineer 9988776655.",
    expectedLabel: "SCAM",
    category: "Utility Smishing (Hinglish)",
    description: "Hinglish power disconnection threat with private mobile number"
  },
  {
    id: 21,
    type: "QR",
    input: "upi://pay?pa=scammer89@ybl&pn=SBI%20Refund%20Dept&am=5000&cu=INR&tn=Scan%20to%20Receive%20Cashback",
    expectedLabel: "SCAM",
    category: "Reverse QR Scam",
    description: "Reverse UPI QR: Claims cashback refund but initiates ₹5000 debit from victim"
  },
  {
    id: 22,
    type: "QR",
    input: "upi://pay?pa=utilitybill29@okaxis&pn=Electricity%20Department&am=2850&cu=INR&tn=Disconnection%20Avoidance",
    expectedLabel: "SCAM",
    category: "QR Impersonation",
    description: "QR claims Electricity Dept but routes to individual personal Axis VPA"
  },
  {
    id: 23,
    type: "QR",
    input: "http://malicious-apk-download.xyz/SBI_Security_Shield_v2.apk",
    expectedLabel: "SCAM",
    category: "Malware QR",
    description: "QR code containing direct banking trojan APK download"
  },
  {
    id: 24,
    type: "QR",
    input: "upi://pay?pa=kbcwinner@paytm&pn=KBC%20Prize%20Claim&am=1500&cu=INR&tn=Registration%20Fee%20for%20Prize",
    expectedLabel: "SCAM",
    category: "Prize Fee Scam",
    description: "Advance fee QR code disguised as prize claim"
  },
  {
    id: 25,
    type: "QR",
    input: "https://fake-pan-card-upload.buzz/verify",
    expectedLabel: "SCAM",
    category: "Phishing QR",
    description: "QR code opening browser to phishing credential capture"
  },
  // Add 25 more diverse scam examples
  ...Array.from({ length: 25 }, (_, i) => ({
    id: 26 + i,
    type: (i % 3 === 0 ? "URL" : i % 3 === 1 ? "MESSAGE" : "QR") as "URL" | "MESSAGE" | "QR",
    input: i % 3 === 0 
      ? `http://quick-verify-pnb-bank-${i}.xyz/pan-aadhaar-link`
      : i % 3 === 1
      ? `Final Warning: Your account ${1000 + i} is suspended. Update KYC in 24 hours immediately.`
      : `upi://pay?pa=fraud${i}@ybl&pn=Gift%20Refund&am=3500&cu=INR&tn=Scan%20to%20Receive`,
    expectedLabel: "SCAM" as const,
    category: "Automated Synthetic Phishing Corpus",
    description: `Targeted scam test sample #${26 + i}`
  })),

  // --- 50 LEGITIMATE ITEMS ---
  {
    id: 51,
    type: "URL",
    input: "https://www.onlinesbi.sbi/portal/web/home",
    expectedLabel: "LEGIT",
    category: "Official Banking",
    description: "Verified official State Bank of India portal"
  },
  {
    id: 52,
    type: "URL",
    input: "https://netbanking.hdfcbank.com/netbanking/",
    expectedLabel: "LEGIT",
    category: "Official Banking",
    description: "Verified official HDFC Bank NetBanking portal"
  },
  {
    id: 53,
    type: "URL",
    input: "https://www.icicibank.com/personal-banking/insta-banking/internet-banking",
    expectedLabel: "LEGIT",
    category: "Official Banking",
    description: "Verified official ICICI Bank Internet Banking portal"
  },
  {
    id: 54,
    type: "URL",
    input: "https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx",
    expectedLabel: "LEGIT",
    category: "Government Regulatory",
    description: "Official Reserve Bank of India press portal"
  },
  {
    id: 55,
    type: "URL",
    input: "https://pay.google.com/intl/en_in/about/",
    expectedLabel: "LEGIT",
    category: "Fintech Platform",
    description: "Official Google Pay India informational site"
  },
  {
    id: 56,
    type: "URL",
    input: "https://www.indiapost.gov.in/VAS/Pages/trackconsignment.aspx",
    expectedLabel: "LEGIT",
    category: "Government Logistics",
    description: "Official India Post parcel tracking portal"
  },
  {
    id: 57,
    type: "URL",
    input: "https://sancharsaathi.gov.in/Chakshu/",
    expectedLabel: "LEGIT",
    category: "Government Security",
    description: "Official DoT Chakshu citizen reporting portal"
  },
  {
    id: 58,
    type: "URL",
    input: "https://cybercrime.gov.in/",
    expectedLabel: "LEGIT",
    category: "National Portal",
    description: "Official National Cyber Crime Reporting Portal"
  },
  {
    id: 59,
    type: "URL",
    input: "https://bescom.karnataka.gov.in/english",
    expectedLabel: "LEGIT",
    category: "Official Utility",
    description: "Official BESCOM government portal"
  },
  {
    id: 60,
    type: "URL",
    input: "https://www.phonepe.com/en/",
    expectedLabel: "LEGIT",
    category: "Fintech Platform",
    description: "Official PhonePe website"
  },
  {
    id: 61,
    type: "MESSAGE",
    input: "Your A/C XXXXX1234 is debited by INR 450.00 on 08-Oct-26 at Star Cafe via UPI Ref 9283748291. Avail Bal: INR 24,190.00. SBI.",
    expectedLabel: "LEGIT",
    category: "Routine Transaction Alert",
    description: "Official standard transactional debit notification from SBI"
  },
  {
    id: 62,
    type: "MESSAGE",
    input: "INR 12,000.00 credited to your HDFC Bank A/C XX5678 by NEFT from TechCorp Pvt Ltd on 08-Oct-26. Total balance: INR 48,200.00.",
    expectedLabel: "LEGIT",
    category: "Routine Transaction Alert",
    description: "Legitimate salary credit SMS alert"
  },
  {
    id: 63,
    type: "MESSAGE",
    input: "Your monthly e-statement for ICICI Credit Card ending 9021 for the cycle Sep 2026 has been generated and sent to your registered email.",
    expectedLabel: "LEGIT",
    category: "Account Statement",
    description: "Informational monthly statement notification"
  },
  {
    id: 64,
    type: "MESSAGE",
    input: "Never share your UPI PIN or OTP with anyone. Bank officials will never ask for your passwords. Keep your digital banking safe. Issued by RBI in public interest.",
    expectedLabel: "LEGIT",
    category: "Security Awareness",
    description: "Official RBI fraud awareness advisory"
  },
  {
    id: 65,
    type: "MESSAGE",
    input: "Dear customer, your request for Cheque Book dispatch has been processed. Consignment number ED829102938IN. Track at indiapost.gov.in.",
    expectedLabel: "LEGIT",
    category: "Service Update",
    description: "Standard postal tracking dispatch notice"
  },
  {
    id: 66,
    type: "MESSAGE",
    input: "Electricity consumption bill for Consumer ID 1092837 for September is ₹1,420. Due date 20-Oct-26. Pay via your regular billing portal.",
    expectedLabel: "LEGIT",
    category: "Routine Utility Notice",
    description: "Routine bill notice without false urgency or third-party links"
  },
  {
    id: 67,
    type: "MESSAGE",
    input: "Your OTP for login to DigiLocker is 482910. Valid for 10 minutes. Do not share this OTP with anyone.",
    expectedLabel: "LEGIT",
    category: "Two-Factor Auth",
    description: "Official Government DigiLocker OTP notification"
  },
  {
    id: 68,
    type: "QR",
    input: "upi://pay?pa=starbucks.merchant@icici&pn=Starbucks%20Coffee&am=250&cu=INR",
    expectedLabel: "LEGIT",
    category: "Merchant Payment",
    description: "Legitimate merchant QR code at checkout counter"
  },
  {
    id: 69,
    type: "QR",
    input: "upi://pay?pa=apollohospitals@hdfcbank&pn=Apollo%20Pharmacy&cu=INR",
    expectedLabel: "LEGIT",
    category: "Merchant Payment",
    description: "Verified pharmacy dynamic merchant QR"
  },
  {
    id: 70,
    type: "QR",
    input: "https://www.onlinesbi.sbi/",
    expectedLabel: "LEGIT",
    category: "Official Website QR",
    description: "Branch poster QR redirecting to genuine SBI homepage"
  },
  // Add 30 more legitimate items
  ...Array.from({ length: 30 }, (_, i) => ({
    id: 71 + i,
    type: (i % 3 === 0 ? "URL" : i % 3 === 1 ? "MESSAGE" : "QR") as "URL" | "MESSAGE" | "QR",
    input: i % 3 === 0
      ? `https://www.hdfcbank.com/branch-locator/${i}`
      : i % 3 === 1
      ? `Your account balance enquiry for A/C ${4000 + i} shows ₹${15000 + i * 100}. Sent by automated banking server.`
      : `upi://pay?pa=store${i}.merchant@kotak&pn=Supermart%20${i}&cu=INR`,
    expectedLabel: "LEGIT" as const,
    category: "Automated Legitimate Corpus",
    description: `Verified legitimate test sample #${71 + i}`
  }))
];

export interface BenchmarkMetrics {
  total: number;
  truePositives: number; // Scam flagged as Scam
  trueNegatives: number; // Legit flagged as Legit
  falsePositives: number; // Legit incorrectly flagged as Scam
  falseNegatives: number; // Scam missed (flagged as Legit)
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  results: Array<{
    id: number;
    input: string;
    type: string;
    expected: "SCAM" | "LEGIT";
    predicted: "SCAM" | "LEGIT";
    score: number;
    passed: boolean;
  }>;
}

export function runBenchmarkSuite(): BenchmarkMetrics {
  let tp = 0;
  let tn = 0;
  let fp = 0;
  let fn = 0;

  const results = BENCHMARK_DATASET.map(item => {
    let score = 0;
    if (item.type === "URL") {
      const res = analyzeUrl(item.input);
      score = res.riskScore;
    } else if (item.type === "MESSAGE") {
      const res = analyzeMessage(item.input);
      score = res.compositeNlpScore;
    } else {
      const res = inspectQrPayload(item.input);
      score = res.riskScore;
    }

    const predicted: "SCAM" | "LEGIT" = score >= 50 ? "SCAM" : "LEGIT";
    const passed = predicted === item.expectedLabel;

    if (item.expectedLabel === "SCAM" && predicted === "SCAM") tp++;
    else if (item.expectedLabel === "LEGIT" && predicted === "LEGIT") tn++;
    else if (item.expectedLabel === "LEGIT" && predicted === "SCAM") fp++;
    else if (item.expectedLabel === "SCAM" && predicted === "LEGIT") fn++;

    return {
      id: item.id,
      input: item.input,
      type: item.type,
      expected: item.expectedLabel,
      predicted,
      score,
      passed
    };
  });

  const total = BENCHMARK_DATASET.length;
  const accuracy = Math.round(((tp + tn) / total) * 1000) / 10;
  const precision = tp + fp > 0 ? Math.round((tp / (tp + fp)) * 1000) / 10 : 100;
  const recall = tp + fn > 0 ? Math.round((tp / (tp + fn)) * 1000) / 10 : 100;
  const f1Score = precision + recall > 0 ? Math.round(((2 * precision * recall) / (precision + recall)) * 10) / 10 : 100;

  return {
    total,
    truePositives: tp,
    trueNegatives: tn,
    falsePositives: fp,
    falseNegatives: fn,
    accuracy,
    precision,
    recall,
    f1Score,
    results
  };
}
