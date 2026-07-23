// Using the new @google/genai SDK (replaces deprecated @google/generative-ai)
// This SDK fully supports the new "AQ." API key format from Google AI Studio.
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Model priority list: tries each in order until one succeeds.
// gemini-2.5-flash is the best for vision; others are fallbacks.
const MODEL_PRIORITY = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-flash-latest",
];

const optimizePrompt = async (prompt, referenceImage = null) => {
  const instruction = `You are a professional AI Prompt Engineer.
Your job is to improve prompts for an AI Image Generator.
Rules:
- Keep under 70 words.
- Improve realism with cinematic lighting and camera angle.
- Add detailed textures and high quality descriptors.
- Do NOT explain yourself.
- Return ONLY the final optimized prompt as a single paragraph.`;

  let contents;

  if (referenceImage?.buffer) {
    // Vision mode: send image + text together so Gemini can read
    // any text in the image and extract its visual style/mood/tone.
    contents = [
      {
        role: "user",
        parts: [
          {
            text: `${instruction}

User Prompt: ${prompt}

A reference image has been provided. Carefully analyse it:
1. READ any text visible in the image and incorporate its meaning/theme into the prompt.
2. EXTRACT the visual style, colour palette, mood, lighting, tone, and composition.
3. MAINTAIN those visual characteristics in the output prompt.
4. BLEND the image's visual identity with the user's requested subject.

Generate a single optimized image generation prompt that respects both the user's idea and the reference image's visual language.`,
          },
          {
            inlineData: {
              data: referenceImage.buffer.toString("base64"),
              mimeType: referenceImage.mimetype,
            },
          },
        ],
      },
    ];
  } else {
    // Text-only mode
    contents = `${instruction}\n\nUser Prompt: ${prompt}`;
  }

  // Try each model in priority order until one succeeds
  for (const model of MODEL_PRIORITY) {
    try {
      const response = await ai.models.generateContent({ model, contents });
      console.log(`✅ Prompt optimized using ${model}`);
      return response.text.trim();
    } catch (error) {
      const code = error?.message?.includes('"code":429') ? 429
                 : error?.message?.includes('"code":404') ? 404
                 : error?.message?.includes('"code":503') ? 503
                 : 0;

      if (code === 429 || code === 503 || code === 404) {
        // Quota exhausted, model not found, or overloaded — try next model
        console.warn(`⚠️  ${model} unavailable (${code}), trying next...`);
        continue;
      }

      // For auth errors or unexpected errors, log and fall back immediately
      console.error("Gemini Error:", error.message);
      break;
    }
  }

  // Graceful fallback — return original prompt so image generation still proceeds
  console.warn("⚠️  All Gemini models exhausted/failed — using original prompt as fallback.");
  return prompt;
};

export default optimizePrompt;