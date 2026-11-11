"use client";

import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Plus,
  Server,
  Laptop,
  Printer,
  Smartphone,
  HardDrive,
  Zap,
  Edit,
  Eye,
  ArrowUpRight,
  Filter,
  Download,
} from "lucide-react";

type AssetStatus = "in_use" | "available" | "under_maintenance" | "decommissioned";
type AssetCondition = "good" | "fair" | "needs_repair" | "damaged";

interface Asset {
  id: number;
  assetTag: string;
  name: string;
  category: string;
  serialNumber: string;
  condition: AssetCondition;
  status: AssetStatus;
  branchName: string;
  userName: string | null;
  purchaseDate?: string;
  warrantyUntil?: string;
}

const MOCK_ASSETS: Asset[] = [
  { id: 1, assetTag: "AST-MDN-PDA-001", name: "Honeywell EDA51 Sales PDA", category: "Sales PDA / SFA Device", serialNumber: "HWEDA51-99882211", condition: "good", status: "in_use", branchName: "Depo Medan Marelan", userName: "Agus Kurniawan", purchaseDate: "2024-03-15", warrantyUntil: "2027-03-15" },
  { id: 2, assetTag: "AST-SUB-LTP-004", name: "Lenovo ThinkPad L14 Gen 3", category: "Laptop", serialNumber: "PF-3982A1", condition: "good", status: "in_use", branchName: "Depo Surabaya Rungkut", userName: "Hendra Wijaya", purchaseDate: "2023-07-01", warrantyUntil: "2026-07-01" },
  { id: 3, assetTag: "AST-MDN-PRN-002", name: "Epson TM-T82X Thermal Receipt Printer", category: "Printer", serialNumber: "EPS-882710-MDN", condition: "needs_repair", status: "under_maintenance", branchName: "Depo Medan Marelan", userName: null, purchaseDate: "2022-01-10", warrantyUntil: "2025-01-10" },
  { id: 4, assetTag: "AST-HQ-SRV-001", name: "Dell PowerEdge R440 Rack Server", category: "Server / Network", serialNumber: "DELL-9821-HQ", condition: "good", status: "in_use", branchName: "Headquarters Jakarta", userName: "Budi Santoso", purchaseDate: "2023-11-20", warrantyUntil: "2028-11-20" },
  { id: 5, assetTag: "AST-MKS-PDA-003", name: "Zebra TC57 Industrial PDA", category: "Sales PDA / SFA Device", serialNumber: "ZB-TC57-MKS-77341", condition: "good", status: "in_use", branchName: "Depo Makassar Biringkanaya", userName: "Joko Santoso", purchaseDate: "2024-01-05", warrantyUntil: "2027-01-05" },
  { id: 6, assetTag: "AST-SUB-UPS-001", name: "APC Smart-UPS 1500VA", category: "UPS / Power", serialNumber: "APCU-15-SUB-002", condition: "good", status: "available", branchName: "Depo Surabaya Rungkut", userName: null, purchaseDate: "2023-04-18", warrantyUntil: "2026-04-18" },
  { id: 7, assetTag: "AST-HQ-LTP-012", name: "Dell Latitude 5540 Laptop", category: "Laptop", serialNumber: "DLLT-5540-HQ-12", condition: "fair", status: "available", branchName: "Headquarters Jakarta", userName: null, purchaseDate: "2022-08-30", warrantyUntil: "2025-08-30" },
  { id: 8, assetTag: "AST-MDN-SWT-001", name: "Cisco Catalyst 2960-X Switch", category: "Server / Network", serialNumber: "CIS-2960-MDN-01", condition: "good", status: "in_use", branchName: "Depo Medan Marelan", userName: null, purchaseDate: "2021-06-10", warrantyUntil: "2026-06-10" },
];

