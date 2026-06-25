"use client";
import { useState } from "react";
import {
  Bell, ChevronRight,
  Users, Calendar, BookMarked, Globe, Play,
  CheckCircle, Lock, TrendingUp, Star, ArrowUpRight, Video, Download, BookOpen, Award, X,
} from "lucide-react";
import { Sidebar, Page } from "./Sidebar";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { createContext, useContext, useEffect } from "react";
import { getUserDashboardData } from "@/app/actions";

const EMV_BLUE = "#29ABE2";
const EMV_ORANGE = "#F7941D";
const EMV_MAGENTA = "#EC008C";
const BG = "#F4F6F9";

// ── Context ───────────────────────────────────────────────────────────────────
const DashboardDataContext = createContext<any>(null);



// ── Sub-components ────────────────────────────────────────────────────────────

function TopBar({ onShowNotifications }: { onShowNotifications?: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 12,
        marginBottom: 28,
        padding: "0 0 20px",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <button
        onClick={onShowNotifications}
        style={{
          position: "relative",
          width: 36,
          height: 36,
          borderRadius: 10,
          border: "1px solid rgba(0,0,0,0.08)",
          background: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#6B7280",
        }}
      >
        <Bell size={16} />
        <span
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: EMV_MAGENTA,
            border: "1.5px solid white",
          }}
        />
      </button>
      <div style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>
        Junio 2025
      </div>
    </div>
  );
}

