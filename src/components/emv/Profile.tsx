"use client";
import { useState, useEffect } from "react";
import {
  User, Mail, Phone, Globe, Building2, MapPin, Briefcase,
  Save, Edit2, Camera, Shield, Bell, Lock, Check,
  LogOut, ChevronRight, Award, Calendar, Clock, Eye, EyeOff,
  BookOpen, Video, FileText, TrendingUp, Star, CheckCircle,
} from "lucide-react";
import { Sidebar, Page } from "./Sidebar";
import { getProfileData } from "@/app/actions";

// Mapea el tipo de contenido a un icono/color para el feed de actividad.
const ACTIVITY_ICON: Record<string, { icon: React.ElementType; color: string }> = {
  VIDEO: { icon: Video, color: "#29ABE2" },
  PDF: { icon: FileText, color: "#F7941D" },
  REPORT: { icon: FileText, color: "#F7941D" },
  CURSO: { icon: BookOpen, color: "#10B981" },
};
const activityVisual = (type: string) => ACTIVITY_ICON[type?.toUpperCase()] ?? { icon: BookOpen, color: "#29ABE2" };

const EMV_BLUE    = "#29ABE2";
const EMV_ORANGE  = "#F7941D";
const EMV_MAGENTA = "#EC008C";
const GREEN       = "#10B981";
const BG          = "#F4F6F9";

// ── Types & data ──────────────────────────────────────────────────────────────

interface UserProfile {
  name:        string;
  role:        string;
  email:       string;
  phone:       string;
  company:     string;
  industry:    string;
  city:        string;
  website:     string;
  bio:         string;
  avatar:      string; // initials
  avatarColor: string;
  tier:        string;
  memberSince: string;
}

const INITIAL: UserProfile = {
  name:        "Alejandro García",
  role:        "Director de Responsabilidad Social",
  email:       "a.garcia@empresa-xyz.com",
  phone:       "+52 55 1234 5678",
  company:     "Empresa XYZ",
  industry:    "Manufactura",
  city:        "Ciudad de México",
  website:     "empresa-xyz.com",
  bio:         "Comprometido con generar impacto social positivo a través de programas de valores y liderazgo ético en nuestra organización.",
  avatar:      "AG",
  avatarColor: EMV_ORANGE,
  tier:        "Constructor",
  memberSince: "Febrero 2024",
};

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "white", borderRadius: 16,
      border: "1px solid rgba(0,0,0,0.07)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
      overflow: "hidden", marginBottom: 20,
    }}>
      <div style={{
        padding: "18px 24px 14px",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: 0, fontFamily: "var(--font-display)" }}>
          {title}
        </h2>
      </div>
      <div style={{ padding: "20px 24px" }}>{children}</div>
    </div>
  );
}

function Field({ label, value, icon: Icon, editing, onChange, type = "text", multiline = false }: {
  label: string; value: string; icon: React.ElementType;
  editing: boolean; onChange: (v: string) => void;
  type?: string; multiline?: boolean;
}) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#9CA3AF", letterSpacing: "0.06em", marginBottom: 6, fontFamily: "var(--font-sans)" }}>
        {label.toUpperCase()}
      </label>
      {editing ? (
        multiline ? (
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            rows={3}
            style={{
              width: "100%", padding: "9px 12px", borderRadius: 9,
              border: `1.5px solid ${EMV_BLUE}`, background: "#F0F9FD",
              fontSize: 13, color: "#1F2937", outline: "none",
              fontFamily: "var(--font-sans)", resize: "none", lineHeight: 1.5,
              boxSizing: "border-box", boxShadow: `0 0 0 3px ${EMV_BLUE}15`,
            }}
          />
        ) : (
          <div style={{ position: "relative" }}>
            <Icon size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: EMV_BLUE, pointerEvents: "none" }} />
            <input
              type={type}
              value={value}
              onChange={e => onChange(e.target.value)}
              style={{
                width: "100%", padding: "9px 12px 9px 32px", borderRadius: 9,
                border: `1.5px solid ${EMV_BLUE}`, background: "#F0F9FD",
                fontSize: 13, color: "#1F2937", outline: "none",
                fontFamily: "var(--font-sans)", boxSizing: "border-box",
                boxShadow: `0 0 0 3px ${EMV_BLUE}15`,
              }}
            />
          </div>
        )
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0" }}>
          <Icon size={14} color="#9CA3AF" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: value ? "#1F2937" : "#C4C9D4", fontFamily: "var(--font-sans)" }}>
            {value || "—"}
          </span>
        </div>
      )}
    </div>
  );
}

