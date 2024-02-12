'use client';

import * as React from 'react';
import { GearIcon } from '@radix-ui/react-icons';

import {
  Button,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Separator,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@bxav/ui-components';

import { useAssistantLayout } from '../contexts/assistant-layout-context';

type AssistantLayoutProps = {
  defaultLayout?: number[];
  assistantForm: React.ReactNode;
};

const AssistantLayout = ({
  defaultLayout = [440, 655],
  children,
  assistantForm,
}: React.PropsWithChildren<AssistantLayoutProps>) => {
  const { isWideScreen, showConfig, setShowConfig } = useAssistantLayout();

  return (
    <>
      {isWideScreen ? (
        <ResizablePanelGroup
          direction="horizontal"
          onLayout={(sizes: number[]) => {
            console.log(sizes);
            document.cookie = `react-resizable-panels:assistant-layout=${JSON.stringify(
              sizes
            )}`;
          }}
          className="h-screen items-stretch"
        >
          <ResizablePanel defaultSize={defaultLayout[0]}>
            {children}
          </ResizablePanel>
          {showConfig && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={defaultLayout[1] || 20}>
                <div className="flex h-screen flex-col">
                  <div className="flex h-12 items-center p-2.5">
                    <div className="flex items-center gap-2"></div>
                    <div className="ml-auto flex items-center gap-2"></div>
                    <Separator orientation="vertical" className="mx-2 h-6" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowConfig(false)}
                    >
                      <GearIcon className="mr-2 h-4 w-4" />
                      Hide Config
                    </Button>
                  </div>
                  <Separator />
                  <div className="w-full p-4">{assistantForm}</div>
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      ) : (
        <>
          {children}
          <Sheet open={showConfig} onOpenChange={setShowConfig}>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit Assistant</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-full py-10">{assistantForm}</ScrollArea>
            </SheetContent>
          </Sheet>
        </>
      )}
    </>
  );
};

export { AssistantLayout };
