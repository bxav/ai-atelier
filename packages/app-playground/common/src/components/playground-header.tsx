import { HTMLAttributes } from 'react';

import { AppSwitcher } from '@bxav/ui-saas-components';
import { cn } from '@bxav/ui-utils';
import { UserAccountNav } from '@bxav/kit-auth';

import { PresetActions } from './preset-actions';
import { PresetSave } from './preset-save';
import { PresetSelector } from './preset-selector';

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
            <UserAccountNav
              user={{
                name: user.name,
                image: user.image,
                email: user.email,
              }}
            />
          )}
        </div>
      </div>
    </div>
    <div className="ml-auto flex w-full space-x-2 sm:w-auto sm:justify-end">
      {user && (
        <>
          <PresetSelector presets={user.presets} />
          <PresetSave />
          <PresetActions />
        </>
      )}

      <div className="hidden sm:block">
        {user && (
          <UserAccountNav
            user={{
              name: user.name,
              image: user.image,
              email: user.email,
            }}
          />
        )}
      </div>
    </div>
  </div>
);
