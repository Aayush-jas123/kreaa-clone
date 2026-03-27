import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const { userId }: { userId: string | null } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId }: { userId: string | null } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, name, nodes, edges } = await req.json();

    const project = await prisma.project.upsert({
      where: { id: id || 'new-unsaved-id' },
      update: {
        name,
        nodes: nodes || [],
        edges: edges || [],
      },
      create: {
        userId,
        name: name || 'Untitled Project',
        nodes: nodes || [],
        edges: edges || [],
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Failed to save project:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
