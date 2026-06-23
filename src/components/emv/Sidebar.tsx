"use client";
import { LayoutDashboard, BookOpen, Award, User, ChevronRight, LogOut } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
const emvLogo = "/imports/EMV_XVIII-Blanco.png";

const EMV_BLUE = "#29ABE2";
const EMV_ORANGE = "#F7941D";
const EMV_MAGENTA = "#EC008C";

export type Page = "dashboard" | "library" | "reports" | "membership" | "profile";

const navItems: { icon: React.ElementType; label: string; page: Page }[] = [
  { icon: LayoutDashboard, label: "Dashboard",    page: "dashboard"  },
  { icon: BookOpen,        label: "Biblioteca",   page: "library"    },
  { icon: Award,           label: "Mi Membresía", page: "membership" },
  { icon: User,            label: "Perfil",       page: "profile"    },
];

interface Props {
  currentPage: Page;
  onNavigate: (p: Page) => void;
  onLogout: () => void;
  userTier?: string;
}

export function Sidebar({ currentPage, onNavigate, onLogout, userTier = "Constructor" }: Props) {
  const isGuardian = userTier === "Guardián";
  
  // Determinar emoji según el nivel
  const getTierEmoji = (tier: string) => {
    switch (tier) {
      case "Aliado":
      return "🤝";
      case "Sembrador":
        return "🌱";
      case "Constructor":
        return "🧱";
      case "Guardián":
        return "🛡";
      default:
        return "🧱";
    }
  };

  // Configuración del mensaje de upgrade según el tier actual
  const getUpgradeMessage = () => {
    switch (userTier) {
      case "Aliado":
        return {
          emoji: "🌱",
          targetTier: "Sembrador",
          benefit: "Accede a cursos completos y webinars exclusivos",
          color: "#10B981",
        };
      case "Sembrador":
        return {
          emoji: "🧱",
          targetTier: "Constructor",
          benefit: "Desbloquea reportes trimestrales y análisis detallados",
          color: EMV_ORANGE,
        };
      case "Constructor":
        return {
          emoji: "🛡",
          targetTier: "Guardián",
          benefit: "Acceso total y prioridad en eventos exclusivos",
          color: EMV_MAGENTA,
        };
      default:
        return null;
    }
  };

  const upgradeInfo = getUpgradeMessage();
  
  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: 220,
        background: "#0F1923",
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: "linear-gradient(135deg,#0B2E3E,#1A8CBF)",
            borderRadius: 10,
            padding: "8px 12px",
          }}
        >
          <ImageWithFallback
            src={emvLogo}
            alt="EMV"
            style={{ height: 24, width: "auto", objectFit: "contain" }}
          />
        </div>
      </div>

      {/* Company badge */}
      <div
        style={{
          margin: "14px 14px 6px",
          padding: "12px 14px",
          borderRadius: 12,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: `linear-gradient(135deg,${EMV_ORANGE},#F7C068)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 800,
              color: "white",
              fontFamily: "var(--font-display)",
              flexShrink: 0,
            }}
          >
            XZ
          </div>
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "white",
                fontFamily: "var(--font-display)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Empresa XYZ
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginTop: 2,
              }}
            >
              <span style={{ fontSize: 11 }}>{getTierEmoji(userTier)}</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: EMV_BLUE,
                  fontFamily: "var(--font-display)",
                  letterSpacing: "0.04em",
                }}
              >
                {userTier}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav section label */}
      <div
        style={{
          padding: "14px 20px 6px",
          fontSize: 10,
          fontWeight: 700,
          color: "rgba(255,255,255,0.25)",
          letterSpacing: "0.12em",
          fontFamily: "var(--font-sans)",
        }}
      >
        MENÚ PRINCIPAL
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map((item) => {
          const active = currentPage === item.page;
          return (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                border: "none",
                background: active ? `${EMV_BLUE}18` : "none",
                color: active ? EMV_BLUE : "rgba(255,255,255,0.5)",
                fontSize: 13,
                fontWeight: active ? 700 : 500,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                textAlign: "left",
                width: "100%",
                transition: "background 0.15s, color 0.15s",
                position: "relative",
              }}
            >
              {active && (
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 3,
                    height: 20,
                    borderRadius: "0 3px 3px 0",
                    background: EMV_BLUE,
                  }}
                />
              )}
              <item.icon size={16} />
              {item.label}
              {active && (
                <ChevronRight size={12} style={{ marginLeft: "auto" }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Membership upgrade teaser - solo si NO es Guardián */}
      {!isGuardian && upgradeInfo && (
        <div
          style={{
            margin: "10px 14px",
            padding: "14px",
            borderRadius: 12,
            background: `linear-gradient(135deg,${upgradeInfo.color}25,${upgradeInfo.color}10)`,
            border: `1px solid ${upgradeInfo.color}30`,
          }}
        >
          <div style={{ fontSize: 16, marginBottom: 6 }}>{upgradeInfo.emoji}</div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "white",
              fontFamily: "var(--font-display)",
              marginBottom: 3,
            }}
          >
            Sube a {upgradeInfo.targetTier}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.4,
              fontFamily: "var(--font-sans)",
              marginBottom: 10,
            }}
          >
            {upgradeInfo.benefit}
          </div>
          <button
            onClick={() => onNavigate("membership")}
            style={{
              width: "100%",
              padding: "7px 0",
              borderRadius: 8,
              border: "none",
              background: upgradeInfo.color,
              color: "white",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "var(--font-display)",
            }}
          >
            Mejorar nivel →
          </button>
        </div>
      )}

      {/* Logout */}
      <div style={{ padding: "10px 10px 16px" }}>
        <button
          onClick={onLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 12px",
            width: "100%",
            borderRadius: 10,
            border: "none",
            background: "none",
            color: "rgba(255,255,255,0.3)",
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
            transition: "color 0.15s",
          }}
        >
          <LogOut size={14} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}