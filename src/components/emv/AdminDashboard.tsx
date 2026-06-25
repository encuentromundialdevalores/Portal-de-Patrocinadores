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
import { createContext, useContext, useEffect } from "react";
import { getAdminDashboardData, getSubscriptions, getComments, createNotification } from "@/app/actions";
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
  | "dashboard" | "patrocinadores" | "suscripciones" | "contenido"
  | "reportes" | "metricas" | "notificaciones"
  | "comentarios" | "configuracion";

// ── Context ───────────────────────────────────────────────────────────────────
const AdminDataContext = createContext<any>(null);

// ── Tooltip style ─────────────────────────────────────────────────────────────

const tt = {
  background: "white", border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
  fontSize: 12, fontFamily: "var(--font-sans)",
};

// ── Sidebar ───────────────────────────────────────────────────────────────────

const NAV: { icon: React.ElementType; label: string; page: AdminPage; badge?: number }[] = [
  { icon: LayoutDashboard, label: "Dashboard",       page: "dashboard"       },
  { icon: Users,           label: "Patrocinadores",  page: "patrocinadores"  },
  { icon: DollarSign,      label: "Suscripciones",   page: "suscripciones"   },
  { icon: BookOpen,        label: "Contenido",       page: "contenido"       },
  { icon: FileText,        label: "Reportes",        page: "reportes"        },
  { icon: Activity,        label: "Métricas",        page: "metricas"        },
  { icon: Bell,            label: "Notificaciones",  page: "notificaciones"  },
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
  const data = useContext(AdminDataContext);
  const sponsors = data?.recentSponsors || [];

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
            {sponsors.length === 0 && (
              <tr><td colSpan={6} style={{ padding: "12px 16px", textAlign: "center", fontSize: 12, color: "#9CA3AF" }}>No hay patrocinadores recientes</td></tr>
            )}
            {sponsors.map((s: any, i: number) => (
              <tr key={s.id} style={{ borderBottom: i < sponsors.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: `linear-gradient(135deg,${BLUE}30,${BLUE}15)`,
                      border: `1px solid ${BLUE}25`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 800, color: BLUE, fontFamily: "var(--font-display)",
                    }}>
                      {s.name.substring(0,2).toUpperCase()}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1F2937", fontFamily: "var(--font-sans)" }}>{s.name}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "2px 8px", borderRadius: 99,
                    background: `${BLUE}12`, border: `1px solid ${BLUE}22`,
                    color: BLUE, fontSize: 10, fontWeight: 700, fontFamily: "var(--font-display)",
                  }}>
                    {s.users?.[0]?.membership === "NONE" ? "SIN MEMBRESÍA" : s.users?.[0]?.membership || "SIN MEMBRESÍA"}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  {(() => {
                    const sub = s.subscriptions?.[0];
                    const monthly = sub?.amount
                      ? Math.round((sub.interval === "year" ? sub.amount / 12 : sub.amount) / 100)
                      : 0;
                    return (
                      <>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#1F2937", fontFamily: "var(--font-display)" }}>
                          ${monthly.toLocaleString("es-MX")}
                        </span>
                        <span style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>/mes</span>
                      </>
                    );
                  })()}
                </td>
                <td style={{ padding: "12px 16px" }}><StatusPill status={s.isActive ? "activo" : "inactivo"} /></td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontSize: 12, color: "#6B7280", fontFamily: "var(--font-sans)" }}>{new Date(s.createdAt).toLocaleDateString()}</span>
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
  const data = useContext(AdminDataContext);
  const content = data?.recentContent || [];

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
        {content.length === 0 && <div style={{ padding: "12px 20px", fontSize: 12, color: "#9CA3AF", textAlign: "center" }}>No hay contenido disponible</div>}
        {content.map((c: any, i: number) => (
          <div key={c.id} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "12px 20px",
            borderBottom: i < content.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none",
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
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <StatusPill status={c.isActive ? "publicado" : "borrador"} />
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
  const data = useContext(AdminDataContext);
  const notifications = data?.notifications || [];
  const unread = notifications.filter((n: any) => !n.read).length;
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
        {notifications.length === 0 && <div style={{ padding: "12px 20px", fontSize: 12, color: "#9CA3AF", textAlign: "center" }}>No hay notificaciones</div>}
        {notifications.map((n: any, i: number) => (
          <div key={n.id} style={{
            display: "flex", alignItems: "flex-start", gap: 12, padding: "13px 20px",
            borderBottom: i < notifications.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none",
            background: n.read ? "transparent" : `${BLUE}04`,
          }}>
            {!n.read && (
              <div style={{
                width: 7, height: 7, borderRadius: "50%",
                background: BLUE, flexShrink: 0, marginTop: 5,
              }} />
            )}
            {n.read && <div style={{ width: 7, flexShrink: 0 }} />}
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: `${BLUE}12`, border: `1px solid ${BLUE}20`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Bell size={15} color={BLUE} />
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
        <div style={{ padding: "12px 20px", fontSize: 12, color: "#9CA3AF", textAlign: "center" }}>No hay contenido programado</div>
      </div>
    </Card>
  );
}

// ── Charts section ────────────────────────────────────────────────────────────

function ChartsSection() {
  const data = useContext(AdminDataContext);
  
  // Transform membership data
  const membershipData = data?.membershipCounts?.map((m: any) => ({
    name: m.membership,
    value: m._count.membership,
    color: m.membership === 'ALIADO' ? BLUE : m.membership === 'SEMBRADOR' ? GREEN : m.membership === 'CONSTRUCTOR' ? ORANGE : m.membership === 'GUARDIAN' ? MAGENTA : "#9CA3AF"
  })) || [];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>

      {/* Membership distribution — Pie */}
      <Card style={{ padding: 0 }}>
        <SectionHeader title="Distribución de Membresías" sub="Por nivel activo" />
        <div style={{ padding: "0 20px 20px" }}>
          {membershipData.length === 0 ? (
            <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#9CA3AF" }}>Sin datos</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={membershipData} cx="50%" cy="50%" innerRadius={46} outerRadius={70}
                    dataKey="value" stroke="none">
                    {membershipData.map((e: any, i: number) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={tt} formatter={(v: any) => [`${v} sponsors`, ""]} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {membershipData.map((e: any) => (
                  <div key={e.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: e.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: "#6B7280", fontFamily: "var(--font-sans)" }}>{e.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#374151", marginLeft: "auto", fontFamily: "var(--font-display)" }}>{e.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Placeholder blocks since we do not track time-series yet */}
      <Card style={{ padding: 0 }}>
        <SectionHeader title="Crecimiento de Patrocinadores" sub="Este año por nivel" />
        <div style={{ padding: "0 16px 16px", height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF", fontSize: 12 }}>
          Requiere históricos en BD
        </div>
      </Card>

      <Card style={{ padding: 0 }}>
        <SectionHeader title="Consumo de Contenido" sub="Vistas y descargas" />
        <div style={{ padding: "0 16px 16px", height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF", fontSize: 12 }}>
           Requiere históricos en BD
        </div>
      </Card>
    </div>
  );
}

// ── Revenue chart ─────────────────────────────────────────────────────────────

function RevenueChart() {
  const data = useContext(AdminDataContext);
  const mrr = Math.round((data?.mrrCents || 0) / 100);
  const annual = mrr * 12;
  const active = data?.activeSubscriptions || 0;

  return (
    <Card style={{ marginBottom: 20 }}>
      <SectionHeader
        title="Ingresos por Suscripciones"
        sub="Calculado desde Stripe (MXN)"
      />
      <div style={{ padding: "16px 20px 22px", display: "flex", gap: 16, flexWrap: "wrap" }}>
        {[
          { label: "Ingreso Mensual Recurrente (MRR)", value: `$${mrr.toLocaleString("es-MX")}`, sub: "MXN / mes", color: GREEN },
          { label: "Proyección Anual (ARR)", value: `$${annual.toLocaleString("es-MX")}`, sub: "MXN / año", color: BLUE },
          { label: "Suscripciones Activas", value: active.toString(), sub: "aliados pagando", color: PURPLE },
        ].map((m) => (
          <div key={m.label} style={{
            flex: 1, minWidth: 160, padding: "16px 18px", borderRadius: 12,
            background: `${m.color}08`, border: `1px solid ${m.color}22`,
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", fontFamily: "var(--font-sans)", marginBottom: 8 }}>{m.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#1F2937", fontFamily: "var(--font-display)" }}>{m.value}</div>
            <div style={{ fontSize: 11, color: m.color, fontFamily: "var(--font-sans)", marginTop: 2 }}>{m.sub}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Top bar ───────────────────────────────────────────────────────────────────

function TopBar({ page, setPage, onNewContent }: { page: AdminPage; setPage: (p: AdminPage) => void; onNewContent?: () => void }) {
  const labels: Record<AdminPage, string> = {
    dashboard: "Dashboard", patrocinadores: "Patrocinadores", suscripciones: "Suscripciones",
    contenido: "Contenido", reportes: "Reportes", metricas: "Métricas",
    notificaciones: "Notificaciones", comentarios: "Comentarios", configuracion: "Configuración",
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
  const data = useContext(AdminDataContext);
  
  const mrr = Math.round((data?.mrrCents || 0) / 100);
  const kpis = [
    { label: "Total Patrocinadores", value: (data?.totalUsers || 0).toString(),        delta: "0%", positive: true,  icon: Users,        color: BLUE,    bg: `${BLUE}10`,    sub: undefined },
    { label: "Ingreso Mensual (MRR)", value: `$${mrr.toLocaleString("es-MX")}`,         delta: `${data?.activeSubscriptions || 0} activas`,  positive: true,  icon: TrendingUp,   color: GREEN,   bg: `${GREEN}10`,   sub: "MXN/mes" },
    { label: "Organizaciones Activas",      value: (data?.activeOrganizations || 0).toString(),         delta: "0%",  positive: true,  icon: Globe,        color: BLUE,    bg: `${BLUE}10`,    sub: undefined },
    { label: "Contenido activo",     value: (data?.totalContent || 0).toString(),         delta: "0%",  positive: true,  icon: BookOpen,     color: PURPLE,  bg: `${PURPLE}10`,  sub: undefined },
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
  const data = useContext(AdminDataContext);
  const content = data?.recentContent || [];
  const reportes = content.filter((c: any) => c.type === "Reporte" || c.type === "REPORT");
  return (
    <Card>
      <SectionHeader title="Gestión de Reportes" sub="Sube y administra los reportes de impacto trimestrales y anuales" />
      <div>
        {reportes.map((c: any, i: number) => (
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
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    setFeedback(null);
    const res = await createNotification(title, message);
    setSending(false);
    if (res.success) {
      setMessage("");
      setTitle("");
      setFeedback("Notificación enviada. Recarga para verla en el feed.");
    } else {
      setFeedback(res.error || "No se pudo enviar");
    }
  };

  return (
    <div style={{ display: "grid", gap: 20, gridTemplateColumns: "1fr 300px" }}>
      <NotificationsFeed />
      <Card>
        <SectionHeader title="Nueva Notificación" sub="Enviar a aliados" />
        <div style={{ padding: "16px 20px" }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, fontFamily: "var(--font-sans)" }}>Título</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título (opcional)" style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 13, fontFamily: "var(--font-sans)", outline: "none", marginBottom: 12 }} />
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, fontFamily: "var(--font-sans)" }}>Mensaje</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Escribe el mensaje aquí..." style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 13, fontFamily: "var(--font-sans)", outline: "none", resize: "none", marginBottom: 12 }} />
          <button onClick={handleSend} disabled={sending || !message.trim()} style={{ width: "100%", padding: "8px 16px", borderRadius: 8, border: "none", background: sending || !message.trim() ? "#9CA3AF" : BLUE, color: "white", fontSize: 12, fontWeight: 700, cursor: sending || !message.trim() ? "not-allowed" : "pointer", fontFamily: "var(--font-display)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Send size={14} /> {sending ? "Enviando..." : "Enviar notificación"}
          </button>
          {feedback && <div style={{ marginTop: 10, fontSize: 11, color: "#6B7280", fontFamily: "var(--font-sans)" }}>{feedback}</div>}
        </div>
      </Card>
    </div>
  );
}

function ComentariosPage() {
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getComments().then((res) => {
      if (res.success && res.data) setComentarios(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <Card>
      <SectionHeader title="Comentarios y Retroalimentación" sub="Mensajes de la comunidad" />
      <div>
        {loading && <div style={{ padding: "20px", textAlign: "center", fontSize: 12, color: "#9CA3AF" }}>Cargando...</div>}
        {!loading && comentarios.length === 0 && (
          <div style={{ padding: "24px", textAlign: "center", fontSize: 13, color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>
            Aún no hay comentarios de la comunidad.
          </div>
        )}
        {comentarios.map((c, i) => (
          <div key={c.id} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 20px", borderBottom: i < comentarios.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${BLUE}12`, display: "flex", alignItems: "center", justifyContent: "center", color: BLUE, fontWeight: 700, fontSize: 14 }}>
              {(c.user || "?").charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1F2937", fontFamily: "var(--font-display)" }}>{c.user} <span style={{ fontWeight: 400, color: "#6B7280" }}>({c.empresa})</span></span>
                <span style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "#4B5563", fontFamily: "var(--font-sans)", lineHeight: 1.5 }}>{c.msg}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SuscripcionesPage() {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubscriptions().then((res) => {
      if (res.success && res.data) setSubs(res.data);
      setLoading(false);
    });
  }, []);

  const fmtMoney = (amount: number | null, interval: string | null) => {
    if (!amount) return "—";
    const val = Math.round(amount / 100);
    return `$${val.toLocaleString("es-MX")} ${interval === "year" ? "/año" : "/mes"}`;
  };

  return (
    <Card>
      <SectionHeader title="Suscripciones" sub="Pagos recurrentes vía Stripe" />
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["Empresa", "Contacto", "Plan", "Monto", "Estado", "Renovación", "Inicio"].map((h) => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9CA3AF", fontFamily: "var(--font-sans)", borderBottom: "1px solid rgba(0,0,0,0.05)", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} style={{ padding: "20px", textAlign: "center", fontSize: 12, color: "#9CA3AF" }}>Cargando...</td></tr>}
            {!loading && subs.length === 0 && (
              <tr><td colSpan={7} style={{ padding: "24px", textAlign: "center", fontSize: 13, color: "#9CA3AF" }}>Aún no hay suscripciones registradas.</td></tr>
            )}
            {subs.map((s, i) => (
              <tr key={s.id} style={{ borderBottom: i < subs.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#1F2937", fontFamily: "var(--font-sans)" }}>{s.organizationName}</td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ fontSize: 12, color: "#374151" }}>{s.contactName}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>{s.contactEmail}</div>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 99, background: `${BLUE}12`, border: `1px solid ${BLUE}22`, color: BLUE, fontSize: 10, fontWeight: 700, textTransform: "capitalize", fontFamily: "var(--font-display)" }}>{s.planName}</span>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: "#1F2937", fontFamily: "var(--font-display)" }}>{fmtMoney(s.amount, s.interval)}</td>
                <td style={{ padding: "12px 16px" }}><StatusPill status={s.status === "active" ? "activo" : s.status === "canceled" ? "inactivo" : "pendiente"} /></td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: "#6B7280", fontFamily: "var(--font-sans)" }}>{s.currentPeriodEnd ? new Date(s.currentPeriodEnd).toLocaleDateString() : "—"}</td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: "#6B7280", fontFamily: "var(--font-sans)" }}>{new Date(s.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

interface Props { onBack: () => void; }

export function AdminDashboard({ onBack }: Props) {
  const [page, setPage] = useState<AdminPage>("dashboard");
  const [showNewContentModal, setShowNewContentModal] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboardData().then(res => {
      if (res.success) {
        setDashboardData(res.data);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div style={{ display: "flex", minHeight: "100vh", background: BG, alignItems: "center", justifyContent: "center", color: "#6B7280" }}>Cargando datos...</div>;
  }

  return (
    <AdminDataContext.Provider value={dashboardData}>
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
        {page === "suscripciones" && <SuscripcionesPage />}
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
    </AdminDataContext.Provider>
  );
}
