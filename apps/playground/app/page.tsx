import { Metadata, ResolvingMetadata } from 'next';

import {
  PlaygroundContent,
  PlaygroundHeader,
  PresetConfigProvider,
  PromptConfigProvider,
  SelectedPresetProvider,
} from '@bxav/app-playground-common';
import { Separator } from '@bxav/ui-components';
import { db, findCurrentUser } from '@bxav/app-playground-common/server';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  let preset: any = null;
  if (searchParams && searchParams.shareId) {
    preset = await db.preset.findUnique({
      where: {
        shareId: searchParams.shareId as string,
      },
    });
  }

  return {
    title: preset?.name || 'LLM Playground',
    description: preset?.description || 'The LLM Playground',
  };
}

export default async function Index({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const user = await findCurrentUser({
    withPresets: true,
  });

  let preset: any = null;
  if (searchParams && searchParams.shareId) {
    preset = await db.preset.findUnique({
      where: {
        shareId: searchParams.shareId as string,
      },
    });
  }

  return (
    <>
      <div className="flex h-full flex-col">
        <SelectedPresetProvider
          initialPreset={
            preset?.id
              ? {
                  id: preset.id,
                  shareId: preset.shareId,
                }
              : undefined
          }
        >
          <PresetConfigProvider initialPresetConfig={preset?.config}>
            <PromptConfigProvider initialPromptConfig={preset?.promptConfig}>
              <PlaygroundHeader user={user} />
              <Separator />
              <PlaygroundContent />
            </PromptConfigProvider>
          </PresetConfigProvider>
        </SelectedPresetProvider>
      </div>
    </>
  );
}
