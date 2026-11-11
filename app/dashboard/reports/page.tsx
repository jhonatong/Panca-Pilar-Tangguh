"use client";

import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Server,
  LifeBuoy,
  Rocket,
  Building2,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";

const MONTHLY_TICKETS = [
  { month: "Jun", open: 3, resolved: 8 },
  { month: "Jul", open: 5, resolved: 11 },
  { month: "Agu", open: 2, resolved: 9 },
  { month: "Sep", open: 7, resolved: 14 },
  { month: "Okt", open: 4, resolved: 10 },
  { month: "Nov", open: 2, resolved: 6 },
];

const BRANCH_ASSETS = [
  { branch: "HQ Jakarta", total: 48, inUse: 42, available: 4, maintenance: 2 },
  { branch: "Medan Marelan", total: 35, inUse: 29, available: 3, maintenance: 3 },
  { branch: "Surabaya Rungkut", total: 31, inUse: 27, available: 3, maintenance: 1 },
  { branch: "Makassar Biringkanaya", total: 22, inUse: 19, available: 2, maintenance: 1 },
];

const CATEGORY_DIST = [
  { category: "Sales PDA / SFA Device", count: 52, pct: 38 },
  { category: "Laptop", count: 34, pct: 25 },
  { category: "Server / Network", count: 20, pct: 15 },
  { category: "Printer", count: 18, pct: 13 },
  { category: "UPS / Power", count: 12, pct: 9 },
];

const TICKET_BY_CATEGORY = [
  { category: "Software / SFA App", count: 14, pct: 40 },
  { category: "Hardware / Laptop", count: 8, pct: 23 },
  { category: "Printer & Network", count: 6, pct: 17 },
  { category: "Jaringan & VPN", count: 5, pct: 14 },
  { category: "Lainnya", count: 2, pct: 6 },
];

const maxBar = Math.max(...MONTHLY_TICKETS.map((m) => m.open + m.resolved));

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="flex-1 flex items-end h-16">
      <div
        className={`w-full rounded-t-sm ${color}`}
        style={{ height: `${Math.round((value / max) * 100)}%`, minHeight: "4px" }}
      />
    </div>
  );
}

