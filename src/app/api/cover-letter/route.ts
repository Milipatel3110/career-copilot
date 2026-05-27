import { NextRequest } from "next/server";
import { streamToResponse } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("resume") as File | null;
    const jobTitle = (formData.get("jobTitle") as string) || "";
    const company = (formData.get("company") as string) || "";
    const jobDescription = (formData.get("jobDescription") as string) || "";
    const tone = (formData.get("tone") as string) || "Professional";

    if (!jobTitle || !company) {
      return Response.json(
        { error: "Job title and company are required" },
        { status: 400 }
      );
    }

    let resumeText = "";
    if (file && file.type === "application/pdf") {
      const buffer = Buffer.from(await file.arrayBuffer());
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      resumeText = result.text;
    }

    const toneInstructions = {
      Professional:
        "formal, polished, and authoritative. Use confident, business-appropriate language with a structured tone.",
      Enthusiastic:
        "energetic, warm, and genuinely excited. Show authentic enthusiasm for the role and company while remaining professional.",
      Concise:
        "brief, direct, and punchy. Get to the point quickly. Avoid filler words. Every sentence should earn its place.",
    }[tone] || "professional";

    const prompt = `You are an expert cover letter writer who has helped thousands of candidates land jobs at top companies. Write an outstanding cover letter.

**Position:** ${jobTitle}
**Company:** ${company}
**Tone:** ${toneInstructions}
${resumeText ? `\n**Candidate's Resume:**\n${resumeText.substring(0, 3000)}\n` : ""}
${jobDescription ? `\n**Job Description:**\n${jobDescription.substring(0, 2000)}\n` : ""}

Write a complete, ready-to-send cover letter that:

1. Opens with a compelling hook (NOT "I am writing to apply for...")
2. Demonstrates genuine knowledge of the company
3. Connects the candidate's experience to specific job requirements (if resume provided)
4. Includes 1-2 specific accomplishments with metrics or impact
5. Shows cultural fit and enthusiasm for the specific role
6. Closes with a clear, confident call to action
7. Is appropriately ${tone === "Concise" ? "short (3 tight paragraphs)" : "detailed (4 paragraphs)"}

Format the letter professionally with:
- Date placeholder: [Date]
- Hiring Manager placeholder: [Hiring Manager's Name] or "Hiring Team"
- Candidate name placeholder: [Your Name]
- Contact info placeholders at the end

Write ONLY the cover letter. No commentary, no "here's your letter", no markdown headers. Just the letter itself, formatted as it would appear on paper.`;

    const stream = await streamToResponse(prompt);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: unknown) {
    console.error("Cover letter error:", error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate cover letter",
      },
      { status: 500 }
    );
  }
}
