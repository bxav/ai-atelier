## Example with `React.FC`, `React.FunctionComponent`, and `React.ElementType`:

The code:

```tsx
'use client';

import { Button } from '@bxav/ui-components';

type AssistantListButtonProps = {
  assistant: Assistant;
};

const AssistantListButton: React.FC<AssistantListButtonProps> = ({
  assistant,
}) => {
    return <Button />;
  }
};

export { AssistantListButton };
```

Never use `React.FC`, `React.FunctionComponent`, or `React.ElementType` for typing components.

You should always explicitly type props and never the return types.

The code should be refactored to:

```tsx
'use client';

type AssistantListButtonProps = {
  assistant: Assistant;
};

import { Button } from '@bxav/ui-components';

const AssistantListButton = ({ assistant }: AssistantListButtonProps) => {
  return <Button />;
};

export { AssistantListButton };

```
