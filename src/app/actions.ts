"use server";

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { auth } from "@/auth";

// Normaliza el monto de una suscripción a su equivalente MENSUAL en centavos.
function monthlyAmountCents(sub: { amount: number | null; interval: string | null }): number {
  if (!sub.amount) return 0;
  return sub.interval === "year" ? Math.round(sub.amount / 12) : sub.amount;
}

// Tiempo relativo simple en español para feeds.
function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Hace ${hrs} h`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Ayer";
  if (days < 30) return `Hace ${days} días`;
  return date.toLocaleDateString();
}

export async function getAdminDashboardData() {
  try {
    const totalUsers = await prisma.user.count({ where: { role: Role.SPONSOR } });
    const totalContent = await prisma.content.count();
    const activeOrganizations = await prisma.organization.count({ where: { isActive: true } });

    // Recent Sponsors (con su suscripción activa para mostrar ingreso real)
    const recentSponsors = await prisma.organization.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        users: { take: 1 },
        subscriptions: {
          where: { status: "active" },
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    // Recent Content
    const recentContent = await prisma.content.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    // Notificaciones reales (las más recientes para el admin)
    const notifRows = await prisma.notification.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
    });
    const notifications = notifRows.map((n) => ({
      id: n.id,
      type: n.type,
      msg: n.message,
      time: relativeTime(n.createdAt),
      read: n.isRead,
    }));

    // Memberships Breakdown
    const membershipCounts = await prisma.user.groupBy({
      by: ["membership"],
      _count: { membership: true },
    });

    // Suscripciones activas → MRR (ingreso mensual recurrente)
    const activeSubs = await prisma.subscription.findMany({
      where: { status: "active" },
      select: { amount: true, interval: true },
    });
    const activeSubscriptions = activeSubs.length;
    const mrrCents = activeSubs.reduce((sum, s) => sum + monthlyAmountCents(s), 0);

    return {
      success: true,
      data: {
        totalUsers,
        totalContent,
        activeOrganizations,
        recentSponsors,
        recentContent,
        notifications,
        membershipCounts,
        activeSubscriptions,
        mrrCents,
      },
    };
  } catch (error) {
    console.error("Error in getAdminDashboardData", error);
    return { success: false, error: "Failed to load dashboard data" };
  }
}

export async function getSponsors() {
  try {
    const sponsors = await prisma.user.findMany({
      where: { role: Role.SPONSOR },
      include: {
        organization: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: sponsors };
  } catch (error) {
    console.error("Error in getSponsors", error);
    return { success: false, error: "Failed to load sponsors" };
  }
}

export async function getContent() {
  try {
    const content = await prisma.content.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        organization: true
      }
    });
    return { success: true, data: content };
  } catch (error) {
    console.error("Error in getContent", error);
    return { success: false, error: "Failed to load content" };
  }
}

export async function getReports() {
  try {
    const reports = await prisma.deliverable.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        organization: true
      }
    });
    return { success: true, data: reports };
  } catch (error) {
    console.error("Error in getReports", error);
    return { success: false, error: "Failed to load reports" };
  }
}

export async function getUserDashboardData(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        organization: true
      }
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const recentContent = await prisma.content.findMany({
      where: {
        isActive: true,
      },
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    return {
      success: true,
      data: {
        user,
        recentContent
      }
    };
  } catch (error) {
    console.error("Error in getUserDashboardData", error);
    return { success: false, error: "Failed to load user dashboard data" };
  }
}

// ── Suscripciones (Stripe) ────────────────────────────────────────────────────

// Lista detallada de suscripciones para el admin: quién compró qué, monto y estado.
export async function getSubscriptions() {
  try {
    const subscriptions = await prisma.subscription.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        organization: {
          include: { users: { take: 1, orderBy: { createdAt: "asc" } } },
        },
      },
    });

    const data = subscriptions.map((s) => ({
      id: s.id,
      planName: s.planName,
      status: s.status,
      amount: s.amount, // centavos
      currency: s.currency,
      interval: s.interval,
      currentPeriodEnd: s.currentPeriodEnd,
      createdAt: s.createdAt,
      organizationName: s.organization?.name ?? "—",
      contactName: s.organization?.users?.[0]?.name ?? "—",
      contactEmail: s.organization?.users?.[0]?.email ?? "—",
    }));

    return { success: true, data };
  } catch (error) {
    console.error("Error in getSubscriptions", error);
    return { success: false, error: "Failed to load subscriptions" };
  }
}

// ── Notificaciones ────────────────────────────────────────────────────────────

// Crea una notificación de difusión (visible para todos los aliados). Solo admin.
export async function createNotification(title: string, message: string) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: Role } | undefined)?.role;
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return { success: false, error: "No autorizado" };
    }
    if (!message.trim()) {
      return { success: false, error: "El mensaje no puede estar vacío" };
    }
    await prisma.notification.create({
      data: { title: title.trim() || "Notificación", message: message.trim(), userId: null },
    });
    return { success: true };
  } catch (error) {
    console.error("Error in createNotification", error);
    return { success: false, error: "Failed to create notification" };
  }
}

// Notificaciones del usuario: las suyas + las de difusión (userId nulo).
export async function getUserNotifications(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (!user) return { success: false, error: "User not found" };

    const notifications = await prisma.notification.findMany({
      where: { OR: [{ userId: user.id }, { userId: null }] },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return { success: true, data: notifications };
  } catch (error) {
    console.error("Error in getUserNotifications", error);
    return { success: false, error: "Failed to load notifications" };
  }
}

// ── Comentarios / retroalimentación ───────────────────────────────────────────

export async function getComments() {
  try {
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        user: { include: { organization: true } },
      },
    });
    const data = comments.map((c) => ({
      id: c.id,
      user: c.user?.name ?? "Usuario",
      empresa: c.user?.organization?.name ?? c.user?.companyName ?? "—",
      msg: c.message,
      status: c.status,
      createdAt: c.createdAt,
    }));
    return { success: true, data };
  } catch (error) {
    console.error("Error in getComments", error);
    return { success: false, error: "Failed to load comments" };
  }
}

// Un aliado autenticado envía un comentario.
export async function createComment(message: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) return { success: false, error: "No autenticado" };
    if (!message.trim()) return { success: false, error: "El mensaje no puede estar vacío" };

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (!user) return { success: false, error: "User not found" };

    await prisma.comment.create({ data: { userId: user.id, message: message.trim() } });
    return { success: true };
  } catch (error) {
    console.error("Error in createComment", error);
    return { success: false, error: "Failed to create comment" };
  }
}

// ── Perfil: actividad y logros ────────────────────────────────────────────────

export async function getProfileData(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    });
    if (!user) return { success: false, error: "User not found" };

    // Actividad reciente: accesos a contenido.
    const logs = await prisma.contentAccessLog.findMany({
      where: { userId: user.id },
      orderBy: { accessedAt: "desc" },
      take: 10,
      include: { content: true },
    });
    const activity = logs.map((l) => ({
      id: l.id,
      label: l.content?.title ?? "Contenido",
      type: l.content?.type ?? "Acceso",
      date: relativeTime(l.accessedAt),
    }));

    // Logros: catálogo completo + cuáles desbloqueó el usuario.
    const [catalog, unlocked] = await Promise.all([
      prisma.achievement.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.userAchievement.findMany({ where: { userId: user.id }, select: { achievementId: true } }),
    ]);
    const unlockedIds = new Set(unlocked.map((u) => u.achievementId));
    const achievements = catalog.map((a) => ({
      id: a.id,
      emoji: a.emoji,
      label: a.label,
      desc: a.description,
      achieved: unlockedIds.has(a.id),
    }));

    return { success: true, data: { user, activity, achievements } };
  } catch (error) {
    console.error("Error in getProfileData", error);
    return { success: false, error: "Failed to load profile data" };
  }
}
