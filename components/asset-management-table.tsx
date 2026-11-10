"use client";

import React, { useState } from "react";
import { Server, Search, Filter, ShieldCheck, Laptop, Printer, Smartphone } from "lucide-react";
import { Badge, BadgeVariant } from "@/components/ui/badge";

interface AssetRecord {
  id: number;
  assetTag: string;
  name: string;
  category: string;
  serialNumber?: string | null;
  condition: string;
  status: string;
  branchName: string;
  userName?: string | null;
}

interface AssetTableProps {
  assets: AssetRecord[];
}

export function AssetManagementTable({ assets }: AssetTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");

  const filtered = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.serialNumber ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.branchName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || asset.status === statusFilter;
    const matchesCondition = conditionFilter === "all" || asset.condition === conditionFilter;

    return matchesSearch && matchesStatus && matchesCondition;
  });

  const getConditionBadgeVariant = (condition: string): BadgeVariant => {
    switch (condition) {
      case "good":
        return "available";
      case "needs_repair":
        return "warning";
      case "damaged":
      case "decommissioned":
        return "critical";
      default:
        return "available";
    }
  };

  const getStatusBadgeVariant = (status: string): BadgeVariant => {
    switch (status) {
      case "in_use":
        return "deployed";
      case "in_stock":
        return "available";
      case "under_maintenance":
        return "maintenance";
      default:
        return "deployed";
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("pda") || cat.includes("sfa") || cat.includes("mobile")) {
      return <Smartphone className="h-4 w-4 text-blue-400" />;
    }
    if (cat.includes("printer")) {
      return <Printer className="h-4 w-4 text-cyan-400" />;
    }
    return <Laptop className="h-4 w-4 text-indigo-400" />;
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#111827] overflow-hidden shadow-xl">
      {/* Control Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-5 border-b border-slate-800 bg-[#0E131F]">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Cari Tag Perangkat, Nama SFA, atau Serial No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#161F30] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#161F30] border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Filter className="h-3.5 w-3.5 text-blue-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">Semua Status</option>
              <option value="in_use" className="bg-slate-900">In Use (Digunakan)</option>
              <option value="in_stock" className="bg-slate-900">In Stock (Tersedia)</option>
              <option value="under_maintenance" className="bg-slate-900">Maintenance</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-[#161F30] border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">Semua Kondisi</option>
              <option value="good" className="bg-slate-900">Baik (Good)</option>
              <option value="needs_repair" className="bg-slate-900">Perlu Perbaikan</option>
              <option value="damaged" className="bg-slate-900">Rusak (Damaged)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#0B0F17] text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 font-semibold">Asset Tag</th>
              <th className="py-3 px-4 font-semibold">Perangkat & Kategori</th>
              <th className="py-3 px-4 font-semibold">Depo / Lokasi</th>
              <th className="py-3 px-4 font-semibold">Pengguna / Sales</th>
              <th className="py-3 px-4 font-semibold">Kondisi</th>
              <th className="py-3 px-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filtered.map((asset) => (
              <tr key={asset.id} className="hover:bg-slate-800/40 transition">
                <td className="py-3.5 px-4 font-mono font-bold text-blue-400 flex items-center gap-2">
                  {getCategoryIcon(asset.category)}
                  {asset.assetTag}
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-100">{asset.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    SN: {asset.serialNumber || "-"} · {asset.category}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-300">{asset.branchName}</td>
                <td className="py-3.5 px-4">
                  {asset.userName ? (
                    <span className="text-slate-200">{asset.userName}</span>
                  ) : (
                    <span className="text-slate-500 italic">Unassigned (Pool)</span>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  <Badge variant={getConditionBadgeVariant(asset.condition)}>
                    {asset.condition.replace("_", " ")}
                  </Badge>
                </td>
                <td className="py-3.5 px-4">
                  <Badge variant={getStatusBadgeVariant(asset.status)}>
                    {asset.status.replace("_", " ")}
                  </Badge>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  Tidak ada aset IT yang cocok dengan filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
