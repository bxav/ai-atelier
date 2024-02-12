'use client';

import { useChat } from 'ai/react';

const useChatCompletion = ({
  api = '/api/completion',
  initialMessages = [],
  lastMessage,
  additionalBody,
  onFinish,
}: any) => {
  return useChat({
    api,
    initialMessages,
    body: {
      lastMessage,
      ...additionalBody,
    },
    headers: {
      'Content-Type': 'application/json',
    },
    onFinish,
  });
};

export { useChatCompletion };
