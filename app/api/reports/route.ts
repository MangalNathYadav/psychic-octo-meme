import { NextRequest, NextResponse } from "next/server";
import { getRecentThreatReports, saveThreatReport } from "@/lib/firebase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limitCount = parseInt(searchParams.get("limit") || "10", 10);
    const reports = await getRecentThreatReports(limitCount);
    return NextResponse.json({
      success: true,
      reports
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch threat reports" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, target, riskScore, riskLevel, summary, flags, userNotes } = body;

    const saved = await saveThreatReport({
      type: type || "url",
      target: target || "Manual Report",
      riskScore: riskScore ?? 85,
      riskLevel: riskLevel || "HIGH_RISK",
      summary: summary || "Citizen reported phishing incident",
      flags: flags || ["Citizen Manual Report"],
      userNotes: userNotes || "Reported via ScamShield Community Incident Form"
    });

    return NextResponse.json({
      success: true,
      data: saved
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit threat report" },
      { status: 500 }
    );
  }
}
