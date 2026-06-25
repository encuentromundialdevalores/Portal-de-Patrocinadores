"use server";

import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import { getPlan, getChargeAmount } from "@/lib/plans";
import { headers } from "next/headers";

export async function createCheckoutSessionAction(planData: {
  key: string;
  name: string;
  price: number;
  annual: boolean;
}) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("No estás autenticado");
  }

  // El precio se calcula en el servidor desde el catálogo, NO se confía en
  // el `price` enviado por el cliente (evita manipulación del monto).
  const plan = getPlan(planData.key);
  if (!plan) {
    throw new Error("Plan no válido");
  }

  // Obtenemos el origen (ej: http://localhost:3000)
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const origin = `${protocol}://${host}`;

  // - Mensual: se cobra el precio mensual cada mes.
  // - Anual: se cobra el equivalente a 12 meses, una vez al año.
  const interval = planData.annual ? "year" : "month";
  const unitAmount = getChargeAmount(plan.key, planData.annual) * 100; // Stripe usa centavos

  const metadata = {
    userId: session.user.id || "",
    userEmail: session.user.email,
    planKey: plan.key,
    billingInterval: interval,
  };

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: session.user.email,
      metadata,
      // Replicamos la metadata en la suscripción para poder identificarla
      // en eventos de ciclo de vida (renovaciones, cancelaciones, etc.).
      subscription_data: { metadata },
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: `Membresía ${plan.name} - EMV`,
            },
            unit_amount: unitAmount,
            recurring: { interval },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/?pago=exito`,
      cancel_url: `${origin}/planes`,
    });

    return { url: checkoutSession.url };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al crear la sesión de pago";
    console.error("Stripe Checkout error:", error);
    throw new Error(message);
  }
}
