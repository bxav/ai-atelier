'use client';

import * as React from 'react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  ButtonProps,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@bxav/ui-components';

import { deleteAssistantAction } from '../actions/delete-assistant-action';
import { useAssistant } from '../hooks/use-assistant';

type DeleteAssistantProps = Pick<
  ButtonProps,
  'size' | 'variant' | 'children'
> & {
  tooltipContent?: string;
};

const DeleteAssistantButton = ({
  tooltipContent,
  ...props
}: DeleteAssistantProps) => {
  const [{ id: assistantId }] = useAssistant();
  const [isPending, startTransition] = React.useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDeleteDialog(true)}
            {...props}
          />
        </TooltipTrigger>
        <TooltipContent>{tooltipContent}</TooltipContent>
      </Tooltip>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This assistant will no longer be
              accessible by you or others you&apos;ve shared it with.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  await deleteAssistantAction(assistantId as string);
                });
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export { DeleteAssistantButton };
