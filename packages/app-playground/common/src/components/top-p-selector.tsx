'use client';

import * as React from 'react';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@bxav/ui-components';
import { Label } from '@bxav/ui-components';
import { Slider } from '@bxav/ui-components';

import { PresetConfigContext } from '../contexts/preset-config-id-context';

export function TopPSelector() {
  const { presetConfig, setPresetConfig } =
    React.useContext(PresetConfigContext);

  return (
    <div className="grid gap-2 pt-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="top-p">Top P</Label>
              <span className="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm">
                {presetConfig.topP}
              </span>
            </div>
            <Slider
              id="top-p"
              max={1}
              value={[presetConfig.topP]}
              step={0.1}
              onValueChange={(v) =>
                setPresetConfig((p) => ({ ...p, topP: v[0] }))
              }
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              aria-label="Top P"
            />
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-[260px] text-sm"
          side="left"
        >
          Control diversity via nucleus sampling: 0.5 means half of all
          likelihood-weighted options are considered.
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
