'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { db } from '../lib/db';
import { getCurrentUser } from '../lib/session';

export async function deleteAssistantAction(assistantId: string) {
  const user = await getCurrentUser();

  await db.assistant.delete({
    where: {
      id: assistantId,
      author: {
        id: user.id,
      },
    },
  });

  revalidatePath('/');

  redirect('/');
}
