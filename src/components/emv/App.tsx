"use client";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Globe, Users, BookOpen, Calendar, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { signIn } from "next-auth/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Dashboard } from "./Dashboard";
import Library from "./Library";
import { Reports } from "./Reports";
import { Membership } from "./Membership";
import { Profile } from "./Profile";
import { AdminDashboard } from "./AdminDashboard";
import { SubscriptionPlans } from "./SubscriptionPlans";
import type { Page } from "./Sidebar";
const emvLogo = "/imports/EMV_XVIII-Blanco.png";

/* MARKER-MAKE-KIT-INVOKED */

// Colors extracted directly from the EMV logo mark
const EMV_BLUE = "#29ABE2";
const EMV_BLUE_DARK = "#1A8CBF";
const EMV_ORANGE = "#F7941D";
const EMV_MAGENTA = "#EC008C";

const kpiCards = [
  { value: "50,000+", label: "personas impactadas", icon: Users, color: EMV_BLUE },
  { value: "120", label: "eventos realizados", icon: Calendar, color: EMV_ORANGE },
  { value: "300h", label: "de formación", icon: BookOpen, color: EMV_MAGENTA },
  { value: "150", label: "aliados activos", icon: Globe, color: EMV_BLUE },
];

const tiers = [
  { emoji: "🤝", name: "Aliado" },
  { emoji: "🌱", name: "Sembrador" },
  { emoji: "🧱", name: "Constructor" },
  { emoji: "🛡", name: "Guardián" },
];

