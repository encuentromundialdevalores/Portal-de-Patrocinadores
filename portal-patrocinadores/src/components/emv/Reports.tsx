"use client";
import { useState } from "react";
import {
  Download, Eye, Lock, ArrowUpRight, TrendingUp, Users, Calendar,
  Clock, Award, FileText, BarChart2, Globe, Star, Building2,
  ChevronRight, Zap, Target, Heart,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Sidebar, Page } from "./Sidebar";

const EMV_BLUE    = "#29ABE2";
const EMV_ORANGE  = "#F7941D";
const EMV_MAGENTA = "#EC008C";
const BG          = "#F4F6F9";
const USER_LEVEL  = 3; // Constructor

// ── Data ──────────────────────────────────────────────────────────────────────

const quarterlyImpact = [
  { q: "Q1 2024", personas: 2800, eventos: 18, horas: 64  },
  { q: "Q2 2024", personas: 3500, eventos: 22, horas: 80  },
  { q: "Q3 2024", personas: 4100, eventos: 27, horas: 96  },
  { q: "Q4 2024", personas: 5200, eventos: 31, horas: 108 },
  { q: "Q1 2025", personas: 5900, eventos: 36, horas: 120 },
  { q: "Q2 2025", personas: 7300, eventos: 42, horas: 140 },
];

const radarData = [
  { metric: "Liderazgo",    score: 88 },
  { metric: "Innovación",   score: 72 },
  { metric: "Comunidad",    score: 95 },
  { metric: "Bienestar",    score: 80 },
  { metric: "Formación",    score: 84 },
  { metric: "Valores",      score: 91 },
];

const pieData = [
  { name: "Webinars",     value: 34, color: EMV_BLUE    },
  { name: "Cursos",       value: 28, color: EMV_ORANGE  },
  { name: "Eventos",      value: 22, color: EMV_MAGENTA },
  { name: "Certificados", value: 16, color: "#8B5CF6"   },
];

const companyMonthly = [
  { mes: "Ene", colaboradores: 42, programas: 3 },
  { mes: "Feb", colaboradores: 58, programas: 4 },
  { mes: "Mar", colaboradores: 71, programas: 4 },
  { mes: "Abr", colaboradores: 83, programas: 5 },
  { mes: "May", colaboradores: 96, programas: 6 },
  { mes: "Jun", colaboradores: 112, programas: 7 },
];

const quarterReports = [
  {
    label: "Q1 2025",
    sub: "Ene – Mar 2025",
    date: "15 Abr 2025",
    tier: "Aliado",
    tierLevel: 1,
    color: EMV_BLUE,
    pages: 28,
    thumb: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=480&h=280&fit=crop&auto=format",
    highlight: "3,200 personas impactadas",
  },
  {
    label: "Q2 2025",
    sub: "Abr – Jun 2025",
    date: "15 Jul 2025",
    tier: "Aliado",
    tierLevel: 1,
    color: EMV_BLUE,
    pages: 32,
    thumb: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=480&h=280&fit=crop&auto=format",
    highlight: "4,800 personas impactadas",
  },
  {
    label: "Q3 2025",
    sub: "Jul – Sep 2025",
    date: "15 Oct 2025",
    tier: "Sembrador",
    tierLevel: 2,
    color: "#10B981",
    pages: 36,
    thumb: "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=480&h=280&fit=crop&auto=format",
    highlight: "6,100 personas impactadas",
  },
  {
    label: "Q4 2025",
    sub: "Oct – Dic 2025",
    date: "15 Ene 2026",
    tier: "Constructor",
    tierLevel: 3,
    color: EMV_ORANGE,
    pages: 44,
    thumb: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=480&h=280&fit=crop&auto=format",
    highlight: "8,400 personas impactadas",
  },
];

const annualReport = {
  label: "Reporte Anual 2024",
  sub: "Informe ejecutivo completo",
  date: "28 Feb 2025",
  tier: "Constructor",
  tierLevel: 3,
  color: EMV_ORANGE,
  pages: 68,
  thumb: "https://images.unsplash.com/photo-1599658880436-c61792e70672?w=760&h=340&fit=crop&auto=format",
  highlight: "50,000+ personas impactadas en el año",
};

