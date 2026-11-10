import { EnterpriseSidebar } from "@/components/enterprise-sidebar";
import { EnterpriseHeader } from "@/components/enterprise-header";
import { StatCard } from "@/components/ui/stat-card";
import { AssetManagementTable } from "@/components/asset-management-table";
import { TicketKanbanBoard } from "@/components/ticket-kanban-board";
import { TicketForm } from "@/components/ticket-form";
import { AssetForm } from "@/components/asset-form";
import { getAuthenticatedUser, isAdmin, isStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  Server,
  LifeBuoy,
  Building2,
  Layers,
} from "lucide-react";

export const dynamic = "force-dynamic";

const DEMO_USER = {
  id: 2,
  name: "Rizky Pratama",
  email: "itsupport.mdn@pancapilartangguh.co.id",
  role: "it_staff",
  branchId: 2,
};

const FALLBACK_BRANCHES = [
  { id: 1, branchCode: "HQ-JKT-01", branchName: "Headquarters Jakarta" },
  { id: 2, branchCode: "MDN-MAR-01", branchName: "Depo Medan Marelan" },
  { id: 3, branchCode: "SUB-RNG-01", branchName: "Depo Surabaya Rungkut" },
  { id: 4, branchCode: "MKS-BKY-01", branchName: "Depo Makassar Biringkanaya" },
];

const FALLBACK_ASSETS = [
  { id: 1, assetTag: "AST-MDN-PDA-001", name: "Honeywell EDA51 Sales PDA", category: "Sales PDA / SFA Device", serialNumber: "HWEDA51-99882211", condition: "good", status: "in_use", branchName: "Depo Medan Marelan", userName: "Agus Kurniawan (Field Sales)" },
  { id: 2, assetTag: "AST-SUB-LTP-004", name: "Lenovo ThinkPad L14 Gen 3", category: "Laptop", serialNumber: "PF-3982A1", condition: "good", status: "in_use", branchName: "Depo Surabaya Rungkut", userName: "Hendra Wijaya (IT Support)" },
  { id: 3, assetTag: "AST-MDN-PRN-002", name: "Epson TM-T82X Thermal Receipt Printer", category: "Printer", serialNumber: "EPS-882710-MDN", condition: "needs_repair", status: "under_maintenance", branchName: "Depo Medan Marelan", userName: null },
  { id: 4, assetTag: "AST-HQ-SRV-001", name: "Dell PowerEdge R440 Rack Server", category: "Server / Network", serialNumber: "DELL-9821-HQ", condition: "good", status: "in_use", branchName: "Headquarters Jakarta", userName: "Budi Santoso (Admin)" },
];

const FALLBACK_TICKETS = [
  { id: 1, ticketCode: "TKT-202611-0001", category: "Software / SFA App", priority: "high", subject: "SFA Mobile App scanner gagal sync inventory", status: "in_progress", branchName: "Depo Medan Marelan", reporterName: "Agus Kurniawan (Field Sales)" },
  { id: 2, ticketCode: "TKT-202611-0002", category: "Printer & Network", priority: "medium", subject: "Printer invoice thermal warehouse cetak huruf acak", status: "open", branchName: "Depo Medan Marelan", reporterName: "Dewi Lestari (Branch Manager)" },
  { id: 3, ticketCode: "TKT-202611-0003", category: "Hardware / Laptop", priority: "low", subject: "Permintaan penggantian baterai laptop sales admin", status: "resolved", branchName: "Depo Surabaya Rungkut", reporterName: "Hendra Wijaya" },
  { id: 4, ticketCode: "TKT-202611-0004", category: "Jaringan & VPN", priority: "critical", subject: "Koneksi VPN Depo Makassar terputus ke HQ", status: "closed", branchName: "Depo Makassar Biringkanaya", reporterName: "Siti Rahmawati" },
];

