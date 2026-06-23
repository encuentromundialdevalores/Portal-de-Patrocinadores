"use client";
import { useState } from "react";
import { ArrowLeft, CreditCard, Lock, CheckCircle, Calendar, Shield } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
const emvLogo = "/imports/EMV_XVIII-Blanco.png";

const EMV_BLUE = "#29ABE2";
const EMV_BLUE_DARK = "#1A8CBF";
const EMV_ORANGE = "#F7941D";
const EMV_MAGENTA = "#EC008C";

const planColors: Record<string, string> = {
  aliado: EMV_BLUE,
  sembrador: EMV_ORANGE,
  constructor: "#6366F1",
  guardian: EMV_MAGENTA,
};

interface PaymentPageProps {
  plan: { key: string; name: string; price: number; annual: boolean };
  userName: string;
  userEmail: string;
  onBack: () => void;
  onComplete: () => void;
}

export function PaymentPage({ plan, userName, userEmail, onBack, onComplete }: PaymentPageProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState(userName);
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [method, setMethod] = useState<"card" | "paypal">("card");

  const planColor = planColors[plan.key] || EMV_BLUE;
  const totalPrice = plan.annual ? plan.price * 12 : plan.price;
  const savings = plan.annual ? Math.round((plan.price / 0.8 - plan.price) * 12) : 0;

  const formatCard = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const inputStyle = (name: string) => ({
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: `1.5px solid ${focused === name ? planColor : "rgba(255,255,255,0.12)"}`,
    background: focused === name ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
    fontSize: 14,
    color: "white",
    outline: "none",
    transition: "all 0.15s",
    boxShadow: focused === name ? `0 0 0 3px ${planColor}18` : "none",
    boxSizing: "border-box" as const,
    fontFamily: "var(--font-sans)",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setTimeout(onComplete, 2200);
    }, 1800);
  };

  if (success) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #111827 0%, #1C2437 50%, #1E2A3A 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-sans)",
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          style={{
            textAlign: "center", padding: "48px 40px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 24, maxWidth: 440,
            backdropFilter: "blur(20px)",
          }}
        >
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: `${planColor}20`, border: `2px solid ${planColor}50`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
          }}>
            <CheckCircle size={36} color={planColor} />
          </div>
          <h2 style={{ color: "white", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, margin: "0 0 12px" }}>
            ¡Bienvenido al EMV!
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, lineHeight: 1.6, margin: "0 0 8px" }}>
            Tu membresía <strong style={{ color: planColor }}>{plan.name}</strong> ha sido activada exitosamente.
          </p>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>
            Redirigiendo al portal...
          </p>
          <div style={{
            marginTop: 24, height: 3, borderRadius: 2,
            background: "rgba(255,255,255,0.08)", overflow: "hidden",
          }}>
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.0, ease: "linear" }}
              style={{ height: "100%", background: planColor, borderRadius: 2 }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #111827 0%, #1C2437 50%, #1E2A3A 100%)",
      fontFamily: "var(--font-sans)",
    }}>
      {/* SVG glow */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none" style={{ position: "fixed", zIndex: 0 }}>
        <defs>
          <radialGradient id="payg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={planColor} stopOpacity="0.08" />
            <stop offset="100%" stopColor={planColor} stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="75%" cy="30%" rx="600" ry="400" fill="url(#payg)" />
      </svg>

      <div className="relative z-10" style={{ padding: "32px 24px 60px", maxWidth: 900, margin: "0 auto" }}>
        {/* Top bar */}
        <div className="flex items-center justify-between" style={{ marginBottom: 40 }}>
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
              <ImageWithFallback src={emvLogo} alt="EMV" style={{ height: 26, width: "auto" }} />
            </div>
          </div>
          <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
            <Lock size={12} /> Pago seguro con cifrado SSL
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2" style={{ marginBottom: 40 }}>
          {["Crear cuenta", "Elegir plan", "Pago"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                background: i === 2 ? planColor : i < 2 ? `${planColor}30` : "rgba(255,255,255,0.1)",
                border: `2px solid ${i <= 2 ? planColor : "rgba(255,255,255,0.1)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: i === 2 ? "white" : planColor,
              }}>
                {i < 2 ? <CheckCircle size={12} /> : "3"}
              </div>
              <span style={{ color: i === 2 ? "white" : "rgba(255,255,255,0.35)", fontSize: 13, fontWeight: i === 2 ? 600 : 400 }}>
                {step}
              </span>
              {i < 2 && <div style={{ width: 32, height: 1, background: `${planColor}40`, margin: "0 4px" }} />}
            </div>
          ))}
        </div>

        <div className="grid" style={{ gridTemplateColumns: "1fr 380px", gap: 28 }}>
          {/* Payment form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20, padding: "32px",
              backdropFilter: "blur(20px)",
            }}
          >
            <h2 style={{ color: "white", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, margin: "0 0 24px" }}>
              Información de pago
            </h2>

            {/* Method selector */}
            <div className="flex gap-3" style={{ marginBottom: 24 }}>
              {[
                { key: "card", label: "Tarjeta", icon: "💳" },
                { key: "paypal", label: "PayPal", icon: "🅿️" },
              ].map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMethod(m.key as "card" | "paypal")}
                  style={{
                    flex: 1, padding: "10px 16px",
                    borderRadius: 10,
                    border: `1.5px solid ${method === m.key ? planColor : "rgba(255,255,255,0.10)"}`,
                    background: method === m.key ? `${planColor}15` : "rgba(255,255,255,0.02)",
                    color: method === m.key ? "white" : "rgba(255,255,255,0.45)",
                    cursor: "pointer", fontSize: 13, fontWeight: 600,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: "all 0.15s",
                  }}
                >
                  <span>{m.icon}</span> {m.label}
                </button>
              ))}
            </div>

            {method === "card" ? (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 7, letterSpacing: "0.06em" }}>
                    NÚMERO DE TARJETA
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCard(e.target.value))}
                      onFocus={() => setFocused("card")}
                      onBlur={() => setFocused(null)}
                      placeholder="1234 5678 9012 3456"
                      required
                      style={inputStyle("card")}
                    />
                    <CreditCard
                      size={16}
                      color="rgba(255,255,255,0.25)"
                      style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 7, letterSpacing: "0.06em" }}>
                    NOMBRE EN LA TARJETA
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                    placeholder="Como aparece en tu tarjeta"
                    required
                    style={inputStyle("name")}
                  />
                </div>

                <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 7, letterSpacing: "0.06em" }}>
                      VENCIMIENTO
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        onFocus={() => setFocused("expiry")}
                        onBlur={() => setFocused(null)}
                        placeholder="MM/AA"
                        required
                        style={inputStyle("expiry")}
                      />
                      <Calendar size={14} color="rgba(255,255,255,0.25)" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 7, letterSpacing: "0.06em" }}>
                      CVV
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        onFocus={() => setFocused("cvv")}
                        onBlur={() => setFocused(null)}
                        placeholder="•••"
                        required
                        style={inputStyle("cvv")}
                      />
                      <Shield size={14} color="rgba(255,255,255,0.25)" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }} />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: "100%", padding: "14px 20px", borderRadius: 12, border: "none",
                    background: isLoading ? `${planColor}80` : `linear-gradient(90deg, ${planColor}, ${planColor}CC)`,
                    color: "white", fontSize: 15, fontWeight: 700, cursor: isLoading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    fontFamily: "var(--font-display)",
                    marginTop: 4,
                    boxShadow: `0 4px 20px ${planColor}40`,
                    transition: "all 0.15s",
                  }}
                >
                  {isLoading ? (
                    <>
                      <span style={{
                        width: 16, height: 16,
                        border: "2px solid rgba(255,255,255,0.4)",
                        borderTopColor: "white", borderRadius: "50%",
                        display: "inline-block",
                        animation: "spin 0.7s linear infinite",
                      }} />
                      Procesando pago...
                    </>
                  ) : (
                    <>
                      <Lock size={15} /> Pagar ${plan.annual ? totalPrice : plan.price}{plan.annual ? "/año" : "/mes"}
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-4" style={{ marginTop: 4 }}>
                  {["Visa", "Mastercard", "Amex", "PayPal"].map((b) => (
                    <span key={b} style={{
                      fontSize: 11, color: "rgba(255,255,255,0.2)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 5, padding: "3px 8px", fontWeight: 600,
                    }}>{b}</span>
                  ))}
                </div>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 20 }}>
                  Serás redirigido a PayPal para completar tu pago de forma segura.
                </p>
                <button
                  onClick={() => { setIsLoading(true); setTimeout(() => { setIsLoading(false); setSuccess(true); setTimeout(onComplete, 2200); }, 1800); }}
                  style={{
                    padding: "13px 32px", borderRadius: 12, border: "none",
                    background: "#003087", color: "white", fontSize: 14, fontWeight: 700,
                    cursor: "pointer", fontFamily: "var(--font-display)",
                  }}
                >
                  🅿️ Continuar con PayPal
                </button>
              </div>
            )}
          </motion.div>

          {/* Order summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20, padding: "28px 24px",
              backdropFilter: "blur(20px)",
              position: "sticky", top: 24,
            }}>
              <h3 style={{ color: "white", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, margin: "0 0 20px" }}>
                Resumen del pedido
              </h3>

              {/* Plan card */}
              <div style={{
                borderRadius: 12, padding: "16px",
                background: `${planColor}12`,
                border: `1px solid ${planColor}30`,
                marginBottom: 20,
              }}>
                <div className="flex items-center gap-3">
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: `${planColor}25`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18,
                  }}>
                    {plan.key === "aliado" ? "🤝" : plan.key === "sembrador" ? "🌱" : plan.key === "constructor" ? "🧱" : "🛡"}
                  </div>
                  <div>
                    <div style={{ color: "white", fontWeight: 700, fontSize: 15, fontFamily: "var(--font-display)" }}>
                      Membresía {plan.name}
                    </div>
                    <div style={{ color: planColor, fontSize: 12, fontWeight: 600 }}>
                      {plan.annual ? "Facturación anual" : "Facturación mensual"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price breakdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                <div className="flex justify-between">
                  <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>
                    Precio {plan.annual ? "anual" : "mensual"}
                  </span>
                  <span style={{ color: "white", fontSize: 13, fontWeight: 600 }}>
                    ${plan.annual ? totalPrice : plan.price}
                  </span>
                </div>
                {plan.annual && (
                  <div className="flex justify-between">
                    <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>Descuento anual</span>
                    <span style={{ color: "#4ADE80", fontSize: 13, fontWeight: 600 }}>-${savings}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>Impuestos</span>
                  <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>Incluidos</span>
                </div>
              </div>

              <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 16 }} />

              <div className="flex justify-between" style={{ marginBottom: 24 }}>
                <span style={{ color: "white", fontWeight: 700, fontSize: 15 }}>Total</span>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: planColor, fontWeight: 800, fontSize: 22, fontFamily: "var(--font-display)" }}>
                    ${plan.annual ? totalPrice : plan.price}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
                    {plan.annual ? "por año" : "por mes"}
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: "🔒", text: "Pago 100% seguro y encriptado" },
                  { icon: "↩️", text: "14 días de garantía de devolución" },
                  { icon: "❌", text: "Cancela en cualquier momento" },
                ].map((g) => (
                  <div key={g.text} className="flex items-center gap-2.5">
                    <span style={{ fontSize: 14 }}>{g.icon}</span>
                    <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{g.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Account info */}
            <div style={{
              marginTop: 16, padding: "14px 16px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.25)", marginBottom: 8, fontFamily: "var(--font-display)" }}>
                CUENTA
              </div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>{userName}</div>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{userEmail}</div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
