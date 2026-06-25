"use client";
import { useState } from "react";
import {
  Search, Plus, Filter, ChevronDown, MoreHorizontal, Edit2,
  UserX, ArrowUpRight, X, Check, Mail, Phone, Globe,
  Calendar, Clock, Users, BookOpen, FileText, Award,
  TrendingUp, Building2, ChevronRight, AlertCircle,
  Eye, Download, Zap, Shield, Save, User,
} from "lucide-react";
import { getSponsors } from "@/app/actions";
import { useEffect } from "react";

const BLUE    = "#29ABE2";
const ORANGE  = "#F7941D";
const MAGENTA = "#EC008C";
const GREEN   = "#10B981";
const PURPLE  = "#8B5CF6";

// ── Types ─────────────────────────────────────────────────────────────────────

type TierName = "Sin Membresía" | "Aliado" | "Sembrador" | "Constructor" | "Guardián";
type StatusKey = "activo" | "pendiente" | "inactivo" | "suspendido";

interface Sponsor {
  id: string;
  company: string;
  initials: string;
  contact: string;
  contactRole: string;
  email: string;
  phone: string;
  website: string;
  tier: TierName;
  status: StatusKey;
  registrationDate: string;
  lastLogin: string;
  monthlyRevenue: string;
  collaborators: number;
  contentAccessed: number;
  reportsDownloaded: number;
  coursesCompleted: number;
  city: string;
  industry: string;
  notes: string;
  color: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const TIER_COLOR: Record<TierName, string> = {
  "Sin Membresía": "#9CA3AF", Aliado: BLUE, Sembrador: GREEN, Constructor: ORANGE, Guardián: MAGENTA,
};
const TIER_EMOJI: Record<TierName, string> = {
  "Sin Membresía": "❌", Aliado: "🤝", Sembrador: "🌱", Constructor: "🧱", Guardián: "🛡",
};
const TIER_LEVEL: Record<TierName, number> = {
  "Sin Membresía": 0, Aliado: 1, Sembrador: 2, Constructor: 3, Guardián: 4,
};
const STATUS_CONFIG: Record<StatusKey, { label: string; bg: string; color: string; dot: string }> = {
  activo:     { label: "Activo",     bg: "#ECFDF5", color: "#10B981", dot: "#10B981" },
  pendiente:  { label: "Pendiente",  bg: "#FFFBEB", color: "#D97706", dot: "#F59E0B" },
  inactivo:   { label: "Inactivo",   bg: "#F9FAFB", color: "#9CA3AF", dot: "#9CA3AF" },
  suspendido: { label: "Suspendido", bg: "#FEF2F2", color: "#EF4444", dot: "#EF4444" },
};
const TIERS: TierName[] = ["Sin Membresía", "Aliado", "Sembrador", "Constructor", "Guardián"];

// ── Mock data ─────────────────────────────────────────────────────────────────

// Mock data removed. Data is fetched from DB.

// ── Helpers ───────────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: StatusKey }) {
  const s = STATUS_CONFIG[status];
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 9px", borderRadius: 99, background: s.bg,
    }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
      <span style={{ fontSize: 11, fontWeight: 600, color: s.color, fontFamily: "var(--font-sans)" }}>{s.label}</span>
    </div>
  );
}

function TierBadge({ tier }: { tier: TierName }) {
  const color = TIER_COLOR[tier];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 9px", borderRadius: 99,
      background: `${color}12`, border: `1px solid ${color}25`,
      color, fontSize: 11, fontWeight: 700, fontFamily: "var(--font-display)",
    }}>
      {TIER_EMOJI[tier]} {tier}
    </span>
  );
}

// ── Modal: Create / Edit sponsor ──────────────────────────────────────────────

