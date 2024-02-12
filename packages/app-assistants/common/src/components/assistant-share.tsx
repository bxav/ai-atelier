'use client';

import { CheckIcon, CopyIcon, Share1Icon } from '@radix-ui/react-icons';
import { useEffect, useState, useTransition } from 'react';

import {
  Button,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Switch,
} from '@bxav/ui-components';

import { updateAssistantAction } from '../actions/update-assistant-action';
import { useAssistant } from '../hooks/use-assistant';

const ShareCurrentAssistantPopover = () => {
  const [isPending, startTransition] = useTransition();
  const [currentAssistant, setCurrentAssistant] = useAssistant();
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState('');

  useEffect(() => {
    setLink(`${window.location.origin}/p/${currentAssistant.shareId}`);
  }, [currentAssistant]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      console.log('Link copied to clipboard');
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleShareMessageClick = (shareWithMessages: boolean) => {
    startTransition(async () => {
      await updateAssistantAction({
        ...currentAssistant,
        shareWithMessages,
      });

      setCurrentAssistant((a: any) => ({
        ...a,
        shareWithMessages,
      }));
    });
  };

  return (
    <Popover onOpenChange={() => setCopied(false)}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Share1Icon className="h-4 w-4" />
          <span className="sr-only">Share your assistant</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-full sm:w-[520px]">
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          <h3 className="text-lg font-semibold">Share assistant</h3>
          <p className="text-muted-foreground text-sm">
            Anyone who has this link will be able to view this.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-2 pt-4 sm:flex-row sm:space-x-2 sm:space-y-0">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" value={link} readOnly className="h-9" />
          </div>
          <Button
            type="button"
            size="sm"
            className="px-3"
            onClick={copyToClipboard}
          >
            <span className="sr-only">Copy</span>
            {copied ? (
              <CheckIcon className="h-4 w-4" />
            ) : (
              <CopyIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="flex pt-4">
          <Label
            htmlFor="showMessages"
            className="flex items-center gap-2 text-xs font-normal"
          >
            <Switch
              id="showMessages"
              aria-label="Show messages"
              checked={currentAssistant.shareWithMessages}
              onCheckedChange={handleShareMessageClick}
            />
            Show messages when sharing
          </Label>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { ShareCurrentAssistantPopover };