const STATUS_CONFIG: Record<AssetStatus, { label: string; color: string; bg: string; dot: string }> = {
  in_use: { label: "Digunakan", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30", dot: "bg-blue-400" },
  available: { label: "Tersedia", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30", dot: "bg-emerald-400" },
  under_maintenance: { label: "Maintenance", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30", dot: "bg-amber-400" },
  decommissioned: { label: "Pensiun", color: "text-slate-500", bg: "bg-slate-800/40 border-slate-700/30", dot: "bg-slate-500" },
};

const CONDITION_CONFIG: Record<AssetCondition, { label: string; color: string }> = {
  good: { label: "Baik", color: "text-emerald-400" },
  fair: { label: "Cukup", color: "text-yellow-400" },
  needs_repair: { label: "Perlu Servis", color: "text-orange-400" },
  damaged: { label: "Rusak", color: "text-red-400" },
};

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Sales PDA / SFA Device": Smartphone,
  "Laptop": Laptop,
  "Printer": Printer,
  "Server / Network": Server,
  "UPS / Power": Zap,
};

export default function AssetsPage() {
  const [assets] = useState<Asset[]>(MOCK_ASSETS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<AssetStatus | "">("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterBranch, setFilterBranch] = useState("");

  const categories = Array.from(new Set(MOCK_ASSETS.map((a) => a.category)));
  const branches = Array.from(new Set(MOCK_ASSETS.map((a) => a.branchName)));

  const filtered = assets.filter((a) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      a.name.toLowerCase().includes(q) ||
      a.assetTag.toLowerCase().includes(q) ||
      a.serialNumber.toLowerCase().includes(q) ||
      (a.userName ?? "").toLowerCase().includes(q);
    const matchesStatus = !filterStatus || a.status === filterStatus;
    const matchesCategory = !filterCategory || a.category === filterCategory;
    const matchesBranch = !filterBranch || a.branchName === filterBranch;
    return matchesSearch && matchesStatus && matchesCategory && matchesBranch;
  });

  const stats = {
    total: assets.length,
    inUse: assets.filter((a) => a.status === "in_use").length,
    available: assets.filter((a) => a.status === "available").length,
    maintenance: assets.filter((a) => a.status === "under_maintenance").length,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">Manajemen Aset IT</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola seluruh inventaris perangkat keras IT di semua depo.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800 transition">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition">
            <Plus className="h-3.5 w-3.5" /> Tambah Aset
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Aset", value: stats.total, color: "text-white" },
          { label: "Sedang Digunakan", value: stats.inUse, color: "text-blue-400" },
          { label: "Tersedia", value: stats.available, color: "text-emerald-400" },
          { label: "Maintenance", value: stats.maintenance, color: "text-amber-400" },
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
            placeholder="Cari nama, asset tag, serial number, atau pengguna..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-[#0B0F17] py-2.5 pl-9 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as AssetStatus | "")}
              className="rounded-xl border border-slate-800 bg-[#0B0F17] py-2.5 pl-9 pr-8 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50 transition appearance-none cursor-pointer"
            >
              <option value="">Semua Status</option>
              <option value="in_use">Digunakan</option>
              <option value="available">Tersedia</option>
              <option value="under_maintenance">Maintenance</option>
              <option value="decommissioned">Pensiun</option>
            </select>
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-xl border border-slate-800 bg-[#0B0F17] py-2.5 px-3 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50 transition appearance-none cursor-pointer"
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="rounded-xl border border-slate-800 bg-[#0B0F17] py-2.5 px-3 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50 transition appearance-none cursor-pointer"
          >
            <option value="">Semua Depo</option>
            {branches.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      {/* Assets Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#0B0F17] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40">
                <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider">Asset Tag / Nama</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider">Kategori</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider">Serial Number</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider">Kondisi</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider">Depo</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider">Pengguna</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider">Garansi</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-600">
                    <HardDrive className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p>Tidak ada aset yang cocok dengan filter.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((asset) => {
                  const statusCfg = STATUS_CONFIG[asset.status];
                  const condCfg = CONDITION_CONFIG[asset.condition];
                  const CategoryIcon = CATEGORY_ICONS[asset.category] ?? HardDrive;

                  return (
                    <tr key={asset.id} className="hover:bg-slate-800/20 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800">
                            <CategoryIcon className="h-4 w-4 text-slate-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-200 leading-tight">{asset.name}</p>
                            <p className="text-slate-600 font-mono text-[10px]">{asset.assetTag}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{asset.category}</td>
                      <td className="px-4 py-3 font-mono text-slate-500">{asset.serialNumber}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusCfg.bg} ${statusCfg.color}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className={`px-4 py-3 font-semibold ${condCfg.color}`}>{condCfg.label}</td>
                      <td className="px-4 py-3 text-slate-400">{asset.branchName.replace("Depo ", "").replace("Headquarters ", "HQ ")}</td>
                      <td className="px-4 py-3 text-slate-300">
                        {asset.userName ?? <span className="text-slate-600 italic">— tidak ada</span>}
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-mono text-[10px]">
                        {asset.warrantyUntil ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-blue-400 transition" title="Lihat Detail">
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-amber-400 transition" title="Edit Aset">
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-emerald-400 transition" title="Deploy / Assign">
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3">
          <p className="text-xs text-slate-500">
            Menampilkan <span className="text-slate-300 font-semibold">{filtered.length}</span> dari {assets.length} aset
          </p>
          <div className="flex items-center gap-1">
            <button className="rounded-lg px-2.5 py-1 text-xs text-slate-400 hover:bg-slate-800 transition disabled:opacity-30" disabled>← Sebelumnya</button>
            <span className="rounded-lg bg-blue-600/10 border border-blue-500/20 px-2.5 py-1 text-xs font-bold text-blue-400">1</span>
            <button className="rounded-lg px-2.5 py-1 text-xs text-slate-400 hover:bg-slate-800 transition disabled:opacity-30" disabled>Berikutnya →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