function HeroPanel() {
  return (
    <div
      className="relative flex flex-col justify-center w-full md:w-3/5 p-12 overflow-hidden"
      style={{
        minHeight: "100vh",
        background: "#050505",
        fontFamily: "var(--font-display)",
      }}
    >
      {/* Sleek abstract glowing background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-20 blur-[140px]" style={{ background: EMV_BLUE }}></div>
        <div className="absolute bottom-[-10%] left-[30%] w-[50%] h-[50%] rounded-full opacity-10 blur-[140px]" style={{ background: EMV_MAGENTA }}></div>
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px"
          }}
        />
        {/* Noise overlay for premium texture */}
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
      </div>

      <div className="relative z-10 flex flex-col h-full max-w-xl mx-auto">
        {/* Top logo */}
        <div className="mb-auto">
          <ImageWithFallback
            src={emvLogo}
            alt="XVIII Encuentro Mundial de Valores"
            style={{ height: 32, width: "auto", objectFit: "contain", opacity: 0.9 }}
          />
        </div>

        {/* Center content */}
        <div className="my-auto py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div 
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 100,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                marginBottom: 24,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: EMV_BLUE, boxShadow: `0 0 10px ${EMV_BLUE}` }} />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 600, letterSpacing: "0.05em", fontFamily: "var(--font-sans)" }}>NUEVO PORTAL</span>
            </div>

            <h1
              style={{
                color: "white",
                fontSize: "clamp(36px, 4vw, 56px)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                fontFamily: "var(--font-display)",
                margin: "0 0 24px",
              }}
            >
              Construyamos juntos
              <br />
              <span
                style={{
                  background: `linear-gradient(135deg, #FFFFFF 0%, #A5D6F3 50%, ${EMV_BLUE} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                un legado de valores
              </span>
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 18,
                lineHeight: 1.6,
                maxWidth: 480,
                marginBottom: 48,
                fontFamily: "var(--font-sans)",
                fontWeight: 400,
              }}
            >
              Accede al Portal de Aliados del Encuentro Mundial de Valores. Explora nuestro impacto, descubre recursos exclusivos y conéctate con la comunidad.
            </p>

            {/* Premium KPI glassmorphism cards */}
            <div className="grid grid-cols-2 gap-4">
              {kpiCards.map((kpi, i) => (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.6, ease: "easeOut" }}
                  className="group relative overflow-hidden p-5 rounded-2xl flex items-center gap-4"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  }}
                >
                  <div className="absolute top-0 left-0 w-full h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${kpi.color}40, transparent)`, opacity: 0.5 }} />
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                    style={{
                      width: 44,
                      height: 44,
                      background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0))`,
                      border: `1px solid rgba(255,255,255,0.08)`,
                      boxShadow: `inset 0 0 20px ${kpi.color}15`,
                    }}
                  >
                    <kpi.icon size={20} color={kpi.color} style={{ filter: `drop-shadow(0 0 8px ${kpi.color}80)` }} />
                  </div>
                  <div>
                    <div
                      style={{
                        color: "white",
                        fontSize: 24,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        letterSpacing: "-0.02em",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {kpi.value}
                    </div>
                    <div
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: 13,
                        marginTop: 4,
                        fontWeight: 500,
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      {kpi.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom footer */}
        <div className="mt-auto pt-8 border-t border-white/10">
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-sans)", margin: 0 }}>
            XVIII Encuentro Mundial de Valores · Portal Exclusivo para Aliados
          </p>
        </div>
      </div>
    </div>
  );
}

function LoginButton({ isLoading }: { isLoading: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="submit"
      disabled={isLoading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        padding: "13px 20px",
        borderRadius: 10,
        border: "none",
        background: isLoading ? "#8BCEE5" : hovered ? EMV_BLUE_DARK : EMV_BLUE,
        color: "white",
        fontSize: 15,
        fontWeight: 700,
        cursor: isLoading ? "not-allowed" : "pointer",
        transition: "background 0.15s, transform 0.1s, box-shadow 0.15s",
        transform: hovered && !isLoading ? "translateY(-1px)" : "translateY(0)",
        boxShadow: hovered && !isLoading ? `0 4px 16px ${EMV_BLUE}50` : `0 2px 8px ${EMV_BLUE}30`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        fontFamily: "var(--font-display)",
        letterSpacing: "-0.01em",
        marginTop: 4,
        boxSizing: "border-box",
      }}
    >
      {isLoading ? (
        <>
          <span
            style={{
              width: 16,
              height: 16,
              border: "2px solid rgba(255,255,255,0.4)",
              borderTopColor: "white",
              borderRadius: "50%",
              display: "inline-block",
              animation: "spin 0.7s linear infinite",
            }}
          />
          Accediendo...
        </>
      ) : (
        <>
          Acceder al Portal
          <ArrowRight size={16} />
        </>
      )}
    </button>
  );
}

// Admin credentials — only this user reaches AdminDashboard
const ADMIN_EMAIL    = "admin@emv.org";
const ADMIN_PASSWORD = "Admin2024!";

// Maps email to membership tier
type TierName = "Aliado" | "Sembrador" | "Constructor" | "Guardián";
const EMAIL_TIER_MAP: Record<string, TierName> = {
  "aliado@emv.org":      "Aliado",
  "sembrador@emv.org":   "Sembrador",
  "constructor@emv.org": "Constructor",
  "guardian@emv.org":    "Guardián",
};

// Google sign-in icon SVG
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2045c0-.638-.0573-1.252-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9086c1.7018-1.5668 2.6836-3.874 2.6836-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9086-2.2581c-.8064.54-1.8382.8591-3.0478.8591-2.3445 0-4.3282-1.5836-5.036-3.7105H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71C3.7845 10.17 3.6818 9.5932 3.6818 9s.1027-1.17.2822-1.71V4.9582H.9574C.3477 6.1732 0 7.5477 0 9s.3477 2.8268.9574 4.0418L3.964 10.71z" fill="#FBBC05"/>
      <path d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.4259 0 9 0 5.4818 0 2.4382 2.0168.9574 4.9582L3.964 7.29C4.6718 5.1632 6.6555 3.5795 9 3.5795z" fill="#EA4335"/>
    </svg>
  );
}

function RegisterPanel({ onRegisterComplete }: { onRegisterComplete: (name: string, email: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const inputStyle = (field: string) => ({
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: `1px solid ${focused === field ? EMV_BLUE : "rgba(255,255,255,0.12)"}`,
    background: focused === field ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
    fontSize: 14,
    color: "white",
    outline: "none",
    transition: "all 0.15s",
    boxSizing: "border-box" as const,
    boxShadow: focused === field ? `0 0 0 3px ${EMV_BLUE}25` : "none",
    fontFamily: "var(--font-sans)",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onRegisterComplete(name, email);
    }, 1000);
  };

  const handleGoogle = () => {
    setIsLoading(true);
    signIn("google", { callbackUrl: "/planes" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Google button */}
      <button
        type="button"
        onClick={handleGoogle}
        style={{
          width: "100%", padding: "11px 16px", borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.03)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          cursor: "pointer", fontSize: 14, fontWeight: 600, color: "white",
          transition: "all 0.15s",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          fontFamily: "var(--font-sans)",
        }}
      >
        <GoogleIcon />
        Continuar con Google
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>o regístrate con correo</span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>
            Nombre completo
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setFocused("name")}
            onBlur={() => setFocused(null)}
            placeholder="Tu nombre y apellido"
            required
            style={inputStyle("name")}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused(null)}
            placeholder="tu@empresa.com"
            required
            style={inputStyle("email")}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>
            Empresa / Organización
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            onFocus={() => setFocused("company")}
            onBlur={() => setFocused(null)}
            placeholder="Nombre de tu empresa u organización"
            required
            style={inputStyle("company")}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%", padding: "13px 20px", borderRadius: 10, border: "none",
            background: isLoading ? "#8BCEE5" : EMV_BLUE,
            color: "white", fontSize: 15, fontWeight: 700,
            cursor: isLoading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            fontFamily: "var(--font-display)",
            transition: "all 0.15s",
            boxShadow: `0 2px 12px ${EMV_BLUE}40`,
            marginTop: 4,
          }}
        >
          {isLoading ? (
            <>
              <span style={{
                width: 16, height: 16,
                border: "2px solid rgba(255,255,255,0.4)",
                borderTopColor: "white", borderRadius: "50%",
                display: "inline-block", animation: "spin 0.7s linear infinite",
              }} />
              Creando cuenta...
            </>
          ) : (
            <>Crear cuenta <ArrowRight size={16} /></>
          )}
        </button>

        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textAlign: "center", margin: 0, lineHeight: 1.5 }}>
          Al crear una cuenta aceptas nuestros{" "}
          <span style={{ color: EMV_BLUE, cursor: "pointer", fontWeight: 600 }}>Términos de servicio</span>
          {" "}y{" "}
          <span style={{ color: EMV_BLUE, cursor: "pointer", fontWeight: 600 }}>Política de privacidad</span>
        </p>
      </form>
    </div>
  );
}

function AuthPanel({ onLogin, onAdminLogin, onRegisterComplete }: {
  onLogin: (tier: TierName) => void;
  onAdminLogin: () => void;
  onRegisterComplete: (name: string, email: string) => void;
}) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        onAdminLogin();
      } else {
        const tier = EMAIL_TIER_MAP[email.trim().toLowerCase()] ?? "Constructor";
        onLogin(tier);
      }
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    signIn("google", { callbackUrl: "/planes" });
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center w-full md:w-2/5 min-h-screen p-6 md:p-8"
      style={{
        background: "rgba(5, 5, 5, 0.7)",
        backdropFilter: "blur(40px)",
        borderLeft: "1px solid rgba(255,255,255,0.05)",
        fontFamily: "var(--font-sans)",
        overflowY: "auto",
        zIndex: 20,
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            background: "rgba(255,255,255,0.02)",
            borderRadius: 20,
            boxShadow: "0 24px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
            padding: "36px 32px 32px",
            border: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Logo & header */}
          <div className="flex flex-col items-center gap-3 mb-6">
            <div
              className="flex items-center justify-center rounded-2xl px-5 py-3"
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))`,
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: `0 8px 32px rgba(0,0,0,0.3)`,
              }}
            >
              <ImageWithFallback
                src={emvLogo}
                alt="XVIII Encuentro Mundial de Valores"
                style={{ height: 36, width: "auto", objectFit: "contain" }}
              />
            </div>
            <div className="text-center mt-2">
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: EMV_BLUE, marginBottom: 4, fontFamily: "var(--font-display)" }}>
                ENCUENTRO MUNDIAL DE VALORES
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: "white", letterSpacing: "-0.02em", fontFamily: "var(--font-display)", lineHeight: 1.2, margin: 0 }}>
                {tab === "login" ? "Bienvenido" : "Únete al EMV"}
              </h1>
            </div>
          </div>

          {/* Tab switcher */}
          <div style={{
            display: "flex", borderRadius: 10,
            background: "rgba(0,0,0,0.3)", padding: 3, marginBottom: 24,
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1, padding: "8px 12px", borderRadius: 8, border: "none",
                  background: tab === t ? "rgba(255,255,255,0.1)" : "transparent",
                  color: tab === t ? "white" : "rgba(255,255,255,0.5)",
                  fontSize: 13, fontWeight: tab === t ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: tab === t ? "0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)" : "none",
                  fontFamily: "var(--font-display)",
                }}
              >
                {t === "login" ? "Iniciar sesión" : "Crear cuenta"}
              </button>
            ))}
          </div>

          {tab === "login" ? (
            <>
              {/* Google login */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                style={{
                  width: "100%", padding: "11px 16px", borderRadius: 10, marginBottom: 16,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.03)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  cursor: "pointer", fontSize: 14, fontWeight: 600, color: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  transition: "all 0.15s",
                  fontFamily: "var(--font-sans)",
                }}
              >
                <GoogleIcon /> Continuar con Google
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>o inicia con correo</span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label htmlFor="email" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>
                    Correo electrónico
                  </label>
                  <input
                    id="email" type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="tu@empresa.com" required
                    style={{
                      width: "100%", padding: "11px 14px", borderRadius: 10,
                      border: `1px solid ${focusedField === "email" ? EMV_BLUE : "rgba(255,255,255,0.12)"}`,
                      background: focusedField === "email" ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                      fontSize: 14, color: "white", outline: "none",
                      transition: "all 0.15s", boxSizing: "border-box",
                      boxShadow: focusedField === "email" ? `0 0 0 3px ${EMV_BLUE}25` : "none",
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="password" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>
                    Contraseña
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="password" type={showPassword ? "text" : "password"} value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="••••••••" required
                      style={{
                        width: "100%", padding: "11px 44px 11px 14px", borderRadius: 10,
                        border: `1px solid ${focusedField === "password" ? EMV_BLUE : "rgba(255,255,255,0.12)"}`,
                        background: focusedField === "password" ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                        fontSize: 14, color: "white", outline: "none",
                        transition: "all 0.15s", boxSizing: "border-box",
                        boxShadow: focusedField === "password" ? `0 0 0 3px ${EMV_BLUE}25` : "none",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer", padding: 4,
                        color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", lineHeight: 0,
                      }}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ width: 15, height: 15, accentColor: EMV_BLUE, cursor: "pointer", opacity: 0.8 }} />
                    Recordar sesión
                  </label>
                  <button type="button" style={{ background: "none", border: "none", fontSize: 13, color: EMV_BLUE, cursor: "pointer", fontWeight: 600, padding: 0 }}>
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <LoginButton isLoading={isLoading} />
              </form>

              {/* Demo credentials */}
              <div style={{ marginTop: 20, padding: "14px 16px", borderRadius: 12, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", marginBottom: 10, fontFamily: "var(--font-display)" }}>
                  ALIADOS — ACCESO AL PORTAL
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {[
                    { emoji: "🤝", name: "Aliado",      email: "aliado@emv.org",      pass: "Aliado2024!" },
                    { emoji: "🌱", name: "Sembrador",   email: "sembrador@emv.org",   pass: "Sembrador2024!" },
                    { emoji: "🧱", name: "Constructor", email: "constructor@emv.org", pass: "Constructor2024!" },
                    { emoji: "🛡", name: "Guardián",    email: "guardian@emv.org",    pass: "Guardian2024!" },
                  ].map((c, i) => (
                    <div key={c.name} className="flex items-center gap-2 px-2.5 py-2 rounded-lg" style={{
                      background: i === 0 ? `${EMV_BLUE}15` : i === 1 ? `${EMV_ORANGE}15` : i === 2 ? `rgba(100,160,220,0.1)` : `${EMV_MAGENTA}15`,
                      border: `1px solid ${i === 0 ? `${EMV_BLUE}30` : i === 1 ? `${EMV_ORANGE}30` : i === 2 ? `rgba(100,160,220,0.2)` : `${EMV_MAGENTA}30`}`,
                    }}>
                      <span style={{ fontSize: 12, flexShrink: 0 }}>{c.emoji}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "white", minWidth: 66, fontFamily: "var(--font-display)" }}>{c.name}</span>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-sans)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.email}</span>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-sans)", flexShrink: 0 }}>{c.pass}</span>
                    </div>
                  ))}
                </div>
                <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "10px 0 8px" }} />
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", marginBottom: 8, fontFamily: "var(--font-display)" }}>
                  ADMINISTRADOR
                </div>
                <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
                  <span style={{ fontSize: 12 }}>⚙️</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "white", minWidth: 66, fontFamily: "var(--font-display)" }}>Admin</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-sans)", flex: 1 }}>admin@emv.org</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-sans)", flexShrink: 0 }}>Admin2024!</span>
                </div>
              </div>
            </>
          ) : (
            <RegisterPanel onRegisterComplete={onRegisterComplete} />
          )}
        </motion.div>

        <div className="text-center mt-5">
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>
            ¿Necesitas ayuda?{" "}
            <button style={{ background: "none", border: "none", color: EMV_BLUE, fontWeight: 600, cursor: "pointer", fontSize: 13, padding: 0, display: "inline-flex", alignItems: "center", gap: 3, verticalAlign: "middle" }}>
              Contacta al equipo EMV <ArrowRight size={12} />
            </button>
          </p>
        </div>
        <div className="text-center mt-3">
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", margin: 0 }}>
            © 2024 Encuentro Mundial de Valores · Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  );
}