function HeroSection({ userTier }: { userTier: TierKey }) {
  const meta = TIER_META[userTier as TierKey] || TIER_META["Sin Membresía"];
  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: "linear-gradient(130deg,#0B2E3E 0%,#1A8CBF 55%,#29ABE2 100%)",
        padding: "36px 40px",
        marginBottom: 24,
      }}
    >
      {/* Decorative shapes */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.1 }}>
        <circle cx="90%" cy="50%" r="180" fill="white" />
        <circle cx="80%" cy="20%" r="80" fill={EMV_ORANGE} />
        <circle cx="95%" cy="80%" r="60" fill={EMV_MAGENTA} />
      </svg>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.05 }}>
        <defs>
          <pattern id="hd" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hd)" />
      </svg>

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, marginBottom: 6, fontFamily: "var(--font-sans)" }}>
            Portal de Aliados · Junio 2025
          </p>
          <h1
            style={{
              color: "white",
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: "-0.025em",
              fontFamily: "var(--font-display)",
              margin: "0 0 8px",
              lineHeight: 1.2,
            }}
          >
            Bienvenido, Empresa XYZ
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, fontFamily: "var(--font-sans)", margin: 0 }}>
            Gracias por construir una cultura basada en valores junto al EMV.
          </p>

          <div className="flex items-center gap-3 mt-5">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              <span style={{ fontSize: 18 }}>{meta.emoji}</span>
              <div>
                <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em" }}>NIVEL ACTUAL</div>
                <div style={{ color: "white", fontSize: 14, fontWeight: 800, fontFamily: "var(--font-display)" }}>{userTier}</div>
              </div>
            </div>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 18px",
                borderRadius: 10,
                border: "none",
                background: "white",
                color: "#1F2937",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "var(--font-display)",
              }}
            >
              Ver mi impacto <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        {/* Right stat */}
        <div
          className="flex flex-col items-center justify-center rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.18)",
            padding: "24px 32px",
            textAlign: "center",
            minWidth: 180,
          }}
        >
          <TrendingUp size={22} color="rgba(255,255,255,0.7)" style={{ marginBottom: 8 }} />
          <div style={{ color: "white", fontSize: 36, fontWeight: 800, fontFamily: "var(--font-display)", lineHeight: 1 }}>
            94%
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 6, fontFamily: "var(--font-sans)" }}>
            Satisfacción de la comunidad
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICards() {
  const data = useContext(DashboardDataContext);
  
  const kpiCards = [
    { label: "Eventos Asistidos",     value: "0", delta: "0%", icon: Calendar,   color: EMV_ORANGE  },
    { label: "Programas Completados", value: "0", delta: "0%", icon: BookMarked, color: EMV_MAGENTA },
    { label: "Contenido Visto",       value: "0", delta: "0%",  icon: Play,      color: EMV_BLUE    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {kpiCards.map((k) => (
        <div
          key={k.label}
          style={{
            background: "white",
            borderRadius: 16,
            padding: "18px 20px",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: `${k.color}15`,
                border: `1px solid ${k.color}25`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <k.icon size={17} color={k.color} />
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#10B981",
                background: "#ECFDF5",
                padding: "2px 7px",
                borderRadius: 99,
              }}
            >
              {k.delta}
            </span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#1F2937", fontFamily: "var(--font-display)", lineHeight: 1 }}>
            {k.value}
          </div>
          <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4, fontFamily: "var(--font-sans)" }}>
            {k.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function Charts() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, marginBottom: 24 }}>
      <div
        style={{
          background: "white", borderRadius: 16, padding: "24px 28px 12px",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: "0 0 4px", fontFamily: "var(--font-display)" }}>
          Evolución del Impacto 2025
        </h3>
        <p style={{ fontSize: 13, color: "#9CA3AF", margin: "0 0 24px", fontFamily: "var(--font-sans)" }}>
          Requiere históricos en BD
        </p>
        <div style={{ height: 260, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF", fontSize: 13 }}>
          Sin datos suficientes
        </div>
      </div>
    </div>
  );
}

function LatestContent({ onNavigate, onOpenModal }: { onNavigate?: (page: Page) => void; onOpenModal?: (item: any) => void }) {
  const data = useContext(DashboardDataContext);
  const content = data?.content || [];

  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        padding: "24px",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
        marginBottom: 24,
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: 0, fontFamily: "var(--font-display)" }}>
            Contenido Reciente
          </h2>
          <p style={{ fontSize: 12, color: "#9CA3AF", margin: "2px 0 0", fontFamily: "var(--font-sans)" }}>
            Últimas publicaciones de la comunidad
          </p>
        </div>
        <button
          onClick={() => onNavigate?.("library")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 12,
            color: "#6B7280",
            fontWeight: 600,
            background: "none",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 8,
            padding: "6px 12px",
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
          }}
        >
          Ver biblioteca <ArrowUpRight size={13} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {content.length === 0 && <div style={{ fontSize: 13, color: "#9CA3AF" }}>No hay contenido disponible</div>}
        {content.map((c: any) => (
          <div
            key={c.id}
            onClick={() => onOpenModal?.(c)}
            style={{
              borderRadius: 14,
              border: "1px solid rgba(0,0,0,0.07)",
              overflow: "hidden",
              cursor: "pointer",
              transition: "box-shadow 0.2s",
            }}
          >
            {/* Thumbnail */}
            <div style={{ position: "relative", height: 140, background: "#F3F4F6" }}>
              <img
                src={c.thumbnailUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=220&fit=crop&auto=format"}
                alt={c.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  padding: "3px 9px",
                  borderRadius: 99,
                  background: EMV_BLUE,
                  color: "white",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  fontFamily: "var(--font-display)",
                }}
              >
                {c.type}
              </div>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.2s",
                  background: "rgba(0,0,0,0.3)",
                }}
                className="hover:opacity-100"
              >
              </div>
            </div>

            {/* Meta */}
            <div style={{ padding: "14px 16px" }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1F2937",
                  margin: "0 0 8px",
                  lineHeight: 1.35,
                  fontFamily: "var(--font-display)",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {c.title}
              </p>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>{c.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const TIER_META = {
  "Sin Membresía": { level: 0, emoji: "❌", color: "#9CA3AF",   progressPct: 0   },
  Aliado:      { level: 1, emoji: "🤝", color: EMV_BLUE,    progressPct: 25  },
  Sembrador:   { level: 2, emoji: "🌱", color: "#10B981",   progressPct: 50  },
  Constructor: { level: 3, emoji: "🧱", color: EMV_ORANGE,  progressPct: 72  },
  Guardián:    { level: 4, emoji: "🛡", color: EMV_MAGENTA, progressPct: 100 },
} as const;
type TierKey = keyof typeof TIER_META;
const TIER_ORDER: TierKey[] = ["Sin Membresía", "Aliado", "Sembrador", "Constructor", "Guardián"];

const TIER_COLORS: Record<string, string> = {
  "Sin Membresía": "#9CA3AF",
  Aliado: EMV_BLUE,
  Sembrador: "#10B981",
  Constructor: EMV_ORANGE,
  Guardián: EMV_MAGENTA,
};

const TIER_EMOJI: Record<string, string> = {
  "Sin Membresía": "❌",
  Aliado: "🤝",
  Sembrador: "🌱",
  Constructor: "🧱",
  Guardián: "🛡",
};

const TIER_LEVEL: Record<string, number> = {
  "Sin Membresía": 0,
  Aliado: 1,
  Sembrador: 2,
  Constructor: 3,
  Guardián: 4,
};

// Modal de contenido
function ContentModal({ item, onClose, userTier }: { item: any | null; onClose: () => void; userTier: TierKey }) {
  if (!item) return null;
  const tierLevel = TIER_LEVEL[item.tier];
  const userLevel = (TIER_META[userTier as TierKey] || TIER_META["Sin Membresía"]).level;
  const isLocked  = tierLevel > userLevel;
  const color = item.color;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "white", borderRadius: 20, overflow: "hidden",
          width: "100%", maxWidth: 560,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ position: "relative", height: 240 }}>
          <img
            src={item.thumb}
            alt={item.title}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              filter: isLocked ? "blur(6px) brightness(0.6)" : "brightness(0.85)",
            }}
          />
          <div style={{
            position: "absolute", top: 14, left: 14, display: "flex", gap: 8,
          }}>
            <span style={{
              padding: "5px 11px", borderRadius: 99, background: color,
              color: "white", fontSize: 11, fontWeight: 700,
              fontFamily: "var(--font-display)", display: "flex", alignItems: "center", gap: 4,
            }}>
              {item.type}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 14, right: 14,
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(0,0,0,0.5)", border: "none", color: "white",
              fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ×
          </button>
          {isLocked && (
            <div style={{
              position: "absolute", inset: 0, display: "flex",
              alignItems: "center", justifyContent: "center",
              pointerEvents: "none",
            }}>
              <div style={{
                background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12,
                padding: "10px 18px", color: "white", fontFamily: "var(--font-display)",
                fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6,
                pointerEvents: "auto",
              }}>
                <Lock size={14} /> {TIER_EMOJI[item.tier]} Requiere plan {item.tier}
              </div>
            </div>
          )}
        </div>
        <div style={{ padding: "24px 28px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "3px 10px", borderRadius: 99,
              background: `${TIER_COLORS[item.tier]}12`,
              border: `1px solid ${TIER_COLORS[item.tier]}25`,
              color: TIER_COLORS[item.tier], fontSize: 11, fontWeight: 700,
              fontFamily: "var(--font-display)",
            }}>
              {TIER_EMOJI[item.tier]} {item.tier}
            </span>
            <span style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>
              {item.duration}
            </span>
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", margin: 0, fontFamily: "var(--font-display)" }}>
            {item.title}
          </h3>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: "#6B7280", margin: 0, fontFamily: "var(--font-sans)" }}>
            {item.description}
          </p>

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            {!isLocked && (
              <>
                <button style={{
                  flex: 1, padding: "11px 16px", borderRadius: 10, border: "none",
                  background: `linear-gradient(135deg,${color},${color}CC)`,
                  color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer",
                  fontFamily: "var(--font-display)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                  <Play size={15} /> Reproducir
                </button>
                <button style={{
                  padding: "11px 16px", borderRadius: 10,
                  border: `1px solid ${color}40`, background: `${color}08`,
                  color: color, fontSize: 13, fontWeight: 700, cursor: "pointer",
                  fontFamily: "var(--font-display)", display: "flex", alignItems: "center", gap: 6,
                }}>
                  <Download size={14} /> Descargar
                </button>
              </>
            )}
            {isLocked && (
              <button style={{
                flex: 1, padding: "11px 16px", borderRadius: 10, border: "none",
                background: `linear-gradient(135deg,${TIER_COLORS[item.tier]},${TIER_COLORS[item.tier]}CC)`,
                color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer",
                fontFamily: "var(--font-display)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                Mejorar a {item.tier} <ArrowUpRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Modal de notificaciones
function NotificationsModal({ onClose }: { onClose: () => void }) {
  const notifications = [
    { id: 1, title: "Nuevo contenido disponible", message: "Se ha publicado un nuevo webinar sobre liderazgo transformacional.", time: "Hace 2 horas", unread: true },
    { id: 2, title: "Actualización de perfil", message: "Tu perfil de empresa ha sido verificado exitosamente.", time: "Hace 5 horas", unread: true },
    { id: 3, title: "Próximo evento", message: "Recuerda que el EMV 2025 comienza en 30 días.", time: "Hace 1 día", unread: false },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "flex-start", justifyContent: "flex-end", padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "white", borderRadius: 16, overflow: "hidden",
          width: "100%", maxWidth: 400, marginTop: 60, marginRight: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: 0, fontFamily: "var(--font-display)" }}>
            Notificaciones
          </h3>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: "50%", background: "transparent",
              border: "none", color: "#9CA3AF", fontSize: 20, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>
        <div style={{ maxHeight: 400, overflowY: "auto" }}>
          {notifications.map((notif) => (
            <div
              key={notif.id}
              style={{
                padding: "16px 24px",
                borderBottom: "1px solid rgba(0,0,0,0.04)",
                background: notif.unread ? "rgba(41,171,226,0.02)" : "white",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                {notif.unread && (
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: EMV_MAGENTA, marginTop: 4, flexShrink: 0,
                  }} />
                )}
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: 13, fontWeight: 700, color: "#1F2937",
                    margin: "0 0 4px", fontFamily: "var(--font-display)",
                  }}>
                    {notif.title}
                  </p>
                  <p style={{
                    fontSize: 12, color: "#6B7280", margin: "0 0 6px",
                    fontFamily: "var(--font-sans)", lineHeight: 1.4,
                  }}>
                    {notif.message}
                  </p>
                  <span style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>
                    {notif.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 24px", borderTop: "1px solid rgba(0,0,0,0.06)", textAlign: "center" }}>
          <button
            onClick={() => {
              alert("Has visto todas tus notificaciones.");
              onClose();
            }}
            style={{
            fontSize: 12, fontWeight: 700, color: EMV_BLUE,
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "var(--font-display)",
          }}>
            Ver todas las notificaciones
          </button>
        </div>
      </div>
    </div>
  );
}

function MembershipJourney({ userTier, onUpgrade }: { userTier: TierKey; onUpgrade?: () => void }) {
  const meta = TIER_META[userTier as TierKey] || TIER_META["Sin Membresía"];
  const currentLevel  = meta.level;
  const currentColor  = meta.color;
  const nextTier      = TIER_ORDER[currentLevel] as TierKey | undefined; // next index
  const progress      = meta.progressPct;

  return (
    <div style={{
      background: "white", borderRadius: 16, padding: "24px",
      border: "1px solid rgba(0,0,0,0.06)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
      marginBottom: 24,
    }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: 0, fontFamily: "var(--font-display)" }}>
            Tu Camino como Aliado
          </h2>
          <p style={{ fontSize: 12, color: "#9CA3AF", margin: "2px 0 0", fontFamily: "var(--font-sans)" }}>
            Nivel actual: <strong style={{ color: currentColor }}>{userTier}</strong>
            {nextTier && <> · Próximo: <strong style={{ color: TIER_META[nextTier].color }}>{nextTier}</strong></>}
          </p>
        </div>
        {nextTier && (
          <button 
            onClick={onUpgrade}
            style={{
              padding: "7px 16px", borderRadius: 8, border: "none",
              background: `linear-gradient(135deg,${TIER_META[nextTier].color},${TIER_META[nextTier].color}CC)`,
              color: "white", fontSize: 12, fontWeight: 700,
              cursor: "pointer", fontFamily: "var(--font-display)",
              boxShadow: `0 4px 12px ${TIER_META[nextTier].color}35`,
            }}>
            Mejorar a {nextTier} →
          </button>
        )}
      </div>

      <div className="flex items-center">
        {TIER_ORDER.map((tierName, i) => {
          const meta     = TIER_META[tierName];
          const isCurrent = tierName === userTier;
          const isDone    = meta.level < currentLevel;
          const isLocked  = meta.level > currentLevel;

          return (
            <div key={tierName} className="flex items-center" style={{ flex: i < TIER_ORDER.length - 1 ? 1 : "none" }}>
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                padding: "16px 20px", borderRadius: 14, position: "relative", minWidth: 110,
                border: isCurrent ? `2px solid ${meta.color}` : "1px solid rgba(0,0,0,0.07)",
                background: isCurrent ? `${meta.color}0D` : isLocked ? "#FAFAFA" : "white",
                boxShadow: isCurrent ? `0 4px 20px ${meta.color}20` : "none",
              }}>
                {isCurrent && (
                  <div style={{
                    position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
                    background: meta.color, color: "white", fontSize: 9, fontWeight: 800,
                    padding: "2px 8px", borderRadius: 99, letterSpacing: "0.08em",
                    whiteSpace: "nowrap", fontFamily: "var(--font-display)",
                  }}>
                    NIVEL ACTUAL
                  </div>
                )}
                <span style={{ fontSize: 26 }}>{meta.emoji}</span>
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--font-display)", color: isCurrent ? meta.color : isLocked ? "#9CA3AF" : "#374151" }}>
                  {tierName}
                </span>
                {isDone && (
                  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <CheckCircle size={12} color="#10B981" />
                    <span style={{ fontSize: 10, color: "#10B981", fontWeight: 600 }}>Completado</span>
                  </div>
                )}
                {isCurrent && (
                  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Star size={12} color={meta.color} fill={meta.color} />
                    <span style={{ fontSize: 10, color: meta.color, fontWeight: 600 }}>Activo</span>
                  </div>
                )}
                {isLocked && (
                  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Lock size={12} color="#9CA3AF" />
                    <span style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600 }}>Disponible</span>
                  </div>
                )}
              </div>

              {i < TIER_ORDER.length - 1 && (
                <div className="flex-1 flex items-center" style={{ padding: "0 8px" }}>
                  <div style={{
                    height: 2, flex: 1, borderRadius: 2,
                    background: meta.level < currentLevel
                      ? `linear-gradient(90deg,${meta.color},${TIER_META[TIER_ORDER[i + 1]].color}80)`
                      : "rgba(0,0,0,0.08)",
                  }} />
                  <ChevronRight size={14} color={meta.level < currentLevel ? TIER_META[TIER_ORDER[i + 1]].color : "#D1D5DB"} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      {nextTier && (
        <div style={{ marginTop: 20 }}>
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontSize: 12, color: "#6B7280", fontFamily: "var(--font-sans)" }}>Progreso hacia {nextTier}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: TIER_META[nextTier].color, fontFamily: "var(--font-display)" }}>{progress}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 99, background: "#F3F4F6", overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${progress}%`, borderRadius: 99,
              background: `linear-gradient(90deg,${currentColor},${TIER_META[nextTier].color})`,
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────

export function Dashboard({ onLogout, onNavigate, userTier = "Constructor", onUpgrade, email }: {
  onLogout: () => void;
  onNavigate: (p: Page) => void;
  userTier?: TierKey;
  onUpgrade?: () => void;
  email?: string;
}) {
  const [contentModalItem, setContentModalItem] = useState<any | null>(null);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (email) {
      getUserDashboardData(email).then(res => {
        if (res.success) setDashboardData(res.data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [email]);

  const handleOpenContentModal = (item: any) => setContentModalItem(item);
  const handleCloseContentModal = () => setContentModalItem(null);
  const handleOpenNotificationsModal = () => setNotificationsModalOpen(true);
  const handleCloseNotificationsModal = () => setNotificationsModalOpen(false);

  if (loading) {
    return <div style={{ display: "flex", minHeight: "100vh", background: BG, alignItems: "center", justifyContent: "center", color: "#6B7280" }}>Cargando datos...</div>;
  }

  return (
    <DashboardDataContext.Provider value={dashboardData}>
    <div style={{ display: "flex", minHeight: "100vh", background: BG, fontFamily: "var(--font-sans)" }}>
      <Sidebar currentPage="dashboard" onNavigate={onNavigate} onLogout={onLogout} userTier={userTier} />
      <main style={{ marginLeft: 220, flex: 1, padding: "32px 36px 56px", minWidth: 0 }}>
        <TopBar onShowNotifications={handleOpenNotificationsModal} />
        <HeroSection userTier={userTier} />
        <KPICards />
        <Charts />
        <LatestContent onNavigate={onNavigate} onOpenModal={handleOpenContentModal} />
        <MembershipJourney userTier={userTier} onUpgrade={onUpgrade} />
      </main>

      {/* Modals */}
      {contentModalItem && (
        <ContentModal item={contentModalItem} onClose={handleCloseContentModal} userTier={userTier} />
      )}
      {notificationsModalOpen && (
        <NotificationsModal onClose={handleCloseNotificationsModal} />
      )}
    </div>
    </DashboardDataContext.Provider>
  );
}