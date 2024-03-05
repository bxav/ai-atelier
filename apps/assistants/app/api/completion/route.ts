// NextAuth.js cannot use the run Edge Runtime for initialization.
// The upcoming @auth/nextjs library (which will replace next-auth) on the other hand will be fully compatible.
// export const runtime = 'edge';

import { NextResponse } from 'next/server';

import { models } from '@bxav/shared-ai-models-config';
import { getCurrentUser } from '@bxav/app-assistants-common/server';

export async function POST(req: Request) {
  const user = await getCurrentUser();
  const { messages, lastMessage, ...values } = await req.json();
  const model = models.find(
    (m) => m.name === (values.config.model || 'gpt-3.5-turbo-1106')
  );

  if (!model) {
    return NextResponse.json({ error: 'invalid_model' }, { status: 400 });
  }

  if (!user.vetted) {
    return NextResponse.json({ error: 'unvetted_user' }, { status: 403 });
  }

  const res = await fetch(`${process.env.AI_LAB_API_BASE_URL}/completions`, {
    method: 'POST',
    body: JSON.stringify({
      modelId: model.id,
      messages: [
        ...(values.config.prompt
          ? [{ role: 'system', content: values.config.prompt }]
          : []),
        ...messages,
        {
          role: 'user',
          content: lastMessage,
        },
      ],
      temperature: values.temperature || 0.5,
      maxLength: 2056,
      topP: values.topP || 0.5,
    }),
    headers: {
      'x-api-key': process.env.AI_LAB_API_KEY!,
      'Content-Type': 'application/json',
    },
  });

  return res;
}
