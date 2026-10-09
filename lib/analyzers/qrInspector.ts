import { analyzeUrl, UrlAnalysisResult } from "./urlAnalyzer";

export interface QrAnalysisResult {
  rawPayload: string;
  payloadType: "UPI_PAYMENT" | "WEB_URL" | "TEXT_DATA" | "MALICIOUS_APP";
  isReverseScam: boolean; // "Scan to receive money" fraud
  riskScore: number;
  riskTier: "SAFE" | "SUSPICIOUS" | "HIGH_RISK";
  flags: string[];
  upiDetails?: {
    payeeVpa: string;
    payeeName: string;
    amount?: string;
    transactionNote?: string;
    currency: string;
    isMerchantVpa: boolean;
    personalVpaMasquerade: boolean;
  };
  embeddedUrlResult?: UrlAnalysisResult;
  explanationEn: string;
  explanationHi: string;
  recommendation: string;
}

export function inspectQrPayload(payload: string): QrAnalysisResult {
  const trimmed = payload.trim();
  const lower = trimmed.toLowerCase();
  const flags: string[] = [];
  let score = 0;

  // 1. UPI Payment URI Analysis (upi://pay?...)
  if (lower.startsWith("upi://pay")) {
    let parsedUrl: URL;
    try {
      // Fix format for URL parser if needed
      const normalized = trimmed.replace("upi://pay", "https://upi-intent.mock");
      parsedUrl = new URL(normalized);
    } catch {
      return {
        rawPayload: trimmed,
        payloadType: "UPI_PAYMENT",
        isReverseScam: false,
        riskScore: 85,
        riskTier: "HIGH_RISK",
        flags: ["Malformed UPI URI scheme", "Corrupted intent parameters"],
        explanationEn: "The QR code contains a corrupted or tampered UPI payment format.",
        explanationHi: "इस क्यूआर कोड में विकृत या छेड़छाड़ की गई UPI भुगतान संरचना है।",
        recommendation: "Reject transaction immediately."
      };
    }

    const params = parsedUrl.searchParams;
    const payeeVpa = params.get("pa") || "";
    const payeeName = params.get("pn") || "";
    const amount = params.get("am") || undefined;
    const note = params.get("tn") || "";
    const currency = params.get("cu") || "INR";

    // Detect if VPA belongs to personal handle vs merchant handle
    // Merchants usually have merchant codes or registered gateway handles
    const personalHandles = ["okhdfcbank", "okaxis", "oksbi", "okicici", "ybl", "paytm", "axl", "ibl"];
    const isPersonalHandle = personalHandles.some(h => payeeVpa.toLowerCase().endsWith("@" + h));

    // Reverse QR Scam Detection:
    // A QR code ALWAYS DEBITS money from the person who scans it!
    // If the note or name mentions "Refund", "Cashback", "Reward", "Prize", or "Receive", it's a 100% scam!
    let isReverseScam = false;
    const reverseKeywords = [/refund/i, /cashback/i, /receive/i, /prize/i, /claim/i, /gift/i, /lottery/i, /रिफंड/i, /इनाम/i];
    if (reverseKeywords.some(r => r.test(note) || r.test(payeeName))) {
      isReverseScam = true;
      flags.push("CRITICAL REVERSE-QR SCAM: Payload claims you are 'Receiving' or getting a 'Refund/Cashback'. Scanning a QR ALWAYS DEBITS money!");
      score += 65;
    }

    // Masquerading Check: payeeName claims to be a company/government entity, but VPA is an individual handle
    let personalVpaMasquerade = false;
    const corporateKeywords = [/electricity/i, /discom/i, /bescom/i, /tneb/i, /rbi/i, /sbi/i, /support/i, /officer/i, /airtel/i, /jio/i, /बिजली/i];
    if (corporateKeywords.some(r => r.test(payeeName)) && isPersonalHandle) {
      personalVpaMasquerade = true;
      flags.push(`Impersonation Anomaly: Name claims '${payeeName}' but destination VPA (${payeeVpa}) is an individual personal account!`);
      score += 45;
    }

    // Amount manipulation check
    if (amount) {
      const numAmt = parseFloat(amount);
      if (numAmt > 5000) {
        flags.push(`High value transaction hardcoded: ₹${numAmt.toLocaleString('en-IN')}`);
        score += 20;
      }
    }

    // Verify clean merchant
    const isMerchantVpa = !isPersonalHandle || payeeVpa.includes(".merchant");
    if (isMerchantVpa && !isReverseScam && !personalVpaMasquerade) {
      flags.push("Verified Merchant Payment Format");
      score = Math.max(0, score - 20);
    }

    const finalScore = Math.min(100, Math.max(5, score));
    const riskTier = finalScore >= 65 ? "HIGH_RISK" : finalScore >= 35 ? "SUSPICIOUS" : "SAFE";

    let explanationEn = "";
    let explanationHi = "";

    if (isReverseScam) {
      explanationEn = `CRITICAL ALERT: This is an active Reverse-QR Scam. In UPI, YOU NEVER SCAN TO RECEIVE MONEY OR CASHBACK. Scanning this code will ask for your UPI PIN and immediately transfer ₹${amount || "money"} from your account to the scammer (${payeeVpa}).`;
      explanationHi = `गंभीर चेतावनी: यह 'रिवर्स क्यूआर घोटाला' है। UPI में पैसे या कैशबैक प्राप्त करने के लिए कभी भी क्यूआर स्कैन नहीं करना पड़ता। इसे स्कैन करके पिन डालने पर पैसे आपके खाते से कट जाएंगे।`;
    } else if (personalVpaMasquerade) {
      explanationEn = `FRAUD DETECTED: The QR code claims to belong to an official body (${payeeName}), but the underlying money is routed to an individual's personal UPI ID (${payeeVpa}).`;
      explanationHi = `धोखाधड़ी का पता चला: यह क्यूआर कोड आधिकारिक संस्था का दावा करता है, लेकिन भुगतान किसी निजी व्यक्ति के यूपीआई पते (${payeeVpa}) पर जा रहा है।`;
    } else {
      explanationEn = `Standard legitimate UPI payment code to ${payeeName || payeeVpa}. Verify the amount and recipient before authorizing in your UPI app.`;
      explanationHi = `मानक वैध UPI भुगतान कोड। अपने ऐप में पुष्टि करने से पहले राशि और प्राप्तकर्ता की जांच कर लें।`;
    }

    return {
      rawPayload: trimmed,
      payloadType: "UPI_PAYMENT",
      isReverseScam,
      riskScore: finalScore,
      riskTier,
      flags,
      upiDetails: {
        payeeVpa,
        payeeName,
        amount,
        transactionNote: note,
        currency,
        isMerchantVpa,
        personalVpaMasquerade
      },
      explanationEn,
      explanationHi,
      recommendation: isReverseScam || personalVpaMasquerade
        ? "DO NOT AUTHORIZE. Never enter your UPI PIN. Cancel and report to bank."
        : "Verify payee name and amount in your UPI app before completing payment."
    };
  }

  // 2. Web URL QR Payload
  if (lower.startsWith("http://") || lower.startsWith("https://") || lower.includes("www.") || lower.endsWith(".com") || lower.endsWith(".xyz")) {
    const embeddedUrlResult = analyzeUrl(trimmed);
    const isApp = lower.endsWith(".apk") || lower.endsWith(".exe");

    let payloadType: QrAnalysisResult["payloadType"] = isApp ? "MALICIOUS_APP" : "WEB_URL";
    if (isApp) {
      flags.push("Direct executable/APK download link embedded inside QR code (Severe Malware Vector)");
      embeddedUrlResult.riskScore = 98;
      embeddedUrlResult.riskTier = "HIGH_RISK";
    }

    return {
      rawPayload: trimmed,
      payloadType,
      isReverseScam: false,
      riskScore: embeddedUrlResult.riskScore,
      riskTier: embeddedUrlResult.riskTier,
      flags: [...embeddedUrlResult.flags, ...flags],
      embeddedUrlResult,
      explanationEn: `QR code embeds web link: ${embeddedUrlResult.explanationEn}`,
      explanationHi: `क्यूआर कोड में वेब लिंक मौजूद है: ${embeddedUrlResult.explanationHi}`,
      recommendation: embeddedUrlResult.riskTier === "HIGH_RISK"
        ? "DO NOT OPEN this URL. It leads to a high-risk portal or malware APK."
        : "Open only if you recognize the website domain."
    };
  }

  // 3. Raw Text
  return {
    rawPayload: trimmed,
    payloadType: "TEXT_DATA",
    isReverseScam: false,
    riskScore: 10,
    riskTier: "SAFE",
    flags: ["Plaintext QR data without executable intent"],
    explanationEn: "This QR code contains static plaintext and cannot directly trigger financial transfers or web navigations.",
    explanationHi: "इस क्यूआर कोड में केवल सामान्य टेक्स्ट है और इससे कोई वित्तीय लेनदेन नहीं हो सकता।",
    recommendation: "Safe to view."
  };
}
