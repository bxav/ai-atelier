import { HTMLAttributes } from 'react';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

import { AppSwitcher } from '@bxav/ui-saas-components';
import { Button } from '@bxav/ui-components';
import { cn } from '@bxav/ui-utils';

import { CreditActions } from './credit-actions';
import { PresetActions } from './preset-actions';
import { PresetSave } from './preset-save';
import { PresetSelector } from './preset-selector';

const LoginButton = () => (
  <>
    <SignedIn>
      <UserButton afterSignOutUrl="/" />
    </SignedIn>
    <SignedOut>
      <SignInButton>
        <Button>Sign in</Button>
      </SignInButton>
    </SignedOut>
  </>
);

export const PlaygroundHeader = ({
  className,
  user,
  ...props
}: {
  user: any;
} & HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16',
      className
    )}
    {...props}
  >
    <div className="flex w-full justify-between">
      <AppSwitcher currentApp="playground" className="w-auto" />
      <div className="flex space-x-2 sm:hidden">
        <div className="flex items-center space-x-2 ">
          {user && (
            <CreditActions
              creditBalance={user.creditBalance}
              showManageAccount={!!user.stripeCustomerId}
            />
          )}
          <LoginButton />
        </div>
      </div>
    </div>
    <div className="ml-auto flex w-full space-x-2 sm:w-auto sm:justify-end">
      {user && (
        <>
          <PresetSelector presets={user.presets} />
          <PresetSave />
          <PresetActions />
          <div className="hidden sm:block">
            <CreditActions
              creditBalance={user.creditBalance}
              showManageAccount={!!user.stripeCustomerId}
            />
          </div>
        </>
      )}

      <div className="hidden sm:block">
        <LoginButton />
      </div>
    </div>
  </div>
);
