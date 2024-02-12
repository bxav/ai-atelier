import { headers } from 'next/headers';
import Stripe from 'stripe';

import { db, stripe } from '@bxav/app-playground-common/server';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (session?.metadata?.app !== 'playground') {
    return new Response(null, { status: 200 });
  }

  if (event.type === 'checkout.session.completed') {
    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
      event.data.object.id,
      {
        expand: ['line_items'],
      }
    );

    const lineItems = sessionWithLineItems.line_items;

    const stripeCustomerId = sessionWithLineItems.customer as string;

    await db.user.update({
      where: {
        id: session?.client_reference_id as string,
      },
      data: {
        stripeCustomerId: stripeCustomerId,
        stripePriceId: lineItems?.data[0].price?.id,
        creditBalance: {
          increment: (lineItems?.data[0].quantity || 0) * 100,
        },
      },
    });
  }

  return new Response(null, { status: 200 });
}
