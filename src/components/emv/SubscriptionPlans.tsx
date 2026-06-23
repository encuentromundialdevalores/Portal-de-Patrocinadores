"use client";
import { useState } from "react";
import { Check, Zap, Star, Shield, Users, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
const emvLogo = "/imports/EMV_XVIII-Blanco.png";

const EMV_BLUE = "#29ABE2";
const EMV_BLUE_DARK = "#1A8CBF";
const EMV_ORANGE = "#F7941D";
const EMV_MAGENTA = "#EC008C";

const plans = [
  {
    key: "aliado",
    name: "Aliado",
    emoji: "🤝",
    icon: Users,
    color: EMV_BLUE,
    colorLight: "#E8F6FC",
    monthlyPrice: 1000,
    annualPrice: 800,
    description: "Se suma a la causa y comienza a generar impacto.",
    badge: null,
    features: [
      "Acceso al Portal de Aliados",
      "Logotipo en página de aliados",
      "Reporte de impacto trimestral",
      "1 plática al año de la Biblioteca",
      "2 boletos para el evento anual",
    ],
    notIncluded: [
      "Cursos para empleados",
      "Menciones en redes sociales",
      "Certificación de Empresa Compasiva",
    ],
  },
  {
    key: "sembrador",
    name: "Sembrador",
    emoji: "🌱",
    icon: Zap,
    color: EMV_ORANGE,
    colorLight: "#FEF3E7",
    monthlyPrice: 3000,
    annualPrice: 2400,
    description: "Siembra valores en tu organización y comunidad.",
    badge: null,
    features: [
      "Acceso al Portal de Aliados",
      "Reporte de impacto trimestral",
      "2 pláticas al año de la Biblioteca",
      "Curso \"HCV\" para 10 colaboradores",
    ],
    notIncluded: [
      "Menciones en redes sociales",
      "Boletos para el evento anual",
      "Certificación de Empresa Compasiva",
    ],
  },
  {
    key: "constructor",
    name: "Constructor",
    emoji: "🧱",
    icon: Star,
    color: "#6366F1",
    colorLight: "#EEF2FF",
    monthlyPrice: 5000,
    annualPrice: 4000,
    description: "Construye comunidad con impacto comprobado.",
    badge: "Más popular",
    features: [
      "Acceso al Portal de Aliados",
      "Reporte de impacto trimestral",
      "3 pláticas al año de la Biblioteca",
      "Curso \"HCV\" para 10 colaboradores",
      "Descuento en boletos del evento anual",
      "50% de descuento en Certificación",
    ],
    notIncluded: [
      "Menciones en redes sociales",
    ],
  },
  {
    key: "guardian",
    name: "Guardián",
    emoji: "🛡",
    icon: Shield,
    color: EMV_MAGENTA,
    colorLight: "#FDE8F4",
    monthlyPrice: 10000,
    annualPrice: 8000,
    description: "Protege el legado y lidera el cambio con propósito.",
    badge: "Elite",
    features: [
      "Acceso al Portal de Aliados",
      "Reporte de impacto trimestral",
      "5 pláticas al año de la Biblioteca",
      "Cursos HCV y Prosocial (30 colaboradores)",
      "Menciones en redes sociales",
      "5 boletos para el evento anual",
      "Certificación Empresa Compasiva",
    ],
    notIncluded: [],
  },
];

const allFeatures = [
  { name: "Portal de Aliados", aliado: "Sí", sembrador: "Sí", constructor: "Sí", guardian: "Sí" },
  { name: "Reporte de impacto", aliado: "Trimestral", sembrador: "Trimestral", constructor: "Trimestral", guardian: "Trimestral" },
  { name: "Biblioteca de grabaciones", aliado: "1 plática al año", sembrador: "2 pláticas al año", constructor: "3 pláticas al año", guardian: "5 pláticas al año" },
  { name: "Cursos para empleados", aliado: "—", sembrador: "HCV (10 colab.)", constructor: "HCV (10 colab.)", guardian: "HCV y Prosocial (30 colab.)" },
  { name: "Menciones en redes", aliado: "—", sembrador: "—", constructor: "—", guardian: "Sí" },
  { name: "Boletos para el EMV", aliado: "2", sembrador: "—", constructor: "% Descuento", guardian: "5" },
  { name: "Certificación como Empresa Compasiva", aliado: "—", sembrador: "—", constructor: "50% Descuento", guardian: "Sí" },
];

interface SubscriptionPlansProps {
  userName?: string;
  onSelectPlan: (plan: { key: string; name: string; price: number; annual: boolean }) => void;
  onBack: () => void;
}

export function SubscriptionPlans({ userName, onSelectPlan, onBack }: SubscriptionPlansProps) {
  const [annual, setAnnual] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #111827 0%, #1C2437 50%, #1E2A3A 100%)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* SVG glows */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ position: "fixed" }}>
        <defs>
          <radialGradient id="pg1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={EMV_BLUE} stopOpacity="0.10" />
            <stop offset="100%" stopColor={EMV_BLUE} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="pg2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={EMV_ORANGE} stopOpacity="0.10" />
            <stop offset="100%" stopColor={EMV_ORANGE} stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="20%" cy="20%" rx="600" ry="400" fill="url(#pg1)" />
        <ellipse cx="80%" cy="80%" rx="500" ry="350" fill="url(#pg2)" />
      </svg>

      <div className="relative z-10" style={{ padding: "0 24px 80px" }}>
        {/* Top bar */}
        <div className="flex items-center justify-between" style={{ maxWidth: 1200, margin: "0 auto", paddingTop: 32, paddingBottom: 8 }}>
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "7px 14px",
                cursor: "pointer", fontSize: 13, fontWeight: 500,
              }}
            >
              <ArrowLeft size={14} /> Atrás
            </button>
            <div
              className="flex items-center justify-center rounded-xl px-4 py-2"
              style={{ background: "linear-gradient(135deg, #0B2E3E, #1A8CBF)" }}
            >
              <ImageWithFallback src={emvLogo} alt="EMV" style={{ height: 28, width: "auto" }} />
            </div>
          </div>
          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>
            {userName && `Hola, ${userName} · `}Elige tu plan
          </div>
        </div>

        {/* Header */}
        <div className="text-center" style={{ maxWidth: 640, margin: "0 auto", paddingTop: 48, paddingBottom: 48 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              style={{
                display: "inline-block",
                fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
                color: EMV_BLUE, marginBottom: 14,
                fontFamily: "var(--font-display)",
                background: `${EMV_BLUE}15`,
                border: `1px solid ${EMV_BLUE}30`,
                borderRadius: 20, padding: "4px 14px",
              }}
            >
              SELECCIONA TU MEMBRESÍA
            </div>
            <h1
              style={{
                color: "white", fontSize: "clamp(28px, 3vw, 44px)",
                fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.025em",
                fontFamily: "var(--font-display)", margin: "0 0 16px",
              }}
            >
              Únete al impacto que
              <br />
              <span style={{
                background: `linear-gradient(90deg, #FFDC8A, ${EMV_ORANGE})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                transforma vidas
              </span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, lineHeight: 1.65, margin: 0 }}>
              Elige el plan que mejor se adapta a tu organización y comienza a generar impacto desde hoy.
            </p>
          </motion.div>

          {/* Billing toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-3"
            style={{ marginTop: 32 }}
          >
            <span style={{ color: annual ? "rgba(255,255,255,0.4)" : "white", fontSize: 14, fontWeight: 500 }}>
              Mensual
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              style={{
                width: 48, height: 26, borderRadius: 13,
                background: annual ? EMV_BLUE : "rgba(255,255,255,0.15)",
                border: "none", cursor: "pointer", position: "relative",
                transition: "background 0.2s",
              }}
            >
              <span style={{
                position: "absolute", top: 3,
                left: annual ? 26 : 3,
                width: 20, height: 20, borderRadius: "50%",
                background: "white",
                transition: "left 0.2s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
              }} />
            </button>
            <span style={{ color: annual ? "white" : "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: 500 }}>
              Anual{" "}
              <span style={{
                background: `${EMV_ORANGE}30`, color: EMV_ORANGE,
                borderRadius: 6, padding: "1px 7px", fontSize: 11, fontWeight: 700,
              }}>
                -20%
              </span>
            </span>
          </motion.div>
        </div>

        {/* Plan cards */}
        <div
          className="grid"
          style={{
            maxWidth: 1200, margin: "0 auto",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {plans.map((plan, i) => {
            const price = annual ? plan.annualPrice : plan.monthlyPrice;
            const isPopular = plan.badge === "Más popular";
            const isHovered = hovered === plan.key;

            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
                onMouseEnter={() => setHovered(plan.key)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  borderRadius: 20,
                  border: isPopular
                    ? `2px solid ${plan.color}60`
                    : `1px solid rgba(255,255,255,${isHovered ? "0.14" : "0.07"})`,
                  background: isPopular
                    ? `linear-gradient(160deg, rgba(99,102,241,0.12) 0%, rgba(255,255,255,0.04) 100%)`
                    : `rgba(255,255,255,${isHovered ? "0.06" : "0.03"})`,
                  backdropFilter: "blur(20px)",
                  padding: "28px 24px 24px",
                  display: "flex", flexDirection: "column",
                  position: "relative",
                  transform: isPopular || isHovered ? "translateY(-4px)" : "translateY(0)",
                  transition: "transform 0.2s, border-color 0.2s, background 0.2s",
                  boxShadow: isPopular ? `0 12px 40px rgba(99,102,241,0.20)` : "none",
                }}
              >
                {/* Badge */}
                {plan.badge && (
                  <div style={{
                    position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                    background: isPopular ? "linear-gradient(90deg, #6366F1, #8B5CF6)" : `linear-gradient(90deg, ${EMV_MAGENTA}, #D946EF)`,
                    color: "white", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
                    borderRadius: 20, padding: "4px 14px",
                    whiteSpace: "nowrap",
                    fontFamily: "var(--font-display)",
                  }}>
                    {plan.badge === "Más popular" ? "⭐ MÁS POPULAR" : "👑 ELITE"}
                  </div>
                )}

                {/* Plan header */}
                <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${plan.color}20`, border: `1px solid ${plan.color}35`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20,
                  }}>
                    {plan.emoji}
                  </div>
                  <div>
                    <div style={{ color: "white", fontWeight: 700, fontSize: 17, fontFamily: "var(--font-display)" }}>
                      {plan.name}
                    </div>
                    <div style={{ color: plan.color, fontSize: 11, fontWeight: 600, letterSpacing: "0.04em" }}>
                      MEMBRESÍA
                    </div>
                  </div>
                </div>

                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.55, margin: "0 0 20px" }}>
                  {plan.description}
                </p>

                {/* Price */}
                <div style={{ marginBottom: 24 }}>
                  <div className="flex items-end gap-1">
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 18, fontWeight: 500, alignSelf: "flex-start", marginTop: 6 }}>$</span>
                    <span style={{ color: "white", fontSize: 42, fontWeight: 800, lineHeight: 1, fontFamily: "var(--font-display)" }}>
                      {price}
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, marginBottom: 4 }}>/mes</span>
                  </div>
                  {annual && (
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 4 }}>
                      Facturado anualmente · ${price * 12}/año
                    </div>
                  )}
                </div>

                {/* CTA */}
                <button
                  onClick={() => onSelectPlan({ key: plan.key, name: plan.name, price, annual })}
                  style={{
                    width: "100%", padding: "12px 20px", borderRadius: 10, border: "none",
                    background: isPopular
                      ? "linear-gradient(90deg, #6366F1, #8B5CF6)"
                      : isHovered ? plan.color : `${plan.color}25`,
                    color: isPopular || isHovered ? "white" : plan.color,
                    fontSize: 14, fontWeight: 700, cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                    fontFamily: "var(--font-display)",
                    marginBottom: 20,
                    boxShadow: (isPopular || isHovered) ? `0 4px 16px ${plan.color}40` : "none",
                  }}
                >
                  Elegir {plan.name} <ArrowRight size={15} />
                </button>

                <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 18 }} />

                {/* Features */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <div style={{
                        width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                        background: `${plan.color}20`, border: `1px solid ${plan.color}40`,
                        display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1,
                      }}>
                        <Check size={9} color={plan.color} strokeWidth={3} />
                      </div>
                      <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.45 }}>{f}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <div style={{
                        width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                        display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1,
                      }}>
                        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 10, lineHeight: 1 }}>—</span>
                      </div>
                      <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 13, lineHeight: 1.45 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ maxWidth: 1200, margin: "64px auto 0" }}
        >
          <h2 style={{
            color: "white", textAlign: "center", fontFamily: "var(--font-display)",
            fontWeight: 700, fontSize: 24, marginBottom: 32,
          }}>
            Comparar todos los planes
          </h2>

          <div style={{
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(20px)",
            overflow: "hidden",
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <th style={{ padding: "16px 20px", textAlign: "left", color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>
                    CARACTERÍSTICAS
                  </th>
                  {plans.map((p) => (
                    <th key={p.key} style={{ padding: "16px 16px", textAlign: "center", color: p.color, fontSize: 13, fontWeight: 700, fontFamily: "var(--font-display)" }}>
                      {p.emoji} {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feature, i) => (
                  <tr key={feature.name} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)" }}>
                    <td style={{ padding: "12px 20px", color: "rgba(255,255,255,0.55)", fontSize: 13 }}>
                      {feature.name}
                    </td>
                    {plans.map((p) => {
                      const val = feature[p.key as keyof typeof feature];
                      const isCheck = val === "Sí";
                      const isEmpty = val === "—";
                      return (
                        <td key={p.key} style={{ padding: "12px 16px", textAlign: "center", color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: isCheck ? 600 : 400 }}>
                          {isCheck ? (
                            <div style={{
                              width: 20, height: 20, borderRadius: "50%", margin: "0 auto",
                              background: `${p.color}20`, border: `1px solid ${p.color}40`,
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                            }}>
                              <Check size={10} color={p.color} strokeWidth={3} />
                            </div>
                          ) : isEmpty ? (
                            <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 14 }}>—</span>
                          ) : (
                            val
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Footer note */}
        <div className="text-center" style={{ marginTop: 40 }}>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>
            Todos los planes incluyen 14 días de prueba gratuita · Sin compromiso · Cancela cuando quieras
          </p>
        </div>
      </div>
    </div>
  );
}