function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function ReportsPage() {
  const totalAssets = BRANCH_ASSETS.reduce((s, b) => s + b.total, 0);
  const totalInUse = BRANCH_ASSETS.reduce((s, b) => s + b.inUse, 0);
  const totalAvail = BRANCH_ASSETS.reduce((s, b) => s + b.available, 0);
  const totalMaint = BRANCH_ASSETS.reduce((s, b) => s + b.maintenance, 0);
  const utilizationPct = Math.round((totalInUse / totalAssets) * 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="pb-5 border-b border-slate-800">
        <h1 className="text-xl font-extrabold tracking-tight text-white">Laporan & Analitik IT</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Ringkasan performa aset, tiket, dan deployment seluruh depo PT Panca Pilar Tangguh.
        </p>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Aset IT", value: totalAssets, icon: Server, color: "text-blue-400", trend: "+5 bulan ini", trendUp: true },
          { label: "Utilisasi Aset", value: `${utilizationPct}%`, icon: TrendingUp, color: "text-emerald-400", trend: `${totalInUse} unit aktif`, trendUp: true },
          { label: "Tiket Bulan Ini", value: 8, icon: LifeBuoy, color: "text-amber-400", trend: "2 belum selesai", trendUp: false },
          { label: "Deployment Aktif", value: 36, icon: Rocket, color: "text-purple-400", trend: "+3 bulan ini", trendUp: true },
        ].map((kpi) => {
          const KpiIcon = kpi.icon;
          return (
            <div key={kpi.label} className="rounded-xl border border-slate-800 bg-[#0B0F17] p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-slate-400">{kpi.label}</p>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800">
                  <KpiIcon className={`h-4 w-4 ${kpi.color}`} />
                </div>
              </div>
              <p className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</p>
              <div className="mt-2 flex items-center gap-1 text-[10px]">
                {kpi.trendUp ? (
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className="text-slate-500">{kpi.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Monthly Ticket Bar Chart */}
        <div className="rounded-2xl border border-slate-800 bg-[#0B0F17] p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-white">Tiket per Bulan</h2>
              <p className="text-[10px] text-slate-500">Jun – Nov 2026</p>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-blue-500" />Selesai</div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-amber-500" />Open</div>
            </div>
          </div>
          <div className="flex items-end gap-2 h-32">
            {MONTHLY_TICKETS.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col gap-1">
                <div className="flex items-end gap-0.5 h-24">
                  <MiniBar value={m.resolved} max={maxBar} color="bg-blue-500/70" />
                  <MiniBar value={m.open} max={maxBar} color="bg-amber-500/70" />
                </div>
                <p className="text-center text-[9px] font-semibold text-slate-600">{m.month}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Asset Distribution */}
        <div className="rounded-2xl border border-slate-800 bg-[#0B0F17] p-5">
          <div className="mb-5">
            <h2 className="text-sm font-bold text-white">Distribusi Aset per Kategori</h2>
            <p className="text-[10px] text-slate-500">Total {totalAssets} unit di seluruh depo</p>
          </div>
          <div className="space-y-3.5">
            {CATEGORY_DIST.map((c, i) => {
              const colors = ["bg-blue-500", "bg-sky-500", "bg-indigo-500", "bg-violet-500", "bg-purple-500"];
              const textColors = ["text-blue-400", "text-sky-400", "text-indigo-400", "text-violet-400", "text-purple-400"];
              return (
                <div key={c.category}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-300 truncate max-w-[180px]">{c.category}</span>
                    <span className={`font-bold ${textColors[i]}`}>{c.count} unit · {c.pct}%</span>
                  </div>
                  <ProgressBar pct={c.pct} color={colors[i]} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Branch Asset Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#0B0F17] overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white">Aset per Depo</h2>
          <p className="text-[10px] text-slate-500">Utilisasi dan kondisi per wilayah</p>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/30">
              <th className="px-5 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider">Depo</th>
              <th className="px-5 py-3 text-right font-semibold text-slate-500 uppercase tracking-wider">Total</th>
              <th className="px-5 py-3 text-right font-semibold text-slate-500 uppercase tracking-wider text-blue-500">Digunakan</th>
              <th className="px-5 py-3 text-right font-semibold text-slate-500 uppercase tracking-wider text-emerald-500">Tersedia</th>
              <th className="px-5 py-3 text-right font-semibold text-slate-500 uppercase tracking-wider text-amber-500">Maintenance</th>
              <th className="px-5 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider">Utilisasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {BRANCH_ASSETS.map((b) => {
              const util = Math.round((b.inUse / b.total) * 100);
              return (
                <tr key={b.branch} className="hover:bg-slate-800/20 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-slate-600" />
                      <span className="font-semibold text-slate-200">{b.branch}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-white">{b.total}</td>
                  <td className="px-5 py-3 text-right font-semibold text-blue-400">{b.inUse}</td>
                  <td className="px-5 py-3 text-right font-semibold text-emerald-400">{b.available}</td>
                  <td className="px-5 py-3 text-right font-semibold text-amber-400">{b.maintenance}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <ProgressBar pct={util} color="bg-blue-500" />
                      </div>
                      <span className="text-xs font-bold text-blue-400 w-8 text-right">{util}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
            <tr className="border-t-2 border-slate-700 bg-slate-900/30">
              <td className="px-5 py-3 font-bold text-white">Total Keseluruhan</td>
              <td className="px-5 py-3 text-right font-black text-white text-sm">{totalAssets}</td>
              <td className="px-5 py-3 text-right font-black text-blue-400">{totalInUse}</td>
              <td className="px-5 py-3 text-right font-black text-emerald-400">{totalAvail}</td>
              <td className="px-5 py-3 text-right font-black text-amber-400">{totalMaint}</td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1"><ProgressBar pct={utilizationPct} color="bg-blue-500" /></div>
                  <span className="text-xs font-black text-blue-400 w-8 text-right">{utilizationPct}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Ticket by Category */}
      <div className="rounded-2xl border border-slate-800 bg-[#0B0F17] p-5">
        <div className="mb-5">
          <h2 className="text-sm font-bold text-white">Tiket Helpdesk per Kategori (YTD 2026)</h2>
          <p className="text-[10px] text-slate-500">Total 35 tiket sepanjang tahun berjalan</p>
        </div>
        <div className="space-y-3.5">
          {TICKET_BY_CATEGORY.map((c, i) => {
            const colors = ["bg-red-500", "bg-orange-500", "bg-amber-500", "bg-sky-500", "bg-slate-600"];
            const textColors = ["text-red-400", "text-orange-400", "text-amber-400", "text-sky-400", "text-slate-500"];
            return (
              <div key={c.category}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-300">{c.category}</span>
                  <span className={`font-bold ${textColors[i]}`}>{c.count} tiket · {c.pct}%</span>
                </div>
                <ProgressBar pct={c.pct} color={colors[i]} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="rounded-2xl border border-slate-800 bg-[#0B0F17] p-5">
        <h2 className="text-sm font-bold text-white mb-4">Aktivitas Terakhir</h2>
        <div className="space-y-4">
          {[
            { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", time: "5 menit lalu", text: "Tiket TKT-202611-0003 ditandai Selesai oleh Budi Santoso" },
            { icon: AlertCircle, color: "text-blue-400", bg: "bg-blue-500/10", time: "1 jam lalu", text: "Tiket TKT-202611-0001 diperbarui status: In Progress → by Rizky Pratama" },
            { icon: Rocket, color: "text-purple-400", bg: "bg-purple-500/10", time: "3 jam lalu", text: "Deployment DEP-202611-0005 dimulai: APC UPS → Depo Surabaya" },
            { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", time: "5 jam lalu", text: "Tiket baru TKT-202611-0005 dibuat oleh Joko Santoso (SFA login gagal)" },
          ].map((act, i) => {
            const ActIcon = act.icon;
            return (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${act.bg}`}>
                  <ActIcon className={`h-3.5 w-3.5 ${act.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-300 leading-relaxed">{act.text}</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">{act.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
