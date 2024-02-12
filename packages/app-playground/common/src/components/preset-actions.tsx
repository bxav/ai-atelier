'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useContext, useState, useTransition } from 'react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  useToast,
} from '@bxav/ui-components';
import { Button } from '@bxav/ui-components';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@bxav/ui-components';

import { PresetShare } from './preset-share';
import { SelectedPresetContext } from '../contexts/selected-preset-context';
import { deletePresetAction } from '../actions/delete-preset-action';

export function PresetActions() {
  const { toast } = useToast();
  const { selectedPreset, setSelectedPreset } = useContext(
    SelectedPresetContext
  );
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!selectedPreset) return null;

  return (
    <>
      {selectedPreset.shareId && (
        <PresetShare shareId={selectedPreset.shareId} />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <span className="sr-only">Actions</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            Delete preset
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This preset will no longer be
              accessible by you or others you&apos;ve shared it with.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                startTransition(async () => {
                  await deletePresetAction(selectedPreset.id as string);

                  setSelectedPreset(null);

                  setShowDeleteDialog(false);
                  toast({
                    description: 'This preset has been deleted.',
                  });
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
}
