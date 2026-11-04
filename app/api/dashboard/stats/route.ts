import { NextResponse } from "next/server";
import { getAuthenticatedUser, isAdmin, isStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Login diperlukan." }, { status: 401 });
  }

  try {
    const ticketWhere =
      user.role === "superadmin" || user.role === "it_staff"
        ? {}
        : user.role === "branch_manager"
          ? { branchId: user.branchId }
          : { userId: user.id };
    const assetWhere =
      isAdmin(user.role) || user.role === "it_staff"
        ? {}
        : user.role === "branch_manager"
          ? { branchId: user.branchId }
          : { id: -1 };

    const [tickets, assets, branchCount, b2bLeadCount] = await Promise.all([
      prisma.iTTicket.findMany({
        where: ticketWhere,
        select: { status: true, priority: true },
      }),
      prisma.iTAsset.findMany({
        where: assetWhere,
        select: { condition: true, status: true },
      }),
      isStaff(user.role)
        ? prisma.branch.count({ where: { isActive: true } })
        : prisma.branch.count({ where: { id: user.branchId, isActive: true } }),
      isAdmin(user.role) ? prisma.b2BPartnerRequest.count() : Promise.resolve(null),
    ]);

    const byStatus: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    const assetsByCondition: Record<string, number> = {};
    const assetsByStatus: Record<string, number> = {};
    for (const ticket of tickets) {
      byStatus[ticket.status] = (byStatus[ticket.status] ?? 0) + 1;
      byPriority[ticket.priority] = (byPriority[ticket.priority] ?? 0) + 1;
    }
    for (const asset of assets) {
      assetsByCondition[asset.condition] =
        (assetsByCondition[asset.condition] ?? 0) + 1;
      assetsByStatus[asset.status] = (assetsByStatus[asset.status] ?? 0) + 1;
    }

    return NextResponse.json({
      data: {
        role: user.role,
        tickets: tickets.length,
        byStatus,
        byPriority,
        assets: assets.length,
        assetsByCondition,
        assetsByStatus,
        branches: branchCount,
        b2bLeads: b2bLeadCount,
      },
    });
  } catch (error) {
    console.error("GET /api/dashboard/stats failed:", error);
    return NextResponse.json(
      { error: "Gagal mengambil statistik dashboard." },
      { status: 500 },
    );
  }
}
