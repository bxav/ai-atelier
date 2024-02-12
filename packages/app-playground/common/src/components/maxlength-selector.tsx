'use client';

import * as React from 'react';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Label,
  Slider,
} from '@bxav/ui-components';

import { PresetConfigContext } from '../contexts/preset-config-id-context';

export function MaxLengthSelector() {
  const { presetConfig, setPresetConfig } =
    React.useContext(PresetConfigContext);

  return (
    <div className="grid gap-2 pt-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="maxlength">Maximum Length</Label>
              <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
                {presetConfig.maxLength}
              </span>
            </div>
            <Slider
              id="maxlength"
              max={4000}
              value={[presetConfig.maxLength]}
              step={10}
              onValueChange={(v) =>
                setPresetConfig((p) => ({ ...p, maxLength: v[0] }))
              }
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              aria-label="Maximum Length"
            />
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-[260px] text-sm"
          side="left"
        >
          The maximum number of tokens to generate. Requests can use up to 2,048
          or 4,000 tokens, shared between prompt and completion. The exact limit
          varies by model.
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
