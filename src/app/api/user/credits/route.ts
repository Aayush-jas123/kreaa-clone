import { NextResponse } from 'next/server';
import { getOrCreateUser } from '@/lib/user';

export async function GET() {
  try {
    const user = await getOrCreateUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    return NextResponse.json({ credits: user.credits });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch credits' }, { status: 500 });
  }
}
