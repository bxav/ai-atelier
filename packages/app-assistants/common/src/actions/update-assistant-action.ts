'use server';

import { revalidatePath } from 'next/cache';

import { db } from '../lib/db';

export async function updateAssistantAction(values: any) {
  const assistant = await db.assistant.update({
    where: {
      id: values.id,
    },
    data: {
      name: values.name,
      description: values.description,
      config: values.config,
      messages: values.messages,
      ...(values.shareWithMessages === true ||
      values.shareWithMessages === false
        ? { shareWithMessages: values.shareWithMessages }
        : {}),
    },
  });

  revalidatePath('/');

  return assistant;
}
