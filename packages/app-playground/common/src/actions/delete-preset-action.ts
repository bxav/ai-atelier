'use server';

import { revalidatePath } from 'next/cache';

import { db, getCurrentUser } from '../server';

export async function deletePresetAction(presetId: string) {
  const user = await getCurrentUser({});

  const preset = await db.preset.delete({
    where: {
      id: presetId,
      author: {
        id: user.id,
      },
    },
  });

  revalidatePath('/');

  return preset;
}
