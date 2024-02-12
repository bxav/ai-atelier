import { z } from 'zod';

import { getCurrentUser, stripe } from '@bxav/app-playground-common/server';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser({});

    if (!user.stripeCustomerId) {
      return new Response(null, { status: 404 });
    }

    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: req.headers.get('referer')!,
    });

    return new Response(JSON.stringify({ url: stripeSession.url }));
  } catch (error) {
    console.log('error', error);
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
