import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function getOrCreateUser() {
  const { userId } = await auth();
  if (!userId) return null;

  let user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    user = await prisma.user.create({
      data: {
        id: userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        credits: 50, // Initial free credits
      },
    });
  }

  return user;
}

export async function hasCredits(amount: number = 1) {
  const user = await getOrCreateUser();
  if (!user) return false;
  return user.credits >= amount;
}

export async function deductCredits(amount: number = 1) {
  const { userId } = await auth();
  if (!userId) return false;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          decrement: amount,
        },
      },
    });
    return true;
  } catch (error) {
    console.error('Failed to deduct credits:', error);
    return false;
  }
}
