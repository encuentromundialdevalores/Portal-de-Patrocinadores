import EmvApp from "@/components/emv/App";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const TIER_MAP: Record<string, string> = {
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
    
    if (!dbUser?.membership) {
      redirect("/planes");
    }
    
    initialView = "portal";
    initialTier = TIER_MAP[dbUser.membership.toLowerCase()] || dbUser.membership;
  }

  return <EmvApp initialView={initialView as any} initialTier={initialTier} />;
}
