import { AvatarProps } from '@radix-ui/react-avatar';

import { UserIcon } from 'lucide-react';
import { User } from '@prisma/client/assistants';
import { Avatar, AvatarFallback, AvatarImage } from '@bxav/ui-components';

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, 'image' | 'name'>;
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.image ? (
        <AvatarImage alt="Picture" src={user.image} />
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.name}</span>
          <UserIcon className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
}
