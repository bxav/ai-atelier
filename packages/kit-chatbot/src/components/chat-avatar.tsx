'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@bxav/ui-components';

const ChatAvatar = ({ name }: { name: string }) => (
  <Avatar>
    <AvatarImage alt={name} />
    <AvatarFallback>
      {name
        .split(' ')
        .map((chunk) => chunk[0])
        .join('')}
    </AvatarFallback>
  </Avatar>
);

export { ChatAvatar };
