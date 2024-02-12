'use client';

import { PropsWithChildren, useContext } from 'react';

import { Tabs } from '@bxav/ui-components';

import {
  Mode,
  PresetConfigContext,
} from '../contexts/preset-config-id-context';

export function ModeSelectorTabs({ children }: PropsWithChildren) {
  const { presetConfig, setPresetConfig } = useContext(PresetConfigContext);

  return (
    <Tabs
      value={presetConfig.mode}
      onValueChange={(m) => setPresetConfig((p) => ({ ...p, mode: m as Mode }))}
      className="flex-1"
    >
      {children}
    </Tabs>
  );
}
