"use client";

import { useState } from "react";
import {
  Rocket,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Building2,
  Calendar,
  Laptop,
  Smartphone,
  Server,
  Printer,
  HardDrive,
  ArrowRight,
} from "lucide-react";

type DeployStatus = "pending" | "in_transit" | "deployed" | "returned";

interface Deployment {
  id: number;
  deployCode: string;
  assetTag: string;
  assetName: string;
  assetCategory: string;
  assignedTo: string;
  branchName: string;
  status: DeployStatus;
  deployedAt: string;
  returnDate?: string;
  notes?: string;
  deployedBy: string;
}

const MOCK_DEPLOYMENTS: Deployment[] = [
  { id: 1, deployCode: "DEP-202611-0001", assetTag: "AST-MDN-PDA-001", assetName: "Honeywell EDA51 Sales PDA", assetCategory: "Sales PDA / SFA Device", assignedTo: "Agus Kurniawan", branchName: "Depo Medan Marelan", status: "deployed", deployedAt: "2026-11-01T08:00:00Z", returnDate: "2027-04-30", notes: "PDA untuk tim sales area Medan Utara", deployedBy: "Rizky Pratama" },
  { id: 2, deployCode: "DEP-202611-0002", assetTag: "AST-SUB-LTP-004", assetName: "Lenovo ThinkPad L14 Gen 3", assetCategory: "Laptop", assignedTo: "Hendra Wijaya", branchName: "Depo Surabaya Rungkut", status: "deployed", deployedAt: "2026-10-15T09:00:00Z", returnDate: "2027-10-15", notes: "Laptop kerja IT Support Surabaya", deployedBy: "Budi Santoso" },
  { id: 3, deployCode: "DEP-202611-0003", assetTag: "AST-MKS-PDA-003", assetName: "Zebra TC57 Industrial PDA", assetCategory: "Sales PDA / SFA Device", assignedTo: "Joko Santoso", branchName: "Depo Makassar Biringkanaya", status: "deployed", deployedAt: "2026-11-05T10:00:00Z", returnDate: "2027-05-05", notes: "Pengganti PDA lama yang rusak", deployedBy: "Rizky Pratama" },
  { id: 4, deployCode: "DEP-202611-0004", assetTag: "AST-HQ-LTP-012", assetName: "Dell Latitude 5540 Laptop", assetCategory: "Laptop", assignedTo: "Siti Nuraini", branchName: "Headquarters Jakarta", status: "pending", deployedAt: "2026-11-10T14:00:00Z", notes: "Menunggu approval branch manager", deployedBy: "Rizky Pratama" },
  { id: 5, deployCode: "DEP-202610-0021", assetTag: "AST-MDN-PRN-002", assetName: "Epson TM-T82X Printer", assetCategory: "Printer", assignedTo: "Gudang MDN", branchName: "Depo Medan Marelan", status: "returned", deployedAt: "2026-05-01T08:00:00Z", returnDate: "2026-11-08", notes: "Dikembalikan karena perlu servis head", deployedBy: "Rizky Pratama" },
  { id: 6, deployCode: "DEP-202611-0005", assetTag: "AST-SUB-UPS-001", assetName: "APC Smart-UPS 1500VA", assetCategory: "UPS / Power", assignedTo: "Server Room SUB", branchName: "Depo Surabaya Rungkut", status: "in_transit", deployedAt: "2026-11-11T07:00:00Z", returnDate: "2029-01-01", notes: "Pengiriman dari gudang HQ ke depo SUB", deployedBy: "Budi Santoso" },
];

