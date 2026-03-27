import { task } from "@trigger.dev/sdk/v3";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateImageTask = task({
  id: "generate-image",
  run: async (payload: { prompt: string; width: number; height: number; seed: number }) => {
    const { prompt, width, height, seed } = payload;
    const encodedPrompt = encodeURIComponent(prompt);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=true`;
    
    try {
      // Pollinations.ai generates the image on the first request
      await fetch(pollinationsUrl);
    } catch (e) {
      console.warn("Pollinations fetch error", e);
    }

    return {
      success: true,
      imageUrl: `/api/proxy-image?url=${encodeURIComponent(pollinationsUrl)}`
    };
  }
});

export const generateTextTask = task({
  id: "generate-text",
  run: async (payload: { prompt: string; systemPrompt?: string }) => {
    if (!process.env.GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const modelsToTry = ["gemini-2.0-flash-exp", "gemini-1.5-flash-latest", "gemini-1.5-flash", "gemini-pro"];
    let result = null;
    let lastError = null;
    const fullPrompt = payload.systemPrompt ? `${payload.systemPrompt}\n\nUser: ${payload.prompt}` : payload.prompt;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const chat = model.startChat({ history: [], generationConfig: { maxOutputTokens: 2048 } });
        result = await chat.sendMessage(fullPrompt);
        break;
      } catch (err: any) {
        lastError = err;
      }
    }

    if (!result) throw lastError || new Error("All fallback models failed");
    return { success: true, text: result.response.text() };
  }
});
