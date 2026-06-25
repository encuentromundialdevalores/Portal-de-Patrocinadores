import { NextResponse } from 'next/server';
import { stripe } from '../../../../lib/stripe';

export async function GET(request, { params }) {
  try {
    const { accountId } = await params;

    const options = {};
    // If accountId is not 'platform', fetch from connected account
    if (accountId !== "platform") {
      options.stripeAccount = accountId;
    }
    const prices = await stripe.prices.list(
      {
        expand: ["data.product"],
        active: true,
        limit: 100,
      },
      options
    );

    return NextResponse.json(
      prices.data.map((price) => ({
        id: price.product.id,
        name: price.product.name,
        price: price.unit_amount,
        priceId: price.id,
        period: price.recurring ? price.recurring.interval : null,
        image: "https://i.imgur.com/6Mvijcm.png"
      }))
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 400 }
    );
  }
}