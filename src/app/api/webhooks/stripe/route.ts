import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { toMembershipLevel } from "@/lib/plans";
import type { MembershipLevel } from "@prisma/client";

// Extrae monto/moneda/intervalo del primer item de la suscripción de Stripe.
function getPricing(subscription: Stripe.Subscription): {
  amount: number | null;
  currency: string | null;
  interval: string | null;
} {
  const price = subscription.items.data[0]?.price;
  return {
    amount: price?.unit_amount ?? null,
    currency: price?.currency ?? null,
    interval: price?.recurring?.interval ?? null,
  };
}

// `current_period_end` cambió de ubicación entre versiones de la API de Stripe
// (a veces vive en el item de la suscripción). Lo leemos de forma defensiva.
function getCurrentPeriodEnd(subscription: Stripe.Subscription): Date | null {
  const sub = subscription as unknown as {
    current_period_end?: number;
    items?: { data?: Array<{ current_period_end?: number }> };
  };
  const unix = sub.current_period_end ?? sub.items?.data?.[0]?.current_period_end;
  return unix ? new Date(unix * 1000) : null;
}

// Asegura que el usuario tenga una organización y le asigna la membresía.
// Devuelve el organizationId para vincular la suscripción.
async function applyMembership(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  userEmail: string,
  membership: MembershipLevel
): Promise<string> {
  const user = await tx.user.findUnique({
    where: { email: userEmail },
    include: { organization: true },
  });

  if (!user) {
    throw new Error(`Usuario no encontrado: ${userEmail}`);
  }

  let orgId = user.organizationId;
  if (!orgId) {
    const newOrg = await tx.organization.create({
      data: { name: `Organización de ${user.name || "Patrocinador"}` },
    });
    orgId = newOrg.id;
  }

  await tx.user.update({
    where: { email: userEmail },
    data: { membership, organizationId: orgId },
  });

  return orgId;
}

// Crea o actualiza el registro Subscription a partir de la suscripción de Stripe.
async function upsertSubscription(params: {
  organizationId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string;
  planName: string;
  status: string;
  amount: number | null;
  currency: string | null;
  interval: string | null;
  currentPeriodEnd: Date | null;
}) {
  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: params.stripeSubscriptionId },
    update: {
      status: params.status,
      amount: params.amount,
      currency: params.currency,
      interval: params.interval,
      currentPeriodEnd: params.currentPeriodEnd,
      stripeCustomerId: params.stripeCustomerId,
    },
    create: {
      organizationId: params.organizationId,
      stripeCustomerId: params.stripeCustomerId,
      stripeSubscriptionId: params.stripeSubscriptionId,
      planName: params.planName,
      status: params.status,
      amount: params.amount,
      currency: params.currency,
      interval: params.interval,
      currentPeriodEnd: params.currentPeriodEnd,
    },
  });
}

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature provided" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET no está configurado.");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "invalid signature";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      // Se dispara cuando el usuario completa el pago en Stripe Checkout.
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const userEmail = session.metadata?.userEmail;
        const planKey = session.metadata?.planKey;
        if (!userEmail || !planKey) {
          console.error("Falta userEmail o planKey en la metadata de la sesión.");
          return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
        }

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;
        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id ?? null;

        if (!subscriptionId) {
          console.error("La sesión no tiene una suscripción asociada.");
          return NextResponse.json({ error: "No subscription on session" }, { status: 400 });
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const pricing = getPricing(subscription);

        const orgId = await prisma.$transaction((tx) =>
          applyMembership(tx, userEmail, toMembershipLevel(planKey))
        );

        await upsertSubscription({
          organizationId: orgId,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          planName: planKey,
          status: subscription.status,
          amount: pricing.amount,
          currency: pricing.currency,
          interval: pricing.interval,
          currentPeriodEnd: getCurrentPeriodEnd(subscription),
        });

        console.log(`Suscripción activada para ${userEmail}. Plan: ${planKey}`);
        break;
      }

      // Renovaciones, cambios de estado (past_due, etc.).
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const pricing = getPricing(subscription);
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: subscription.status,
            amount: pricing.amount,
            currency: pricing.currency,
            interval: pricing.interval,
            currentPeriodEnd: getCurrentPeriodEnd(subscription),
          },
        });
        break;
      }

      // Cancelación: marcamos la suscripción y revocamos la membresía.
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const existing = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });
        if (existing) {
          await prisma.subscription.update({
            where: { id: existing.id },
            data: { status: "canceled" },
          });
        }
        const userEmail = subscription.metadata?.userEmail;
        if (userEmail) {
          await prisma.user.update({
            where: { email: userEmail },
            data: { membership: "NONE" },
          }).catch((e) => console.error("No se pudo revocar la membresía:", e));
        }
        break;
      }

      default:
        // Otros eventos se ignoran intencionalmente.
        break;
    }
  } catch (dbError: unknown) {
    console.error("Error procesando el webhook:", dbError);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
