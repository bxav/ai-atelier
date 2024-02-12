'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@bxav/ui-components';
import { cn } from '@bxav/ui-utils';

import { useAssistant } from '../hooks/use-assistant';

const UnsavedAssistantListButton = () => {
  const [selectedAssistant] = useAssistant();

  if (selectedAssistant.id) {
    return null;
  }

  const systemPrompt = (selectedAssistant.config as any)?.prompt;

  return (
    <button
      className={cn(
        'hover:bg-accent flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all',
        'bg-red-100'
      )}
    >
      <div className="flex w-full items-center space-x-2">
        <Avatar>
          <AvatarImage alt={selectedAssistant.name} />
          <AvatarFallback>
            {selectedAssistant.name
              .split(' ')
              .map((chunk) => chunk[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="font-semibold">{selectedAssistant.name}</div>
            </div>
            <div className={cn('ml-auto text-xs', 'text-foreground')}>
              Unsaved
            </div>
          </div>
          <div className="text-xs font-medium">
            {selectedAssistant.description}
          </div>
        </div>
      </div>

      <div className="text-muted-foreground line-clamp-2 text-xs">
        {systemPrompt.substring(0, 300)}
      </div>
    </button>
  );
};

export { UnsavedAssistantListButton };
