import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
  apiVersion: "2024-04-10" as any,
});

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
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Manejar el evento
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const userEmail = session.metadata?.userEmail;
    const planKey = session.metadata?.planKey;

    if (!userEmail || !planKey) {
      console.error("No se encontró email o planKey en la metadata.");
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    try {
      await prisma.$transaction(async (tx) => {
        // Encontrar al usuario y su org
        const user = await tx.user.findUnique({
          where: { email: userEmail },
          include: { organization: true },
        });

        let orgId = user?.organizationId;

        // Si no tiene org, crear una por defecto
        if (!orgId) {
          const orgName = `Organización de ${user?.name || "Patrocinador"}`;
          const newOrg = await tx.organization.create({
            data: { name: orgName },
          });
          orgId = newOrg.id;
        }

        // Actualizar la membresía
        await tx.user.update({
          where: { email: userEmail },
          data: {
            membership: planKey.toUpperCase() as import("@prisma/client").MembershipLevel,
            organizationId: orgId,
          },
        });
      });
      
      console.log(`Pago procesado con éxito para ${userEmail}. Plan asignado: ${planKey}`);
    } catch (dbError: any) {
      console.error("Error actualizando la base de datos:", dbError);
      return NextResponse.json({ error: "Database update failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
