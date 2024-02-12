'use client';

import { HTMLAttributes, useEffect, useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Textarea,
} from '@bxav/ui-components';
import { cn } from '@bxav/ui-utils';

import { SubmitButton } from './submit-button';
import { usePlaygroundState } from '../hooks/use-playground-state';

export const InsertPlayground = ({
  className,
}: HTMLAttributes<HTMLDivElement>) => {
  const [open, setOpen] = useState(false);
  const {
    completion,
    error,
    complete,
    presetConfig,
    promptConfig,
    setPromptConfig,
  } = usePlaygroundState();

  useEffect(() => {
    if (error && JSON.parse(error.message).error === 'insufficient_tokens') {
      setOpen(true);
    }
  }, [error]);

  const handleSubmit = async () => {
    const c = await complete(promptConfig.prompt);
    setPromptConfig((p) => ({
      ...p,
      result: c as string,
    }));
  };

  return (
    <div className={cn('flex flex-col space-y-4', className)}>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Insufficient Token</AlertDialogTitle>
            <AlertDialogDescription>
              You have insufficient token to complete this request. Please try
              an other model. Or buy more tokens!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async (event) => {
                event.preventDefault();

                const response = await fetch('/api/users/stripe');

                const session = await response.json();
                if (session) {
                  window.location.href = session.url;
                }
              }}
            >
              Buy some tokens
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
