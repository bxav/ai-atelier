'use server';

import { revalidatePath } from 'next/cache';

import { db, getCurrentUser } from '../server';

export async function createPresetAction(values: any) {
  const user = await getCurrentUser({});

  const preset = await db.preset.create({
    data: {
      name: values.name,
      description: values.description,
      config: values.config,
      promptConfig: values.promptConfig,
      author: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  revalidatePath('/');

  return preset;
}
