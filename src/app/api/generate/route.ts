import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, type, baseImageUrl, guidance_scale = 7.5, steps = 30, width = 1024, height = 1024 } = body;

    // --- OPTION 1: Free AI Image Generation via Pollinations.ai ---
    // This requires NO API KEY and generates real unique images instantly.
    const seed = Math.floor(Math.random() * 1000000);
    const encodedPrompt = encodeURIComponent(prompt || "beautiful aesthetic artwork");
    const imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=true`;
    
    // Log what was received for debugging
    console.log(`[Generate] type=${type}, steps=${steps}, cfg=${guidance_scale}, has_base_image=${!!baseImageUrl}`);

    // Wait slightly to ensure UI loading state is visible
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // --- OPTION 2: OpenAI DALL-E 3 (Requires API Key in .env.local) ---
    /*
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ success: false, error: "Missing OPENAI_API_KEY in .env.local" }, { status: 400 });
    }
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({ model: "dall-e-3", prompt: prompt, n: 1, size: "1024x1024" })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    const imageUrl = data.data[0].url;
    */

    return NextResponse.json({ success: true, imageUrl, prompt });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json({ success: false, error: "Generation failed" }, { status: 500 });
  }
}
