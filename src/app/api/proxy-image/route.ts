import { NextResponse } from 'next/server';

// Proxies an external image URL to avoid CORS and CSP issues in the browser
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  try {
    const response = await fetch(decodeURIComponent(imageUrl), {
      signal: AbortSignal.timeout(45000), // 45 second timeout for slow generation
    });

    if (!response.ok) {
      return new NextResponse(`Failed to fetch image: ${response.status}`, { status: 502 });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    console.error('[proxy-image] Error:', error?.message);
    return new NextResponse('Image generation timed out or failed', { status: 504 });
  }
}
