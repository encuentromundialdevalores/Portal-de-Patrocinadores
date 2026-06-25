// Fuente única de verdad para los planes de membresía.
// La usan: el checkout de Stripe (precio que se cobra), el webhook
// (fallback de monto) y el panel admin (cálculo de ingresos).
import type { MembershipLevel } from "@prisma/client";

export type PlanKey = "aliado" | "sembrador" | "constructor" | "guardian";

export interface Plan {
  key: PlanKey;
  name: string;
  emoji: string;
  /** Precio mensual mostrado en la UI (MXN). */
  monthlyPrice: number;
  /** Precio mensual con facturación anual (MXN). El cobro anual = annualPrice * 12. */
  annualPrice: number;
}

export const PLANS: Record<PlanKey, Plan> = {
  aliado: { key: "aliado", name: "Aliado", emoji: "🤝", monthlyPrice: 1000, annualPrice: 800 },
  sembrador: { key: "sembrador", name: "Sembrador", emoji: "🌱", monthlyPrice: 3000, annualPrice: 2400 },
  constructor: { key: "constructor", name: "Constructor", emoji: "🧱", monthlyPrice: 5000, annualPrice: 4000 },
  guardian: { key: "guardian", name: "Guardián", emoji: "🛡", monthlyPrice: 10000, annualPrice: 8000 },
};

export const PLAN_LIST: Plan[] = Object.values(PLANS);

export function isPlanKey(value: string): value is PlanKey {
  return value in PLANS;
}

export function getPlan(key: string): Plan | undefined {
  return isPlanKey(key) ? PLANS[key] : undefined;
}

/** Monto total que se cobra por periodo, en la moneda base (no centavos). */
export function getChargeAmount(key: PlanKey, annual: boolean): number {
  const plan = PLANS[key];
  return annual ? plan.annualPrice * 12 : plan.monthlyPrice;
}

/** Convierte el planKey de la app al enum de Prisma. */
export function toMembershipLevel(key: string): MembershipLevel {
  return key.toUpperCase() as MembershipLevel;
}
