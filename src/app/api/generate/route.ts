import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, type } = body;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // TODO: Replace with real Replicate/OpenAI API call using process.env
    // e.g. const output = await replicate.run(model, { input: { prompt } })

    const dummyUrls = [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop"
    ];
    
    // Pick random dummy image
    const imageUrl = dummyUrls[Math.floor(Math.random() * dummyUrls.length)];

    return NextResponse.json({ success: true, imageUrl, prompt });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json({ success: false, error: "Generation failed" }, { status: 500 });
  }
}
