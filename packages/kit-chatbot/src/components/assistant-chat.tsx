'use client';

import { useEffect, useRef, useState } from 'react';

import { Button, ScrollArea, Separator, Textarea } from '@bxav/ui-components';

import { ChatAvatar } from './chat-avatar';
import { Message, ThreadMessage, ThreeDotsSpinner } from './thread-message';
import { useChatCompletion } from '../hooks/use-chat-completion';

type AssistantChatProps = {
  assistant: {
    name?: string;
    description?: string;
    messages: Message[];
    [key: string]: any;
  };
  onFinish: any;
  onNewMessages: any;
  onError: any;
  hideSendButton?: boolean;
};

const AssistantChat = ({
  assistant: selectedAssistant,
  onFinish,
  onNewMessages,
  onError,
  hideSendButton = false,
}: AssistantChatProps) => {
  const [input, setInput] = useState('');

  const { messages, isLoading, append, error } = useChatCompletion({
    initialMessages: selectedAssistant.messages || [],
    lastMessage: input,
    additionalBody: {
      ...selectedAssistant,
    },
    onFinish,
  });

  const divBottomElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divBottomElement.current) {
      divBottomElement.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (error && JSON.parse(error.message).error === 'insufficient_tokens') {
      onError();
    }
  }, [error]);

  return (
    <div className="flex h-full flex-1 flex-col">
      <ScrollArea className="h-full">
        <div className="flex items-start p-4">
          <div className="flex items-start gap-4 text-sm">
            <ChatAvatar name={selectedAssistant.name || 'Assistant'} />
            <div className="grid gap-1">
              <div className="font-semibold">{selectedAssistant.name}</div>
              <div className="mb-2 line-clamp-1 text-xs">
                {selectedAssistant.description}
              </div>
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
          {messages?.map((message, key) => (
            <ThreadMessage
              key={key}
              message={message.content}
              name={
                message.role == 'assistant'
                  ? selectedAssistant.name || 'Assistant'
                  : 'You'
              }
            />
          ))}

          {isLoading && <ThreeDotsSpinner />}
          <div ref={divBottomElement} />
        </div>
      </ScrollArea>
      <Separator className="mt-auto" />
      <div className="p-4">
        <div className="grid gap-4">
          <Textarea
            className="p-4"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            placeholder={`Reply ${selectedAssistant.name}...`}
          />
          {hideSendButton ? null : (
            <div className="flex items-center">
              <div></div>
              <div className="ml-auto">
                <Button
                  onClick={async (e) => {
                    e.preventDefault();
                    const message: Omit<Message, 'id'> = {
                      role: 'user',
                      content: input,
                    };
                    append(message);

                    const newMessages = [
                      ...(selectedAssistant.messages || []),
                      {
                        role: 'user',
                        content: input,
                      },
                    ];

                    onNewMessages(newMessages);

                    setInput('');
                  }}
                  size="sm"
                  disabled={isLoading}
                >
                  Send
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { AssistantChat };
