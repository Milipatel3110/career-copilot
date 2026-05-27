import { NextRequest } from "next/server";
import { generateContent, streamToResponse } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      role,
      company,
      type,
      difficulty,
      action,
      question,
      answer,
    } = body;

    if (!role) {
      return Response.json({ error: "Role is required" }, { status: 400 });
    }

    if (action === "generate") {
      // Generate 5 interview questions as a JSON array
      const prompt = `You are an expert interviewer. Generate exactly 5 ${type} interview questions for a ${difficulty}-level ${role} position${company ? ` at ${company}` : ""}.

Requirements:
- Questions should be realistic and challenging
- For Behavioral: Use STAR-method scenarios
- For Technical: Include specific technical challenges relevant to ${role}
- For Mixed: Mix of behavioral and technical
- Questions should be appropriate for ${difficulty} level
- Make them specific to the ${role} role, not generic

Return ONLY a valid JSON array of exactly 5 question strings. No other text, no markdown, no explanation. Just the JSON array.

Example format:
["Question 1 here?", "Question 2 here?", "Question 3 here?", "Question 4 here?", "Question 5 here?"]`;

      const text = await generateContent(prompt);

      // Clean and parse the JSON
      let cleaned = text.trim();
      // Remove markdown code blocks if present
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "");
      // Find JSON array
      const start = cleaned.indexOf("[");
      const end = cleaned.lastIndexOf("]");
      if (start !== -1 && end !== -1) {
        cleaned = cleaned.substring(start, end + 1);
      }

      let questions: string[];
      try {
        questions = JSON.parse(cleaned);
      } catch {
        // Fallback: extract questions manually
        questions = cleaned
          .split(/\d\.\s+/)
          .filter((s: string) => s.trim().length > 10)
          .slice(0, 5)
          .map((s: string) => s.trim().replace(/^["']|["']$/g, "").replace(/",?\s*$/, "").trim());

        if (questions.length < 3) {
          return Response.json(
            { error: "Failed to generate questions. Please try again." },
            { status: 500 }
          );
        }
      }

      return Response.json({ questions: questions.slice(0, 5) });
    }

    if (action === "feedback") {
      if (!question || !answer) {
        return Response.json(
          { error: "Question and answer are required" },
          { status: 400 }
        );
      }

      const prompt = `You are an expert interviewer giving feedback on a candidate's answer. The candidate is applying for a ${difficulty}-level ${role} position${company ? ` at ${company}` : ""}.

**Interview Question:**
${question}

**Candidate's Answer:**
${answer}

Provide detailed, constructive feedback in this exact format using markdown:

## Score: X/10

Give a score and a 1-sentence summary of the overall quality.

---

## What Was Good

2-3 specific things the candidate did well in their answer. Be specific and reference their actual words.

---

## What Was Missing or Could Be Improved

2-3 specific gaps or weaknesses in the answer. For behavioral questions, note if they didn't use STAR method clearly. Be direct but constructive.

---

## Model Answer

Provide a strong example answer to this question that a top candidate would give. Make it realistic, specific, and appropriately detailed for a ${difficulty}-level ${role}.

---

## One Tip to Remember

One concise, memorable tip they can apply to all future interview answers.`;

      const stream = await streamToResponse(prompt);

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    console.error("Interview API error:", error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process interview request",
      },
      { status: 500 }
    );
  }
}