export default async function DashboardPage() {
  const sessionUser = await getAuthenticatedUser();
  const user = sessionUser ?? DEMO_USER;

  const staff = isStaff(user.role);
  const admin = isAdmin(user.role);

  let tickets = FALLBACK_TICKETS;
  let assets = FALLBACK_ASSETS;
  let branches = FALLBACK_BRANCHES;

  try {
    const ticketWhere =
      user.role === "superadmin" || user.role === "it_staff"
        ? {}
        : user.role === "branch_manager"
          ? { branchId: user.branchId }
          : { userId: user.id };

    const assetWhere =
      admin || user.role === "it_staff"
        ? {}
        : user.role === "branch_manager"
          ? { branchId: user.branchId }
          : { id: -1 };

    const [dbTickets, dbAssets, dbBranches] = await Promise.all([
      prisma.iTTicket.findMany({
        include: { branch: true, user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        where: ticketWhere,
      }),
      prisma.iTAsset.findMany({
        include: { branch: true, user: true },
        orderBy: { id: "asc" },
        where: assetWhere,
      }),
      prisma.branch.findMany({
        where: staff ? { isActive: true } : { id: user.branchId },
        orderBy: { branchName: "asc" },
      }),
    ]);

    if (dbBranches.length > 0) {
      branches = dbBranches.map((b) => ({ id: b.id, branchCode: b.branchCode, branchName: b.branchName }));
    }
    if (dbAssets.length > 0) {
      assets = dbAssets.map((a) => ({
        id: a.id,
        assetTag: a.assetTag,
        name: a.name,
        category: a.category,
        serialNumber: a.serialNumber,
        condition: a.condition,
        status: a.status,
        branchName: a.branch.branchName,
        userName: a.user?.name ?? null,
      }));
    }
    if (dbTickets.length > 0) {
      tickets = dbTickets.map((t) => ({
        id: t.id,
        ticketCode: t.ticketCode,
        category: t.category,
        priority: t.priority,
        subject: t.subject,
        status: t.status,
        branchName: t.branch.branchName,
        reporterName: t.user.name,
      }));
    }
  } catch (error) {
    console.warn("Prisma unreachable for dashboard, running with enterprise fallback mock data.", error);
  }

  const counts = tickets.reduce(
    (result, ticket) => {
      result[ticket.status] = (result[ticket.status] ?? 0) + 1;
      return result;
    },
    {} as Record<string, number>,
  );

  const totalTickets = tickets.length;
  const assetsNeedingRepair = assets.filter((asset) => asset.condition !== "good").length;

  return (
    <div className="flex min-h-screen bg-[#070A0F] text-slate-100 font-sans">
      {/* Dark Graphite Sidebar */}
      <EnterpriseSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <EnterpriseHeader user={user} branches={branches} />

        <main className="p-6 md:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* Top Banner / Heading */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-semibold">
                  Sistem Aktif • PT Panca Pilar Tangguh
                </span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white">
                Dashboard Manajemen Aset & Helpdesk IT
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Depo Medan Marelan (MDN-01) · Wilayah kerja dan otorisasi:{" "}
                <span className="text-blue-400 font-semibold uppercase">{user.role}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              {staff && (
                <AssetForm
                  branches={branches.map(({ id, branchName }) => ({ id, name: branchName }))}
                />
              )}
            </div>
          </div>

          {/* High-Density Metric Stat Cards */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Perangkat IT"
              value={assets.length}
              change={`${assetsNeedingRepair} perlu perbaikan`}
              trend={assetsNeedingRepair > 0 ? "down" : "up"}
              icon={Server}
            />
            <StatCard
              title="Tiket Terbuka (Open)"
              value={counts.open ?? 0}
              change="Menunggu respon tim IT"
              trend="neutral"
              icon={LifeBuoy}
            />
            <StatCard
              title="Tiket Dalam Proses"
              value={counts.in_progress ?? 0}
              change="Penyelesaian di lapangan"
              trend="neutral"
              icon={Layers}
            />
            <StatCard
              title="Jaringan Depo Aktif"
              value={branches.length}
              change="Medan, Surabaya, MKS, JKT"
              trend="up"
              icon={Building2}
            />
          </section>

          {/* Asset Management Inventory Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Inventaris Hardware & SFA Handheld
                </h2>
                <p className="text-xs text-slate-400">
                  Daftar perangkat PDA Sales, printer gudang, dan workstation per depo.
                </p>
              </div>
            </div>

            <AssetManagementTable assets={assets} />
          </section>

          {/* Helpdesk Ticketing Kanban / Table */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Tiket Bantuan & Kendala Operasional (Helpdesk)
                </h2>
                <p className="text-xs text-slate-400">
                  Total {totalTickets} tiket dalam pemantauan cabang.
                </p>
              </div>

              {/* Ticket Popover or Form */}
              <details className="relative">
                <summary className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white cursor-pointer shadow-lg shadow-blue-600/30 transition">
                  + Buat Tiket
                </summary>
                <div className="absolute right-0 top-9 w-96 p-5 rounded-2xl bg-[#0E131F] border border-slate-800 shadow-2xl z-50">
                  <TicketForm
                    branches={branches.map(({ id, branchName }) => ({ id, name: branchName }))}
                    canChooseBranch={staff}
                  />
                </div>
              </details>
            </div>

            <TicketKanbanBoard
              tickets={tickets}
              isStaff={staff}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
