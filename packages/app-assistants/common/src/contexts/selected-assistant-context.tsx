'use client';

import { PropsWithChildren, createContext, useState } from 'react';

import { Assistant as BaseAssistant } from '@prisma/client/assistants';

export type AssistantConfig = {
  prompt: string;
  model: string;
};

export type AssistantMessage = {
  role: 'assistant' | 'user' | 'system';
  content: string;
};

export type Assistant = {
  id?: BaseAssistant['id'];
  name: BaseAssistant['name'];
  description: BaseAssistant['description'];
  config: AssistantConfig | BaseAssistant['config'];
  messages: AssistantMessage[] | BaseAssistant['messages'];
  shareWithMessages?: BaseAssistant['shareWithMessages'];
  shareId?: BaseAssistant['shareId'];
};

type AssistantContextType = {
  assistant: Assistant;
  setAssistant: (
    config: Assistant | ((config: Assistant) => Assistant)
  ) => void;
};

export const defaultAssistant: Assistant = {
  name: 'Demo assistant',
  description: 'This is a demo assistant',
  config: {
    prompt: 'Your are an helpful assistant',
    model: 'gpt-3.5-turbo-1106',
  },
  messages: [
    {
      role: 'assistant',
      content: "Hello, I'm an assistant",
    },
  ],
};

export const SelectedAssistantContext = createContext<AssistantContextType>({
  assistant: defaultAssistant,
  setAssistant: () => {},
});

export const SelectedAssistantProvider = ({
  children,
  initialAssistant,
}: PropsWithChildren<{
  initialAssistant?: Assistant;
}>) => {
  const [assistant, setAssistant] = useState<Assistant>(
    initialAssistant || defaultAssistant
  );

  return (
    <SelectedAssistantContext.Provider value={{ assistant, setAssistant }}>
      {children}
    </SelectedAssistantContext.Provider>
  );
};
