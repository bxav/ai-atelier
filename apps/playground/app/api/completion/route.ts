import { NextResponse } from 'next/server';

import { models } from '@bxav/shared-ai-models-config';
import { getCurrentUser } from '@bxav/app-playground-common/server';

// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
//export const runtime = 'edge';

export async function POST(req: Request) {
  const user = await getCurrentUser({});
  const { prompt, ...values } = await req.json();
  const model = models.find((m) => m.name === values.model.name);

  if (!model) {
    return NextResponse.json({ error: 'invalid_model' }, { status: 400 });
  }

  if (!user.vetted) {
    return NextResponse.json({ error: 'unvetted_user' }, { status: 403 });
  }

  const res = await fetch(`${process.env.AI_LAB_API_BASE_URL}/completions`, {
    method: 'POST',
    body: JSON.stringify({
      modelId: values.model.id,
      systemPrompt: prompt,
      temperature: values.temperature,
      maxLength: values.maxLength,
      topP: values.topP,
    }),
    headers: {
      'x-api-key': process.env.AI_LAB_API_KEY!,
      'Content-Type': 'application/json',
    },
  });

  return res;
}
