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

export const CompletePlayground = ({
  className,
}: HTMLAttributes<HTMLDivElement>) => {
  const [open, setOpen] = useState(false);
  const {
    completion,
    complete,
    error,
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
    const newCompletion = await complete(`${promptConfig.prompt}`);

    setPromptConfig((p) => ({
      ...p,
      prompt: `${promptConfig.prompt} ${newCompletion}`,
    }));
  };

  return (
    <div className={cn('flex h-full flex-col space-y-4', className)}>
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
