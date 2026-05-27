import { NextRequest } from "next/server";
import { streamToResponse } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let resumeText = "";
    let jobDescription = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("resume") as File | null;
      jobDescription = (formData.get("jobDescription") as string) || "";

      if (file && file.type === "application/pdf") {
        const buffer = Buffer.from(await file.arrayBuffer());
        const { PDFParse } = await import("pdf-parse");
        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        resumeText = result.text;
      }
    } else {
      const body = await request.json();
      resumeText = body.resumeText || "";
      jobDescription = body.jobDescription || "";
    }

    if (!jobDescription.trim()) {
      return Response.json(
        { error: "Job description is required" },
        { status: 400 }
      );
    }

    const hasResume = resumeText.trim().length > 50;

    const prompt = `You are an expert career coach and ATS specialist. Analyze the compatibility between this candidate's resume and the job description.

${hasResume ? `Resume:\n${resumeText.substring(0, 4000)}` : "Note: No resume provided. Give general advice based on the job description."}

Job Description:
${jobDescription.substring(0, 3000)}

Provide your analysis in this exact format using markdown:

## Match Score: XX%

Show a percentage match and a 2-sentence explanation of the score.

---

## Skills You Have That Match

List specific skills, experiences, or qualifications from the resume that align with the job requirements. Use bullet points.

---

## Skills Gap (What You're Missing)

List specific skills, qualifications, or experiences required by the job that are missing or unclear from the resume. Prioritize them by importance.

---

## How to Position Yourself

Give 3-4 specific, tactical pieces of advice on how to present yourself for this role. This should include:
- How to frame existing experience
- Keywords to add to the resume
- What to emphasize in the cover letter

---

## Suggested Bullet Point Rewrites

Pick 2-3 bullet points from the resume and rewrite them to better match the job description's language and requirements. Show before/after format:

**Before:** [original bullet]
**After:** [improved bullet that uses JD keywords and quantifies impact]

---

## Overall Recommendation

One paragraph: should they apply? What's their biggest strength for this role? What's the one thing that would most improve their chances?`;

    const stream = await streamToResponse(prompt);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: unknown) {
    console.error("Match job error:", error);
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to analyze match",
      },
      { status: 500 }
    );
  }
}
