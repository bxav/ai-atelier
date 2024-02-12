import { auth } from '@clerk/nextjs';
import { db } from './db';

export async function getCurrentUser() {
  const user = await findCurrentUser();

  if (!user) {
    throw new Error('No user found');
  }

  return user;
}

export async function findCurrentUser() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  let user = await db.user.findUnique({
    where: {
      externalId: userId as string,
    },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        externalId: userId as string,
      },
    });
  }

  return user;
}
