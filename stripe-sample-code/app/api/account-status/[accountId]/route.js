import { NextResponse } from 'next/server';
import { stripe } from '../../../../lib/stripe';

export async function GET(request, { params }) {
  try {
    const { accountId } = await params;

    const account = await stripe.v2.core.accounts.retrieve(
      accountId,
      {
        include: ['requirements', 'configuration.merchant'],
      }
    );
    const payoutsEnabled = account.configuration?.merchant?.capabilities?.stripe_balance?.payouts?.status === 'active'
    const chargesEnabled = account.configuration?.merchant?.capabilities?.card_payments?.status === 'active'

    // No pending requirements
    const summaryStatus = account.requirements?.summary?.minimum_deadline?.status
    const detailsSubmitted = !summaryStatus || summaryStatus === 'eventually_due'

    return NextResponse.json({
      id: account.id,
      payoutsEnabled,
      chargesEnabled,
      detailsSubmitted,
      requirements: account.requirements?.entries,
    });
  } catch (error) {
    console.error('Error retrieving account status:', error);
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 400 }
    );
  }
}