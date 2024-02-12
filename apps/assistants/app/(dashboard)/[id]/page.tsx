import { notFound } from 'next/navigation';

import { AssistantChat, AppLayout } from '@bxav/app-assistants-common';
import { db, getCurrentUser } from '@bxav/app-assistants-common/server';

export default async function AssistantPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;

  const user = await getCurrentUser();
  const assistant = await db.assistant.findUnique({
    where: {
      id: id,
      authorId: user.id,
    },
  });

  if (!assistant) {
    return notFound();
  }

  return (
    <AppLayout user={user} assistant={assistant}>
      <AssistantChat />
    </AppLayout>
  );
}
