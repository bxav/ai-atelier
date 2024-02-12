import { currentUser } from '@clerk/nextjs';
import { z } from 'zod';

import { getCurrentUser, stripe } from '@bxav/app-assistants-common/server';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    const externalUser = await currentUser();

    const stripeCustomerId = user.stripeCustomerId;

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: `${req.headers.get('referer')!}/?success=true`,
      cancel_url: `${req.headers.get('referer')!}/?canceled=true`,
      payment_method_types: ['card'],
      mode: 'payment',
      billing_address_collection: 'required',
      allow_promotion_codes: true,
      client_reference_id: user.id,
      ...(stripeCustomerId
        ? {
            customer: stripeCustomerId,
          }
        : {
            customer_email: externalUser?.emailAddresses?.[0]?.emailAddress,
            customer_creation: 'always',
          }),
      line_items: [
        {
          price: process.env.STRIPE_CREDIT_PRICE_ID,
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
            maximum: 1000,
          },
          quantity: 10,
        },
      ],
      metadata: {
        app: 'assistants',
      },
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
