import {
  AssistantChat,
  AppLayout,
  defaultAssistant,
} from '@bxav/app-assistants-common';
import { getCurrentUser } from '@bxav/app-assistants-common/server';

export default async function NewAssistantPage() {
  const user = await getCurrentUser();

  return (
    <AppLayout user={user} assistant={defaultAssistant}>
      <AssistantChat />
    </AppLayout>
  );
}
