import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = "openai/gpt-oss-120b";

export async function streamToResponse(prompt: string): Promise<ReadableStream> {
  const stream = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    stream: true,
    max_tokens: 4096,
  });

  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) controller.enqueue(encoder.encode(text));
        }
      } finally {
        controller.close();
      }
    },
  });
}

export async function generateContent(prompt: string): Promise<string> {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 4096,
  });
  return response.choices[0]?.message?.content ?? "";
}
