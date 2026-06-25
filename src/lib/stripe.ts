import Stripe from "stripe";

// Cliente Stripe compartido para Server Actions y Route Handlers.
// No forzamos `apiVersion`: dejamos que el SDK use la versión con la que
// fueron generados sus tipos, evitando el desajuste tipos/runtime.
const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey && process.env.NODE_ENV === "production") {
  // En producción una llave ausente es un error de configuración.
  console.error("STRIPE_SECRET_KEY no está configurada.");
}

export const stripe = new Stripe(secretKey || "sk_test_dummy");
