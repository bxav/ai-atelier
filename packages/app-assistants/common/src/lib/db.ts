import { PrismaClient } from '@prisma/client/assistants';
import { PrismaClient as PrismaClientEdge } from '@prisma/client/assistants/edge';

import { withAccelerate } from '@prisma/extension-accelerate';

const prismaClientWithAccelerate = (edge: boolean = false) => {
  if (edge) {
    return new PrismaClientEdge().$extends(withAccelerate());
  }

  return new PrismaClient().$extends(withAccelerate());
};

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: undefined | ReturnType<typeof prismaClientWithAccelerate>;
}

let prisma: ReturnType<typeof prismaClientWithAccelerate>;
if (process.env.NODE_ENV === 'production') {
  prisma = prismaClientWithAccelerate(true);
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = prismaClientWithAccelerate();
  }
  prisma = global.cachedPrisma;
}

export const db = prisma;
