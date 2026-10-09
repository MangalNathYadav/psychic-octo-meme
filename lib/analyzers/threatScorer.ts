import { analyzeUrl, UrlAnalysisResult } from "./urlAnalyzer";
import { analyzeMessage, NlpAnalysisResult } from "./nlpEngine";
import { inspectQrPayload, QrAnalysisResult } from "./qrInspector";

export interface OmniThreatReport {
  overallRiskScore: number; // 0 - 100
  overallRiskTier: "SAFE" | "SUSPICIOUS" | "HIGH_RISK";
  zeroTrustVerificationPassed: boolean;
  threatSummaryEn: string;
  threatSummaryHi: string;
  vectorsAnalyzed: {
    url?: UrlAnalysisResult;
    message?: NlpAnalysisResult;
    qr?: QrAnalysisResult;
  };
  metrics: {
    domainTrust: number; // 0-100 (100 = safest)
    protocolSecurity: number; // 0-100 (100 = safest)
    linguisticUrgency: number; // 0-100 (0 = safest)
    impersonationRisk: number; // 0-100 (0 = safest)
    zeroTrustScore: number; // 0-100 (100 = fully verified)
  };
  keyFlags: string[];
  actionChecklist: {
    immediateAction: string;
    reportingStep: string;
    helpline: string;
  };
}

export function synthesizeOmniThreat(params: {
  url?: string;
  message?: string;
  qrPayload?: string;
}): OmniThreatReport {
  const { url, message, qrPayload } = params;

  let urlResult: UrlAnalysisResult | undefined;
  let messageResult: NlpAnalysisResult | undefined;
  let qrResult: QrAnalysisResult | undefined;

  let scoreSum = 0;
  let weightSum = 0;
  const allFlags: string[] = [];

  // Metrics initialization
  let domainTrust = 95;
  let protocolSecurity = 95;
  let linguisticUrgency = 0;
  let impersonationRisk = 0;

  // 1. Analyze Message
  if (message && message.trim().length > 0) {
    messageResult = analyzeMessage(message);
    const weight = 0.40;
    scoreSum += messageResult.compositeNlpScore * weight;
    weightSum += weight;

    linguisticUrgency = messageResult.urgencyScore;
    impersonationRisk = messageResult.impersonationScore;
    allFlags.push(...messageResult.detectedKeywords.map(k => `Message: ${k}`));
  }

  // 2. Analyze URL
  if (url && url.trim().length > 0) {
    urlResult = analyzeUrl(url);
    const weight = 0.35;
    scoreSum += urlResult.riskScore * weight;
    weightSum += weight;

    domainTrust = Math.max(5, 100 - urlResult.riskScore);
    protocolSecurity = urlResult.details.sslStatus.includes("Unencrypted") ? 20 : 90;
    allFlags.push(...urlResult.flags.map(f => `Link: ${f}`));
  }

  // 3. Analyze QR
  if (qrPayload && qrPayload.trim().length > 0) {
    qrResult = inspectQrPayload(qrPayload);
    const weight = 0.35;
    scoreSum += qrResult.riskScore * weight;
    weightSum += weight;

    if (qrResult.isReverseScam) {
      impersonationRisk = Math.max(impersonationRisk, 95);
    }
    allFlags.push(...qrResult.flags.map(f => `QR: ${f}`));
  }

  const finalScore = weightSum > 0 ? Math.round(scoreSum / weightSum) : 0;
  const overallRiskTier = finalScore >= 65 ? "HIGH_RISK" : finalScore >= 35 ? "SUSPICIOUS" : "SAFE";
  const zeroTrustVerificationPassed = overallRiskTier === "SAFE";
  const zeroTrustScore = Math.max(5, 100 - finalScore);

  // Summary logic
  let threatSummaryEn = "";
  let threatSummaryHi = "";

  if (overallRiskTier === "HIGH_RISK") {
    threatSummaryEn = `CRITICAL CYBER THREAT DETECTED: This interaction displays classical indicators of targeted social engineering and financial credential fraud. Zero-Trust verification failed across multiple vectors.`;
    threatSummaryHi = `गंभीर साइबर खतरा मिला: यह संपर्क वित्तीय धोखाधड़ी और नकली लिंक के स्पष्ट संकेत प्रदर्शित करता है। सुरक्षा जांच में इसे उच्च जोखिम पाया गया है।`;
  } else if (overallRiskTier === "SUSPICIOUS") {
    threatSummaryEn = `SUSPICIOUS ACTIVITY: Anomaly score is elevated due to irregular contact channels or pressuring phrasing. Do not share payment credentials.`;
    threatSummaryHi = `संदिग्ध गतिविधि: दबाव डालने वाली भाषा या असत्यापित स्रोत के कारण सतर्क रहें। भुगतान या ओटीपी साझा न करें।`;
  } else {
    threatSummaryEn = `VERIFIED LEGITIMATE: All Zero-Trust security checkpoints passed. Verified domain signature and non-threatening communication patterns.`;
    threatSummaryHi = `सत्यापित और सुरक्षित: सुरक्षा जांच में कोई खतरा नहीं पाया गया। सभी विवरण सामान्य और सुरक्षित हैं।`;
  }

  return {
    overallRiskScore: finalScore,
    overallRiskTier,
    zeroTrustVerificationPassed,
    threatSummaryEn,
    threatSummaryHi,
    vectorsAnalyzed: {
      url: urlResult,
      message: messageResult,
      qr: qrResult,
    },
    metrics: {
      domainTrust,
      protocolSecurity,
      linguisticUrgency,
      impersonationRisk,
      zeroTrustScore
    },
    keyFlags: Array.from(new Set(allFlags)).slice(0, 8),
    actionChecklist: {
      immediateAction: overallRiskTier === "HIGH_RISK"
        ? "DO NOT enter UPI PIN, DO NOT click link, DO NOT install any provided APK."
        : overallRiskTier === "SUSPICIOUS"
        ? "Verify transaction details directly from your bank's official application."
        : "Safe to proceed with normal caution.",
      reportingStep: "Forward fraudulent SMS to 1909 or report suspect number on the Chakshu Portal (Sanchar Saathi).",
      helpline: "National Cyber Crime Reporting Helpline: 1930 / https://cybercrime.gov.in"
    }
  };
}