const STATUS_CFG: Record<DeployStatus, { label: string; color: string; bg: string; border: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending: { label: "Menunggu Persetujuan", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", icon: Clock },
  in_transit: { label: "Dalam Pengiriman", color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/30", icon: Rocket },
  deployed: { label: "Aktif / Digunakan", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", icon: CheckCircle2 },
  returned: { label: "Dikembalikan", color: "text-slate-500", bg: "bg-slate-800/40", border: "border-slate-700/30", icon: AlertTriangle },
};

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Sales PDA / SFA Device": Smartphone,
  "Laptop": Laptop,
  "Printer": Printer,
  "Server / Network": Server,
  "UPS / Power": HardDrive,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

export default function DeploymentsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<DeployStatus | "">("");

  const filtered = MOCK_DEPLOYMENTS.filter((d) => {
    const q = search.toLowerCase();
    return (
      (!q || d.assetName.toLowerCase().includes(q) || d.assetTag.toLowerCase().includes(q) || d.assignedTo.toLowerCase().includes(q) || d.deployCode.toLowerCase().includes(q)) &&
      (!filterStatus || d.status === filterStatus)
    );
  });

  const counts = {
    total: MOCK_DEPLOYMENTS.length,
    deployed: MOCK_DEPLOYMENTS.filter((d) => d.status === "deployed").length,
    pending: MOCK_DEPLOYMENTS.filter((d) => d.status === "pending").length,
    inTransit: MOCK_DEPLOYMENTS.filter((d) => d.status === "in_transit").length,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">Deployment Perangkat IT</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Pantau penugasan dan pengiriman aset IT ke seluruh depo dan karyawan.
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition">
          <Plus className="h-3.5 w-3.5" /> Buat Deployment Baru
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Deployment", value: counts.total, color: "text-white" },
          { label: "Aktif / Deployed", value: counts.deployed, color: "text-emerald-400" },
          { label: "Menunggu Approval", value: counts.pending, color: "text-amber-400" },
          { label: "Dalam Pengiriman", value: counts.inTransit, color: "text-sky-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-800 bg-[#0B0F17] p-4">
            <p className="text-xs text-slate-400">{s.label}</p>
            <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Cari kode deployment, aset, atau penerima..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-[#0B0F17] py-2.5 pl-9 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as DeployStatus | "")}
          className="rounded-xl border border-slate-800 bg-[#0B0F17] py-2.5 px-4 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50 transition appearance-none cursor-pointer"
        >
          <option value="">Semua Status</option>
          <option value="pending">Menunggu Persetujuan</option>
          <option value="in_transit">Dalam Pengiriman</option>
          <option value="deployed">Aktif / Deployed</option>
          <option value="returned">Dikembalikan</option>
        </select>
      </div>

      {/* Deployment Timeline Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-[#0B0F17] p-16 text-center">
            <Rocket className="h-10 w-10 mx-auto mb-3 text-slate-700" />
            <p className="text-slate-600 text-sm">Tidak ada deployment yang cocok.</p>
          </div>
        ) : (
          filtered.map((dep) => {
            const cfg = STATUS_CFG[dep.status];
            const CatIcon = CATEGORY_ICONS[dep.assetCategory] ?? HardDrive;
            const SIcon = cfg.icon;

            return (
              <div
                key={dep.id}
                className="flex flex-col md:flex-row md:items-center gap-4 rounded-2xl border border-slate-800 bg-[#0B0F17] p-4 hover:border-slate-700 transition-colors"
              >
                {/* Asset Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800">
                    <CatIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-100 truncate">{dep.assetName}</p>
                    <p className="text-[10px] font-mono text-slate-500">{dep.assetTag} · {dep.deployCode}</p>
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-700 hidden md:block" />

                {/* Assignment Info */}
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <User className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span className="font-semibold truncate">{dep.assignedTo}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Building2 className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{dep.branchName}</span>
                  </div>
                </div>

                {/* Dates */}
                <div className="flex-1 space-y-1 min-w-0 hidden lg:block">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span>Deploy: {formatDate(dep.deployedAt)}</span>
                  </div>
                  {dep.returnDate && (
                    <div className="text-xs text-slate-600 pl-5">Rencana kembali: {formatDate(dep.returnDate)}</div>
                  )}
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold whitespace-nowrap ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                    <SIcon className="h-3 w-3" />
                    {cfg.label}
                  </span>

                  {/* Quick Actions */}
                  <div className="flex gap-1">
                    {dep.status === "pending" && (
                      <button className="rounded-lg px-2.5 py-1 text-[10px] font-semibold bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition">
                        Setujui
                      </button>
                    )}
                    {dep.status === "deployed" && (
                      <button className="rounded-lg px-2.5 py-1 text-[10px] font-semibold bg-slate-800 border border-slate-700 text-slate-400 hover:text-amber-400 transition">
                        Kembalikan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
