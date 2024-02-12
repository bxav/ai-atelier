'use client';

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useMediaQuery } from 'react-responsive';
import { useAssistant } from '../hooks/use-assistant';

type AssistantLayoutContextType = {
  showConfig: boolean;
  setShowConfig: (show: boolean) => void;
  isWideScreen: boolean;
};

const AssistantLayoutContext = createContext<AssistantLayoutContextType>({
  showConfig: false,
  setShowConfig: () => {},
  isWideScreen: false,
});

export const AssistantLayoutProvider = ({
  children,
  defaultLayout,
  defaultShowConfig = false,
}: PropsWithChildren<{
  defaultLayout?: number[];
  defaultShowConfig: boolean;
}>) => {
  const [selectedAssistant] = useAssistant();
  const [showConfig, setShowConfig] = useState(defaultShowConfig);

  const isWideScreen = useMediaQuery({
    query: '(min-width: 1024px)',
  });

  const setPersistentShowConfig = (show: boolean) => {
    setShowConfig(show);
    if (isWideScreen)
      document.cookie = `react-resizable-panels:assistant-show-config=${show}`;
  };

  useEffect(() => {
    if (!isWideScreen) {
      setShowConfig(false);
    }
  }, [isWideScreen, selectedAssistant]);

  return (
    <AssistantLayoutContext.Provider
      value={{
        showConfig,
        setShowConfig: setPersistentShowConfig,
        isWideScreen,
      }}
    >
      {children}
    </AssistantLayoutContext.Provider>
  );
};

export const useAssistantLayout = () => {
  const context = useContext(AssistantLayoutContext);
  if (context === undefined) {
    throw new Error(
      'useAssistantLayout must be used within a AssistantProvider'
    );
  }
  return context;
};
