import { PropsWithChildren } from 'react';
import { cookies } from 'next/headers';

import { Assistant, SelectedAssistantProvider } from '../contexts/selected-assistant-context';
import { ClientLayout } from './client-layout';
import { AssistantList } from './assistant-list';
import { AssistantLayoutProvider } from '../contexts/assistant-layout-context';
import { AssistantLayout } from './assistant-layout';
import { AssistantForm } from './assistant-form';

type AppLayoutProps = {
  user: any;
  assistant: Assistant;
};

const AppLayout = ({
  children,
  user,
  assistant,
}: PropsWithChildren<AppLayoutProps>) => {
  const layoutCookie = cookies().get('react-resizable-panels:layout');
  const defaultLayout = layoutCookie
    ? JSON.parse(layoutCookie.value)
    : undefined;

  const assistantLayoutCookie = cookies().get(
    'react-resizable-panels:assistant-layout'
  );
  const defaultAssistantLayout = assistantLayoutCookie
    ? JSON.parse(assistantLayoutCookie.value)
    : undefined;

  const showConfigCookie = cookies().get(
    'react-resizable-panels:assistant-show-config'
  );
  const defaultShowConfig = showConfigCookie?.value === 'true';

  return (
    <SelectedAssistantProvider initialAssistant={assistant}>
      <ClientLayout
        assistantList={<AssistantList />}
        defaultLayout={defaultLayout}
        user={user}
      >
        <AssistantLayoutProvider
          defaultLayout={defaultAssistantLayout}
          defaultShowConfig={defaultShowConfig}
        >
          <AssistantLayout
            defaultLayout={defaultAssistantLayout}
            assistantForm={<AssistantForm />}
          >
            {children}
          </AssistantLayout>
        </AssistantLayoutProvider>
      </ClientLayout>
    </SelectedAssistantProvider>
  );
};

export { AppLayout };
