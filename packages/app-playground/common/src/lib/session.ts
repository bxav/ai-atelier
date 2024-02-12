import { auth } from '@clerk/nextjs';
import { db } from './db';

export async function getCurrentUser({ withPresets = false }) {
  const user = await findCurrentUser({ withPresets });

  if (!user) {
    throw new Error('No user found');
  }

  return user;
}

export async function findCurrentUser({ withPresets = false }) {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  let user = await db.user.findUnique({
    where: {
      externalId: userId as string,
    },
    include: {
      presets: withPresets,
    },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        externalId: userId as string,
      },
      include: {
        presets: withPresets,
      },
    });
  }

  return user;
}
