import Stripe from 'stripe';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
});

// Credit packages
const CREDIT_PACKAGES = {
  starter: { credits: 100, priceId: process.env.STRIPE_PRICE_STARTER! },
  pro: { credits: 500, priceId: process.env.STRIPE_PRICE_PRO! },
  unlimited: { credits: 2000, priceId: process.env.STRIPE_PRICE_UNLIMITED! },
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { packageId } = await req.json();
    const pkg = CREDIT_PACKAGES[packageId as keyof typeof CREDIT_PACKAGES];
    if (!pkg) {
      return NextResponse.json({ error: 'Invalid package' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: pkg.priceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${baseUrl}/?success=true&package=${packageId}`,
      cancel_url: `${baseUrl}/?cancelled=true`,
      metadata: {
        userId,
        packageId,
        credits: pkg.credits.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('[Stripe Checkout Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
