"use client";

import { SubscriptionPlans } from "@/components/emv/SubscriptionPlans";
import { signOut } from "next-auth/react";

export default function PlanesClient({ userName }: { userName: string }) {
  return (
    <SubscriptionPlans
      userName={userName}
      onBack={() => {
        signOut({ callbackUrl: "/" });
      }}
    />
  );
}
