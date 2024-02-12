'use client';

import * as React from 'react';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@bxav/ui-components';
import { Label } from '@bxav/ui-components';
import { Slider } from '@bxav/ui-components';

import { PresetConfigContext } from '../contexts/preset-config-id-context';

export function TemperatureSelector() {
  const { presetConfig, setPresetConfig } =
    React.useContext(PresetConfigContext);

  return (
    <div className="grid gap-2 pt-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="temperature">Temperature</Label>
              <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
                {presetConfig.temperature}
              </span>
            </div>
            <Slider
              id="temperature"
              max={1}
              value={[presetConfig.temperature]}
              step={0.1}
              onValueChange={(v) =>
                setPresetConfig((p) => ({ ...p, temperature: v[0] }))
              }
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              aria-label="Temperature"
            />
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-[260px] text-sm"
          side="left"
        >
          Controls randomness: lowering results in less random completions. As
          the temperature approaches zero, the model will become deterministic
          and repetitive.
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
