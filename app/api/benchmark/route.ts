import { NextResponse } from "next/server";
import { runBenchmarkSuite } from "@/lib/analyzers/dataset";

export async function GET() {
  try {
    const metrics = runBenchmarkSuite();
    return NextResponse.json({
      success: true,
      metrics
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Benchmark failed" },
      { status: 500 }
    );
  }
}
