'use client';

import { HTMLAttributes } from 'react';

import {
  Textarea,
} from '@bxav/ui-components';
import { cn } from '@bxav/ui-utils';

import { SubmitButton } from './submit-button';
import { usePlaygroundState } from '../hooks/use-playground-state';

export const InsertPlayground = ({
  className,
}: HTMLAttributes<HTMLDivElement>) => {
  const {
    completion,
    error,
    complete,
    presetConfig,
    promptConfig,
    setPromptConfig,
  } = usePlaygroundState();

  const handleSubmit = async () => {
    const c = await complete(promptConfig.prompt);
    setPromptConfig((p) => ({
      ...p,
      result: c as string,
    }));
  };

  return (
    <div className={cn('flex flex-col space-y-4', className)}>
      <div className="grid h-full grid-rows-2 gap-6 lg:grid-cols-2 lg:grid-rows-1">
        <Textarea
          placeholder="We're writing to [inset]. Congrats from OpenAI!"
          value={promptConfig.prompt}
          onChange={(e) =>
            setPromptConfig((p) => ({ ...p, prompt: e.target.value }))
          }
          className="h-full min-h-[300px] lg:min-h-[700px] xl:min-h-[700px]"
        />
        <div className="bg-muted rounded-md border">
          <p className="m-2">{completion}</p>
        </div>
      </div>
      <SubmitButton
        onClick={handleSubmit}
        tokenCount={presetConfig.model.token}
      />
    </div>
  );
};
