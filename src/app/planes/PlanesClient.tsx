"use client";

import { SubscriptionPlans } from "@/components/emv/SubscriptionPlans";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function PlanesClient({ userName }: { userName: string }) {
  const router = useRouter();

  return (
    <SubscriptionPlans 
      userName={userName}
      onSelectPlan={(plan) => {
        router.push(`/pago?plan=${plan.key}&price=${plan.price}&annual=${plan.annual}&name=${encodeURIComponent(plan.name)}`);
      }}
      onBack={() => {
        signOut({ callbackUrl: "/" });
      }}
    />
  );
}
