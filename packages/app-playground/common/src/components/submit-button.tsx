'use client';

import { Button } from '@bxav/ui-components';

export const SubmitButton = ({
  onClick,
  tokenCount,
}: {
  onClick: () => void;
  tokenCount: number;
}) => (
  <div className="flex items-center space-x-2">
    <Button onClick={onClick}>Submit (count: {tokenCount})</Button>
  </div>
);
