"use client";
import { useState } from "react";
import {
  LayoutDashboard, Users, BookOpen, BarChart2, Activity, Bell,
  MessageSquare, Settings, ChevronRight, TrendingUp, TrendingDown,
  Search, Filter, MoreHorizontal, Plus, Eye, Edit2, Trash2, X,
  ArrowUpRight, CheckCircle, Clock, AlertCircle, Send,
  Globe, Award, Video, FileText, Zap, Shield, LogOut,
  Calendar, DollarSign,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { SponsorManagement } from "./SponsorManagement";
const emvLogo = "/imports/EMV_XVIII-Blanco.png";

// ── Constants ─────────────────────────────────────────────────────────────────

const BLUE    = "#29ABE2";
const ORANGE  = "#F7941D";
const MAGENTA = "#EC008C";
const GREEN   = "#10B981";
const PURPLE  = "#8B5CF6";
const BG      = "#F0F2F5";
const SIDEBAR_W = 228;

type AdminPage =
  | "dashboard" | "patrocinadores" | "contenido"
  | "reportes" | "metricas" | "notificaciones"
  | "comentarios" | "configuracion";

// ── Data ──────────────────────────────────────────────────────────────────────

const growthData = [
  { mes: "Ene", aliado: 62, sembrador: 28, constructor: 18, guardian: 8 },
  { mes: "Feb", aliado: 65, sembrador: 30, constructor: 19, guardian: 8 },
  { mes: "Mar", aliado: 70, sembrador: 31, constructor: 21, guardian: 9 },
  { mes: "Abr", aliado: 74, sembrador: 33, constructor: 22, guardian: 10 },
  { mes: "May", aliado: 78, sembrador: 34, constructor: 24, guardian: 10 },
  { mes: "Jun", aliado: 80, sembrador: 36, constructor: 26, guardian: 11 },
  { mes: "Jul", aliado: 83, sembrador: 37, constructor: 27, guardian: 12 },
  { mes: "Ago", aliado: 85, sembrador: 38, constructor: 28, guardian: 12 },
];

const revenueData1A = [
  { mes: "Sep", ingreso: 280000 },
  { mes: "Oct", ingreso: 295000 },
  { mes: "Nov", ingreso: 305000 },
  { mes: "Dic", ingreso: 310000 },
  { mes: "Ene", ingreso: 312000 },
  { mes: "Feb", ingreso: 328000 },
  { mes: "Mar", ingreso: 345000 },
  { mes: "Abr", ingreso: 361000 },
  { mes: "May", ingreso: 379000 },
  { mes: "Jun", ingreso: 395000 },
  { mes: "Jul", ingreso: 418000 },
  { mes: "Ago", ingreso: 435000 },
];

const revenueData1M = [
  { mes: "1-7 Ago", ingreso: 85000 },
  { mes: "8-14 Ago", ingreso: 92000 },
  { mes: "15-21 Ago", ingreso: 81000 },
  { mes: "22-31 Ago", ingreso: 177000 },
];

const consumptionData = [
  { tipo: "Webinars", vistas: 4820, descargas: 1240 },
  { tipo: "Cursos",   vistas: 3610, descargas: 890  },
  { tipo: "Reportes", vistas: 2180, descargas: 2180 },
  { tipo: "Videos",   vistas: 5340, descargas: 620  },
  { tipo: "Certs",    vistas: 980,  descargas: 760  },
];

const pieData = [
  { name: "Aliado",      value: 85, color: BLUE    },
  { name: "Sembrador",   value: 38, color: GREEN   },
  { name: "Constructor", value: 27, color: ORANGE  },
  { name: "Guardián",    value: 12, color: MAGENTA },
];

const SPONSORS = [
  { id: 1, name: "Grupo Bimbo",       tier: "Guardián",    emoji: "🛡", color: MAGENTA, revenue: "$8,500",  status: "activo",    date: "12 Jun 2025", avatar: "GB" },
  { id: 2, name: "CEMEX",             tier: "Constructor", emoji: "🧱", color: ORANGE,  revenue: "$5,000",  status: "activo",    date: "8 Jun 2025",  avatar: "CX" },
  { id: 3, name: "Banorte",           tier: "Constructor", emoji: "🧱", color: ORANGE,  revenue: "$5,000",  status: "activo",    date: "3 Jun 2025",  avatar: "BN" },
  { id: 4, name: "Femsa",             tier: "Sembrador",   emoji: "🌱", color: GREEN,   revenue: "$3,500",  status: "pendiente", date: "1 Jun 2025",  avatar: "FM" },
  { id: 5, name: "Liverpool",         tier: "Aliado",      emoji: "🤝", color: BLUE,    revenue: "$2,000",  status: "activo",    date: "28 May 2025", avatar: "LV" },
  { id: 6, name: "Televisa",          tier: "Guardián",    emoji: "🛡", color: MAGENTA, revenue: "$8,500",  status: "inactivo",  date: "22 May 2025", avatar: "TV" },
];

const CONTENT = [
  { id: 1, title: "Liderazgo con Propósito 2025",         type: "Webinar",  status: "publicado",  views: 3840, date: "5 Jun 2025",  tier: "Aliado"      },
  { id: 2, title: "Certificado en Valores Corporativos",   type: "Curso",    status: "publicado",  views: 1220, date: "28 May 2025", tier: "Constructor" },
  { id: 3, title: "Reporte Impacto Q2 2025",               type: "Reporte",  status: "publicado",  views: 892,  date: "15 May 2025", tier: "Constructor" },
  { id: 4, title: "Masterclass: Comunicación de Valores",  type: "Video",    status: "borrador",   views: 0,    date: "Próx. Jul 10",tier: "Sembrador"   },
  { id: 5, title: "Workshop: Cultura Organizacional",      type: "Workshop", status: "programado", views: 0,    date: "Próx. Jul 20",tier: "Aliado"      },
];

const NOTIFICATIONS = [
  { id: 1, type: "sponsor",  icon: Users,      color: BLUE,    msg: "Nuevo patrocinador: Femsa (Sembrador)",          time: "Hace 12 min",  read: false },
  { id: 2, type: "content",  icon: BookOpen,   color: GREEN,   msg: "Contenido publicado: Liderazgo con Propósito",   time: "Hace 1h",      read: false },
  { id: 3, type: "report",   icon: FileText,   color: ORANGE,  msg: "Reporte Q2 descargado 50 veces esta semana",     time: "Hace 2h",      read: true  },
  { id: 4, type: "alert",    icon: AlertCircle,color: MAGENTA, msg: "Televisa no renovó membresía — vence hoy",       time: "Hace 3h",      read: false },
  { id: 5, type: "metric",   icon: TrendingUp, color: PURPLE,  msg: "Ingresos mensuales superaron meta del 15%",      time: "Hace 5h",      read: true  },
];

const UPCOMING = [
  { title: "Masterclass: Comunicación de Valores", date: "10 Jul 2025", type: "Video",    tier: "Sembrador",   color: ORANGE  },
  { title: "Workshop: Cultura Organizacional",      date: "20 Jul 2025", type: "Workshop", tier: "Aliado",      color: BLUE    },
  { title: "Reporte Anual 2025 (Preview)",          date: "1 Ago 2025",  type: "Reporte",  tier: "Constructor", color: ORANGE  },
];

// ── Tooltip style ─────────────────────────────────────────────────────────────

const tt = {
  background: "white", border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
  fontSize: 12, fontFamily: "var(--font-sans)",
};

// ── Sidebar ───────────────────────────────────────────────────────────────────

const NAV: { icon: React.ElementType; label: string; page: AdminPage; badge?: number }[] = [
  { icon: LayoutDashboard, label: "Dashboard",       page: "dashboard"       },
  { icon: Users,           label: "Patrocinadores",  page: "patrocinadores", badge: 2 },
  { icon: BookOpen,        label: "Contenido",       page: "contenido"       },
  { icon: FileText,        label: "Reportes",        page: "reportes"        },
  { icon: Activity,        label: "Métricas",        page: "metricas"        },
  { icon: Bell,            label: "Notificaciones",  page: "notificaciones", badge: 3 },
  { icon: MessageSquare,   label: "Comentarios",     page: "comentarios"     },
  { icon: Settings,        label: "Configuración",   page: "configuracion"   },
];

function AdminSidebar({ page, setPage, onBack }: {
  page: AdminPage;
  setPage: (p: AdminPage) => void;
  onBack: () => void;
}) {
  return (
    <aside style={{
      position: "fixed", top: 0, left: 0, bottom: 0, width: SIDEBAR_W,
      background: "#0C1420", display: "flex", flexDirection: "column", zIndex: 50,
      borderRight: "1px solid rgba(255,255,255,0.05)",
    }}>
      {/* Logo */}
      <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "8px 10px", borderRadius: 10,
          background: "linear-gradient(135deg,#0B2E3E,#1A8CBF)",
        }}>
          <ImageWithFallback src={emvLogo} alt="EMV"
            style={{ height: 22, width: "auto", objectFit: "contain" }} />
          <div style={{ borderLeft: "1px solid rgba(255,255,255,0.2)", paddingLeft: 10 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em" }}>ADMIN</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "white", fontFamily: "var(--font-display)" }}>Panel de Control</div>
          </div>
        </div>
      </div>

      {/* Admin badge */}
      <div style={{ padding: "12px 14px 6px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 9,
          padding: "10px 12px", borderRadius: 10,
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: `linear-gradient(135deg,${MAGENTA},#C9006E)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 800, color: "white", fontFamily: "var(--font-display)",
          }}>AD</div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "white", fontFamily: "var(--font-display)" }}>Admin EMV</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-sans)" }}>Administrador general</div>
          </div>
          <div style={{ marginLeft: "auto", width: 7, height: 7, borderRadius: "50%", background: "#4ADE80", flexShrink: 0 }} />
        </div>
      </div>

      {/* Nav label */}
      <div style={{ padding: "12px 20px 4px", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.22)", letterSpacing: "0.12em", fontFamily: "var(--font-sans)" }}>
        NAVEGACIÓN
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: 1 }}>
        {NAV.map(item => {
          const active = page === item.page;
          return (
            <button key={item.page} onClick={() => setPage(item.page)} style={{
              display: "flex", alignItems: "center", gap: 9, padding: "9px 12px",
              borderRadius: 9, border: "none",
              background: active ? `${BLUE}18` : "none",
              color: active ? BLUE : "rgba(255,255,255,0.48)",
              fontSize: 13, fontWeight: active ? 700 : 500,
              cursor: "pointer", fontFamily: "var(--font-sans)",
              textAlign: "left", width: "100%", position: "relative",
              transition: "background 0.15s, color 0.15s",
            }}>
              {active && <span style={{
                position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                width: 3, height: 18, borderRadius: "0 3px 3px 0", background: BLUE,
              }} />}
              <item.icon size={15} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  minWidth: 18, height: 18, borderRadius: 9, padding: "0 5px",
                  background: active ? BLUE : MAGENTA, color: "white",
                  fontSize: 10, fontWeight: 800, fontFamily: "var(--font-display)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Back to portal */}
      <div style={{ padding: "10px 10px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={onBack} style={{
          display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", width: "100%",
          borderRadius: 9, border: "none", background: "none",
          color: "rgba(255,255,255,0.3)", fontSize: 12, fontWeight: 500,
          cursor: "pointer", fontFamily: "var(--font-sans)",
        }}>
          <LogOut size={14} /> Volver al portal
        </button>
      </div>
    </aside>
  );
}

// ── KPI Card ──────────────────────────────────────────────────────────────────

function KPICard({ label, value, sub, delta, positive, icon: Icon, color, bg }: {
  label: string; value: string; sub?: string; delta: string;
  positive: boolean; icon: React.ElementType; color: string; bg: string;
}) {
  return (
    <div style={{
      background: "white", borderRadius: 14, padding: "18px 20px",
      border: "1px solid rgba(0,0,0,0.06)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: bg,
          border: `1px solid ${color}22`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={17} color={color} />
        </div>
        <span style={{
          display: "flex", alignItems: "center", gap: 3,
          fontSize: 11, fontWeight: 700,
          color: positive ? GREEN : MAGENTA,
          background: positive ? "#ECFDF5" : `${MAGENTA}10`,
          padding: "2px 7px", borderRadius: 99,
        }}>
          {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {delta}
        </span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: "#1F2937", fontFamily: "var(--font-display)", lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: color, fontWeight: 600, fontFamily: "var(--font-sans)", marginTop: 2 }}>{sub}</div>}
      <div style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "var(--font-sans)", marginTop: 4 }}>{label}</div>
    </div>
  );
}

// ── Status pill ───────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; dot: string }> = {
    activo:      { bg: "#ECFDF5", color: "#10B981", dot: "#10B981" },
    pendiente:   { bg: "#FFFBEB", color: "#D97706", dot: "#F59E0B" },
    inactivo:    { bg: "#FEF2F2", color: "#EF4444", dot: "#EF4444" },
    publicado:   { bg: "#EFF6FF", color: BLUE, dot: BLUE },
    borrador:    { bg: "#F9FAFB", color: "#9CA3AF", dot: "#9CA3AF" },
    programado:  { bg: "#F5F3FF", color: PURPLE, dot: PURPLE },
  };
  const s = map[status] ?? map.borrador;
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 9px", borderRadius: 99, background: s.bg,
    }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
      <span style={{ fontSize: 11, fontWeight: 600, color: s.color, fontFamily: "var(--font-sans)", textTransform: "capitalize" }}>
        {status}
      </span>
    </div>
  );
}

// ── Content type pill ─────────────────────────────────────────────────────────

const TYPE_MAP: Record<string, { icon: React.ElementType; color: string }> = {
  Webinar:  { icon: Video,        color: BLUE    },
  Curso:    { icon: BookOpen,     color: GREEN   },
  Reporte:  { icon: FileText,     color: ORANGE  },
  Video:    { icon: Video,        color: PURPLE  },
  Workshop: { icon: Users,        color: MAGENTA },
};

function TypeBadge({ type }: { type: string }) {
  const t = TYPE_MAP[type] ?? { icon: FileText, color: "#9CA3AF" };
  const Icon = t.icon;
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 8px", borderRadius: 99,
      background: `${t.color}10`, border: `1px solid ${t.color}20`,
      color: t.color, fontSize: 10, fontWeight: 700, fontFamily: "var(--font-sans)",
    }}>
      <Icon size={9} /> {type}
    </div>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "white", borderRadius: 16,
      border: "1px solid rgba(0,0,0,0.06)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      padding: "20px 22px 16px",
      borderBottom: "1px solid rgba(0,0,0,0.05)",
    }}>
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: 0, fontFamily: "var(--font-display)" }}>{title}</h3>
        {sub && <p style={{ fontSize: 12, color: "#9CA3AF", margin: "2px 0 0", fontFamily: "var(--font-sans)" }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Section: Sponsor table ────────────────────────────────────────────────────

function SponsorsTable() {
  return (
    <Card>
      <SectionHeader
        title="Patrocinadores Recientes"
        sub="Últimas incorporaciones y renovaciones"
        action={
          <button style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "6px 14px", borderRadius: 8, border: "none",
            background: BLUE, color: "white", fontSize: 11, fontWeight: 700,
            cursor: "pointer", fontFamily: "var(--font-display)",
          }}>
            <Plus size={12} /> Agregar
          </button>
        }
      />
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["Empresa", "Nivel", "Ingreso", "Estado", "Fecha", ""].map(h => (
                <th key={h} style={{
                  padding: "10px 16px", textAlign: "left", fontSize: 11,
                  fontWeight: 600, color: "#9CA3AF", fontFamily: "var(--font-sans)",
                  borderBottom: "1px solid rgba(0,0,0,0.05)", whiteSpace: "nowrap",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SPONSORS.map((s, i) => (
              <tr key={s.id} style={{ borderBottom: i < SPONSORS.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: `linear-gradient(135deg,${s.color}30,${s.color}15)`,
                      border: `1px solid ${s.color}25`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 800, color: s.color, fontFamily: "var(--font-display)",
                    }}>
                      {s.avatar}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1F2937", fontFamily: "var(--font-sans)" }}>{s.name}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "2px 8px", borderRadius: 99,
                    background: `${s.color}12`, border: `1px solid ${s.color}22`,
                    color: s.color, fontSize: 10, fontWeight: 700, fontFamily: "var(--font-display)",
                  }}>
                    {s.emoji} {s.tier}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1F2937", fontFamily: "var(--font-display)" }}>{s.revenue}</span>
                  <span style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>/mes</span>
                </td>
                <td style={{ padding: "12px 16px" }}><StatusPill status={s.status} /></td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontSize: 12, color: "#6B7280", fontFamily: "var(--font-sans)" }}>{s.date}</span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[Eye, Edit2].map((Icon, idx) => (
                      <button key={idx} style={{
                        width: 28, height: 28, borderRadius: 7,
                        border: "1px solid rgba(0,0,0,0.08)", background: "none",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color: "#6B7280",
                      }}>
                        <Icon size={13} />
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
        <button style={{
          fontSize: 12, color: BLUE, fontWeight: 600, background: "none",
          border: "none", cursor: "pointer", fontFamily: "var(--font-sans)",
          display: "flex", alignItems: "center", gap: 4,
        }}>
          Ver todos los patrocinadores <ChevronRight size={13} />
        </button>
      </div>
    </Card>
  );
}

// ── Section: Content table ────────────────────────────────────────────────────

function ContentTable() {
  return (
    <Card>
      <SectionHeader
        title="Contenido Reciente"
        sub="Publicaciones y borradores"
        action={
          <button style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "6px 14px", borderRadius: 8,
            border: "1px solid rgba(0,0,0,0.09)", background: "none",
            color: "#374151", fontSize: 11, fontWeight: 600,
            cursor: "pointer", fontFamily: "var(--font-sans)",
          }}>
            <Filter size={11} /> Filtrar
          </button>
        }
      />
      <div>
        {CONTENT.map((c, i) => (
          <div key={c.id} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "12px 20px",
            borderBottom: i < CONTENT.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: `${(TYPE_MAP[c.type]?.color ?? "#9CA3AF")}12`,
              border: `1px solid ${(TYPE_MAP[c.type]?.color ?? "#9CA3AF")}20`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {(() => { const Icon = TYPE_MAP[c.type]?.icon ?? FileText; return <Icon size={16} color={TYPE_MAP[c.type]?.color ?? "#9CA3AF"} />; })()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 13, fontWeight: 600, color: "#1F2937",
                fontFamily: "var(--font-sans)", whiteSpace: "nowrap",
                overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {c.title}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <TypeBadge type={c.type} />
                <span style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>
                  {c.date}
                </span>
                {c.views > 0 && (
                  <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#6B7280" }}>
                    <Eye size={10} /> {c.views.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            <StatusPill status={c.status} />
            <button style={{
              width: 28, height: 28, borderRadius: 7,
              border: "1px solid rgba(0,0,0,0.08)", background: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#9CA3AF",
            }}>
              <MoreHorizontal size={14} />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Section: Notifications feed ───────────────────────────────────────────────

function NotificationsFeed() {
  const unread = NOTIFICATIONS.filter(n => !n.read).length;
  return (
    <Card>
      <SectionHeader
        title="Notificaciones Recientes"
        sub={`${unread} sin leer`}
        action={
          <button style={{
            fontSize: 11, color: BLUE, fontWeight: 600,
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "var(--font-sans)",
          }}>
            Marcar todo leído
          </button>
        }
      />
      <div>
        {NOTIFICATIONS.map((n, i) => (
          <div key={n.id} style={{
            display: "flex", alignItems: "flex-start", gap: 12, padding: "13px 20px",
            borderBottom: i < NOTIFICATIONS.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none",
            background: n.read ? "transparent" : `${n.color}04`,
          }}>
            {!n.read && (
              <div style={{
                width: 7, height: 7, borderRadius: "50%",
                background: n.color, flexShrink: 0, marginTop: 5,
              }} />
            )}
            {n.read && <div style={{ width: 7, flexShrink: 0 }} />}
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: `${n.color}12`, border: `1px solid ${n.color}20`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <n.icon size={15} color={n.color} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: n.read ? "#6B7280" : "#1F2937", fontFamily: "var(--font-sans)", fontWeight: n.read ? 400 : 600, lineHeight: 1.4 }}>
                {n.msg}
              </div>
              <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 3, fontFamily: "var(--font-sans)" }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
        <button style={{
          fontSize: 12, color: BLUE, fontWeight: 600,
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", gap: 4,
        }}>
          Ver todas las notificaciones <ChevronRight size={13} />
        </button>
      </div>
    </Card>
  );
}

// ── Section: Upcoming releases ────────────────────────────────────────────────

function UpcomingReleases() {
  return (
    <Card>
      <SectionHeader title="Próximos Lanzamientos" sub="Contenido programado" />
      <div style={{ padding: "6px 12px 12px" }}>
        {UPCOMING.map((u, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 10px", borderRadius: 10,
            background: i % 2 === 0 ? "transparent" : "#FAFAFA",
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: u.color, flexShrink: 0,
              boxShadow: `0 0 0 3px ${u.color}20`,
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#1F2937", fontFamily: "var(--font-sans)" }}>{u.title}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 3 }}>
                <TypeBadge type={u.type} />
                <span style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", gap: 3 }}>
                  <Calendar size={9} /> {u.date}
                </span>
              </div>
            </div>
            <button style={{
              width: 26, height: 26, borderRadius: 7,
              border: "1px solid rgba(0,0,0,0.08)", background: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#9CA3AF",
            }}>
              <Edit2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Charts section ────────────────────────────────────────────────────────────

function ChartsSection() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>

      {/* Membership distribution — Pie */}
      <Card style={{ padding: 0 }}>
        <SectionHeader title="Distribución de Membresías" sub="Por nivel activo" />
        <div style={{ padding: "0 20px 20px" }}>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={46} outerRadius={70}
                dataKey="value" stroke="none">
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={tt} formatter={(v: any) => [`${v} sponsors`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {pieData.map(e => (
              <div key={e.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: e.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "#6B7280", fontFamily: "var(--font-sans)" }}>{e.name}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#374151", marginLeft: "auto", fontFamily: "var(--font-display)" }}>{e.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Sponsor growth — stacked area */}
      <Card style={{ padding: 0 }}>
        <SectionHeader title="Crecimiento de Patrocinadores" sub="2025 por nivel" />
        <div style={{ padding: "0 16px 16px" }}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={growthData}>
              <defs>
                {[["gA", BLUE], ["gS", GREEN], ["gC", ORANGE], ["gG", MAGENTA]].map(([id, color]) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={color} stopOpacity={0}   />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={tt} />
              <Area type="monotone" dataKey="aliado"      stroke={BLUE}    fill="url(#gA)" strokeWidth={1.5} dot={false} name="Aliado"      />
              <Area type="monotone" dataKey="sembrador"   stroke={GREEN}   fill="url(#gS)" strokeWidth={1.5} dot={false} name="Sembrador"   />
              <Area type="monotone" dataKey="constructor" stroke={ORANGE}  fill="url(#gC)" strokeWidth={1.5} dot={false} name="Constructor" />
              <Area type="monotone" dataKey="guardian"    stroke={MAGENTA} fill="url(#gG)" strokeWidth={1.5} dot={false} name="Guardián"    />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Content consumption */}
      <Card style={{ padding: 0 }}>
        <SectionHeader title="Consumo de Contenido" sub="Vistas y descargas" />
        <div style={{ padding: "0 16px 16px" }}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={consumptionData} barSize={12} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="tipo" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={36} />
              <Tooltip contentStyle={tt} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
              <Bar dataKey="vistas"     fill={BLUE}   radius={[4, 4, 0, 0]} name="Vistas"     />
              <Bar dataKey="descargas"  fill={ORANGE}  radius={[4, 4, 0, 0]} name="Descargas"  />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

// ── Revenue chart ─────────────────────────────────────────────────────────────

function RevenueChart() {
  const [filter, setFilter] = useState("1M");

  let currentData = revenueData1A;
  if (filter === "1M") currentData = revenueData1M;
  else if (filter === "3M") currentData = revenueData1A.slice(-3);
  else if (filter === "6M") currentData = revenueData1A.slice(-6);
  else if (filter === "1A") currentData = revenueData1A;

  const totalIngreso = currentData.reduce((acc, curr) => acc + curr.ingreso, 0);

  const getSubtitle = () => {
    if (filter === "1M") return "MXN · Agosto 2025";
    if (filter === "3M") return "MXN · Últimos 3 meses";
    if (filter === "6M") return "MXN · Últimos 6 meses";
    return "MXN · Últimos 12 meses";
  };

  return (
    <Card style={{ marginBottom: 20 }}>
      <SectionHeader
        title="Ingresos Mensuales"
        sub="Evolución 2025 (MXN)"
        action={
          <div style={{ display: "flex", gap: 8 }}>
            {["1M", "3M", "6M", "1A"].map((r) => (
              <button key={r} onClick={() => setFilter(r)} style={{
                padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                border: filter === r ? "none" : "1px solid rgba(0,0,0,0.09)",
                background: filter === r ? BLUE : "none",
                color: filter === r ? "white" : "#6B7280",
                cursor: "pointer", fontFamily: "var(--font-sans)",
              }}>
                {r}
              </button>
            ))}
          </div>
        }
      />
      <div style={{ padding: "8px 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 30, fontWeight: 800, color: "#1F2937", fontFamily: "var(--font-display)" }}>
            ${totalIngreso.toLocaleString()}
          </span>
          <span style={{ fontSize: 13, color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>{getSubtitle()}</span>
          {filter === "1M" && (
            <span style={{
              display: "flex", alignItems: "center", gap: 3,
              fontSize: 12, fontWeight: 700, color: GREEN,
              background: "#ECFDF5", padding: "3px 9px", borderRadius: 99,
            }}>
              <TrendingUp size={11} /> +4.1% vs Julio
            </span>
          )}
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={currentData}>
            <defs>
              <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={BLUE} stopOpacity={0.15} />
                <stop offset="95%" stopColor={BLUE} stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
            <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={55}
              tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip contentStyle={tt} formatter={(v: any) => [`$${v.toLocaleString()} MXN`, "Ingreso"]} />
            <Area type="monotone" dataKey="ingreso" stroke={BLUE} strokeWidth={2.5} fill="url(#gRev)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

// ── Top bar ───────────────────────────────────────────────────────────────────

function TopBar({ page, setPage, onNewContent }: { page: AdminPage; setPage: (p: AdminPage) => void; onNewContent?: () => void }) {
  const labels: Record<AdminPage, string> = {
    dashboard: "Dashboard", patrocinadores: "Patrocinadores", contenido: "Contenido",
    reportes: "Reportes", metricas: "Métricas", notificaciones: "Notificaciones",
    comentarios: "Comentarios", configuracion: "Configuración",
  };
  const hideToolbar = page === "patrocinadores";
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginBottom: 24, gap: 16,
    }}>
      <div>
        <h1 style={{
          fontSize: 22, fontWeight: 800, color: "#1F2937",
          fontFamily: "var(--font-display)", margin: 0, letterSpacing: "-0.02em",
        }}>
          {labels[page]}
        </h1>
        <p style={{ fontSize: 13, color: "#9CA3AF", margin: "4px 0 0", fontFamily: "var(--font-sans)" }}>
          Panel de administración · EMV 2025
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {!hideToolbar && (
          <>
            <div style={{ position: "relative" }}>
              <Search size={14} style={{
                position: "absolute", left: 11, top: "50%",
                transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none",
              }} />
              <input placeholder="Buscar..." style={{
                padding: "8px 14px 8px 32px", borderRadius: 9,
                border: "1px solid rgba(0,0,0,0.09)", background: "white",
                fontSize: 13, color: "#1F2937", outline: "none",
                fontFamily: "var(--font-sans)", width: 200,
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }} />
            </div>
            {page === "contenido" && onNewContent && (
              <button onClick={onNewContent} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 16px", borderRadius: 9, border: "none",
                background: `linear-gradient(135deg,${BLUE},#1A8CBF)`,
                color: "white", fontSize: 12, fontWeight: 700,
                cursor: "pointer", fontFamily: "var(--font-display)",
                boxShadow: `0 4px 12px ${BLUE}35`,
              }}>
                <Plus size={14} /> Nuevo contenido
              </button>
            )}
          </>
        )}
        {/* Notification bell */}
        <button
          onClick={() => setPage("notificaciones")}
          style={{
            position: "relative", width: 36, height: 36, borderRadius: 9,
            border: "1px solid rgba(0,0,0,0.09)", background: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#6B7280",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
          <Bell size={16} />
          <span style={{
            position: "absolute", top: 6, right: 6, width: 7, height: 7,
            borderRadius: "50%", background: MAGENTA, border: "1.5px solid white",
          }} />
        </button>
      </div>
    </div>
  );
}

