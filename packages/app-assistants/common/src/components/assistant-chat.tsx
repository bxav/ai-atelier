'use client';

import * as React from 'react';
import { SignInButton, useUser } from '@clerk/nextjs';

import { Button, Separator } from '@bxav/ui-components';
import { AssistantChat as AssistantChatUi } from '@bxav/kit-chatbot';
import { cn } from '@bxav/ui-utils';

import { AssistantActions } from './assistant-actions';
import { updateAssistantAction } from '../actions/update-assistant-action';
import { useAssistant } from '../hooks/use-assistant';
import { useAssistantLayout } from '../contexts/assistant-layout-context';

const AssistantChat = () => {
  const { showConfig, setShowConfig } = useAssistantLayout();
  const { isSignedIn } = useUser();
  const [selectedAssistant, setSelectedAssistant] = useAssistant();
  const [isPending, startTransition] = React.useTransition();
  return (
    <>
      <AssistantActions
        selectedAssistant={selectedAssistant}
        setShowConfig={!showConfig ? setShowConfig : null}
      />
      <div
        className={cn(
          'flex flex-col h-[calc(100vh-106px)] lg:h-[calc(100vh-52px)]'
        )}
      >
        <Separator />
        <AssistantChatUi
          hideSendButton={!isSignedIn}
          assistant={selectedAssistant as any}
          onError={() => console.error('error')}
          onNewMessages={(newMessages: any) =>
            setSelectedAssistant({
              ...selectedAssistant,
              messages: newMessages,
            })
          }
          onFinish={(message: any) => {
            if (message) {
              delete message.id;
              delete message.createdAt;

              startTransition(async () => {
                setSelectedAssistant((a: any) => {
                  const newMessages = [...(a.messages || []), message];
                  if (a.id) {
                    updateAssistantAction({
                      ...a,
                      id: a.id,
                      messages: newMessages,
                    });
                  }

                  return {
                    ...a,
                    messages: newMessages,
                  };
                });
              });
            }
          }}
        />
        {!isSignedIn && (
          <>
            <div className="flex items-center pb-4 pr-4">
              <div></div>
              <div className="ml-auto">
                <SignInButton>
                  <Button size="sm">Sign in</Button>
                </SignInButton>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export { AssistantChat };
