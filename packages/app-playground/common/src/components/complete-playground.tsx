'use client';

import { HTMLAttributes } from 'react';

import {
  Textarea,
} from '@bxav/ui-components';
import { cn } from '@bxav/ui-utils';

import { SubmitButton } from './submit-button';
import { usePlaygroundState } from '../hooks/use-playground-state';

export const CompletePlayground = ({
  className,
}: HTMLAttributes<HTMLDivElement>) => {
  const {
    completion,
    complete,
    error,
    presetConfig,
    promptConfig,
    setPromptConfig,
  } = usePlaygroundState();

  const handleSubmit = async () => {
    const newCompletion = await complete(`${promptConfig.prompt}`);

    setPromptConfig((p) => ({
      ...p,
      prompt: `${promptConfig.prompt} ${newCompletion}`,
    }));
  };

  return (
    <div className={cn('flex h-full flex-col space-y-4', className)}>
      <Textarea
        value={`${promptConfig.prompt}${completion ? ` ${completion}` : ''}`}
        onChange={(e) =>
          setPromptConfig((p) => ({
            ...p,
            prompt: e.target.value,
          }))
        }
        placeholder="Write a tagline for an ice cream shop"
        className="min-h-[400px] flex-1 p-4 md:min-h-[700px] lg:min-h-[700px]"
      />
      <SubmitButton
        onClick={handleSubmit}
        tokenCount={presetConfig.model.token}
      />
    </div>
  );
};
