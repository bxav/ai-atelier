'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { db } from '../lib/db';
import { getCurrentUser } from '../lib/session';

export async function createAssistantAction(values: any) {
  const user = await getCurrentUser();

  const assistant = await db.assistant.create({
    data: {
      name: values.name,
      description: values.description,
      config: values.config,
      messages: values.messages,
      author: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  revalidatePath('/');
  redirect(`/${assistant.id}`);
}
