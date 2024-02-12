import { ScrollArea } from '@bxav/ui-components';

import { AssistantListButton } from './assistant-list-button';
import { UnsavedAssistantListButton } from './unsaved-assistant-list-button';
import { db } from '../lib/db';
import { findCurrentUser } from '../lib/session';

const AssistantList = async () => {
  const user = await findCurrentUser();

  if (!user) {
    return null;
  }

  const assistants = await db.assistant.findMany({
    where: {
      authorId: user?.id,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return (
    <ScrollArea className="h-[calc(100vh-120px)]">
      <div className="mb-20 flex flex-col gap-2 p-4 pt-0">
        <UnsavedAssistantListButton />
        {assistants.map((item) => (
          <AssistantListButton key={item.id} assistant={item as any} />
        ))}
      </div>
    </ScrollArea>
  );
};

export { AssistantList };