function SponsorModal({ sponsor, onClose, onSave }: {
  sponsor: Sponsor | null;
  onClose: () => void;
  onSave: (s: Sponsor) => void;
}) {
  const isEdit = !!sponsor;
  const blank: Partial<Sponsor> = { tier: "Sin Membresía", status: "pendiente", color: "#9CA3AF" };
  const [form, setForm] = useState<Partial<Sponsor>>(sponsor ?? blank);

  const field = (label: string, key: keyof Sponsor, type = "text", placeholder = "") => (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5, fontFamily: "var(--font-sans)" }}>{label}</label>
      <input
        type={type}
        value={(form[key] as string) ?? ""}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "9px 12px", borderRadius: 9,
          border: "1.5px solid rgba(0,0,0,0.12)", background: "#F9FAFB",
          fontSize: 13, color: "#1F2937", outline: "none",
          fontFamily: "var(--font-sans)", boxSizing: "border-box",
          transition: "border-color 0.15s",
        }}
        onFocus={e => (e.target.style.borderColor = BLUE)}
        onBlur={e => (e.target.style.borderColor = "rgba(0,0,0,0.12)")}
      />
    </div>
  );

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 560, maxHeight: "90vh", overflowY: "auto",
          background: "white", borderRadius: 20,
          boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
          display: "flex", flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "22px 24px 18px", borderBottom: "1px solid rgba(0,0,0,0.07)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, background: "white", zIndex: 10, borderRadius: "20px 20px 0 0",
        }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1F2937", margin: 0, fontFamily: "var(--font-display)" }}>
              {isEdit ? `Editar · ${sponsor!.company}` : "Nuevo Patrocinador"}
            </h2>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: "2px 0 0", fontFamily: "var(--font-sans)" }}>
              {isEdit ? "Modifica la información del patrocinador" : "Crea un nuevo patrocinador en la plataforma"}
            </p>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8,
            border: "1px solid rgba(0,0,0,0.09)", background: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#6B7280",
          }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Section: Empresa */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.1em", marginBottom: 12, fontFamily: "var(--font-sans)" }}>INFORMACIÓN DE LA EMPRESA</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {field("Nombre de la empresa", "company", "text", "Ej. Grupo Bimbo")}
              {field("Industria", "industry", "text", "Ej. Alimentación")}
              {field("Ciudad", "city", "text", "Ej. Ciudad de México")}
              {field("Sitio web", "website", "text", "empresa.com")}
            </div>
          </div>

          {/* Section: Contacto */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.1em", marginBottom: 12, fontFamily: "var(--font-sans)" }}>CONTACTO PRINCIPAL</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {field("Nombre del contacto", "contact", "text", "Nombre completo")}
              {field("Cargo", "contactRole", "text", "Ej. Director RSE")}
              {field("Correo electrónico", "email", "email", "correo@empresa.com")}
              {field("Teléfono", "phone", "tel", "+52 55 0000 0000")}
            </div>
          </div>

          {/* Section: Membresía */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.1em", marginBottom: 12, fontFamily: "var(--font-sans)" }}>MEMBRESÍA</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {/* Tier selector */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5, fontFamily: "var(--font-sans)" }}>Nivel de membresía</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {TIERS.map(t => {
                    const active = form.tier === t;
                    return (
                      <button key={t} onClick={() => setForm(f => ({ ...f, tier: t }))} style={{
                        display: "flex", alignItems: "center", gap: 4,
                        padding: "5px 10px", borderRadius: 8,
                        border: active ? "none" : "1px solid rgba(0,0,0,0.1)",
                        background: active ? TIER_COLOR[t] : "white",
                        color: active ? "white" : "#6B7280",
                        fontSize: 11, fontWeight: 700, cursor: "pointer",
                        fontFamily: "var(--font-display)",
                      }}>
                        {TIER_EMOJI[t]} {t}
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Status selector */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5, fontFamily: "var(--font-sans)" }}>Estado</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {(["activo","pendiente","inactivo","suspendido"] as StatusKey[]).map(s => {
                    const active = form.status === s;
                    const c = STATUS_CONFIG[s];
                    return (
                      <button key={s} onClick={() => setForm(f => ({ ...f, status: s }))} style={{
                        padding: "5px 10px", borderRadius: 8,
                        border: active ? "none" : "1px solid rgba(0,0,0,0.1)",
                        background: active ? c.dot : "white",
                        color: active ? "white" : "#6B7280",
                        fontSize: 11, fontWeight: 600, cursor: "pointer",
                        fontFamily: "var(--font-sans)", textTransform: "capitalize",
                      }}>
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5, fontFamily: "var(--font-sans)" }}>Notas internas</label>
            <textarea
              value={form.notes ?? ""}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3}
              placeholder="Notas visibles solo para el equipo EMV..."
              style={{
                width: "100%", padding: "9px 12px", borderRadius: 9,
                border: "1.5px solid rgba(0,0,0,0.12)", background: "#F9FAFB",
                fontSize: 13, color: "#1F2937", outline: "none",
                fontFamily: "var(--font-sans)", boxSizing: "border-box",
                resize: "none", lineHeight: 1.5,
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px 24px", borderTop: "1px solid rgba(0,0,0,0.07)",
          display: "flex", gap: 10, justifyContent: "flex-end",
          position: "sticky", bottom: 0, background: "white", borderRadius: "0 0 20px 20px",
        }}>
          <button onClick={onClose} style={{
            padding: "9px 20px", borderRadius: 9,
            border: "1px solid rgba(0,0,0,0.1)", background: "none",
            color: "#374151", fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "var(--font-sans)",
          }}>
            Cancelar
          </button>
          <button onClick={() => { onSave(form as Sponsor); onClose(); }} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "9px 22px", borderRadius: 9, border: "none",
            background: BLUE, color: "white", fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: "var(--font-display)",
            boxShadow: `0 4px 12px ${BLUE}35`,
          }}>
            <Save size={14} /> {isEdit ? "Guardar cambios" : "Crear patrocinador"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal: Change tier ────────────────────────────────────────────────────────

function ChangeTierModal({ sponsor, onClose, onConfirm }: {
  sponsor: Sponsor; onClose: () => void; onConfirm: (t: TierName) => void;
}) {
  const [selected, setSelected] = useState<TierName>(sponsor.tier);
  const PRICES: Record<TierName, string> = { "Sin Membresía": "$0", Aliado: "$1,000", Sembrador: "$3,000", Constructor: "$5,000", Guardián: "$10,000" };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 480, background: "white", borderRadius: 20,
        boxShadow: "0 24px 64px rgba(0,0,0,0.2)", overflow: "hidden",
      }}>
        <div style={{ padding: "22px 24px 16px", borderBottom: "1px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1F2937", margin: 0, fontFamily: "var(--font-display)" }}>Cambiar Membresía</h2>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: "2px 0 0", fontFamily: "var(--font-sans)" }}>{sponsor.company} · Nivel actual: {sponsor.tier}</p>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(0,0,0,0.09)", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF" }}>
            <X size={14} />
          </button>
        </div>
        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {TIERS.map(t => {
              const active = selected === t;
              const color  = TIER_COLOR[t];
              const isCurrent = sponsor.tier === t;
              return (
                <button key={t} onClick={() => setSelected(t)} style={{
                  padding: "16px", borderRadius: 14,
                  border: active ? `2px solid ${color}` : "1.5px solid rgba(0,0,0,0.09)",
                  background: active ? `${color}08` : "white",
                  cursor: "pointer", textAlign: "left",
                  boxShadow: active ? `0 4px 14px ${color}20` : "none",
                  position: "relative",
                }}>
                  {isCurrent && (
                    <div style={{
                      position: "absolute", top: 8, right: 8,
                      fontSize: 9, fontWeight: 800, color: color,
                      background: `${color}15`, padding: "2px 6px", borderRadius: 99,
                      fontFamily: "var(--font-display)",
                    }}>ACTUAL</div>
                  )}
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{TIER_EMOJI[t]}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: active ? color : "#1F2937", fontFamily: "var(--font-display)" }}>{t}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: active ? color : "#6B7280", fontFamily: "var(--font-display)", marginTop: 2 }}>
                    {PRICES[t]} <span style={{ fontSize: 10, fontWeight: 400, color: "#9CA3AF" }}>MXN/mes</span>
                  </div>
                  {active && <Check size={14} color={color} style={{ position: "absolute", bottom: 12, right: 12 }} />}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(0,0,0,0.07)", display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "9px 18px", borderRadius: 9, border: "1px solid rgba(0,0,0,0.1)", background: "none", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)" }}>Cancelar</button>
          <button onClick={() => { onConfirm(selected); onClose(); }} style={{
            padding: "9px 22px", borderRadius: 9, border: "none",
            background: TIER_COLOR[selected], color: "white",
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            fontFamily: "var(--font-display)",
            boxShadow: `0 4px 12px ${TIER_COLOR[selected]}35`,
          }}>
            Confirmar cambio
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Detail panel ──────────────────────────────────────────────────────────────