const TIER_EMOJI: Record<string, string> = {
  Aliado: "🤝", Sembrador: "🌱", Constructor: "🧱", Guardián: "🛡",
};

const TIER_COLOR: Record<string, string> = {
  Aliado: EMV_BLUE, Sembrador: "#10B981", Constructor: EMV_ORANGE, Guardián: EMV_MAGENTA,
};

// ── Tooltip style ─────────────────────────────────────────────────────────────

const ttStyle = {
  background: "white",
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 10,
  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
  fontSize: 12,
  fontFamily: "var(--font-sans)",
};

// ── Report Card ───────────────────────────────────────────────────────────────

function ReportCard({ r }: { r: typeof quarterReports[number] }) {
  const locked = r.tierLevel > USER_LEVEL;
  const tc     = TIER_COLOR[r.tier];

  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        overflow: "hidden",
        border: locked ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
        opacity: locked ? 0.8 : 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: "relative", height: 148, background: "#E5E7EB" }}>
        <img
          src={r.thumb}
          alt={r.label}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            filter: locked ? "blur(5px) brightness(0.65)" : "none",
            transform: locked ? "scale(1.05)" : "none",
          }}
        />
        {/* Quarter label overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: locked ? "rgba(0,0,0,0.05)" : "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)",
          }}
        >
          {locked ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Lock size={14} color="white" />
              </div>
              <div style={{
                padding: "3px 10px", borderRadius: 99,
                background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
                color: "white", fontSize: 10, fontWeight: 700,
                fontFamily: "var(--font-display)",
              }}>
                {TIER_EMOJI[r.tier]} Para {r.tier}
              </div>
            </div>
          ) : (
            <div style={{
              position: "absolute", bottom: 10, left: 10, right: 10,
              display: "flex", justifyContent: "space-between", alignItems: "flex-end",
            }}>
              <span style={{
                fontSize: 11, color: "rgba(255,255,255,0.9)",
                fontFamily: "var(--font-sans)", fontWeight: 500,
              }}>
                {r.highlight}
              </span>
              <span style={{
                fontSize: 10, color: "rgba(255,255,255,0.7)",
                fontFamily: "var(--font-sans)",
              }}>
                {r.pages} págs.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: locked ? "#9CA3AF" : "#1F2937", margin: 0, fontFamily: "var(--font-display)" }}>
            {r.label}
          </h3>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99,
            background: `${tc}15`, color: locked ? "#9CA3AF" : tc,
            fontFamily: "var(--font-display)",
          }}>
            {TIER_EMOJI[r.tier]} {r.tier}
          </span>
        </div>
        <div style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>
          {r.sub} · Publicado {r.date}
        </div>

        {locked ? (
          <button style={{
            width: "100%", padding: "9px 0", borderRadius: 10,
            border: `1px solid ${EMV_MAGENTA}30`, background: `${EMV_MAGENTA}08`,
            color: EMV_MAGENTA, fontSize: 12, fontWeight: 700, cursor: "pointer",
            fontFamily: "var(--font-display)", display: "flex", alignItems: "center",
            justifyContent: "center", gap: 5, marginTop: 4,
          }}>
            <ArrowUpRight size={13} /> Mejorar a {r.tier}
          </button>
        ) : (
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button style={{
              flex: 1, padding: "8px 0", borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.09)", background: "none",
              color: "#374151", fontSize: 11, fontWeight: 600, cursor: "pointer",
              fontFamily: "var(--font-sans)", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 4,
            }}>
              <Eye size={12} /> Ver reporte
            </button>
            <button style={{
              flex: 1, padding: "8px 0", borderRadius: 10, border: "none",
              background: EMV_BLUE, color: "white", fontSize: 11, fontWeight: 700,
              cursor: "pointer", fontFamily: "var(--font-display)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              boxShadow: `0 2px 8px ${EMV_BLUE}30`,
            }}>
              <Download size={12} /> Descargar PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Section: Report Cards ──────────────────────────────────────────────────────

function ReportCardsSection() {
  return (
    <div style={{ marginBottom: 32 }}>
      {/* Annual report — wide card */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: 0, fontFamily: "var(--font-display)" }}>
            Reporte Anual
          </h2>
          <span style={{ padding: "2px 8px", borderRadius: 99, background: `${EMV_ORANGE}12`, color: EMV_ORANGE, fontSize: 10, fontWeight: 700, fontFamily: "var(--font-display)" }}>
            🧱 Nivel Constructor
          </span>
        </div>
        <div
          style={{
            position: "relative", borderRadius: 16, overflow: "hidden", height: 200,
            border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.07)",
          }}
        >
          <img
            src={annualReport.thumb}
            alt="Reporte Anual 2024"
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.55)" }}
          />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 36px", gap: 40 }}>
            <div style={{ flex: 1 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "3px 10px", borderRadius: 99,
                background: `${EMV_ORANGE}30`, border: `1px solid ${EMV_ORANGE}50`,
                color: "#FBBC5E", fontSize: 11, fontWeight: 700, marginBottom: 10,
                fontFamily: "var(--font-display)",
              }}>
                <Star size={10} fill="#FBBC5E" /> Informe ejecutivo completo
              </div>
              <h2 style={{ color: "white", fontSize: 22, fontWeight: 800, margin: "0 0 6px", fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
                Reporte Anual 2024
              </h2>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, margin: "0 0 16px", fontFamily: "var(--font-sans)" }}>
                {annualReport.highlight} · {annualReport.pages} páginas · Publicado {annualReport.date}
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={{
                  padding: "9px 20px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.3)",
                  background: "rgba(255,255,255,0.12)", color: "white", fontSize: 12, fontWeight: 600,
                  cursor: "pointer", fontFamily: "var(--font-sans)",
                  display: "flex", alignItems: "center", gap: 5, backdropFilter: "blur(4px)",
                }}>
                  <Eye size={14} /> Ver reporte
                </button>
                <button style={{
                  padding: "9px 20px", borderRadius: 10, border: "none",
                  background: "white", color: "#1F2937", fontSize: 12, fontWeight: 700,
                  cursor: "pointer", fontFamily: "var(--font-display)",
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  <Download size={14} /> Descargar PDF
                </button>
              </div>
            </div>
            {/* Mini stats */}
            <div style={{ display: "flex", gap: 16, flexShrink: 0 }}>
              {[
                { value: "50K+", label: "Personas" },
                { value: "182", label: "Eventos" },
                { value: "300h", label: "Formación" },
              ].map(s => (
                <div key={s.label}
                  style={{
                    textAlign: "center", padding: "14px 18px", borderRadius: 12,
                    background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.18)",
                  }}
                >
                  <div style={{ color: "white", fontSize: 22, fontWeight: 800, fontFamily: "var(--font-display)", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 4, fontFamily: "var(--font-sans)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quarterly cards */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: 0, fontFamily: "var(--font-display)" }}>
          Reportes Trimestrales
        </h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {quarterReports.map(r => <ReportCard key={r.label} r={r} />)}
      </div>
    </div>
  );
}

// ── Section: Community Charts ──────────────────────────────────────────────────

function CommunityCharts() {
  const [activeBar, setActiveBar] = useState<string | null>(null);

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: 0, fontFamily: "var(--font-display)" }}>
          Métricas de Comunidad
        </h2>
        <span style={{ padding: "2px 8px", borderRadius: 99, background: `${EMV_BLUE}12`, color: EMV_BLUE, fontSize: 10, fontWeight: 700, fontFamily: "var(--font-display)" }}>
          Actualizado Jun 2025
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 16 }}>
        {/* Trend area chart */}
        <div style={{
          background: "white", borderRadius: 16, padding: 24,
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: 0, fontFamily: "var(--font-display)" }}>
                Personas Impactadas
              </h3>
              <p style={{ fontSize: 12, color: "#9CA3AF", margin: "3px 0 0", fontFamily: "var(--font-sans)" }}>Evolución 2024 – 2025</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: EMV_BLUE, fontFamily: "var(--font-display)", lineHeight: 1 }}>7,300</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end", marginTop: 3 }}>
                <TrendingUp size={11} color="#10B981" />
                <span style={{ fontSize: 11, color: "#10B981", fontWeight: 700 }}>+41% vs Q1</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={quarterlyImpact}>
              <defs>
                <linearGradient id="gPersonas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={EMV_BLUE} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={EMV_BLUE} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="q" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={ttStyle} />
              <Area type="monotone" dataKey="personas" stroke={EMV_BLUE} strokeWidth={2.5}
                fill="url(#gPersonas)" name="Personas" dot={{ fill: EMV_BLUE, r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Radar chart */}
        <div style={{
          background: "white", borderRadius: 16, padding: 24,
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: "0 0 4px", fontFamily: "var(--font-display)" }}>
            Dimensiones de Impacto
          </h3>
          <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 8px", fontFamily: "var(--font-sans)" }}>Índice EMV</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(0,0,0,0.07)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: "#6B7280" }} />
              <Radar name="Score" dataKey="score" stroke={EMV_BLUE} fill={EMV_BLUE} fillOpacity={0.15} strokeWidth={2} />
              <Tooltip contentStyle={ttStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div style={{
          background: "white", borderRadius: 16, padding: 24,
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: "0 0 4px", fontFamily: "var(--font-display)" }}>
            Tipo de Actividad
          </h3>
          <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 8px", fontFamily: "var(--font-sans)" }}>Distribución</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={66}
                dataKey="value" stroke="none">
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={ttStyle} formatter={(v: any) => [`${v}%`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {pieData.map(e => (
              <div key={e.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: e.color }} />
                  <span style={{ fontSize: 11, color: "#6B7280", fontFamily: "var(--font-sans)" }}>{e.name}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#374151", fontFamily: "var(--font-display)" }}>{e.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Section: Constructor — Your Company Impact ────────────────────────────────

function ConstructorSection() {
  const kpis = [
    { icon: Users,    label: "Colaboradores formados", value: "112", delta: "+38%", color: EMV_BLUE   },
    { icon: Calendar, label: "Programas activos",      value: "7",   delta: "+40%", color: EMV_ORANGE },
    { icon: Clock,    label: "Horas de formación",     value: "340h",delta: "+28%", color: EMV_MAGENTA},
    { icon: Target,   label: "Objetivos cumplidos",    value: "91%", delta: "+12%", color: "#10B981"  },
  ];

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 18 }}>🧱</span>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: 0, fontFamily: "var(--font-display)" }}>
          El Impacto de Empresa XYZ
        </h2>
        <span style={{
          padding: "3px 10px", borderRadius: 99,
          background: `${EMV_ORANGE}12`, border: `1px solid ${EMV_ORANGE}22`,
          color: EMV_ORANGE, fontSize: 10, fontWeight: 700, fontFamily: "var(--font-display)",
        }}>
          Sección Constructor
        </span>
      </div>

      <div style={{
        background: "white", borderRadius: 18, overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
      }}>
        {/* Header band */}
        <div style={{
          background: `linear-gradient(135deg, #0B2E3E, #1A6A90)`,
          padding: "20px 28px",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 13,
            background: `linear-gradient(135deg,${EMV_ORANGE},#F7C068)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 800, color: "white",
            fontFamily: "var(--font-display)", flexShrink: 0,
          }}>
            XZ
          </div>
          <div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontFamily: "var(--font-sans)", letterSpacing: "0.08em" }}>
              REPORTE PERSONALIZADO
            </div>
            <div style={{ color: "white", fontSize: 18, fontWeight: 800, fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
              Empresa XYZ · Nivel Constructor
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
            <button style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "8px 16px", borderRadius: 9,
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.1)", backdropFilter: "blur(4px)",
              color: "white", fontSize: 12, fontWeight: 600,
              cursor: "pointer", fontFamily: "var(--font-sans)",
            }}>
              <Eye size={13} /> Vista previa
            </button>
            <button style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "8px 16px", borderRadius: 9, border: "none",
              background: "white", color: "#1F2937", fontSize: 12, fontWeight: 700,
              cursor: "pointer", fontFamily: "var(--font-display)",
            }}>
              <Download size={13} /> Exportar PDF
            </button>
          </div>
        </div>

        <div style={{ padding: 28 }}>
          {/* KPI row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
            {kpis.map(k => (
              <div key={k.label} style={{
                padding: "16px 18px", borderRadius: 12,
                background: `${k.color}07`, border: `1px solid ${k.color}18`,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: `${k.color}15`, border: `1px solid ${k.color}25`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <k.icon size={15} color={k.color} />
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: "#10B981",
                    background: "#ECFDF5", padding: "2px 6px", borderRadius: 99,
                  }}>
                    {k.delta}
                  </span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#1F2937", fontFamily: "var(--font-display)", lineHeight: 1 }}>
                  {k.value}
                </div>
                <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4, fontFamily: "var(--font-sans)" }}>
                  {k.label}
                </div>
              </div>
            ))}
          </div>

          {/* Bar chart — company monthly */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 14, fontFamily: "var(--font-display)" }}>
              Colaboradores formados por mes
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={companyMonthly} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={ttStyle} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                <Bar dataKey="colaboradores" fill={EMV_BLUE} radius={[6, 6, 0, 0]} name="Colaboradores" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Section: Guardian (locked) ────────────────────────────────────────────────

function GuardianSection() {
  const perks = [
    { icon: FileText,   label: "Reporte Anual con Branding",  desc: "Informe ejecutivo co-branded con el logo de tu empresa y métricas exclusivas." },
    { icon: Zap,        label: "Resumen Ejecutivo Premium",    desc: "Una página de alto impacto para presentar a directivos y stakeholders." },
    { icon: BarChart2,  label: "Insights Exclusivos",          desc: "Datos avanzados de impacto y benchmarking con empresas líderes del sector." },
    { icon: Heart,      label: "Reunión con Dirección EMV",    desc: "Sesión privada semestral con el equipo directivo para revisar tu impacto." },
  ];

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 18 }}>🛡</span>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#9CA3AF", margin: 0, fontFamily: "var(--font-display)" }}>
          Reportes Premium Guardián
        </h2>
        <span style={{
          padding: "3px 10px", borderRadius: 99,
          background: `${EMV_MAGENTA}10`, border: `1px solid ${EMV_MAGENTA}20`,
          color: EMV_MAGENTA, fontSize: 10, fontWeight: 700, fontFamily: "var(--font-display)",
        }}>
          Bloqueado
        </span>
      </div>

      <div style={{
        position: "relative", borderRadius: 18, overflow: "hidden",
        border: `1px solid ${EMV_MAGENTA}20`,
        boxShadow: `0 4px 24px ${EMV_MAGENTA}10`,
      }}>
        {/* Blurred background preview */}
        <div style={{
          background: `linear-gradient(135deg, #1a0010, #350030, #1d0030)`,
          padding: 32,
          filter: "none",
        }}>
          {/* Lock badge */}
          <div style={{
            position: "absolute", top: 20, right: 20, zIndex: 10,
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 14px", borderRadius: 99,
            background: EMV_MAGENTA, color: "white",
            fontSize: 11, fontWeight: 700, fontFamily: "var(--font-display)",
            boxShadow: `0 4px 12px ${EMV_MAGENTA}50`,
          }}>
            <Lock size={12} /> Exclusivo Guardián
          </div>

          <div style={{
            display: "flex", alignItems: "flex-start",
            justifyContent: "space-between", marginBottom: 28,
          }}>
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "3px 10px", borderRadius: 99,
                background: `${EMV_MAGENTA}30`, border: `1px solid ${EMV_MAGENTA}50`,
                color: "#FF85C8", fontSize: 11, fontWeight: 700, marginBottom: 10,
                fontFamily: "var(--font-display)",
              }}>
                <Star size={10} fill="#FF85C8" /> Nivel máximo de impacto
              </div>
              <h3 style={{
                color: "white", fontSize: 22, fontWeight: 800,
                margin: "0 0 8px", fontFamily: "var(--font-display)", letterSpacing: "-0.02em",
              }}>
                Reporte Anual con Branding
              </h3>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, margin: 0, fontFamily: "var(--font-sans)", maxWidth: 420, lineHeight: 1.55 }}>
                Como Guardián, tu empresa recibe un informe ejecutivo anual personalizado, insights exclusivos y una reunión directa con la dirección del EMV para diseñar tu estrategia de impacto.
              </p>
            </div>
          </div>

          {/* Perk cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
            {perks.map(p => (
              <div key={p.label} style={{
                padding: "18px 16px", borderRadius: 14,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(8px)",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${EMV_MAGENTA}30`, border: `1px solid ${EMV_MAGENTA}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 12,
                }}>
                  <p.icon size={17} color="#FF85C8" />
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "white", fontFamily: "var(--font-display)", marginBottom: 6, lineHeight: 1.3 }}>
                  {p.label}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-sans)", lineHeight: 1.45 }}>
                  {p.desc}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 20 }}>
              {[["50K+","Personas"], ["182","Eventos"], ["300h","Formación"], ["98%","Satisfacción"]].map(([v, l]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ color: "white", fontSize: 20, fontWeight: 800, fontFamily: "var(--font-display)", lineHeight: 1, filter: "blur(4px)" }}>{v}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, marginTop: 3, fontFamily: "var(--font-sans)" }}>{l}</div>
                </div>
              ))}
            </div>
            <button style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "13px 28px", borderRadius: 12, border: "none",
              background: EMV_MAGENTA, color: "white",
              fontSize: 14, fontWeight: 700, cursor: "pointer",
              fontFamily: "var(--font-display)", letterSpacing: "-0.01em",
              boxShadow: `0 8px 24px ${EMV_MAGENTA}50`,
            }}>
              Mejorar a Guardián <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Impact Indicators Row ─────────────────────────────────────────────────────

function ImpactIndicators() {
  const indicators = [
    { icon: Users,    value: "50,000+",   label: "Personas impactadas",       color: EMV_BLUE,    bg: `${EMV_BLUE}10`    },
    { icon: Calendar, value: "182",        label: "Eventos realizados",         color: EMV_ORANGE,  bg: `${EMV_ORANGE}10`  },
    { icon: Globe,    value: "23 países",  label: "Alcance internacional",      color: EMV_MAGENTA, bg: `${EMV_MAGENTA}10` },
    { icon: Award,    value: "150",        label: "Aliados activos",            color: "#10B981",   bg: "#10B98112"        },
    { icon: Star,     value: "98%",        label: "Satisfacción de aliados",    color: "#8B5CF6",   bg: "#8B5CF612"        },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 32 }}>
      {indicators.map(ind => (
        <div key={ind.label} style={{
          background: "white", borderRadius: 14, padding: "18px 16px",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 11,
            background: ind.bg, border: `1px solid ${ind.color}22`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <ind.icon size={18} color={ind.color} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", fontFamily: "var(--font-display)", lineHeight: 1 }}>
              {ind.value}
            </div>
            <div style={{ fontSize: 11, color: "#6B7280", marginTop: 3, fontFamily: "var(--font-sans)" }}>
              {ind.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

interface Props {
  onNavigate: (p: Page) => void;
  onLogout: () => void;
  userTier?: string;
}

export function Reports({ onNavigate, onLogout, userTier = "Constructor" }: Props) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: BG }}>
      <Sidebar currentPage="reports" onNavigate={onNavigate} onLogout={onLogout} userTier={userTier} />

      <main style={{ marginLeft: 220, flex: 1, padding: "32px 36px 60px", minWidth: 0 }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <h1 style={{
                fontSize: 26, fontWeight: 800, color: "#1F2937",
                fontFamily: "var(--font-display)", margin: 0, letterSpacing: "-0.02em",
              }}>
                Reportes de Impacto
              </h1>
              <p style={{ fontSize: 14, color: "#6B7280", margin: "6px 0 0", fontFamily: "var(--font-sans)" }}>
                Visualiza el impacto que juntos estamos generando.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "9px 18px", borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.09)", background: "white",
                color: "#374151", fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: "var(--font-sans)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}>
                <Download size={14} /> Descargar todos
              </button>
              <button style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "9px 18px", borderRadius: 10, border: "none",
                background: EMV_BLUE, color: "white",
                fontSize: 12, fontWeight: 700, cursor: "pointer",
                fontFamily: "var(--font-display)",
                boxShadow: `0 4px 12px ${EMV_BLUE}30`,
              }}>
                <Eye size={14} /> Ver impacto en vivo
              </button>
            </div>
          </div>
        </div>

        <ImpactIndicators />
        <ReportCardsSection />
        <CommunityCharts />
        <ConstructorSection />
        <GuardianSection />
      </main>
    </div>
  );
}