type AppView = "auth" | "plans" | "payment" | "portal" | "admin";

export default function App({ initialView = "auth", initialTier = "Constructor" }: { initialView?: AppView, initialTier?: string }) {
  const [view, setView] = useState<AppView>(initialView);
  const [userTier, setUserTier] = useState<TierName>(initialTier as TierName);
  const [page, setPage] = useState<Page>("dashboard");
  const [pendingUser, setPendingUser] = useState({ name: "", email: "" });
  const [selectedPlan, setSelectedPlan] = useState<{ key: string; name: string; price: number; annual: boolean } | null>(null);

  useEffect(() => {
    setView(initialView);
    setUserTier(initialTier as TierName);
  }, [initialView, initialTier]);

  const handleLogout = () => { 
    import("next-auth/react").then(({ signOut }) => signOut({ callbackUrl: "/" }));
    setView("auth"); 
    setPage("dashboard"); 
  };

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 0; height: 0; }
        input::placeholder { color: #C4CDD8; }
      `}</style>

      {view === "auth" ? (
        <div className="flex flex-col md:flex-row min-h-screen w-full bg-[#050505] overflow-hidden">
          <HeroPanel />
          <AuthPanel
            onLogin={(tier) => { setUserTier(tier); setView("portal"); }}
            onAdminLogin={() => setView("admin")}
            onRegisterComplete={(name, email) => {
              setPendingUser({ name, email });
              setView("plans");
            }}
          />
        </div>
      ) : view === "admin" ? (
        <AdminDashboard onBack={handleLogout} />
      ) : view === "plans" ? (
        <SubscriptionPlans
          userName={pendingUser.name}
          onBack={() => setView("portal")}
        />
      ) : page === "library" ? (
        <Library onNavigate={(p: any) => setPage(p)} onLogout={handleLogout} onUpgrade={() => setView("plans")} />
      ) : page === "reports" ? (
        <Reports onNavigate={(p: any) => setPage(p)} onLogout={handleLogout} userTier={userTier} />
      ) : page === "membership" ? (
        <Membership onNavigate={(p: any) => setPage(p)} onLogout={handleLogout} userTier={userTier} onUpgrade={() => setView("plans")} />
      ) : page === "profile" ? (
        <Profile onNavigate={(p: any) => setPage(p)} onLogout={handleLogout} userTier={userTier} />
      ) : (
        <Dashboard onLogout={handleLogout} onNavigate={(p: any) => setPage(p)} userTier={userTier} onUpgrade={() => setView("plans")} />
      )}
    </>
  );
}