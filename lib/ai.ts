import Groq from "groq-sdk";

export class AIInferenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AIInferenceError";
  }
}

/**
 * Step 1: Transcribe all visible text from the image.
 * No product examples, no hints.
 */
export async function ocrImage(base64Image: string): Promise<string> {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const completion = await groq.chat.completions.create(
      {
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Read ALL visible text on this product — labels, stickers, printed model numbers, brand names. Return ONLY the raw text you see, exactly as it appears. Do not add any other words. If you cannot read any text, return an empty string.",
              },
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
        max_tokens: 200,
      },
      { signal: controller.signal }
    );

    const text = completion.choices[0]?.message?.content || "";
    console.log("[OCR] Transcribed:", text.substring(0, 200));
    return text.trim();
  } catch (err: any) {
    console.error("[OCR] Failed:", err.message);
    return "";
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Step 2: Damage assessment only.
 * No product name involved.
 */
export async function analyzeDamage(base64Image: string): Promise<{
  damage_detected: boolean;
  warranty_eligible: boolean;
}> {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const completion = await groq.chat.completions.create(
      {
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: 'Is the item in this image physically damaged or clearly broken? Return ONLY a JSON object with these keys: { "damage_detected": boolean, "warranty_eligible": boolean }. No other text.',
              },
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
        max_tokens: 100,
      },
      { signal: controller.signal }
    );

    const raw = completion.choices[0]?.message?.content || "";
    let jsonStr = raw.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/```(?:json)?/g, "").trim();
    }
    const parsed = JSON.parse(jsonStr);
    return {
      damage_detected: Boolean(parsed.damage_detected),
      warranty_eligible: Boolean(parsed.warranty_eligible),
    };
  } catch (err: any) {
    if (err.name === "AbortError" || err.code === "ETIMEDOUT") {
      throw new AIInferenceError("Groq request timed out");
    }
    throw new AIInferenceError(`Damage analysis failed: ${err.message}`);
  } finally {
    clearTimeout(timeoutId);
  }
}