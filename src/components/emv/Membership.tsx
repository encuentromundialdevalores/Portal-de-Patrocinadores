"use client";
import { useState } from "react";
import {
  Check, X, ArrowUpRight, Star, Zap, ChevronRight, Crown,
  BookOpen, FileText, Users, Award, Calendar, Globe,
  TrendingUp, Shield, Heart, Video, BarChart2, Lock,
} from "lucide-react";
import { Sidebar, Page } from "./Sidebar";

const EMV_BLUE    = "#29ABE2";
const EMV_ORANGE  = "#F7941D";
const EMV_MAGENTA = "#EC008C";
const BG          = "#F4F6F9";

// ── Tier definitions ───────────────────────────────────────────────────────────

interface Tier {
  name:        string;
  emoji:       string;
  price:       string;
  period:      string;
  color:       string;
  darkColor:   string;
  gradient:    string;
  level:       number;
  tagline:     string;
  highlight?:  boolean;
  current?:    boolean;
}

const BASE_TIERS: Omit<Tier, "current" | "highlight">[] = [
  {
    name: "Aliado", emoji: "🤝", level: 1,
    price: "$1,000", period: "MXN / mes",
    color: EMV_BLUE, darkColor: "#1A8CBF",
    gradient: `linear-gradient(135deg, ${EMV_BLUE}, #1A8CBF)`,
    tagline: "Se suma a la causa",
  },
  {
    name: "Sembrador", emoji: "🌱", level: 2,
    price: "$3,000", period: "MXN / mes",
    color: "#10B981", darkColor: "#059669",
    gradient: "linear-gradient(135deg, #10B981, #059669)",
    tagline: "Siembra valores",
  },
  {
    name: "Constructor", emoji: "🧱", level: 3,
    price: "$5,000", period: "MXN / mes",
    color: EMV_ORANGE, darkColor: "#D97706",
    gradient: `linear-gradient(135deg, ${EMV_ORANGE}, #D97706)`,
    tagline: "Construye comunidad",
  },
  {
    name: "Guardián", emoji: "🛡", level: 4,
    price: "$10,000", period: "MXN / mes",
    color: EMV_MAGENTA, darkColor: "#C9006E",
    gradient: `linear-gradient(135deg, ${EMV_MAGENTA}, #C9006E)`,
    tagline: "Protege el legado",
  },
];

function buildTiers(userTier: string): Tier[] {
  return BASE_TIERS.map(t => ({
    ...t,
    current:   t.name === userTier,
    highlight: t.name === userTier,
  }));
}

// ── Benefits matrix ────────────────────────────────────────────────────────────

interface Benefit {
  label:    string;
  icon:     React.ElementType;
  aliado:   boolean | string;
  sembrador:boolean | string;
  constructor: boolean | string;
  guardian: boolean | string;
}

const BENEFITS: Benefit[] = [
  { label: "Portal de Aliados",          icon: Globe,    aliado: true,      sembrador: true,       constructor: true,           guardian: true },
  { label: "Reporte de impacto",         icon: FileText, aliado: "Trimestral",sembrador: "Trimestral",constructor: "Trimestral",    guardian: "Trimestral" },
  { label: "Biblioteca de grabaciones",  icon: Video,    aliado: "1 plática/año",sembrador: "2 pláticas/año",constructor: "3 pláticas/año", guardian: "5 pláticas/año" },
  { label: "Cursos para empleados",      icon: BookOpen, aliado: false,     sembrador: "HCV (10)", constructor: "HCV (10)",     guardian: "HCV + Prosocial (30)" },
  { label: "Menciones en redes",         icon: Heart,    aliado: false,     sembrador: false,      constructor: false,          guardian: true },
  { label: "Boletos para el EMV",        icon: Calendar, aliado: "2 boletos",sembrador: false,      constructor: "% Descuento",  guardian: "5 boletos" },
  { label: "Certificación Empresa Compasiva",icon: Award,aliado: false,     sembrador: false,      constructor: "50% Descuento",guardian: true },
];

// ── Active benefits (for current Constructor tier) ────────────────────────────