// ── Placeholder page ──────────────────────────────────────────────────────────

function PlaceholderPage({ title, icon: Icon, color }: { title: string; icon: React.ElementType; color: string }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: 400, gap: 14,
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 18,
        background: `${color}12`, border: `1px solid ${color}22`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={28} color={color} />
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#1F2937", fontFamily: "var(--font-display)" }}>
        {title}
      </div>
      <div style={{ fontSize: 14, color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>
        Esta sección está disponible en la versión completa.
      </div>
    </div>
  );
}

// ── Main dashboard content ───────────────────────────────────────────────��────

function DashboardContent() {
  const kpis = [
    { label: "Total Patrocinadores", value: "162",        delta: "+12%", positive: true,  icon: Users,        color: BLUE,    bg: `${BLUE}10`,    sub: undefined },
    { label: "Aliados activos",      value: "85",         delta: "+6%",  positive: true,  icon: Globe,        color: BLUE,    bg: `${BLUE}10`,    sub: "🤝 Aliado" },
    { label: "Sembradores",          value: "38",         delta: "+9%",  positive: true,  icon: Zap,          color: GREEN,   bg: `${GREEN}10`,   sub: "🌱 Sembrador" },
    { label: "Constructores",        value: "27",         delta: "+15%", positive: true,  icon: Shield,       color: ORANGE,  bg: `${ORANGE}10`,  sub: "🧱 Constructor" },
    { label: "Guardianes",           value: "12",         delta: "+20%", positive: true,  icon: Award,        color: MAGENTA, bg: `${MAGENTA}10`, sub: "🛡 Guardián" },
    { label: "Ingreso mensual",      value: "$435K",      delta: "+4%",  positive: true,  icon: DollarSign,   color: GREEN,   bg: `${GREEN}10`,   sub: "MXN" },
    { label: "Contenido activo",     value: "94",         delta: "+8%",  positive: true,  icon: BookOpen,     color: PURPLE,  bg: `${PURPLE}10`,  sub: "publicaciones" },
    { label: "Reportes publicados",  value: "18",         delta: "-2%",  positive: false, icon: FileText,     color: ORANGE,  bg: `${ORANGE}10`,  sub: "este trimestre" },
  ];

  return (
    <>
      {/* KPI grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        {kpis.map(k => <KPICard key={k.label} {...k} />)}
      </div>

      {/* Revenue + charts */}
      <RevenueChart />
      <ChartsSection />

      {/* Bottom grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginBottom: 20 }}>
        <SponsorsTable />
        <NotificationsFeed />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>
        <ContentTable />
        <UpcomingReleases />
      </div>
    </>
  );
}

function ConfiguracionPage() {
  const [phone, setPhone] = useState(localStorage.getItem("emv_contact_number") || "+528180000000");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem("emv_contact_number", phone);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ background: "white", padding: 32, borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1F2937", fontFamily: "var(--font-display)", marginBottom: 24 }}>Configuración General</h2>
      <div style={{ maxWidth: 400 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8, fontFamily: "var(--font-sans)" }}>
          Número de contacto (WhatsApp y Llamadas)
        </label>
        <div style={{ display: "flex", gap: 12 }}>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+52 81 8000 0000"
            style={{
              flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid #D1D5DB",
              fontSize: 14, fontFamily: "var(--font-sans)", outline: "none"
            }}
          />
          <button
            onClick={handleSave}
            style={{
              padding: "10px 16px", borderRadius: 8, border: "none", background: BLUE,
              color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)"
            }}
          >
            Guardar
          </button>
        </div>
        {saved && (
          <p style={{ marginTop: 10, fontSize: 12, color: GREEN, fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", gap: 4 }}>
            <CheckCircle size={14} /> Número actualizado exitosamente
          </p>
        )}
      </div>
    </div>
  );
}

function ContenidoPage() {
  return (
    <div style={{ display: "grid", gap: 20 }}>
      <ContentTable />
      <UpcomingReleases />
    </div>
  );
}

function ReportesPage() {
  const reportes = CONTENT.filter(c => c.type === "Reporte");
  return (
    <Card>
      <SectionHeader title="Gestión de Reportes" sub="Sube y administra los reportes de impacto trimestrales y anuales" />
      <div>
        {reportes.map((c, i) => (
          <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 20px", borderBottom: i < reportes.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: `${ORANGE}12`, border: `1px solid ${ORANGE}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileText size={16} color={ORANGE} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1F2937", fontFamily: "var(--font-sans)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.title}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <span style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>{c.date}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#6B7280" }}><Eye size={10} /> {c.views.toLocaleString()} vistas</span>
              </div>
            </div>
            <StatusPill status={c.status} />
            <button style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid rgba(0,0,0,0.08)", background: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#9CA3AF" }}>
              <MoreHorizontal size={14} />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

function MetricasPage() {
  return (
    <div style={{ display: "grid", gap: 20 }}>
      <ChartsSection />
      <RevenueChart />
    </div>
  );
}

function NotificacionesPage() {
  return (
    <div style={{ display: "grid", gap: 20, gridTemplateColumns: "1fr 300px" }}>
      <NotificationsFeed />
      <Card>
        <SectionHeader title="Nueva Notificación" sub="Enviar a aliados" />
        <div style={{ padding: "16px 20px" }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, fontFamily: "var(--font-sans)" }}>Mensaje</label>
          <textarea rows={4} placeholder="Escribe el mensaje aquí..." style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 13, fontFamily: "var(--font-sans)", outline: "none", resize: "none", marginBottom: 12 }} />
          <button style={{ width: "100%", padding: "8px 16px", borderRadius: 8, border: "none", background: BLUE, color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-display)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Send size={14} /> Enviar notificación
          </button>
        </div>
      </Card>
    </div>
  );
}

function ComentariosPage() {
  const comentarios = [
    { id: 1, user: "Juan Pérez", empresa: "Banorte", msg: "Excelente el webinar de liderazgo.", date: "Hace 2 horas" },
    { id: 2, user: "Ana Gómez", empresa: "Femsa", msg: "¿Cuándo publican el reporte anual?", date: "Ayer" },
    { id: 3, user: "Luis Torres", empresa: "CEMEX", msg: "Tuvimos problemas para descargar el certificado.", date: "Hace 2 días" },
  ];

  return (
    <Card>
      <SectionHeader title="Comentarios y Retroalimentación" sub="Mensajes de la comunidad" />
      <div>
        {comentarios.map((c, i) => (
          <div key={c.id} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 20px", borderBottom: i < comentarios.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${BLUE}12`, display: "flex", alignItems: "center", justifyContent: "center", color: BLUE, fontWeight: 700, fontSize: 14 }}>
              {c.user.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1F2937", fontFamily: "var(--font-display)" }}>{c.user} <span style={{ fontWeight: 400, color: "#6B7280" }}>({c.empresa})</span></span>
                <span style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>{c.date}</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "#4B5563", fontFamily: "var(--font-sans)", lineHeight: 1.5 }}>{c.msg}</p>
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <button style={{ fontSize: 11, fontWeight: 600, color: BLUE, background: "none", border: "none", cursor: "pointer" }}>Responder</button>
                <button style={{ fontSize: 11, fontWeight: 600, color: "#EF4444", background: "none", border: "none", cursor: "pointer" }}>Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

interface Props { onBack: () => void; }

export function AdminDashboard({ onBack }: Props) {
  const [page, setPage] = useState<AdminPage>("dashboard");
  const [showNewContentModal, setShowNewContentModal] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: BG }}>
      <AdminSidebar page={page} setPage={setPage} onBack={onBack} />
      <main style={{ marginLeft: SIDEBAR_W, flex: 1, padding: "28px 32px 60px", minWidth: 0, position: "relative" }}>
        <TopBar page={page} setPage={setPage} onNewContent={() => setShowNewContentModal(true)} />
        {page === "dashboard" && <DashboardContent />}
        {page === "patrocinadores" && (
          <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
            <SponsorManagement />
          </div>
        )}
        {page === "contenido" && <ContenidoPage />}
        {page === "reportes" && <ReportesPage />}
        {page === "metricas" && <MetricasPage />}
        {page === "notificaciones" && <NotificacionesPage />}
        {page === "comentarios" && <ComentariosPage />}
        {page === "configuracion" && <ConfiguracionPage />}
      </main>

      {/* Modal for Creating Content */}
      {showNewContentModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{ background: "white", padding: 32, borderRadius: 16, width: "100%", maxWidth: 500, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1F2937", margin: 0, fontFamily: "var(--font-display)" }}>Crear Nuevo Contenido</h2>
              <button onClick={() => setShowNewContentModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}><X size={20} /></button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, fontFamily: "var(--font-sans)" }}>Título</label>
                <input type="text" placeholder="Ej. Webinar Liderazgo" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 14, fontFamily: "var(--font-sans)", outline: "none" }} />
              </div>
              
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, fontFamily: "var(--font-sans)" }}>Tipo</label>
                  <select style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 14, fontFamily: "var(--font-sans)", outline: "none", background: "white" }}>
                    <option>Webinar</option>
                    <option>Curso</option>
                    <option>Reporte</option>
                    <option>Video</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, fontFamily: "var(--font-sans)" }}>Nivel Requerido</label>
                  <select style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 14, fontFamily: "var(--font-sans)", outline: "none", background: "white" }}>
                    <option>Aliado</option>
                    <option>Sembrador</option>
                    <option>Constructor</option>
                    <option>Guardián</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, fontFamily: "var(--font-sans)" }}>Descripción</label>
                <textarea rows={3} placeholder="Breve descripción del contenido..." style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 14, fontFamily: "var(--font-sans)", outline: "none", resize: "none" }} />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
                <button onClick={() => setShowNewContentModal(false)} style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #D1D5DB", background: "white", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
                  Cancelar
                </button>
                <button onClick={() => setShowNewContentModal(false)} style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: BLUE, color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
                  Publicar Contenido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
