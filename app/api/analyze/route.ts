import { NextRequest, NextResponse } from "next/server";
import { synthesizeOmniThreat } from "@/lib/analyzers/threatScorer";
import { analyzeUrl } from "@/lib/analyzers/urlAnalyzer";
import { analyzeMessage } from "@/lib/analyzers/nlpEngine";
import { inspectQrPayload } from "@/lib/analyzers/qrInspector";
import { saveThreatReport } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode, url, message, qrPayload, notes } = body;

    let result: any;
    let target = "";
    let reportType: "url" | "message" | "qr" | "omni" = "omni";

    if (mode === "url" && url) {
      result = analyzeUrl(url);
      target = url;
      reportType = "url";
    } else if (mode === "message" && message) {
      result = analyzeMessage(message);
      target = message.slice(0, 80) + "...";
      reportType = "message";
    } else if (mode === "qr" && qrPayload) {
      result = inspectQrPayload(qrPayload);
      target = qrPayload.slice(0, 80);
      reportType = "qr";
    } else {
      // Omni mode
      result = synthesizeOmniThreat({ url, message, qrPayload });
      target = url || (message ? message.slice(0, 60) : qrPayload || "Omni-Input");
      reportType = "omni";
    }

    // Determine risk score & tier for Firebase logging
    const score = result.overallRiskScore ?? result.riskScore ?? result.compositeNlpScore ?? 0;
    const tier = result.overallRiskTier ?? result.riskTier ?? "SAFE";
    const flags = result.keyFlags ?? result.flags ?? result.detectedKeywords ?? [];
    const summary = result.threatSummaryEn ?? result.explanationEn ?? "Analysis completed";

    // Asynchronously log to Firebase Firestore
    try {
      await saveThreatReport({
        type: reportType,
        target,
        riskScore: score,
        riskLevel: tier,
        summary,
        flags: flags.slice(0, 5),
        userNotes: notes || "Scanned via ScamShield AI Web Terminal"
      });
    } catch (saveErr) {
      console.warn("Could not save to Firebase, continuing response:", saveErr);
    }

    return NextResponse.json({
      success: true,
      mode: mode || "omni",
      data: result
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to analyze threat vector" },
      { status: 500 }
    );
  }
}
