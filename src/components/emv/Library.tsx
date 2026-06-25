"use client";
import { useState, useMemo, useEffect } from "react";
import {
  Search, Clock, Play, FileText, Award, BookOpen, Video,
  Lock, ArrowUpRight, Filter, ChevronDown, Star, Eye, CalendarClock, Sparkles,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import { getContent } from "@/app/actions";

const EMV_BLUE = "#29ABE2";
const EMV_ORANGE = "#F7941D";
const EMV_MAGENTA = "#EC008C";
const BG = "#F4F6F9";

// ── Types ─────────────────────────────────────────────────────────────────────

type Category = "Todos" | "Videos" | "Cursos" | "Webinars" | "Certificados" | "Reportes";
type SortKey  = "Más recientes" | "Más vistos";
type TierName = "Sin Membresía" | "Aliado" | "Sembrador" | "Constructor" | "Guardián";

const USER_TIER_LEVEL = 3; // Constructor

const TIER_COLORS: Record<TierName, string> = {
  "Sin Membresía": "#9CA3AF",
  Aliado:      EMV_BLUE,
  Sembrador:   "#10B981",
  Constructor: EMV_ORANGE,
  Guardián:    EMV_MAGENTA,
};

const TIER_EMOJI: Record<TierName, string> = {
  "Sin Membresía": "❌",
  Aliado:      "🤝",
  Sembrador:   "🌱",
  Constructor: "🧱",
  Guardián:    "🛡",
};

const TIER_LEVEL: Record<TierName, number> = {
  "Sin Membresía": 0,
  Aliado: 1,
  Sembrador: 2,
  Constructor: 3,
  Guardián: 4,
};

interface ContentItem {
  id: string;
  title: string;
  category: Exclude<Category, "Todos">;
  description: string;
  tier: TierName;
  duration: string;
  views: number;
  date: string;
  thumb: string;
  featured?: boolean;
}

// ── Category icons ─────────────────────────────────────────────────────────────

const CAT_ICON: Record<Exclude<Category, "Todos">, React.ElementType> = {
  Videos:       Video,
  Cursos:       BookOpen,
  Webinars:     Play,
  Certificados: Award,
  Reportes:     FileText,
};

const CAT_COLOR: Record<Exclude<Category, "Todos">, string> = {
  Videos:       EMV_BLUE,
  Cursos:       "#10B981",
  Webinars:     EMV_ORANGE,
  Certificados: EMV_MAGENTA,
  Reportes:     "#8B5CF6",
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function ContentCard({ item, onClick, onAction }: { item: ContentItem; onClick?: () => void; onAction?: () => void }) {
  const tierLevel  = TIER_LEVEL[item.tier];
  const isLocked   = tierLevel > USER_TIER_LEVEL;
  const CatIcon    = CAT_ICON[item.category];
  const catColor   = CAT_COLOR[item.category];
  const tierColor  = TIER_COLORS[item.tier];

  return (
    <div
      onClick={onClick}
      style={{
        background: "white",
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.2s, transform 0.2s",
        position: "relative",
        cursor: "pointer",
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: "relative", height: 172, background: "#E5E7EB", flexShrink: 0 }}>
        <img
          src={item.thumb}
          alt={item.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: isLocked ? "blur(6px) brightness(0.7)" : "none",
            transform: isLocked ? "scale(1.05)" : "none",
            transition: "filter 0.3s",
          }}
        />

        {/* Category pill */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "4px 9px",
            borderRadius: 99,
            background: isLocked ? "rgba(0,0,0,0.5)" : catColor,
            color: "white",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.05em",
            fontFamily: "var(--font-display)",
            backdropFilter: "blur(4px)",
          }}
        >
          <CatIcon size={10} />
          {item.category}
        </div>

        {/* Duration */}
        {!isLocked && (
          <div
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "3px 8px",
              borderRadius: 99,
              background: "rgba(0,0,0,0.55)",
              color: "white",
              fontSize: 10,
              fontWeight: 600,
              fontFamily: "var(--font-sans)",
              backdropFilter: "blur(4px)",
            }}
          >
            <Clock size={9} />
            {item.duration}
          </div>
        )}

        {/* Lock overlay */}
        {isLocked && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Lock size={16} color="white" />
            </div>
            <div
              style={{
                padding: "4px 10px",
                borderRadius: 99,
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(8px)",
                color: "white",
                fontSize: 11,
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                pointerEvents: "auto",
              }}
            >
              {TIER_EMOJI[item.tier]} Disponible para {item.tier}
            </div>
          </div>
        )}

        {/* Featured badge */}
        {item.featured && !isLocked && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              display: "flex",
              alignItems: "center",
              gap: 3,
              padding: "3px 8px",
              borderRadius: 99,
              background: EMV_ORANGE,
              color: "white",
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.08em",
              fontFamily: "var(--font-display)",
            }}
          >
            <Star size={8} fill="white" />
            DESTACADO
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Tier badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "2px 8px",
              borderRadius: 99,
              background: `${tierColor}12`,
              border: `1px solid ${tierColor}25`,
              fontSize: 10,
              fontWeight: 700,
              color: isLocked ? "#9CA3AF" : tierColor,
              fontFamily: "var(--font-display)",
            }}
          >
            {TIER_EMOJI[item.tier]} {item.tier}
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              fontSize: 11,
              color: "#9CA3AF",
              fontFamily: "var(--font-sans)",
            }}
          >
            <Eye size={11} /> {item.views.toLocaleString()}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: isLocked ? "#9CA3AF" : "#1F2937",
            fontFamily: "var(--font-display)",
            margin: 0,
            lineHeight: 1.35,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: 12,
            color: isLocked ? "#C4C9D4" : "#6B7280",
            fontFamily: "var(--font-sans)",
            margin: 0,
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            flex: 1,
          }}
        >
          {item.description}
        </p>

        {/* Date */}
        <div style={{ fontSize: 11, color: "#C4C9D4", fontFamily: "var(--font-sans)" }}>
          {item.date}
        </div>

        {/* CTA */}
        {isLocked ? (
          <button
            onClick={(e) => { e.stopPropagation(); onAction?.(); }}
            style={{
              width: "100%",
              padding: "9px 0",
              borderRadius: 10,
              border: `1px solid ${EMV_MAGENTA}30`,
              background: `${EMV_MAGENTA}08`,
              color: EMV_MAGENTA,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "var(--font-display)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <ArrowUpRight size={13} />
            Mejorar a {item.tier}
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction?.();
              window.open("https://youtube.com", "_blank"); // Simulates external content
            }}
            style={{
              width: "100%",
              padding: "9px 0",
              borderRadius: 10,
              border: "none",
              background: EMV_BLUE,
              color: "white",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "var(--font-display)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              boxShadow: `0 2px 8px ${EMV_BLUE}30`,
            }}
          >
            <CatIcon size={13} />
            {item.category === "Reportes" ? "Descargar" : item.category === "Certificados" ? "Ver certificado" : "Acceder"}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Countdown data & component ────────────────────────────────────────────────

interface UpcomingVideo {
  id: string | number;
  title: string;
  description: string;
  type: Exclude<Category, "Todos">;
  tier: "Sin Membresía" | "Aliado" | "Sembrador" | "Constructor" | "Guardián";
  unlockDate: Date;
  thumb: string;
  duration: string;
  speaker: string;
}

function CountdownCard({ video, onNotify, onClick }: { video: UpcomingVideo; onNotify?: () => void; onClick?: () => void }) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    const calculateTime = () => {
      const diff = video.unlockDate.getTime() - new Date().getTime();
      if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
      return {
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / 1000 / 60) % 60),
        s: Math.floor((diff / 1000) % 60),
      };
    };

    setTimeLeft(calculateTime());
    const timer = setInterval(() => setTimeLeft(calculateTime()), 1000);
    return () => clearInterval(timer);
  }, [video.unlockDate]);

  if (!timeLeft) return null;

  return (
    <div
      onClick={onClick}
      style={{
        background: "white", borderRadius: 16, overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
        display: "flex", flexDirection: "column",
        cursor: "pointer",
      }}
    >
      <div style={{ position: "relative", height: 180, background: "#E5E7EB", flexShrink: 0 }}>
        <img
          src={video.thumb}
          alt={video.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.6)" }}
        />
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6 }}>
          <span style={{
            padding: "4px 9px", borderRadius: 99, background: CAT_COLOR[video.type],
            color: "white", fontSize: 10, fontWeight: 700, letterSpacing: "0.05em",
            fontFamily: "var(--font-display)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <CalendarClock size={10} /> {video.type}
          </span>
          <span style={{
            padding: "4px 9px", borderRadius: 99, background: "rgba(0,0,0,0.5)",
            color: "white", fontSize: 10, fontWeight: 700, letterSpacing: "0.05em",
            fontFamily: "var(--font-display)", backdropFilter: "blur(4px)",
          }}>
            {video.unlockDate.toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
          </span>
        </div>
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Lock size={15} color="white" />
          </div>
          <div style={{
            fontSize: 12, fontWeight: 700, color: "white", fontFamily: "var(--font-display)",
            background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.18)", padding: "4px 12px", borderRadius: 99,
          }}>
            Disponible el {video.unlockDate.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { label: "d", value: timeLeft.d },
              { label: "h", value: timeLeft.h },
              { label: "m", value: timeLeft.m },
              { label: "s", value: timeLeft.s },
            ].map(unit => (
              <div key={unit.label} style={{
                background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8,
                padding: "6px 8px", minWidth: 42, textAlign: "center",
              }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "white", fontFamily: "var(--font-display)", lineHeight: 1 }}>
                  {unit.value.toString().padStart(2, "0")}
                </div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.8)", marginTop: 2, fontFamily: "var(--font-sans)", textTransform: "uppercase" }}>
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: "16px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px",
          borderRadius: 99, background: `${TIER_COLORS[video.tier]}12`, border: `1px solid ${TIER_COLORS[video.tier]}25`,
          color: TIER_COLORS[video.tier], fontSize: 10, fontWeight: 700, fontFamily: "var(--font-display)", alignSelf: "flex-start",
        }}>
          {TIER_EMOJI[video.tier]} {video.tier}
        </span>
        <h3 style={{
          fontSize: 13, fontWeight: 700, color: "#6B7280", margin: 0,
          fontFamily: "var(--font-display)", lineHeight: 1.35, display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {video.title}
        </h3>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: "#C4C9D4", fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", gap: 4 }}>
            <Clock size={10} /> {video.duration}
          </span>
          <span style={{ fontSize: 11, color: "#C4C9D4", fontFamily: "var(--font-sans)" }}>{video.speaker}</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onNotify?.(); }}
          style={{
            width: "100%", padding: "8px 0", borderRadius: 9,
            border: "1px solid rgba(0,0,0,0.08)", background: "#F9FAFB",
            color: "#6B7280", fontSize: 11, fontWeight: 600, cursor: "pointer",
            fontFamily: "var(--font-sans)", display: "flex", alignItems: "center",
            justifyContent: "center", gap: 5,
          }}
        >
          🔔 Avisarme cuando esté disponible
        </button>
      </div>
    </div>
  );
}

