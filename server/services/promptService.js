import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const optimizePrompt = async (prompt) => {
  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(`
You are a professional AI Prompt Engineer.

Your job is to improve prompts for an AI Image Generator.

Rules:

- Keep under 70 words.
- Improve realism.
- Add cinematic lighting.
- Add camera angle.
- Add detailed textures.
- Add high quality.
- Don't explain.
- Return ONLY the optimized prompt.

User Prompt:

${prompt}
`);

    return result.response.text().trim();

  } catch (error) {

    console.log("Gemini Error:", error.message);

    // fallback
    return prompt;
  }
};

export default optimizePrompt;