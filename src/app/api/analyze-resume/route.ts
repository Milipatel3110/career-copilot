import { NextRequest } from "next/server";
import { streamToResponse } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return Response.json(
        { error: "File must be a PDF" },
        { status: 400 }
      );
    }

    const uint8Array = new Uint8Array(await file.arrayBuffer());
    const { getDocumentProxy, extractText } = await import("unpdf");
    const pdf = await getDocumentProxy(uint8Array);
    const { text } = await extractText(pdf, { mergePages: true });

    if (!text || text.trim().length < 50) {
      return Response.json(
        { error: "Could not extract text from PDF. Make sure it's not a scanned image." },
        { status: 400 }
      );
    }

    const prompt = `You are an expert career coach, ATS specialist, and former senior recruiter with 15+ years of experience at top companies. Analyze this resume comprehensively and provide detailed, actionable feedback.

Provide your analysis in the following structured format using markdown:

## Overall Score: X/100

Give a score and a 2-sentence justification explaining the main factors affecting this score.

---

## ATS Compatibility

Explain how well this resume will pass Applicant Tracking Systems. Mention specific formatting issues, keyword density, and section headings. Rate it as Poor / Fair / Good / Excellent.

---

## Top Strengths

List exactly 3 specific strengths with direct quotes or examples from the resume:

1. **[Strength Name]**: [Explanation with specific example from resume]
2. **[Strength Name]**: [Explanation with specific example from resume]
3. **[Strength Name]**: [Explanation with specific example from resume]

---

## Improvement Areas

List exactly 5 specific, actionable improvements with before/after examples where possible:

1. **[Issue]**: [Current problem] → [How to fix it]
2. **[Issue]**: [Current problem] → [How to fix it]
3. **[Issue]**: [Current problem] → [How to fix it]
4. **[Issue]**: [Current problem] → [How to fix it]
5. **[Issue]**: [Current problem] → [How to fix it]

---

## Missing Keywords

List 8-12 important keywords or skills likely missing for their apparent target role. Group them by category (Technical Skills, Soft Skills, Industry Terms, etc.).

---

## Recruiter Perspective

Write 2-3 sentences as if you're a recruiter seeing this resume for the first time. Be honest about first impressions, what stands out, and any red flags.

---

## Quick Wins (Under 10 Minutes)

List exactly 3 specific changes they can make right now that will have the biggest impact:

1. **[Action]**: [Exactly what to do]
2. **[Action]**: [Exactly what to do]
3. **[Action]**: [Exactly what to do]

---

Resume to analyze:

${text}`;

    const stream = await streamToResponse(prompt);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Resume-Text": Buffer.from(text.substring(0, 5000)).toString(
          "base64"
        ),
      },
    });
  } catch (error: unknown) {
    console.error("Resume analysis error:", error);
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to analyze resume",
      },
      { status: 500 }
    );
  }
}