function UpcomingSection({ onNotify, videos }: { onNotify: () => void; videos: UpcomingVideo[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: `${EMV_ORANGE}15`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <CalendarClock size={18} color={EMV_ORANGE} />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#1F2937", fontFamily: "var(--font-display)" }}>
            Próximamente
          </h2>
          <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>
            Contenido que se desbloqueará próximamente
          </p>
        </div>
      </div>
      {videos.length === 0 ? (
        <div style={{ padding: "32px 0", textAlign: "center", fontSize: 13, color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>
          No hay contenido programado por ahora.
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
        }}>
          {videos.map(video => (
            <CountdownCard key={video.id} video={video} onNotify={onNotify} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Content Detail Modal ───────────────────────────────────────────────────────

function ContentModal({ item, onClose, onUpgrade }: { item: ContentItem | null; onClose: () => void; onUpgrade?: () => void }) {
  if (!item) return null;
  const tierLevel = TIER_LEVEL[item.tier];
  const isLocked  = tierLevel > USER_TIER_LEVEL;
  const CatIcon    = CAT_ICON[item.category];
  const catColor   = CAT_COLOR[item.category];

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
              padding: "5px 11px", borderRadius: 99, background: catColor,
              color: "white", fontSize: 11, fontWeight: 700,
              fontFamily: "var(--font-display)", display: "flex", alignItems: "center", gap: 4,
            }}>
              <CatIcon size={11} /> {item.category}
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
            }}>
              <div style={{
                background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12,
                padding: "10px 18px", color: "white", fontFamily: "var(--font-display)",
                fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6,
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
            <span style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", gap: 4 }}>
              <Clock size={12} /> {item.duration}
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#1F2937", fontFamily: "var(--font-display)", lineHeight: 1.3 }}>
            {item.title}
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: "#6B7280", fontFamily: "var(--font-sans)", lineHeight: 1.6 }}>
            {item.description}
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            {isLocked ? (
              <button
                onClick={onUpgrade}
                style={{
                  flex: 1, padding: "12px 0", borderRadius: 12,
                  border: "none", background: EMV_MAGENTA, color: "white",
                  fontSize: 14, fontWeight: 700, cursor: "pointer",
                  fontFamily: "var(--font-display)", display: "flex",
                  alignItems: "center", justifyContent: "center", gap: 6,
                  boxShadow: `0 4px 14px ${EMV_MAGENTA}30`,
                }}
              >
                <ArrowUpRight size={16} /> Mejorar a {item.tier}
              </button>
            ) : (
              <button
                style={{
                  flex: 1, padding: "12px 0", borderRadius: 12,
                  border: "none", background: EMV_BLUE, color: "white",
                  fontSize: 14, fontWeight: 700, cursor: "pointer",
                  fontFamily: "var(--font-display)", display: "flex",
                  alignItems: "center", justifyContent: "center", gap: 6,
                  boxShadow: `0 4px 14px ${EMV_BLUE}30`,
                }}
              >
                <CatIcon size={16} />
                {item.category === "Reportes" ? "Descargar" : item.category === "Certificados" ? "Ver certificado" : "Acceder al contenido"}
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                padding: "12px 20px", borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.1)", background: "white",
                color: "#6B7280", fontSize: 14, fontWeight: 600, cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Library page ──────────────────────────────────────────────────────────

export default function Library({ onNavigate, onLogout, onUpgrade, initialCategory }: { 
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
  onUpgrade?: () => void;
  initialCategory?: Category;
}) {
  const [category, setCategory]   = useState<Category>(initialCategory || "Todos");
  const [sort, setSort]           = useState<SortKey>("Más recientes");
  const [search, setSearch]       = useState("");
  const [activeTab, setActiveTab] = useState<"biblioteca" | "proximos">("biblioteca");
  const [modalItem, setModalItem] = useState<ContentItem | null>(null);
  const [showNotifyToast, setShowNotifyToast] = useState(false);

  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [upcoming, setUpcoming]   = useState<UpcomingVideo[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    getContent().then(res => {
      if (res.success && res.data) {
        const tierOf = (m: string): TierName =>
          m === "SEMBRADOR" ? "Sembrador" :
          m === "CONSTRUCTOR" ? "Constructor" :
          m === "GUARDIAN" ? "Guardián" :
          m === "ALIADO" ? "Aliado" : "Sin Membresía";
        const categoryOf = (t: string): Exclude<Category, "Todos"> =>
          t === "REPORT" || t === "PDF" ? "Reportes" : "Videos";

        // Contenido ya disponible (sin fecha futura de desbloqueo).
        const now = Date.now();
        const available = res.data.filter((c: any) => !c.unlockDate || new Date(c.unlockDate).getTime() <= now);
        const mapped = available.map((c: any) => ({
          id: c.id,
          title: c.title,
          category: categoryOf(c.type),
          description: c.description || "",
          tier: tierOf(c.requiredMembership),
          duration: "N/A",
          views: 0,
          date: new Date(c.createdAt).toLocaleDateString(),
          thumb: c.url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=340&fit=crop&auto=format",
          featured: false,
        }));
        setContentList(mapped);

        // Contenido programado a futuro → sección "Próximamente".
        const soon = res.data
          .filter((c: any) => c.unlockDate && new Date(c.unlockDate).getTime() > now)
          .sort((a: any, b: any) => new Date(a.unlockDate).getTime() - new Date(b.unlockDate).getTime())
          .map((c: any): UpcomingVideo => ({
            id: c.id,
            title: c.title,
            description: c.description || "",
            type: categoryOf(c.type),
            tier: tierOf(c.requiredMembership),
            unlockDate: new Date(c.unlockDate),
            thumb: c.url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=280&fit=crop&auto=format",
            duration: "Próximamente",
            speaker: "Equipo EMV",
          }));
        setUpcoming(soon);
      }
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let items = contentList;
    if (category !== "Todos") items = items.filter(i => i.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(i => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    }
    if (sort === "Más vistos") items = [...items].sort((a, b) => b.views - a.views);
    return items;
  }, [category, sort, search, contentList]);

  const handleNotify = () => {
    setShowNotifyToast(true);
    setTimeout(() => setShowNotifyToast(false), 3500);
  };

  const CATS: Category[] = ["Todos", "Videos", "Cursos", "Webinars", "Certificados", "Reportes"];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: BG }}>
      <Sidebar currentPage="library" onNavigate={p => onNavigate?.(p)} onLogout={() => onLogout?.()} />

      {/* Toast */}
      {showNotifyToast && (
        <div style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 2000,
          background: "#1F2937", color: "white", borderRadius: 12,
          padding: "14px 20px", fontSize: 13, fontWeight: 600,
          fontFamily: "var(--font-sans)", boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
          display: "flex", alignItems: "center", gap: 10, maxWidth: 340,
          animation: "slideIn 0.3s ease",
        }}>
          🔔 <span>Te avisaremos cuando este contenido esté disponible.</span>
        </div>
      )}

      {/* Content modal */}
      {modalItem && (
        <ContentModal
          item={modalItem}
          onClose={() => setModalItem(null)}
          onUpgrade={() => { setModalItem(null); onUpgrade?.(); }}
        />
      )}

      <div style={{ padding: "32px 32px 48px", maxWidth: 1200, margin: "0 auto", width: "100%", marginLeft: 220 }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 11, background: `${EMV_BLUE}15`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <BookOpen size={20} color={EMV_BLUE} />
            </div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#1F2937", fontFamily: "var(--font-display)" }}>
              Biblioteca de Contenidos
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: "#9CA3AF", fontFamily: "var(--font-sans)", paddingLeft: 50 }}>
            Accede a recursos exclusivos según tu nivel de membresía.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#F3F4F6", borderRadius: 12, padding: 4, width: "fit-content" }}>
          {([
            { key: "biblioteca", label: "Biblioteca", icon: BookOpen },
            { key: "proximos",   label: "Próximamente", icon: CalendarClock },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 18px", borderRadius: 9, border: "none",
                background: activeTab === tab.key ? "white" : "transparent",
                color: activeTab === tab.key ? "#1F2937" : "#9CA3AF",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                fontFamily: "var(--font-display)",
                boxShadow: activeTab === tab.key ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.15s",
              }}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "proximos" ? (
          <UpcomingSection onNotify={handleNotify} videos={upcoming} />
        ) : (
          <>
            {/* Stats row */}
            <div style={{ display: "flex", gap: 32, marginBottom: 32 }}>
              <div>
                <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 4, fontFamily: "var(--font-sans)" }}>Contenido disponible</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#1F2937", fontFamily: "var(--font-display)" }}>{contentList.length}</div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 4, fontFamily: "var(--font-sans)" }}>Reportes exclusivos</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#1F2937", fontFamily: "var(--font-display)" }}>{contentList.filter(c => c.category === "Reportes").length}</div>
              </div>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
              {/* Search */}
              <div style={{ position: "relative", flex: "1 1 220px", minWidth: 0 }}>
                <Search size={14} color="#9CA3AF" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar contenido..."
                  style={{
                    width: "100%", paddingLeft: 36, paddingRight: 16, paddingTop: 10, paddingBottom: 10,
                    borderRadius: 10, border: "1px solid rgba(0,0,0,0.1)",
                    fontSize: 13, fontFamily: "var(--font-sans)", outline: "none",
                    background: "white", boxSizing: "border-box", color: "#1F2937",
                  }}
                />
              </div>

              {/* Category pills */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {CATS.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    style={{
                      padding: "7px 14px", borderRadius: 99, border: "1px solid",
                      borderColor: category === cat ? EMV_BLUE : "rgba(0,0,0,0.1)",
                      background: category === cat ? `${EMV_BLUE}10` : "white",
                      color: category === cat ? EMV_BLUE : "#6B7280",
                      fontSize: 12, fontWeight: 600, cursor: "pointer",
                      fontFamily: "var(--font-display)", transition: "all 0.15s",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div style={{ position: "relative", marginLeft: "auto" }}>
                <Filter size={13} color="#9CA3AF" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} />
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value as SortKey)}
                  style={{
                    paddingLeft: 30, paddingRight: 28, paddingTop: 9, paddingBottom: 9,
                    borderRadius: 10, border: "1px solid rgba(0,0,0,0.1)",
                    fontSize: 12, fontFamily: "var(--font-sans)", outline: "none",
                    background: "white", color: "#6B7280", cursor: "pointer",
                    appearance: "none",
                  }}
                >
                  <option>Más recientes</option>
                  <option>Más vistos</option>
                </select>
                <ChevronDown size={13} color="#9CA3AF" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              </div>
            </div>

            {/* Stats bar */}
            <div style={{ marginBottom: 20, fontSize: 12, color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>
              {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}{category !== "Todos" ? ` en ${category}` : ""}
            </div>

            {/* Grid */}
            {loading ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#6B7280", fontFamily: "var(--font-sans)" }}>
                Cargando contenido...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>
                <Sparkles size={36} color="#E5E7EB" style={{ marginBottom: 12, display: "block", margin: "0 auto 12px" }} />
                <p style={{ fontSize: 15, fontWeight: 600, color: "#6B7280" }}>Sin resultados</p>
                <p style={{ fontSize: 13 }}>Intenta con otro término o categoría.</p>
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 20,
              }}>
                {filtered.map(item => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    onClick={() => setModalItem(item)}
                    onAction={() => {
                      if (TIER_LEVEL[item.tier] > USER_TIER_LEVEL) onNavigate?.("membership");
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}