'use client';

import { CheckIcon, CopyIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage, Button } from '@bxav/ui-components';

export type Message = {
  role: 'assistant' | 'user' | 'system';
  content: string;
  id?: string;
};

const ThreeDotsSpinner = () => (
  <div className="flex h-12 items-center justify-center space-x-2">
    <div className="h-2 w-2 animate-pulse rounded-full bg-gray-500 delay-150" />
    <div className="h-2 w-2 animate-pulse rounded-full bg-gray-500 delay-300" />
    <div className="delay-450 h-2 w-2 animate-pulse rounded-full bg-gray-500" />
  </div>
);

const ChatAvatar = ({ name }: { name: string }) => (
  <Avatar>
    <AvatarImage alt={name} />
    <AvatarFallback>
      {name
        .split(' ')
        .map((chunk) => chunk[0])
        .join('')}
    </AvatarFallback>
  </Avatar>
);

const ThreadMessage = ({
  name,
  message,
}: {
  name: string;
  message: string;
}) => {
  const [showIcons, setShowIcons] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message);
      console.log('Message copied to clipboard');
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div
      className="mb-4 flex items-start space-x-2"
      onMouseEnter={() => setShowIcons(true)}
      onMouseLeave={() => {
        setShowIcons(false);
        setCopied(false);
      }}
    >
      <ChatAvatar name={name} />
      <div className="flex flex-col space-y-2">
        <div className="text-sm text-gray-500">{name}</div>
        <div className="rounded-md bg-gray-100 p-2">
          <p className="text-sm">{message}</p>
        </div>
        <div className="text-xs text-gray-500">
          {showIcons && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="px-3"
              onClick={copyToClipboard}
            >
              <span className="sr-only">Copy</span>
              {copied ? (
                <CheckIcon className="mr-1 inline h-4 w-4" />
              ) : (
                <CopyIcon className="mr-1 inline h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export { ThreadMessage, ThreeDotsSpinner };
