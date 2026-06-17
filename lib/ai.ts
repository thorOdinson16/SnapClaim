import Groq from "groq-sdk";

export class AIInferenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AIInferenceError";
  }
}

export async function analyzeImage(base64Image: string): Promise<{
  product_name: string;
  damage_detected: boolean;
  warranty_eligible: boolean;
}> {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const systemPrompt = `
You are a warranty claim processor. Analyse the image of a damaged product.
Return exactly a JSON object with these keys:
- product_name: string (the exact model if clearly visible, else "unknown")
- damage_detected: boolean
- warranty_eligible: boolean (true if product is identifiable and clearly broken)
Do not include any additional text, markdown, or explanation.
`.trim();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const chatCompletion = await groq.chat.completions.create(
      {
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        temperature: 0,
        max_tokens: 256,
      },
      { signal: controller.signal }
    );

    const rawContent = chatCompletion.choices[0]?.message?.content;
    if (!rawContent) throw new AIInferenceError("Empty response from Groq");

    // Strip any potential markdown code fences
    let jsonStr = rawContent.trim();
    if (jsonStr.startsWith("```json")) {
      jsonStr = jsonStr.slice(7);
    } else if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.slice(3);
    }
    if (jsonStr.endsWith("```")) {
      jsonStr = jsonStr.slice(0, -3);
    }

    const parsed = JSON.parse(jsonStr);
    return {
      product_name: parsed.product_name ?? "unknown",
      damage_detected: Boolean(parsed.damage_detected),
      warranty_eligible: Boolean(parsed.warranty_eligible),
    };
  } catch (error: any) {
    if (error.name === "AbortError" || error.code === "ETIMEDOUT") {
      throw new AIInferenceError("Groq request timed out");
    }
    throw new AIInferenceError(
      `AI inference failed: ${error.message || "Unknown error"}`
    );
  } finally {
    clearTimeout(timeoutId);
  }
}