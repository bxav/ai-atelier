'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@bxav/ui-components';

type WideScreenClientLayoutProps = {
  children: React.ReactNode;
  defaultLayout?: number[];
  sidebar: React.ReactNode;
};

const WideScreenClientLayout: React.FC<WideScreenClientLayoutProps> = ({
  children,
  defaultLayout = [440, 655],
  sidebar,
}) => {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        console.log(sizes);
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          sizes
        )}`;
      }}
      className="h-screen items-stretch"
    >
      <ResizablePanel defaultSize={defaultLayout[0]} minSize={15}>
        {sidebar}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]}>{children}</ResizablePanel>
    </ResizablePanelGroup>
  );
};

export { WideScreenClientLayout };
