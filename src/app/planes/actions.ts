"use server";

import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
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

  // Obtenemos el origen (ej: http://localhost:3000)
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const origin = `${protocol}://${host}`;

  // `planData.price` es el precio MENSUAL mostrado en la UI.
  // - Mensual: se cobra ese monto cada mes.
  // - Anual: se cobra el equivalente a 12 meses, una vez al año.
  const interval = planData.annual ? "year" : "month";
  const unitAmount = (planData.annual ? planData.price * 12 : planData.price) * 100; // Stripe usa centavos

  const metadata = {
    userId: session.user.id || "",
    userEmail: session.user.email,
    planKey: planData.key,
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
              name: `Membresía ${planData.name} - EMV`,
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
