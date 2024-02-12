import { Metadata, ResolvingMetadata } from 'next';
import { redirect } from 'next/navigation';

import { db } from '@bxav/app-playground-common/server';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;

  const preset = await db.preset.findUnique({
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

export default async function Index({ params }: { params: { id: string } }) {
  redirect(`/?shareId=${params.id}`);
}
