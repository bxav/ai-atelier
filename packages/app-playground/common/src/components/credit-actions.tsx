'use client';

import { Button } from '@bxav/ui-components';
import { Popover, PopoverContent, PopoverTrigger } from '@bxav/ui-components';

export function CreditActions({
  creditBalance,
  showManageAccount = false,
}: {
  creditBalance: number;
  showManageAccount?: boolean;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">{creditBalance}</Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-full sm:w-[520px]">
        <div className="flex flex-col space-y-4 sm:space-x-4">
          {showManageAccount && (
            <Button
              variant="outline"
              onClick={async (event) => {
                event.preventDefault();

                const response = await fetch('/api/users/manage-account');

                const session = await response.json();
                if (session) {
                  window.location.href = session.url;
                }
              }}
            >
              Manage account
            </Button>
          )}
          <Button
            onClick={async (event) => {
              event.preventDefault();

              const response = await fetch('/api/users/stripe');

              const session = await response.json();
              if (session) {
                window.location.href = session.url;
              }
            }}
          >
            Buy some tokens
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
