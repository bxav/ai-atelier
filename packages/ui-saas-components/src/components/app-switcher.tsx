'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@bxav/ui-components';
import { cn } from '@bxav/ui-utils';

interface AccountSwitcherProps {
  isCollapsed?: boolean;
  currentApp: string;
  className?: string;
}

export const accounts = [
  {
    name: 'playground',
    label: 'LLM Playground',
    url: 'https://llm.buill.it',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-cable"
      >
        <path d="M4 9a2 2 0 0 1-2-2V5h6v2a2 2 0 0 1-2 2Z" />
        <path d="M3 5V3" />
        <path d="M7 5V3" />
        <path d="M19 15V6.5a3.5 3.5 0 0 0-7 0v11a3.5 3.5 0 0 1-7 0V9" />
        <path d="M17 21v-2" />
        <path d="M21 21v-2" />
        <path d="M22 19h-6v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2Z" />
      </svg>
    ),
  },
  {
    name: 'assistants',
    label: 'Assistants',
    url: 'https://crew.buill.it',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-bot"
      >
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
      </svg>
    ),
  },
  {
    name: 'www',
    label: 'The AI Lab',
    url: 'https://www.buill.it/ai-lab',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-flask-round"
      >
        <path d="M10 2v7.31" />
        <path d="M14 9.3V1.99" />
        <path d="M8.5 2h7" />
        <path d="M14 9.3a6.5 6.5 0 1 1-4 0" />
        <path d="M5.52 16h12.96" />
      </svg>
    ),
  },
];

export function AppSwitcher({
  className,
  isCollapsed = false,
  currentApp,
}: AccountSwitcherProps) {
  const router = useRouter();
  const [selectedAccount, setSelectedAccount] =
    React.useState<string>(currentApp);

  return (
    <Select
      defaultValue={selectedAccount}
      onValueChange={(v) => {
        if (v === selectedAccount) return;

        const url = accounts.find((account) => account.name === v)?.url;

        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
      }}
    >
      <SelectTrigger
        className={cn(
          'flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0',
          className,
          isCollapsed &&
            'flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden'
        )}
        aria-label="Select account"
      >
        <SelectValue placeholder="Select an account">
          {accounts.find((account) => account.name === selectedAccount)?.icon}
          <span className={cn('ml-2', isCollapsed && 'hidden')}>
            {
              accounts.find((account) => account.name === selectedAccount)
                ?.label
            }
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {accounts.map((account) => (
          <SelectItem key={account.name} value={account.name}>
            <div className="[&_svg]:text-foreground flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0">
              {account.icon}
              {account.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
