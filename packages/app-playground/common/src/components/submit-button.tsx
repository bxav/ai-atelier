'use client';

import { Button } from '@bxav/ui-components';
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';

export const SubmitButton = ({
  onClick,
  tokenCount,
}: {
  onClick: () => void;
  tokenCount: number;
}) => (
  <div className="flex items-center space-x-2">
    <SignedIn>
      <Button onClick={onClick}>Submit (count: {tokenCount})</Button>
    </SignedIn>
    <SignedOut>
      <SignInButton>
        <Button>Sign in & Submit</Button>
      </SignInButton>
    </SignedOut>
  </div>
);
