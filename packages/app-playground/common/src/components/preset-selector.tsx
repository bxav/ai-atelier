'use client';

import * as React from 'react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { PopoverProps } from '@radix-ui/react-popover';
import { useRouter } from 'next/navigation';

import { Button } from '@bxav/ui-components';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@bxav/ui-components';
import { Popover, PopoverContent, PopoverTrigger } from '@bxav/ui-components';
import { Preset } from '@prisma/client/playground';
import { cn } from '@bxav/ui-utils';

import { PresetConfigContext } from '../contexts/preset-config-id-context';
import {
  PromptConfig,
  PromptConfigContext,
} from '../contexts/prompt-config-id-context';
import { SelectedPresetContext } from '../contexts/selected-preset-context';

interface PresetSelectorProps extends PopoverProps {
  presets: Preset[];
}

export function PresetSelector({ presets, ...props }: PresetSelectorProps) {
  const { selectedPreset, setSelectedPreset } = React.useContext(
    SelectedPresetContext
  );
  const { setPresetConfig } = React.useContext(PresetConfigContext);
  const { setPromptConfig } = React.useContext(PromptConfigContext);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const currentPreset = presets.find((p) => p.id === selectedPreset?.id);

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label="Load a preset..."
          aria-expanded={open}
          className="flex-1 justify-between md:max-w-[200px] lg:max-w-[300px]"
        >
          <span className="max-w-[100px] truncate md:max-w-[1800px] lg:max-w-[280px]">
            {currentPreset ? currentPreset.name : 'Load a preset...'}
          </span>
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search presets..." />
          <CommandEmpty>No presets found.</CommandEmpty>
          <CommandGroup heading="Examples">
            {presets.map((preset) => (
              <CommandItem
                key={preset.id}
                onSelect={() => {
                  setSelectedPreset({ id: preset.id, shareId: preset.shareId });
                  setPresetConfig(preset.config as any);
                  setPromptConfig(preset.promptConfig as PromptConfig);
                  setOpen(false);
                }}
              >
                {preset.name}
                <CheckIcon
                  className={cn(
                    'ml-auto h-4 w-4',
                    currentPreset?.id === preset.id
                      ? 'opacity-100'
                      : 'opacity-0'
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup className="pt-0">
            <CommandItem
              onSelect={() => router.push('https://buill.it/ai-lab')}
            >
              More examples
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
