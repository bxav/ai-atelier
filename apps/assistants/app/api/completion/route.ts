// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = 'edge';

import { NextResponse } from 'next/server';

import { db, getCurrentUser } from '@bxav/app-assistants-common/server';
import { models } from '@bxav/shared-ai-models-config';

export async function POST(req: Request) {
  const { messages, lastMessage, ...values } = await req.json();
  const user = await getCurrentUser();
  const model = models.find(
    (m) => m.name === (values.config.model || 'gpt-3.5-turbo-1106')
  );

  if (!model) {
    return NextResponse.json({ error: 'invalid_model' }, { status: 400 });
  }

  if (user.creditBalance < model.token) {
    return NextResponse.json({ error: 'insufficient_tokens' }, { status: 400 });
  }

  await db.user.update({
    where: { id: user.id },
    data: { creditBalance: user.creditBalance - model.token },
  });

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