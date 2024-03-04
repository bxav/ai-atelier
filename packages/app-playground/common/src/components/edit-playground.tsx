'use client';

import { HTMLAttributes } from 'react';

import {
  Label,
  Textarea,
} from '@bxav/ui-components';
import { cn } from '@bxav/ui-utils';

import { SubmitButton } from './submit-button';
import { usePlaygroundState } from '../hooks/use-playground-state';

export const EditPlayground = ({
  className,
}: HTMLAttributes<HTMLDivElement>) => {
  const {
    error,
    completion,
    complete,
    presetConfig,
    promptConfig,
    setPromptConfig,
  } = usePlaygroundState();

  const handleSubmit = async () => {
    const c = await complete(
      `${promptConfig.prompt}; Instruction: ${promptConfig.instruction}; Result:`
    );
    setPromptConfig((p) => ({
      ...p,
      result: c as string,
    }));
  };

  return (
    <div className={cn('flex flex-col space-y-4', className)}>
      <div className="grid h-full gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-1 flex-col space-y-2">
            <Label htmlFor="input">Input</Label>
            <Textarea
              id="input"
              value={promptConfig.prompt}
              onChange={(e) =>
                setPromptConfig((p) => ({
                  ...p,
                  prompt: e.target.value,
                }))
              }
              placeholder="We is going to the market."
              className="flex-1 lg:min-h-[580px]"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              value={promptConfig.instruction}
              onChange={(e) =>
                setPromptConfig((p) => ({
                  ...p,
                  instruction: e.target.value,
                }))
              }
              placeholder="Fix the grammar."
            />
          </div>
        </div>
        <div className="bg-muted mt-[21px] min-h-[400px] rounded-md border lg:min-h-[700px]">
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
