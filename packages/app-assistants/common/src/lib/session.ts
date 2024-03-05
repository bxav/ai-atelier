import { getServerSession } from 'next-auth/next';

import { db } from './db';
import { authOptions } from './auth';

export async function getCurrentUser() {
  const user = await findCurrentUser();

  if (!user) {
    throw new Error('No user found');
  }

  return user;
}

export async function findCurrentUser() {
  const session = await getServerSession(authOptions);

  const userId = (session?.user as any).id;

  if (!userId) {
    return null;
  }

  let user = await db.user.findUnique({
    where: {
      id: userId as string,
    },
  });

  return user;
}
