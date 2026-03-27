import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const generations = await prisma.generation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to recent 50
    });

    return NextResponse.json({ generations });
  } catch (error: any) {
    console.error('[Generations API Error]', error);
    return NextResponse.json({ error: 'Failed to fetch generations' }, { status: 500 });
  }
}