function DetailPanel({ sponsor, onEdit, onClose, onChangeTier, onToggleStatus }: {
  sponsor: Sponsor;
  onEdit: () => void;
  onClose: () => void;
  onChangeTier: () => void;
  onToggleStatus: () => void;
}) {
  const color = TIER_COLOR[sponsor.tier];
  const sc    = STATUS_CONFIG[sponsor.status];

  const statRow = (icon: React.ElementType, label: string, value: string, color?: string) => {
    const Icon = icon;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={14} color="#6B7280" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>{label}</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: color ?? "#1F2937", fontFamily: "var(--font-sans)" }}>{value}</div>
        </div>
      </div>
    );
  };

  const metricCard = (label: string, value: string | number, icon: React.ElementType, c: string) => {
    const Icon = icon;
    return (
      <div style={{ padding: "12px 14px", borderRadius: 12, background: `${c}08`, border: `1px solid ${c}15` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <Icon size={13} color={c} />
          <span style={{ fontSize: 10, color: c, fontWeight: 600, fontFamily: "var(--font-sans)" }}>{label}</span>
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#1F2937", fontFamily: "var(--font-display)", lineHeight: 1 }}>{value}</div>
      </div>
    );
  };

  return (
    <div style={{
      width: 340, flexShrink: 0, background: "white",
      borderLeft: "1px solid rgba(0,0,0,0.07)",
      display: "flex", flexDirection: "column", overflowY: "auto",
    }}>
      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10, background: "white",
        padding: "18px 20px 14px", borderBottom: "1px solid rgba(0,0,0,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1F2937", fontFamily: "var(--font-display)" }}>Detalle del patrocinador</span>
        <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid rgba(0,0,0,0.09)", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF" }}>
          <X size={14} />
        </button>
      </div>

      {/* Company identity */}
      <div style={{
        margin: "16px 20px", padding: "18px",
        borderRadius: 14, background: `linear-gradient(135deg,${color}12,${color}05)`,
        border: `1px solid ${color}22`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, flexShrink: 0,
            background: `linear-gradient(135deg,${color}30,${color}15)`,
            border: `1px solid ${color}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 800, color, fontFamily: "var(--font-display)",
          }}>
            {sponsor.initials}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#1F2937", fontFamily: "var(--font-display)" }}>{sponsor.company}</div>
            <div style={{ fontSize: 12, color: "#6B7280", fontFamily: "var(--font-sans)" }}>{sponsor.industry} · {sponsor.city}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <TierBadge tier={sponsor.tier} />
          <StatusPill status={sponsor.status} />
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: "0 20px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <button onClick={onEdit} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            padding: "9px 0", borderRadius: 9, border: "none",
            background: BLUE, color: "white", fontSize: 12, fontWeight: 700,
            cursor: "pointer", fontFamily: "var(--font-display)",
            boxShadow: `0 2px 8px ${BLUE}30`,
          }}>
            <Edit2 size={13} /> Editar
          </button>
          <button onClick={onChangeTier} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            padding: "9px 0", borderRadius: 9, border: "none",
            background: color, color: "white", fontSize: 12, fontWeight: 700,
            cursor: "pointer", fontFamily: "var(--font-display)",
            boxShadow: `0 2px 8px ${color}30`,
          }}>
            <Zap size={13} /> Cambiar nivel
          </button>
        </div>
        <button onClick={onToggleStatus} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
          padding: "8px 0", borderRadius: 9,
          border: `1px solid ${sponsor.status === "activo" ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)"}`,
          background: sponsor.status === "activo" ? "rgba(239,68,68,0.05)" : "rgba(16,185,129,0.05)",
          color: sponsor.status === "activo" ? "#EF4444" : GREEN,
          fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)",
        }}>
          <UserX size={13} />
          {sponsor.status === "activo" ? "Desactivar patrocinador" : "Reactivar patrocinador"}
        </button>
      </div>

      <div style={{ height: 1, background: "rgba(0,0,0,0.06)", margin: "0 20px 16px" }} />

      {/* Contact info */}
      <div style={{ padding: "0 20px 16px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.1em", marginBottom: 8, fontFamily: "var(--font-sans)" }}>CONTACTO</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0" }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <User size={16} color="#6B7280" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1F2937", fontFamily: "var(--font-sans)" }}>{sponsor.contact}</div>
            <div style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>{sponsor.contactRole}</div>
          </div>
        </div>
        {statRow(Mail, "Correo electrónico", sponsor.email)}
        {statRow(Phone, "Teléfono", sponsor.phone)}
        {statRow(Globe, "Sitio web", sponsor.website, BLUE)}
      </div>

      <div style={{ height: 1, background: "rgba(0,0,0,0.06)", margin: "0 20px 16px" }} />

      {/* Activity metrics */}
      <div style={{ padding: "0 20px 16px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.1em", marginBottom: 12, fontFamily: "var(--font-sans)" }}>RESUMEN DE ACTIVIDAD</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {metricCard("Colaboradores",     sponsor.collaborators,     Users,    BLUE   )}
          {metricCard("Contenido visto",   sponsor.contentAccessed,   BookOpen, GREEN  )}
          {metricCard("Reportes descargados", sponsor.reportsDownloaded, FileText, ORANGE )}
          {metricCard("Cursos completados",sponsor.coursesCompleted,  Award,    PURPLE )}
        </div>
      </div>
      
      <div style={{ height: 1, background: "rgba(0,0,0,0.06)", margin: "0 20px 16px" }} />

      {/* Access summary */}
      <div style={{ padding: "0 20px 16px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.1em", marginBottom: 10, fontFamily: "var(--font-sans)" }}>ACCESOS</div>
        {[
          { label: "Contenido",   ok: true  },
          { label: "Reportes",    ok: TIER_LEVEL[sponsor.tier] >= 3 },
          { label: "Certificados",ok: TIER_LEVEL[sponsor.tier] >= 3 },
          { label: "Branding Report", ok: TIER_LEVEL[sponsor.tier] >= 4 },
          { label: "Mesa directiva",  ok: TIER_LEVEL[sponsor.tier] >= 4 },
        ].map(a => (
          <div key={a.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
            <span style={{ fontSize: 12, color: "#6B7280", fontFamily: "var(--font-sans)" }}>{a.label}</span>
            {a.ok
              ? <div style={{ display: "flex", alignItems: "center", gap: 4, color: GREEN, fontSize: 11, fontWeight: 600 }}><Check size={12} /> Activo</div>
              : <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#C4C9D4", fontSize: 11 }}><X size={12} /> No incluido</div>
            }
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: "rgba(0,0,0,0.06)", margin: "0 20px 16px" }} />

      {/* Account details */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.1em", marginBottom: 8, fontFamily: "var(--font-sans)" }}>CUENTA</div>
        {statRow(Calendar, "Fecha de registro", sponsor.registrationDate)}
        {statRow(Clock,    "Último acceso",     sponsor.lastLogin)}
        {statRow(TrendingUp, "Ingreso mensual", `${sponsor.monthlyRevenue} MXN/mes`, GREEN)}
      </div>

      {/* Notes */}
      {sponsor.notes && (
        <div style={{ padding: "0 20px 24px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.1em", marginBottom: 8, fontFamily: "var(--font-sans)" }}>NOTAS INTERNAS</div>
          <div style={{
            padding: "12px 14px", borderRadius: 10,
            background: "#FFFBEB", border: "1px solid #FDE68A",
            fontSize: 12, color: "#92400E", lineHeight: 1.55,
            fontFamily: "var(--font-sans)",
            display: "flex", gap: 8,
          }}>
            <AlertCircle size={14} color="#D97706" style={{ flexShrink: 0, marginTop: 1 }} />
            {sponsor.notes}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function SponsorManagement() {
  const [sponsors, setSponsors]   = useState<Sponsor[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    getSponsors().then((res) => {
      if (res.success && res.data) {
        const mapped = res.data.map((user: any) => {
          let tierName: TierName = "Sin Membresía";
          if (user.membership === "SEMBRADOR") tierName = "Sembrador";
          if (user.membership === "CONSTRUCTOR") tierName = "Constructor";
          if (user.membership === "GUARDIAN") tierName = "Guardián";

          const company = user.organization?.name || user.companyName || "Desconocido";
          
          return {
            id: user.id,
            company,
            initials: company.substring(0, 2).toUpperCase(),
            contact: user.name || "Sin Nombre",
            contactRole: "Usuario",
            email: user.email,
            phone: user.phone || "-",
            website: user.organization?.domain || "-",
            tier: tierName,
            status: (user.isActive ? "activo" : "inactivo") as StatusKey,
            registrationDate: new Date(user.createdAt).toLocaleDateString(),
            lastLogin: "Recientemente",
            monthlyRevenue: "$0",
            collaborators: 1,
            contentAccessed: 0,
            reportsDownloaded: 0,
            coursesCompleted: 0,
            city: "-",
            industry: "-",
            notes: "",
            color: TIER_COLOR[tierName]
          };
        });
        setSponsors(mapped);
      }
      setLoading(false);
    });
  }, []);
  const [search, setSearch]       = useState("");
  const [tierFilter, setTierFilter] = useState<TierName | "Todos">("Todos");
  const [statusFilter, setStatus] = useState<StatusKey | "Todos">("Todos");
  const [selected, setSelected]   = useState<Sponsor | null>(null);
  const [modal, setModal]         = useState<"create" | "edit" | "tier" | null>(null);
  const [sortKey, setSortKey]     = useState<"company" | "tier" | "status" | "registrationDate">("company");
  const [sortDesc, setSortDesc]   = useState(false);

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDesc(d => !d);
    else { setSortKey(key); setSortDesc(false); }
  };

  const filtered = sponsors
    .filter(s => {
      const q = search.toLowerCase();
      return (
        (s.company.toLowerCase().includes(q) || s.contact.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)) &&
        (tierFilter === "Todos" || s.tier === tierFilter) &&
        (statusFilter === "Todos" || s.status === statusFilter)
      );
    })
    .sort((a, b) => {
      let va = a[sortKey] as string, vb = b[sortKey] as string;
      if (sortKey === "tier") { va = String(TIER_LEVEL[a.tier]); vb = String(TIER_LEVEL[b.tier]); }
      return (sortDesc ? vb.localeCompare(va) : va.localeCompare(vb));
    });

  const SortTh = ({ label, k }: { label: string; k: typeof sortKey }) => (
    <th onClick={() => toggleSort(k)} style={{
      padding: "11px 14px", textAlign: "left", fontSize: 11,
      fontWeight: 600, color: "#9CA3AF", fontFamily: "var(--font-sans)",
      borderBottom: "1px solid rgba(0,0,0,0.06)", cursor: "pointer",
      userSelect: "none", whiteSpace: "nowrap",
      background: sortKey === k ? "#F9FAFB" : "transparent",
    }}>
      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {label}
        {sortKey === k && <ChevronDown size={11} style={{ transform: sortDesc ? "none" : "rotate(180deg)" }} />}
      </span>
    </th>
  );

  const stats = [
    { label: "Total",       value: sponsors.length,                               color: BLUE    },
    { label: "Activos",     value: sponsors.filter(s => s.status === "activo").length,  color: GREEN   },
    { label: "Pendientes",  value: sponsors.filter(s => s.status === "pendiente").length,color: ORANGE  },
    { label: "Guardianes",  value: sponsors.filter(s => s.tier === "Guardián").length,   color: MAGENTA },
  ];

  return (
    <div style={{ display: "flex", flex: 1, height: "100%", overflow: "hidden" }}>
      {/* Left: table area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Stats strip */}
        <div style={{ display: "flex", gap: 12, padding: "0 0 20px" }}>
          {stats.map(s => (
            <div key={s.label} style={{
              flex: 1, padding: "14px 18px", borderRadius: 12,
              background: "white", border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: s.color, boxShadow: `0 0 0 3px ${s.color}20`,
              }} />
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#1F2937", fontFamily: "var(--font-display)", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "var(--font-sans)", marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "0 0 260px" }}>
            <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} />
            <input placeholder="Buscar empresa, contacto, email..." value={search} onChange={e => setSearch(e.target.value)} style={{
              width: "100%", padding: "9px 14px 9px 33px", borderRadius: 9,
              border: "1px solid rgba(0,0,0,0.1)", background: "white",
              fontSize: 13, color: "#1F2937", outline: "none",
              fontFamily: "var(--font-sans)", boxSizing: "border-box",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }} />
          </div>

          {/* Tier filter */}
          <div style={{ display: "flex", gap: 5 }}>
            {(["Todos", ...TIERS] as (TierName | "Todos")[]).map(t => {
              const active = tierFilter === t;
              const color  = t === "Todos" ? "#6B7280" : TIER_COLOR[t];
              return (
                <button key={t} onClick={() => setTierFilter(t)} style={{
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "7px 11px", borderRadius: 8,
                  border: active ? "none" : "1px solid rgba(0,0,0,0.09)",
                  background: active ? color : "white",
                  color: active ? "white" : "#6B7280",
                  fontSize: 11, fontWeight: active ? 700 : 500,
                  cursor: "pointer", fontFamily: "var(--font-sans)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}>
                  {t !== "Todos" && TIER_EMOJI[t]} {t}
                </button>
              );
            })}
          </div>

          {/* Status filter */}
          <div style={{ position: "relative" }}>
            <select
              value={statusFilter}
              onChange={e => setStatus(e.target.value as StatusKey | "Todos")}
              style={{
                padding: "8px 30px 8px 12px", borderRadius: 9,
                border: "1px solid rgba(0,0,0,0.1)", background: "white",
                fontSize: 12, color: "#374151", outline: "none",
                fontFamily: "var(--font-sans)", cursor: "pointer",
                appearance: "none",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <option value="Todos">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="pendiente">Pendiente</option>
              <option value="inactivo">Inactivo</option>
              <option value="suspendido">Suspendido</option>
            </select>
            <ChevronDown size={12} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} />
          </div>

          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>{filtered.length} resultado{filtered.length !== 1 ? "s" : ""}</span>

          {/* Create */}
          <button onClick={() => { setSelected(null); setModal("create"); }} style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "9px 18px", borderRadius: 9, border: "none",
            background: BLUE, color: "white", fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: "var(--font-display)",
            boxShadow: `0 4px 12px ${BLUE}35`,
          }}>
            <Plus size={15} /> Nuevo patrocinador
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#6B7280" }}>Cargando patrocinadores...</div>
        ) : (
        <div style={{
          flex: 1, overflowY: "auto",
          background: "white", borderRadius: 16,
          border: "1px solid rgba(0,0,0,0.07)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 5, background: "white" }}>
              <tr>
                <SortTh label="Empresa"          k="company" />
                <th style={{ padding: "11px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9CA3AF", fontFamily: "var(--font-sans)", borderBottom: "1px solid rgba(0,0,0,0.06)", whiteSpace: "nowrap" }}>Contacto</th>
                <th style={{ padding: "11px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9CA3AF", fontFamily: "var(--font-sans)", borderBottom: "1px solid rgba(0,0,0,0.06)", whiteSpace: "nowrap" }}>Email</th>
                <SortTh label="Membresía"        k="tier" />
                <SortTh label="Estado"           k="status" />
                <SortTh label="Registro"         k="registrationDate" />
                <th style={{ padding: "11px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9CA3AF", fontFamily: "var(--font-sans)", borderBottom: "1px solid rgba(0,0,0,0.06)", whiteSpace: "nowrap" }}>Notas</th>
                <th style={{ padding: "11px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9CA3AF", fontFamily: "var(--font-sans)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "60px 0", textAlign: "center", color: "#9CA3AF", fontFamily: "var(--font-sans)", fontSize: 14 }}>
                    Sin resultados para la búsqueda actual.
                  </td>
                </tr>
              ) : filtered.map((s, i) => {
                const isSelected = selected?.id === s.id;
                return (
                  <tr
                    key={s.id}
                    onClick={() => setSelected(isSelected ? null : s)}
                    style={{
                      borderBottom: i < filtered.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none",
                      background: isSelected ? `${TIER_COLOR[s.tier]}06` : i % 2 === 0 ? "white" : "#FAFAFA",
                      cursor: "pointer",
                      transition: "background 0.1s",
                      outline: isSelected ? `2px solid ${TIER_COLOR[s.tier]}30` : "none",
                      outlineOffset: -1,
                    }}
                  >
                    {/* Company */}
                    <td style={{ padding: "13px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                          background: `linear-gradient(135deg,${s.color}28,${s.color}12)`,
                          border: `1px solid ${s.color}22`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, fontWeight: 800, color: s.color, fontFamily: "var(--font-display)",
                        }}>
                          {s.initials}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#1F2937", fontFamily: "var(--font-sans)" }}>{s.company}</div>
                          <div style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>{s.industry}</div>
                        </div>
                      </div>
                    </td>
                    {/* Contact */}
                    <td style={{ padding: "13px 14px" }}>
                      <div style={{ fontSize: 13, color: "#374151", fontFamily: "var(--font-sans)" }}>{s.contact}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "var(--font-sans)" }}>{s.contactRole}</div>
                    </td>
                    {/* Email */}
                    <td style={{ padding: "13px 14px" }}>
                      <a href={`mailto:${s.email}`} onClick={e => e.stopPropagation()} style={{ fontSize: 12, color: BLUE, textDecoration: "none", fontFamily: "var(--font-sans)" }}>
                        {s.email}
                      </a>
                    </td>
                    {/* Tier */}
                    <td style={{ padding: "13px 14px" }}><TierBadge tier={s.tier} /></td>
                    {/* Status */}
                    <td style={{ padding: "13px 14px" }}><StatusPill status={s.status} /></td>
                    {/* Date */}
                    <td style={{ padding: "13px 14px" }}>
                      <span style={{ fontSize: 12, color: "#6B7280", fontFamily: "var(--font-sans)" }}>{s.registrationDate}</span>
                    </td>
                    {/* Notes */}
                    <td style={{ padding: "13px 14px", maxWidth: 200 }}>
                      {s.notes ? (
                        <span title={s.notes} style={{
                          fontSize: 12, color: "#6B7280", fontFamily: "var(--font-sans)",
                          display: "-webkit-box", WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical", overflow: "hidden",
                          lineHeight: 1.4, cursor: "help",
                        }}>
                          {s.notes}
                        </span>
                      ) : (
                        <span style={{ fontSize: 12, color: "#D1D5DB", fontFamily: "var(--font-sans)", fontStyle: "italic" }}>—</span>
                      )}
                    </td>
                    {/* Actions */}
                    <td style={{ padding: "13px 14px" }} onClick={e => e.stopPropagation()}>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button
                          title="Ver detalle"
                          onClick={() => setSelected(s)}
                          style={{
                            width: 28, height: 28, borderRadius: 7,
                            border: "1px solid rgba(0,0,0,0.09)", background: "white",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", color: "#6B7280",
                          }}
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          title="Editar"
                          onClick={() => { setSelected(s); setModal("edit"); }}
                          style={{
                            width: 28, height: 28, borderRadius: 7,
                            border: "1px solid rgba(0,0,0,0.09)", background: "white",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", color: "#6B7280",
                          }}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button title="Más acciones" style={{
                          width: 28, height: 28, borderRadius: 7,
                          border: "1px solid rgba(0,0,0,0.09)", background: "white",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", color: "#9CA3AF",
                        }}>
                          <MoreHorizontal size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Right: detail panel */}
      {selected && (
        <DetailPanel
          sponsor={selected}
          onClose={() => setSelected(null)}
          onEdit={() => setModal("edit")}
          onChangeTier={() => setModal("tier")}
          onToggleStatus={() => {
            setSponsors(prev => prev.map(s =>
              s.id === selected.id
                ? { ...s, status: s.status === "activo" ? "inactivo" : "activo" }
                : s
            ));
            setSelected(prev => prev ? { ...prev, status: prev.status === "activo" ? "inactivo" : "activo" } : null);
          }}
        />
      )}

      {/* Modals */}
      {(modal === "create" || modal === "edit") && (
        <SponsorModal
          sponsor={modal === "edit" ? selected : null}
          onClose={() => setModal(null)}
          onSave={(updated) => {
            if (modal === "edit" && selected) {
              setSponsors(prev => prev.map(s => s.id === selected.id ? { ...s, ...updated } : s));
              setSelected(prev => prev ? { ...prev, ...updated } : null);
            } else {
              const newS: Sponsor = { ...updated, id: Date.now().toString(), initials: (updated.company ?? "").slice(0, 2).toUpperCase(), color: TIER_COLOR[updated.tier ?? "Sin Membresía"], collaborators: 0, contentAccessed: 0, reportsDownloaded: 0, coursesCompleted: 0, lastLogin: "Nunca", monthlyRevenue: ({ "Sin Membresía": "$0", Aliado: "$1,000", Sembrador: "$3,000", Constructor: "$5,000", Guardián: "$10,000" })[updated.tier ?? "Sin Membresía"] };
              setSponsors(prev => [newS, ...prev]);
            }
          }}
        />
      )}
      {modal === "tier" && selected && (
        <ChangeTierModal
          sponsor={selected}
          onClose={() => setModal(null)}
          onConfirm={(tier) => {
            const color = TIER_COLOR[tier];
            setSponsors(prev => prev.map(s => s.id === selected.id ? { ...s, tier, color } : s));
            setSelected(prev => prev ? { ...prev, tier, color } : null);
          }}
        />
      )}
    </div>
  );
}