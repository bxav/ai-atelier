'use client';

import { Button } from '@bxav/ui-components';
import { CheckIcon, CopyIcon, Share1Icon } from '@radix-ui/react-icons';
import { Input } from '@bxav/ui-components';
import { Label } from '@bxav/ui-components';
import { Popover, PopoverContent, PopoverTrigger } from '@bxav/ui-components';
import { useEffect, useState } from 'react';

export function PresetShare({ shareId }: { shareId: string }) {
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState('');

  useEffect(() => {
    setLink(`${window.location.origin}/p/${shareId}`);
  }, [shareId]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      console.log('Link copied to clipboard');
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Popover
      onOpenChange={() => {
        setCopied(false);
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="secondary">
          <Share1Icon className="h-4 w-4 lg:hidden" />
          <span className="hidden lg:block">Share</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-full sm:w-[520px]">
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          <h3 className="text-lg font-semibold sm:text-xl">Share preset</h3>
          <p className="text-muted-foreground text-sm sm:text-base">
            Anyone who has this link will be able to view this.
          </p>
        </div>
        <div className="flex items-center space-x-2 pt-4">
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
      </PopoverContent>
    </Popover>
  );
}
