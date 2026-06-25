"use server";

import { auth } from "@/auth";
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
  apiVersion: "2024-04-10" as any, // latest stable version syntax might vary, using type assertion to avoid issues
});

export async function createCheckoutSessionAction(planData: { key: string; name: string; price: number; annual: boolean }) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("No estás autenticado");
  }

  // Obtenemos el origen (ej: http://localhost:3000)
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const origin = `${protocol}://${host}`;

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment", // "subscription" if recurring
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id || "",
        userEmail: session.user.email,
        planKey: planData.key,
      },
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: `Membresía ${planData.name} - EMV`,
              description: planData.annual ? "Suscripción anual" : "Suscripción mensual",
            },
            unit_amount: planData.price * 100, // Stripe usa centavos
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/`,
      cancel_url: `${origin}/planes`,
    });

    return { url: checkoutSession.url };
  } catch (error: any) {
    console.error("Stripe Checkout error:", error);
    throw new Error(error.message || "Error al crear la sesión de pago");
  }
}