function PasswordField({ label }: { label: string }) {
  const [show, setShow] = useState(false);
  const [val, setVal]   = useState("");
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#9CA3AF", letterSpacing: "0.06em", marginBottom: 6, fontFamily: "var(--font-sans)" }}>
        {label.toUpperCase()}
      </label>
      <div style={{ position: "relative" }}>
        <Lock size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} />
        <input
          type={show ? "text" : "password"}
          value={val}
          onChange={e => setVal(e.target.value)}
          placeholder="••••••••"
          style={{
            width: "100%", padding: "9px 40px 9px 32px", borderRadius: 9,
            border: "1.5px solid rgba(0,0,0,0.12)", background: "#F9FAFB",
            fontSize: 13, color: "#1F2937", outline: "none",
            fontFamily: "var(--font-sans)", boxSizing: "border-box",
          }}
        />
        <button onClick={() => setShow(s => !s)} style={{
          position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
          background: "none", border: "none", cursor: "pointer", color: "#9CA3AF",
          display: "flex", alignItems: "center",
        }}>
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

interface Props {
  onNavigate: (p: Page) => void;
  onLogout: () => void;
  userTier?: string;
  email?: string;
}

export function Profile({ onNavigate, onLogout, userTier = "Constructor", email }: Props) {
  const [profile, setProfile] = useState<UserProfile>(INITIAL);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState<UserProfile>(INITIAL);
  const [saved, setSaved]     = useState(false);
  const [activity, setActivity] = useState<{ id: string; label: string; type: string; date: string }[]>([]);
  const [achievements, setAchievements] = useState<{ id: string; emoji: string; label: string; desc: string; achieved: boolean }[]>([]);

  useEffect(() => {
    if (!email) return;
    getProfileData(email).then((res) => {
      if (!res.success || !res.data) return;
      const u = res.data.user;
      setActivity(res.data.activity);
      setAchievements(res.data.achievements);
      setProfile((prev) => ({
        ...prev,
        name: u.name || prev.name,
        email: u.email || prev.email,
        company: u.companyName || u.organization?.name || prev.company,
        phone: u.phone || prev.phone,
        memberSince: new Date(u.createdAt).toLocaleDateString("es-MX", { month: "long", year: "numeric" }),
      }));
    });
  }, [email]);

  const [notifEmail,  setNotifEmail]  = useState(true);
  const [notifWebinar,setNotifWebinar]= useState(true);
  const [notifReport, setNotifReport] = useState(false);
  const [notifNews,   setNotifNews]   = useState(true);

  const startEdit = () => { setDraft(profile); setEditing(true); setSaved(false); };
  const cancelEdit = () => { setEditing(false); };
  const saveEdit = () => {
    setProfile(draft);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const set = (key: keyof UserProfile) => (val: string) => setDraft(d => ({ ...d, [key]: val }));
  const cur = editing ? draft : profile;

  const toggle = (cb: (v: boolean) => void) => (prev: boolean) => cb(!prev);

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      style={{
        width: 40, height: 22, borderRadius: 11, border: "none",
        background: value ? EMV_BLUE : "#D1D5DB",
        cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute", top: 3, left: value ? 20 : 3,
        width: 16, height: 16, borderRadius: "50%", background: "white",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        transition: "left 0.2s",
      }} />
    </button>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: BG }}>
      <Sidebar currentPage="profile" onNavigate={onNavigate} onLogout={onLogout} />

      <main style={{ marginLeft: 220, flex: 1, padding: "32px 36px 60px", minWidth: 0 }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1F2937", fontFamily: "var(--font-display)", margin: 0, letterSpacing: "-0.02em" }}>
              Mi Perfil
            </h1>
            <p style={{ fontSize: 14, color: "#6B7280", margin: "6px 0 0", fontFamily: "var(--font-sans)" }}>
              Gestiona tu información personal y preferencias de cuenta.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {saved && (
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: GREEN, fontWeight: 600, fontFamily: "var(--font-sans)" }}>
                <CheckCircle size={15} /> Cambios guardados
              </div>
            )}
            {editing ? (
              <>
                <button onClick={cancelEdit} style={{
                  padding: "9px 18px", borderRadius: 9,
                  border: "1px solid rgba(0,0,0,0.1)", background: "none",
                  color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)",
                }}>
                  Cancelar
                </button>
                <button onClick={saveEdit} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "9px 20px", borderRadius: 9, border: "none",
                  background: EMV_BLUE, color: "white", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", fontFamily: "var(--font-display)",
                  boxShadow: `0 4px 12px ${EMV_BLUE}35`,
                }}>
                  <Save size={14} /> Guardar cambios
                </button>
              </>
            ) : (
              <button onClick={startEdit} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "9px 20px", borderRadius: 9,
                border: "1px solid rgba(0,0,0,0.1)", background: "white",
                color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}>
                <Edit2 size={14} /> Editar perfil
              </button>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, alignItems: "start" }}>

          {/* ── Left column ── */}
          <div>
            {/* Avatar card */}
            <div style={{
              background: "white", borderRadius: 16,
              border: "1px solid rgba(0,0,0,0.07)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
              padding: "28px 24px", textAlign: "center", marginBottom: 20,
            }}>
              {/* Avatar */}
              <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
                <div style={{
                  width: 88, height: 88, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${profile.avatarColor}, ${profile.avatarColor}CC)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, fontWeight: 800, color: "white",
                  fontFamily: "var(--font-display)",
                  boxShadow: `0 6px 24px ${profile.avatarColor}40`,
                }}>
                  {profile.avatar}
                </div>
                <button style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: 28, height: 28, borderRadius: "50%",
                  background: EMV_BLUE, border: "2.5px solid white",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}>
                  <Camera size={13} color="white" />
                </button>
              </div>

              <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1F2937", margin: "0 0 4px", fontFamily: "var(--font-display)" }}>
                {profile.name}
              </h2>
              <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 12px", fontFamily: "var(--font-sans)" }}>
                {profile.role}
              </p>
              <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 16px", fontFamily: "var(--font-sans)" }}>
                {profile.company} · {profile.city}
              </p>

              {/* Tier badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: 99,
                background: `${EMV_ORANGE}12`, border: `1px solid ${EMV_ORANGE}25`,
              }}>
                <span style={{ fontSize: 16 }}>🧱</span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>Nivel</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: EMV_ORANGE, fontFamily: "var(--font-display)" }}>Constructor</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 18 }}>
                {[
                  { label: "Miembro desde", value: profile.memberSince, icon: Calendar },
                  { label: "Contenido visto", value: "72",            icon: Eye },
                  { label: "Cursos completos", value: "11",           icon: BookOpen },
                  { label: "Reportes",         value: "14",           icon: FileText },
                ].map(s => (
                  <div key={s.label} style={{
                    padding: "10px", borderRadius: 10,
                    background: "#F8FAFC", border: "1px solid rgba(0,0,0,0.06)",
                    textAlign: "center",
                  }}>
                    <s.icon size={14} color="#9CA3AF" style={{ marginBottom: 4 }} />
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#1F2937", fontFamily: "var(--font-display)", lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2, fontFamily: "var(--font-sans)" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div style={{
              background: "white", borderRadius: 16,
              border: "1px solid rgba(0,0,0,0.07)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
              overflow: "hidden",
            }}>
              <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: 0, fontFamily: "var(--font-display)" }}>Logros</h3>
                <p style={{ fontSize: 11, color: "#9CA3AF", margin: "2px 0 0", fontFamily: "var(--font-sans)" }}>{achievements.filter(a => a.achieved).length} de {achievements.length} desbloqueados</p>
              </div>
              <div style={{ padding: "14px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                {achievements.length === 0 && (
                  <div style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "var(--font-sans)", textAlign: "center", padding: "8px 0" }}>Sin logros aún</div>
                )}
                {achievements.map(a => (
                  <div key={a.id} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    opacity: a.achieved ? 1 : 0.45,
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: a.achieved ? "#FFFBEB" : "#F3F4F6",
                      border: a.achieved ? "1px solid #FDE68A" : "1px solid rgba(0,0,0,0.06)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18,
                    }}>
                      {a.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#1F2937", fontFamily: "var(--font-display)" }}>{a.label}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>{a.desc}</div>
                    </div>
                    {a.achieved && <Check size={14} color={GREEN} />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right column ── */}
          <div>
            {/* Personal info */}
            <Section title="Información Personal">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="Nombre completo"  value={cur.name}    icon={User}      editing={editing} onChange={set("name")} />
                <Field label="Cargo / Rol"      value={cur.role}    icon={Briefcase} editing={editing} onChange={set("role")} />
                <Field label="Correo electrónico" value={cur.email} icon={Mail}      editing={editing} onChange={set("email")} type="email" />
                <Field label="Teléfono"         value={cur.phone}   icon={Phone}     editing={editing} onChange={set("phone")} type="tel" />
              </div>
              <div style={{ marginTop: 16 }}>
                <Field label="Acerca de mí" value={cur.bio} icon={User} editing={editing} onChange={set("bio")} multiline />
              </div>
            </Section>

            {/* Company info */}
            <Section title="Información de Empresa">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="Empresa"    value={cur.company}  icon={Building2} editing={editing} onChange={set("company")} />
                <Field label="Industria"  value={cur.industry} icon={Briefcase} editing={editing} onChange={set("industry")} />
                <Field label="Ciudad"     value={cur.city}     icon={MapPin}    editing={editing} onChange={set("city")} />
                <Field label="Sitio web"  value={cur.website}  icon={Globe}     editing={editing} onChange={set("website")} />
              </div>
            </Section>

            {/* Notifications */}
            <Section title="Preferencias de Notificaciones">
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  { label: "Notificaciones por correo",     sub: "Recibe resúmenes y actualizaciones",          value: notifEmail,   onChange: () => setNotifEmail(v => !v)   },
                  { label: "Recordatorios de webinars",     sub: "Aviso 24h antes de cada sesión en vivo",       value: notifWebinar, onChange: () => setNotifWebinar(v => !v) },
                  { label: "Nuevos reportes disponibles",   sub: "Notificación cuando se publique contenido",    value: notifReport,  onChange: () => setNotifReport(v => !v)  },
                  { label: "Boletín mensual EMV",           sub: "Resumen de impacto y novedades de la comunidad",value: notifNews,   onChange: () => setNotifNews(v => !v)    },
                ].map(n => (
                  <div key={n.label} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "13px 0", borderBottom: "1px solid rgba(0,0,0,0.05)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Bell size={15} color={n.value ? EMV_BLUE : "#9CA3AF"} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1F2937", fontFamily: "var(--font-sans)" }}>{n.label}</div>
                        <div style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>{n.sub}</div>
                      </div>
                    </div>
                    <Toggle value={n.value} onChange={n.onChange} />
                  </div>
                ))}
              </div>
            </Section>

            {/* Security */}
            <Section title="Seguridad y Contraseña">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <PasswordField label="Contraseña actual" />
                <PasswordField label="Nueva contraseña" />
              </div>
              <PasswordField label="Confirmar nueva contraseña" />
              <div style={{ marginTop: 16 }}>
                <button style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "9px 20px", borderRadius: 9, border: "none",
                  background: `linear-gradient(135deg, #0B2E3E, #1A8CBF)`,
                  color: "white", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", fontFamily: "var(--font-display)",
                }}>
                  <Shield size={14} /> Actualizar contraseña
                </button>
              </div>
            </Section>

            {/* Activity log */}
            <Section title="Actividad Reciente">
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {activity.length === 0 && (
                  <div style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "var(--font-sans)", textAlign: "center", padding: "16px 0" }}>
                    Aún no hay actividad registrada.
                  </div>
                )}
                {activity.map((a, i) => {
                  const v = activityVisual(a.type);
                  return (
                    <div key={a.id} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "11px 0",
                      borderBottom: i < activity.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
                    }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                        background: `${v.color}12`, border: `1px solid ${v.color}22`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <v.icon size={15} color={v.color} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1F2937", fontFamily: "var(--font-sans)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {a.label}
                        </div>
                        <div style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>{a.type}</div>
                      </div>
                      <div style={{ fontSize: 11, color: "#C4C9D4", fontFamily: "var(--font-sans)", flexShrink: 0 }}>{a.date}</div>
                    </div>
                  );
                })}
              </div>
            </Section>

            {/* Logout */}
            <div style={{
              background: "white", borderRadius: 16,
              border: "1px solid rgba(0,0,0,0.07)", padding: "20px 24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", fontFamily: "var(--font-display)" }}>
                  Cerrar sesión
                </div>
                <div style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "var(--font-sans)", marginTop: 2 }}>
                  Saldrás de tu cuenta en este dispositivo.
                </div>
              </div>
              <button onClick={onLogout} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "9px 20px", borderRadius: 9,
                border: "1px solid rgba(0,0,0,0.1)", background: "#F9FAFB",
                color: "#374151", fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "var(--font-sans)",
              }}>
                <LogOut size={14} /> Cerrar sesión
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}