'use client';

import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

import { Assistant } from '@prisma/client/assistants';
import { Avatar, AvatarFallback, AvatarImage } from '@bxav/ui-components';
import { cn } from '@bxav/ui-utils';

import { useAssistant } from '../hooks/use-assistant';

type AssistantListButtonProps = {
  assistant: Assistant;
};

const AssistantListButton = ({ assistant }: AssistantListButtonProps) => {
  const router = useRouter();
  const [selectedAssistant, setSelectedAssistant] = useAssistant();

  const systemPrompt = (assistant.config as any)?.prompt;

  return (
    <button
      key={assistant.id}
      className={cn(
        'hover:bg-accent flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all',
        selectedAssistant?.id === assistant.id && 'bg-muted'
      )}
      onClick={() => router.push(`/${assistant.id}`)}
    >
      <div className="flex w-full items-center space-x-2">
        <Avatar>
          <AvatarImage alt={assistant.name} />
          <AvatarFallback>
            {assistant.name
              .split(' ')
              .map((chunk) => chunk[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="font-semibold">{assistant.name}</div>
            </div>
            <div
              className={cn(
                'ml-auto text-xs',
                selectedAssistant?.id === assistant.id
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {formatDistanceToNow(new Date(assistant.updatedAt), {
                addSuffix: true,
              })}
            </div>
          </div>
          <div className="text-xs font-medium">{assistant.description}</div>
        </div>
      </div>

      <div className="text-muted-foreground line-clamp-2 text-xs">
        {systemPrompt?.substring(0, 300)}
      </div>
    </button>
  );
};

export { AssistantListButton };