const ACTIVE_BENEFITS = [
  { icon: Video,    label: "Webinars",             desc: "Acceso completo a todos los webinars en vivo y grabados",      available: true  },
  { icon: BookOpen, label: "Cursos",               desc: "Catálogo completo de cursos de formación en valores",          available: true  },
  { icon: FileText, label: "Reportes",             desc: "Reportes de impacto personalizados con las métricas de tu empresa", available: true  },
  { icon: Users,    label: "Workshops",            desc: "Talleres presenciales y virtuales de liderazgo y valores",     available: true  },
  { icon: Award,    label: "Certificados",         desc: "1 certificado oficial EMV por periodo de membresía",           available: true  },
  { icon: Heart,    label: "Networking",           desc: "Acceso al foro privado de aliados Constructor",                available: true  },
  { icon: Calendar, label: "Eventos VIP",          desc: "Acceso VIP a eventos presenciales del EMV",                   available: true  },
  { icon: Crown,    label: "Reporte con Branding", desc: "Disponible únicamente en nivel Guardián",                     available: false },
];

// ── Helper: cell renderer ──────────────────────────────────────────────────────

function BenefitCell({ value, color }: { value: boolean | string; color: string }) {
  if (value === false) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <X size={15} color="#D1D5DB" />
      </div>
    );
  }
  if (value === true) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{
          width: 22, height: 22, borderRadius: "50%",
          background: `${color}15`, border: `1px solid ${color}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Check size={12} color={color} strokeWidth={2.5} />
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <span style={{
        fontSize: 11, fontWeight: 600, color,
        background: `${color}10`, border: `1px solid ${color}20`,
        padding: "2px 8px", borderRadius: 99,
        fontFamily: "var(--font-sans)", whiteSpace: "nowrap",
      }}>
        {value}
      </span>
    </div>
  );
}

// ── Section: Hero header ───────────────────────────────────────────────────────

function MembershipHero({ tiers: _tiers, currentTier, onUpgrade }: { tiers: Tier[]; currentTier: Tier; onUpgrade?: () => void }) {
  return (
    <div
      style={{
        position: "relative", borderRadius: 20, overflow: "hidden",
        background: "linear-gradient(130deg, #0B2E3E 0%, #1A6A90 55%, #29ABE2 100%)",
        padding: "32px 36px", marginBottom: 28,
      }}
    >
      {/* Decorative */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.08 }}>
        <circle cx="90%" cy="50%" r="220" fill="white" />
        <circle cx="82%" cy="10%" r="90" fill={EMV_ORANGE} />
      </svg>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.04 }}>
        <defs>
          <pattern id="mp" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mp)" />
      </svg>

      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "var(--font-sans)", marginBottom: 6, letterSpacing: "0.06em" }}>
            MEMBRESÍA ACTUAL · EMPRESA XYZ
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
            <div style={{ fontSize: 36, lineHeight: 1, filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))" }}>
              {currentTier.emoji}
            </div>
            <div>
              <h1 style={{ color: "white", fontSize: 28, fontWeight: 800, fontFamily: "var(--font-display)", margin: 0, letterSpacing: "-0.025em" }}>
                {currentTier.name}
              </h1>
              <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, fontFamily: "var(--font-sans)", marginTop: 2 }}>
                {currentTier.tagline}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{
              padding: "10px 18px", borderRadius: 12,
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
            }}>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, letterSpacing: "0.1em", fontFamily: "var(--font-sans)" }}>CONTRIBUCIÓN MENSUAL</div>
              <div style={{ color: "white", fontSize: 22, fontWeight: 800, fontFamily: "var(--font-display)", lineHeight: 1.2 }}>
                {currentTier.price} <span style={{ fontSize: 13, fontWeight: 500, opacity: 0.7 }}>MXN</span>
              </div>
            </div>
            <div style={{
              padding: "10px 18px", borderRadius: 12,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.14)",
            }}>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, letterSpacing: "0.1em", fontFamily: "var(--font-sans)" }}>PRÓXIMA RENOVACIÓN</div>
              <div style={{ color: "white", fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)", lineHeight: 1.4 }}>
                1 Ago 2025
              </div>
            </div>
            <div style={{
              padding: "10px 18px", borderRadius: 12,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.14)",
            }}>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, letterSpacing: "0.1em", fontFamily: "var(--font-sans)" }}>ESTADO</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ADE80" }} />
                <span style={{ color: "#4ADE80", fontSize: 14, fontWeight: 700, fontFamily: "var(--font-display)" }}>Activo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — upgrade nudge */}
        <div style={{
          padding: "24px 28px", borderRadius: 16,
          background: "rgba(255,255,255,0.09)",
          border: "1px solid rgba(255,255,255,0.16)",
          backdropFilter: "blur(12px)",
          textAlign: "center", minWidth: 220,
        }}>
          {(() => {
            const nextTier = BASE_TIERS.find(t => t.level === currentTier.level + 1);
            if (!nextTier) return (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>🏆</div>
                <div style={{ color: "white", fontSize: 14, fontWeight: 800, fontFamily: "var(--font-display)", marginBottom: 4 }}>
                  Nivel máximo alcanzado
                </div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, fontFamily: "var(--font-sans)", lineHeight: 1.4 }}>
                  Eres parte de la élite de aliados EMV
                </div>
              </div>
            );
            return (
              <>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{nextTier.emoji}</div>
                <div style={{ color: "white", fontSize: 14, fontWeight: 800, fontFamily: "var(--font-display)", marginBottom: 4 }}>
                  Próximo nivel: {nextTier.name}
                </div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, fontFamily: "var(--font-sans)", marginBottom: 14, lineHeight: 1.4 }}>
                  {nextTier.price} MXN/mes · Desbloquea beneficios exclusivos
                </div>
                <button onClick={onUpgrade} style={{
                  width: "100%", padding: "10px 0", borderRadius: 10, border: "none",
                  background: nextTier.color, color: "white", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", fontFamily: "var(--font-display)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  boxShadow: `0 4px 16px ${nextTier.color}50`,
                }}>
                  Mejorar ahora <ArrowUpRight size={15} />
                </button>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

// ── Section: Progression roadmap ───────────────────────────────────────────────

function ProgressionRoadmap({ tiers, currentTier }: { tiers: Tier[]; currentTier: Tier }) {
  return (
    <div style={{
      background: "white", borderRadius: 18, padding: "26px 28px", marginBottom: 28,
      border: "1px solid rgba(0,0,0,0.07)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: 0, fontFamily: "var(--font-display)" }}>
            Tu Camino como Aliado
          </h2>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0", fontFamily: "var(--font-sans)" }}>
            Progresión de membresía · Estás en <strong style={{ color: currentTier.color }}>{currentTier.name}</strong>
          </p>
        </div>
        {/* Progress bar */}
        {currentTier.level < 4 && (() => {
          const nextT = tiers.find(t => t.level === currentTier.level + 1)!;
          const pct   = [25, 50, 72, 100][currentTier.level - 1];
          return (
            <div style={{ minWidth: 240 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>Progreso hacia {nextT.name}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: nextT.color, fontFamily: "var(--font-display)" }}>{pct}%</span>
              </div>
              <div style={{ height: 6, borderRadius: 99, background: "#F3F4F6", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, background: `linear-gradient(90deg, ${currentTier.color}, ${nextT.color})` }} />
              </div>
            </div>
          );
        })()}
      </div>

      {/* Steps */}
      <div style={{ display: "flex", alignItems: "stretch" }}>
        {tiers.map((tier, i) => {
          const done    = tier.level < currentTier.level;
          const current = tier.current;
          const locked  = tier.level > currentTier.level;

          return (
            <div key={tier.name} style={{ display: "flex", alignItems: "center", flex: i < tiers.length - 1 ? 1 : "none" }}>
              {/* Card */}
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                padding: "20px 24px", borderRadius: 16, minWidth: 130,
                background: current
                  ? `linear-gradient(145deg, ${tier.color}14, ${tier.color}06)`
                  : locked ? "#FAFAFA" : "white",
                border: current
                  ? `2px solid ${tier.color}`
                  : locked ? "1px solid rgba(0,0,0,0.06)"
                  : "1px solid rgba(0,0,0,0.08)",
                boxShadow: current ? `0 4px 20px ${tier.color}20` : "none",
                position: "relative",
              }}>
                {current && (
                  <div style={{
                    position: "absolute", top: -11, left: "50%",
                    transform: "translateX(-50%)",
                    background: tier.color, color: "white",
                    fontSize: 9, fontWeight: 800, padding: "2px 9px",
                    borderRadius: 99, letterSpacing: "0.08em", whiteSpace: "nowrap",
                    fontFamily: "var(--font-display)",
                  }}>
                    NIVEL ACTUAL
                  </div>
                )}

                {/* Icon circle */}
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: done
                    ? tier.gradient
                    : current ? `${tier.color}20`
                    : "#F3F4F6",
                  border: current ? `2px solid ${tier.color}` : done ? "none" : "1px solid rgba(0,0,0,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22,
                  boxShadow: done ? `0 4px 12px ${tier.color}35` : "none",
                }}>
                  {tier.emoji}
                </div>

                <div style={{
                  fontSize: 14, fontWeight: 800, fontFamily: "var(--font-display)",
                  color: current ? tier.color : locked ? "#9CA3AF" : "#374151",
                }}>
                  {tier.name}
                </div>

                <div style={{ fontSize: 12, fontWeight: 700, color: locked ? "#C4C9D4" : "#6B7280", fontFamily: "var(--font-display)" }}>
                  {tier.price}
                  <span style={{ fontSize: 10, fontWeight: 400, color: "#9CA3AF" }}>/mes</span>
                </div>

                {/* Status pill */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "3px 8px", borderRadius: 99, fontSize: 10, fontWeight: 600,
                  background: done ? "#ECFDF5" : current ? `${tier.color}12` : "#F9FAFB",
                  color: done ? "#10B981" : current ? tier.color : "#9CA3AF",
                  fontFamily: "var(--font-sans)",
                }}>
                  {done ? <><Check size={10} />Completado</> : current ? <><Star size={10} />Activo</> : <><Lock size={10} />Disponible</>}
                </div>
              </div>

              {/* Connector */}
              {i < tiers.length - 1 && (
                <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 8px", marginBottom: 14 }}>
                  <div style={{
                    height: 2, flex: 1, borderRadius: 2,
                    background: i < 2
                      ? `linear-gradient(90deg, ${tiers[i].color}, ${tiers[i + 1].color}80)`
                      : "rgba(0,0,0,0.07)",
                  }} />
                  <ChevronRight size={14} color={tiers[i].level < currentTier.level ? tiers[i + 1].color : "#D1D5DB"} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Section: Active benefits ───────────────────────────────────────────────────

function ActiveBenefits({ currentTier, onUpgrade, onNavigate }: { currentTier: Tier; onUpgrade?: () => void; onNavigate?: (p: Page) => void }) {
  const activeBenefits = [
    { icon: Globe, label: "Portal de Aliados", desc: "Acceso al portal con usuario y contraseña", available: true, minLevel: 1, page: "dashboard" as Page },
    { icon: FileText, label: "Reporte de Impacto", desc: "Reporte de impacto trimestral del EMV", available: true, minLevel: 1, page: "reports" as Page },
    { icon: Video, label: "Biblioteca de grabaciones", desc: currentTier.level === 1 ? "1 plática al año" : currentTier.level === 2 ? "2 pláticas al año" : currentTier.level === 3 ? "3 pláticas al año" : "5 pláticas al año", available: true, minLevel: 1, page: "library" as Page },
    { icon: BookOpen, label: "Cursos para empleados", desc: currentTier.level <= 3 ? 'Curso HCV (10 colaboradores)' : 'Cursos HCV y Prosocial (30 colaboradores)', available: currentTier.level >= 2, minLevel: 2, page: "library" as Page },
    { icon: Heart, label: "Menciones en redes", desc: "Menciones exclusivas en redes sociales del EMV", available: currentTier.level >= 4, minLevel: 4, page: "dashboard" as Page },
    { icon: Calendar, label: "Boletos EMV", desc: currentTier.level === 1 ? "2 boletos para el evento anual" : currentTier.level === 3 ? "Descuento en boletos del evento anual" : currentTier.level === 4 ? "5 boletos para el evento anual" : "No disponible en nivel Sembrador", available: currentTier.level === 1 || currentTier.level >= 3, minLevel: 3, page: "dashboard" as Page },
    { icon: Award, label: "Certificación Empresa Compasiva", desc: currentTier.level === 3 ? "50% de descuento en Certificación" : currentTier.level === 4 ? "Certificación Internacional completa" : "Requiere nivel Constructor o Guardián", available: currentTier.level >= 3, minLevel: 3, page: "dashboard" as Page },
  ];

  const activeCount = activeBenefits.filter(b => b.available).length;
  const totalCount = activeBenefits.length;

  return (
    <div style={{
      background: "white", borderRadius: 18, padding: "26px 28px", marginBottom: 28,
      border: "1px solid rgba(0,0,0,0.07)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: 0, fontFamily: "var(--font-display)" }}>
            Beneficios Incluidos
          </h2>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0", fontFamily: "var(--font-sans)" }}>
            Nivel {currentTier.name} · {activeCount} de {totalCount} beneficios activos
          </p>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 14px", borderRadius: 99,
          background: "#ECFDF5", border: "1px solid #6EE7B7",
          fontSize: 12, fontWeight: 700, color: "#10B981",
          fontFamily: "var(--font-display)",
        }}>
          <Check size={13} /> {activeCount} activos
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {activeBenefits.map(b => (
          <div key={b.label} style={{
            padding: "18px 16px", borderRadius: 14,
            background: b.available ? "white" : "#FAFAFA",
            border: `1px solid ${b.available ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.05)"}`,
            opacity: b.available ? 1 : 0.7,
            position: "relative",
          }}>
            {/* Status indicator */}
            <div style={{ position: "absolute", top: 12, right: 12 }}>
              {b.available ? (
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  background: "#ECFDF5", border: "1px solid #6EE7B7",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Check size={11} color="#10B981" strokeWidth={2.5} />
                </div>
              ) : (
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  background: "#F9FAFB", border: "1px solid #E5E7EB",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Lock size={10} color="#9CA3AF" />
                </div>
              )}
            </div>

            <div style={{
              width: 40, height: 40, borderRadius: 11, marginBottom: 12,
              background: b.available ? `${EMV_ORANGE}12` : "#F3F4F6",
              border: `1px solid ${b.available ? `${EMV_ORANGE}22` : "rgba(0,0,0,0.06)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <b.icon size={18} color={b.available ? EMV_ORANGE : "#9CA3AF"} />
            </div>

            <div style={{
              fontSize: 13, fontWeight: 700, fontFamily: "var(--font-display)",
              color: b.available ? "#1F2937" : "#9CA3AF", marginBottom: 5,
            }}>
              {b.label}
            </div>
            <div style={{
              fontSize: 11, color: b.available ? "#6B7280" : "#C4C9D4",
              fontFamily: "var(--font-sans)", lineHeight: 1.45,
            }}>
              {b.desc}
            </div>

            {b.available ? (
              <button onClick={() => onNavigate && onNavigate(b.page)} style={{
                marginTop: 12, width: "100%", padding: "6px 0", borderRadius: 8,
                border: `1px solid ${EMV_ORANGE}25`, background: `${EMV_ORANGE}08`,
                color: EMV_ORANGE, fontSize: 11, fontWeight: 600,
                cursor: "pointer", fontFamily: "var(--font-sans)",
              }}>
                Acceder →
              </button>
            ) : (
              <button onClick={onUpgrade} style={{
                marginTop: 12, width: "100%", padding: "6px 0", borderRadius: 8,
                border: `1px solid ${EMV_MAGENTA}25`, background: `${EMV_MAGENTA}08`,
                color: EMV_MAGENTA, fontSize: 11, fontWeight: 600,
                cursor: "pointer", fontFamily: "var(--font-sans)",
              }}>
                Mejorar a {BASE_TIERS.find(t => t.level === b.minLevel)?.name || "nivel superior"} →
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Section: Comparison table ──────────────────────────────────────────────────

function ComparisonTable({ tiers, currentTier, onUpgrade }: { tiers: Tier[]; currentTier: Tier; onUpgrade?: () => void }) {
  const [hoveredTier, setHoveredTier] = useState<number | null>(null);

  return (
    <div style={{
      background: "white", borderRadius: 18, overflow: "hidden",
      border: "1px solid rgba(0,0,0,0.07)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
      marginBottom: 28,
    }}>
      {/* Section header */}
      <div style={{ padding: "24px 28px 0" }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: "0 0 4px", fontFamily: "var(--font-display)" }}>
          Comparar Planes
        </h2>
        <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 20px", fontFamily: "var(--font-sans)" }}>
          Elige el nivel que mejor se adapta a los objetivos de tu empresa
        </p>
      </div>

      <div>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "28%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "18%" }} />
          </colgroup>
          {/* Tier header row */}
          <thead>
            <tr>
              {/* Empty first cell */}
              <th style={{ padding: "0 20px 20px 28px", verticalAlign: "bottom", textAlign: "left" }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", fontFamily: "var(--font-sans)", letterSpacing: "0.08em" }}>
                  BENEFICIO
                </span>
              </th>

              {tiers.map(tier => (
                <th
                  key={tier.name}
                  onMouseEnter={() => setHoveredTier(tier.level)}
                  onMouseLeave={() => setHoveredTier(null)}
                  style={{
                    padding: "0 12px 0",
                    verticalAlign: "bottom",
                    cursor: "default",
                    transition: "background 0.15s",
                  }}
                >
                  <div style={{
                    padding: "20px 10px 18px",
                    borderRadius: "14px 14px 0 0",
                    background: tier.current
                      ? tier.gradient
                      : hoveredTier === tier.level
                      ? `${tier.color}08`
                      : "transparent",
                    transition: "background 0.2s",
                    textAlign: "center",
                    position: "relative",
                  }}>
                    {tier.highlight && (
                      <div style={{
                        position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
                        background: tier.color, color: "white",
                        fontSize: 9, fontWeight: 800, padding: "2px 10px", borderRadius: 99,
                        letterSpacing: "0.08em", whiteSpace: "nowrap",
                        fontFamily: "var(--font-display)",
                        boxShadow: `0 2px 8px ${tier.color}40`,
                      }}>
                        {tier.current ? "TU PLAN" : "RECOMENDADO"}
                      </div>
                    )}
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{tier.emoji}</div>
                    <div style={{
                      fontSize: 15, fontWeight: 800, fontFamily: "var(--font-display)",
                      color: tier.current ? "white" : "#1F2937", marginBottom: 2,
                    }}>
                      {tier.name}
                    </div>
                    <div style={{ fontSize: 10, color: tier.current ? "rgba(255,255,255,0.7)" : "#6B7280", fontFamily: "var(--font-sans)", marginBottom: 10 }}>
                      {tier.tagline}
                    </div>
                    <div style={{
                      fontSize: 20, fontWeight: 800, fontFamily: "var(--font-display)",
                      color: tier.current ? "white" : tier.color, lineHeight: 1,
                    }}>
                      {tier.price}
                    </div>
                    <div style={{ fontSize: 10, color: tier.current ? "rgba(255,255,255,0.65)" : "#9CA3AF", fontFamily: "var(--font-sans)", marginBottom: 14 }}>
                      {tier.period}
                    </div>

                    {tier.current ? (
                      <div style={{
                        padding: "7px 0", borderRadius: 8,
                        background: "rgba(255,255,255,0.2)",
                        color: "white", fontSize: 12, fontWeight: 700,
                        fontFamily: "var(--font-display)",
                      }}>
                        Plan actual ✓
                      </div>
                    ) : tier.level > currentTier.level ? (
                      <button onClick={onUpgrade} style={{
                        padding: "6px 14px", borderRadius: 8, border: "none",
                        background: tier.color, color: "white",
                        fontSize: 12, fontWeight: 700, cursor: "pointer",
                        fontFamily: "var(--font-display)",
                        boxShadow: `0 2px 8px ${tier.color}35`,
                      }}>
                        Mejorar →
                      </button>
                    ) : (
                      <div style={{
                        padding: "7px 0", borderRadius: 8,
                        background: "#ECFDF5",
                        color: "#10B981", fontSize: 11, fontWeight: 700,
                        fontFamily: "var(--font-display)",
                      }}>
                        <Check size={12} style={{ display: "inline", marginRight: 4 }} />
                        Completado
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {BENEFITS.map((b, ri) => (
              <tr
                key={b.label}
                style={{
                  background: ri % 2 === 0 ? "white" : "#FAFAFA",
                  borderTop: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                {/* Benefit label */}
                <td style={{ padding: "11px 20px 11px 28px", fontFamily: "var(--font-sans)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 7,
                      background: "#F3F4F6", border: "1px solid rgba(0,0,0,0.06)",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <b.icon size={13} color="#6B7280" />
                    </div>
                    <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{b.label}</span>
                  </div>
                </td>

                {/* Tier cells */}
                {[
                  { key: "aliado",       tier: tiers[0] },
                  { key: "sembrador",    tier: tiers[1] },
                  { key: "constructor",  tier: tiers[2] },
                  { key: "guardian",     tier: tiers[3] },
                ].map(({ key, tier }) => (
                  <td
                    key={key}
                    style={{
                      padding: "11px 8px", textAlign: "center",
                      background: tier.current
                        ? `${tier.color}05`
                        : hoveredTier === tier.level
                        ? `${tier.color}04`
                        : "transparent",
                      borderLeft: tier.current ? `1px solid ${tier.color}20` : "none",
                      borderRight: tier.current ? `1px solid ${tier.color}20` : "none",
                      transition: "background 0.15s",
                    }}
                  >
                    <BenefitCell value={(b as any)[key]} color={tier.color} />
                  </td>
                ))}
              </tr>
            ))}

            {/* Bottom CTA row */}
            <tr style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>
              <td style={{ padding: "16px 28px" }} />
              {tiers.map(tier => (
                <td key={tier.name} style={{
                  padding: "16px 8px", textAlign: "center",
                  background: tier.current ? `${tier.color}05` : "transparent",
                  borderLeft: tier.current ? `1px solid ${tier.color}20` : "none",
                  borderRight: tier.current ? `1px solid ${tier.color}20` : "none",
                  borderBottom: tier.current ? `1px solid ${tier.color}20` : "none",
                }}>
                  {tier.current ? (
                    <div style={{
                      padding: "9px 0", borderRadius: 10,
                      background: `${tier.color}15`, border: `1px solid ${tier.color}25`,
                      color: tier.color, fontSize: 12, fontWeight: 700,
                      fontFamily: "var(--font-display)",
                    }}>
                      Plan actual
                    </div>
                  ) : tier.level < currentTier.level ? (
                    <div style={{
                      padding: "9px 0", borderRadius: 10,
                      background: "#F9FAFB",
                      color: "#9CA3AF", fontSize: 11, fontWeight: 600,
                      fontFamily: "var(--font-sans)",
                    }}>
                      Ya completado
                    </div>
                  ) : (
                    <button onClick={onUpgrade} style={{
                      width: "100%", padding: "10px 0", borderRadius: 10, border: "none",
                      background: tier.gradient,
                      color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer",
                      fontFamily: "var(--font-display)",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      boxShadow: `0 4px 14px ${tier.color}40`,
                    }}>
                      Mejorar a {tier.name} <ArrowUpRight size={14} />
                    </button>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────

interface Props {
  onNavigate: (p: Page) => void;
  onLogout:   () => void;
  userTier:   string;
  onUpgrade?: () => void;
}

export function Membership({ onNavigate, onLogout, userTier, onUpgrade }: Props) {
  const tiers = buildTiers(userTier);
  const currentTier = tiers.find(t => t.current)!;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#F4F6F9" }}>
      <Sidebar currentPage="membership" onNavigate={onNavigate} onLogout={onLogout} userTier={userTier} />
      <main style={{ flex: 1, marginLeft: 220, overflowY: "auto", padding: "32px 40px" }}>
        <MembershipHero tiers={tiers} currentTier={currentTier} onUpgrade={onUpgrade} />
        <ProgressionRoadmap tiers={tiers} currentTier={currentTier} />
        <ActiveBenefits currentTier={currentTier} onUpgrade={onUpgrade} onNavigate={onNavigate} />
        <ComparisonTable tiers={tiers} currentTier={currentTier} onUpgrade={onUpgrade} />
      </main>
    </div>
  );
}