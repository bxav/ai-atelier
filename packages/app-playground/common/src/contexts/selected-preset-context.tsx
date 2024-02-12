'use client';

import { PropsWithChildren, createContext, useState } from 'react';

export type Preset = {
  id: string;
  shareId: string | null;
};

type SelectedPresetContextType = {
  selectedPreset: Preset | null;
  setSelectedPreset: (preset: Preset | null) => void;
};

export const SelectedPresetContext = createContext<SelectedPresetContextType>({
  selectedPreset: null,
  setSelectedPreset: () => {},
});

export const SelectedPresetProvider = ({
  children,
  initialPreset,
}: PropsWithChildren<{
  initialPreset?: Preset;
}>) => {
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(
    initialPreset || null
  );

  return (
    <SelectedPresetContext.Provider
      value={{ selectedPreset, setSelectedPreset }}
    >
      {children}
    </SelectedPresetContext.Provider>
  );
};
