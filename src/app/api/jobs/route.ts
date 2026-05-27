import { NextRequest } from "next/server";
import { searchJobs } from "@/lib/adzuna";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const what = searchParams.get("what") || "software engineer";
    const where = searchParams.get("where") || undefined;
    const country = searchParams.get("country") || "us";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const full_time = searchParams.get("full_time") === "1";
    const part_time = searchParams.get("part_time") === "1";

    const data = await searchJobs({
      what,
      where,
      country,
      page,
      results_per_page: 20,
      full_time: full_time || undefined,
      part_time: part_time || undefined,
    });

    return Response.json(data);
  } catch (error: unknown) {
    console.error("Jobs API error:", error);
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch jobs",
        results: [],
        count: 0,
      },
      { status: 500 }
    );
  }
}
