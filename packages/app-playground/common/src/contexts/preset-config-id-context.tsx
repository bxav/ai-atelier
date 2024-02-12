'use client';

import { PropsWithChildren, createContext, useState } from 'react';

import { Model, models } from '@bxav/shared-ai-models-config';

export type Mode = 'complete' | 'insert' | 'edit';

export type PresetConfig = {
  mode: Mode;
  model: Model;
  temperature: number;
  maxLength: number;
  topP: number;
};

type PresetConfigContextType = {
  presetConfig: PresetConfig;
  setPresetConfig: (
    config: PresetConfig | ((config: PresetConfig) => PresetConfig)
  ) => void;
};

const defaultPresetConfig: PresetConfig = {
  mode: 'complete',
  model: models[0],
  temperature: 0.5,
  maxLength: 256,
  topP: 0.5,
};

export const PresetConfigContext = createContext<PresetConfigContextType>({
  presetConfig: defaultPresetConfig,
  setPresetConfig: () => {},
});

export const PresetConfigProvider = ({
  children,
  initialPresetConfig,
}: PropsWithChildren<{
  initialPresetConfig?: PresetConfig;
}>) => {
  const [presetConfig, setPresetConfig] = useState<PresetConfig>(
    initialPresetConfig || defaultPresetConfig
  );

  return (
    <PresetConfigContext.Provider value={{ presetConfig, setPresetConfig }}>
      {children}
    </PresetConfigContext.Provider>
  );
};
