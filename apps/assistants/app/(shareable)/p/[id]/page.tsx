import { Metadata, ResolvingMetadata } from 'next';
import { redirect } from 'next/navigation';

import { AssistantChat, AppLayout } from '@bxav/app-assistants-common';
import { db, findCurrentUser } from '@bxav/app-assistants-common/server';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;

  const preset = await db.assistant.findUnique({
    where: {
      shareId: id,
    },
  });

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: preset?.name || 'LLM Playground',
    description: preset?.description || 'The LLM Playground',
    openGraph: {
      images: [...previousImages],
    },
  };
}

export default async function ShareableAssistantPage({ params }: { params: { id: string } }) {
  const [user, dataAssistant] = await Promise.all([
    findCurrentUser(),
    db.assistant.findFirst({
      where: {
        shareId: params.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    }),
  ]);

  if (!dataAssistant) {
    redirect('/');
  }

  const assistant = {
    id: undefined,
    name: dataAssistant.name,
    description: dataAssistant.description,
    config: dataAssistant.config,
    messages: dataAssistant.shareWithMessages
      ? (dataAssistant.messages as any)
      : [],
  };

  return (
    <AppLayout user={user} assistant={assistant}>
      <AssistantChat />
    </AppLayout>
  );
}
