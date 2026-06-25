"use server";

import { prisma } from "@/lib/prisma";
import { Role, MembershipLevel } from "@prisma/client";

export async function getAdminDashboardData() {
  try {
    const totalUsers = await prisma.user.count({ where: { role: Role.SPONSOR } });
    const totalContent = await prisma.content.count();
    const activeOrganizations = await prisma.organization.count({ where: { isActive: true } });
    
    // Recent Sponsors
    const recentSponsors = await prisma.organization.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        users: { take: 1 }
      }
    });

    // Recent Content
    const recentContent = await prisma.content.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    // Notifications (Mocked or derived)
    const notifications = [
      { id: 1, type: "system", msg: "Dashboard actualizado a base de datos", time: "Ahora", read: false }
    ];

    // Memberships Breakdown
    const membershipCounts = await prisma.user.groupBy({
      by: ['membership'],
      _count: { membership: true },
    });

    return {
      success: true,
      data: {
        totalUsers,
        totalContent,
        activeOrganizations,
        recentSponsors,
        recentContent,
        notifications,
        membershipCounts
      }
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
