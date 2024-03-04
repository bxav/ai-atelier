'use client';

import { MenuIcon } from 'lucide-react';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useMediaQuery } from 'react-responsive';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AppSwitcher } from '@bxav/ui-saas-components';
import {
  Button,
  Separator,
  Sheet,
  SheetContent,
  SheetTrigger,
  TooltipProvider,
} from '@bxav/ui-components';
import { WideScreenClientLayout } from './wide-screen-client-layout';

type MobileSidebarProps = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  assistantList: React.ReactNode;
};

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  setOpen,
  assistantList,
}) => {
  const router = useRouter();
  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button>
          <MenuIcon />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="!px-0">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <AppSwitcher currentApp="assistants" className="-my-0.5" />
            <Separator />
            <div className="p-4">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setOpen(false);
                  router.push('/new');
                }}
              >
                New Assistant
              </Button>
            </div>
            <div className="m-0">{assistantList}</div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

type HeaderProps = {
  user: any; // Consider using a more specific type for user
  mobileSidebar?: React.ReactNode;
};

const Header: React.FC<HeaderProps> = ({ user, mobileSidebar }) => (
  <div className="flex h-12 items-center space-x-4 px-4">
    {mobileSidebar && <div className="lg:hidden">{mobileSidebar}</div>}
    <AppSwitcher
      currentApp="assistants"
      className="-my-0.5"
      isCollapsed={!!mobileSidebar}
    />
    {mobileSidebar && <span className="w-full" />}
    <div className="ml-auto flex items-center space-x-4">
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <Button size="sm">Sign in</Button>
        </SignInButton>
      </SignedOut>
    </div>
  </div>
);

const useResponsive = (query: string) => {
  const isMatch = useMediaQuery({ query });
  return isMatch;
};

type ClientLayoutProps = {
  children: React.ReactNode;
  defaultLayout?: number[];
  assistantList: React.ReactNode;
  user: any; // Consider using a more specific type for user
};

const ClientLayout: React.FC<ClientLayoutProps> = ({
  children,
  defaultLayout = [440, 655],
  assistantList,
  user,
}) => {
  const router = useRouter();
  const isWideScreen = useResponsive('(min-width: 1024px)');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col">
      <TooltipProvider delayDuration={0}>
        {isWideScreen ? (
          <WideScreenClientLayout
            sidebar={
              <>
                <Header user={user} />
                <Separator />
                <div className="p-4">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => router.push('/new')}
                  >
                    New Assistant
                  </Button>
                </div>
                <div className="m-0">{assistantList}</div>
              </>
            }
            defaultLayout={defaultLayout}
          >
            {children}
          </WideScreenClientLayout>
        ) : (
          <>
            <Header
              user={user}
              mobileSidebar={
                <MobileSidebar
                  isOpen={isSidebarOpen}
                  setOpen={setSidebarOpen}
                  assistantList={assistantList}
                />
              }
            />
            <Separator />
            {children}
          </>
        )}
      </TooltipProvider>
    </div>
  );
};

export { MobileSidebar, Header, ClientLayout, useResponsive };
