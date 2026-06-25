import EmvApp from "@/components/emv/App";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const TIER_MAP: Record<string, string> = {
  none: "Sin Membresía",
  aliado: "Aliado",
  sembrador: "Sembrador",
  constructor: "Constructor",
  guardian: "Guardián"
};

export default async function Home() {
  const session = await auth();
  
  let initialView: "auth" | "portal" = "auth";
  let initialTier = "Constructor";

  if (session?.user?.email) {
    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });

    // Sin membresía real (NONE o usuario nuevo) → elegir un plan.
    // Con membresía activa → directo a su portal.
    if (!dbUser || dbUser.membership === "NONE") {
      redirect("/planes");
    }

    initialView = "portal";
    initialTier = TIER_MAP[dbUser.membership.toLowerCase()] || dbUser.membership;
  }

  return <EmvApp initialView={initialView as any} initialTier={initialTier} email={session?.user?.email || undefined} />;
}
