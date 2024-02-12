'use client';

import { PropsWithChildren, createContext, useState } from 'react';

export type PromptConfig = {
  prompt: string;
  instruction: string;
  result: string;
};

type PromptConfigContextType = {
  promptConfig: PromptConfig;
  setPromptConfig: (
    config: PromptConfig | ((config: PromptConfig) => PromptConfig)
  ) => void;
};

const defaultPromptConfig: PromptConfig = {
  prompt: '',
  instruction: '',
  result: '',
};

export const PromptConfigContext = createContext<PromptConfigContextType>({
  promptConfig: defaultPromptConfig,
  setPromptConfig: () => {},
});

export const PromptConfigProvider = ({
  children,
  initialPromptConfig,
}: PropsWithChildren<{
  initialPromptConfig?: PromptConfig;
}>) => {
  const [promptConfig, setPromptConfig] = useState<PromptConfig>(
    initialPromptConfig || defaultPromptConfig
  );

  return (
    <PromptConfigContext.Provider value={{ promptConfig, setPromptConfig }}>
      {children}
    </PromptConfigContext.Provider>
  );
};
