"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronDown,
  MessageSquare,
  User,
  Building2,
  Tag,
  Calendar,
} from "lucide-react";

type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
type TicketPriority = "low" | "medium" | "high" | "critical";

interface Ticket {
  id: number;
  ticketCode: string;
  category: string;
  priority: TicketPriority;
  subject: string;
  description: string;
  status: TicketStatus;
  branchName: string;
  reporterName: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

const MOCK_TICKETS: Ticket[] = [
  { id: 1, ticketCode: "TKT-202611-0001", category: "Software / SFA App", priority: "high", subject: "SFA Mobile App scanner gagal sync inventory", description: "Scanner di PDA Honeywell EDA51 tidak bisa mengirim data ke server. Sudah coba restart, masalah tetap ada.", status: "in_progress", branchName: "Depo Medan Marelan", reporterName: "Agus Kurniawan", assignedTo: "Rizky Pratama (IT Support)", createdAt: "2026-11-10T08:00:00Z", updatedAt: "2026-11-10T10:30:00Z" },
  { id: 2, ticketCode: "TKT-202611-0002", category: "Printer & Network", priority: "medium", subject: "Printer invoice thermal warehouse cetak huruf acak", description: "Printer Epson TM-T82X di gudang MDN cetak karakter tidak terbaca. Diduga head atau driver bermasalah.", status: "open", branchName: "Depo Medan Marelan", reporterName: "Dewi Lestari", createdAt: "2026-11-10T09:15:00Z", updatedAt: "2026-11-10T09:15:00Z" },
  { id: 3, ticketCode: "TKT-202611-0003", category: "Hardware / Laptop", priority: "low", subject: "Permintaan penggantian baterai laptop sales admin", description: "Baterai laptop Dell Latitude milik admin di SUB sudah tidak bisa tahan lebih dari 30 menit.", status: "resolved", branchName: "Depo Surabaya Rungkut", reporterName: "Hendra Wijaya", assignedTo: "Budi Santoso (IT)", createdAt: "2026-11-08T13:00:00Z", updatedAt: "2026-11-09T16:00:00Z" },
  { id: 4, ticketCode: "TKT-202611-0004", category: "Jaringan & VPN", priority: "critical", subject: "Koneksi VPN Depo Makassar terputus ke HQ", description: "Seluruh depo MKS tidak bisa terhubung ke sistem ERP HQ Jakarta sejak pukul 14.00 WIT. Dampak ke pelaporan stok.", status: "closed", branchName: "Depo Makassar Biringkanaya", reporterName: "Siti Rahmawati", assignedTo: "Budi Santoso (IT)", createdAt: "2026-11-07T14:00:00Z", updatedAt: "2026-11-08T09:00:00Z" },
  { id: 5, ticketCode: "TKT-202611-0005", category: "Software / SFA App", priority: "high", subject: "Aplikasi SFA tidak bisa login setelah update", description: "Setelah update SFA versi 3.2.1, 5 unit PDA di SUB tidak bisa login. Error: Invalid token.", status: "open", branchName: "Depo Surabaya Rungkut", reporterName: "Joko Santoso", createdAt: "2026-11-11T07:30:00Z", updatedAt: "2026-11-11T07:30:00Z" },
  { id: 6, ticketCode: "TKT-202611-0006", category: "Hardware / Laptop", priority: "medium", subject: "Keyboard laptop branch manager tidak responsif", description: "Beberapa tombol keyboard ThinkPad L14 milik kepala depo HQ tidak berfungsi.", status: "in_progress", branchName: "Headquarters Jakarta", reporterName: "Budi Santoso", assignedTo: "Rizky Pratama (IT)", createdAt: "2026-11-09T11:00:00Z", updatedAt: "2026-11-10T14:00:00Z" },
];

const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string; bg: string; border: string; icon: React.ComponentType<{ className?: string }> }> = {
  open: { label: "Open", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", icon: Clock },
  in_progress: { label: "Dalam Proses", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", icon: AlertCircle },
  resolved: { label: "Selesai", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", icon: CheckCircle2 },
  closed: { label: "Ditutup", color: "text-slate-500", bg: "bg-slate-800/40", border: "border-slate-700/30", icon: XCircle },
};

const PRIORITY_CONFIG: Record<TicketPriority, { label: string; color: string; bg: string }> = {
  low: { label: "Rendah", color: "text-slate-400", bg: "bg-slate-800" },
  medium: { label: "Sedang", color: "text-sky-400", bg: "bg-sky-500/10" },
  high: { label: "Tinggi", color: "text-orange-400", bg: "bg-orange-500/10" },
  critical: { label: "Kritis", color: "text-red-400", bg: "bg-red-500/10" },
};

const COLUMNS: { status: TicketStatus; label: string; color: string }[] = [
  { status: "open", label: "Open", color: "text-amber-400" },
  { status: "in_progress", label: "Dalam Proses", color: "text-blue-400" },
  { status: "resolved", label: "Selesai", color: "text-emerald-400" },
  { status: "closed", label: "Ditutup", color: "text-slate-500" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

function TicketCard({ ticket }: { ticket: Ticket }) {
  const pCfg = PRIORITY_CONFIG[ticket.priority];
  const sCfg = STATUS_CONFIG[ticket.status];
  const SIcon = sCfg.icon;

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0E131F] p-3.5 space-y-3 hover:border-slate-700 transition-colors cursor-pointer group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${pCfg.bg} ${pCfg.color} mb-1.5`}>
            {ticket.priority === "critical" && "🔴 "}
            {pCfg.label}
          </span>
          <p className="text-xs font-semibold text-slate-200 leading-snug line-clamp-2">{ticket.subject}</p>
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <Tag className="h-3 w-3" />
          <span>{ticket.category}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <Building2 className="h-3 w-3" />
          <span>{ticket.branchName.replace("Depo ", "")}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <User className="h-3 w-3" />
          <span>{ticket.reporterName}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(ticket.createdAt)}</span>
        </div>
      </div>
      {ticket.assignedTo && (
        <div className="rounded-lg bg-slate-800/60 px-2.5 py-1.5 text-[10px] text-slate-400">
          👤 Ditangani: <span className="text-slate-300 font-medium">{ticket.assignedTo}</span>
        </div>
      )}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
        <span className="font-mono text-[10px] text-slate-600">{ticket.ticketCode}</span>
        <span className={`text-[10px] font-semibold ${sCfg.color}`}>
          <SIcon className="inline h-3 w-3 mr-0.5" />
          {sCfg.label}
        </span>
      </div>
    </div>
  );
}

export default function TicketsPage() {
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState<TicketPriority | "">("");
  const [filterBranch, setFilterBranch] = useState("");

  const branches = Array.from(new Set(MOCK_TICKETS.map((t) => t.branchName)));

  const filtered = MOCK_TICKETS.filter((t) => {
    const q = search.toLowerCase();
    return (
      (!q || t.subject.toLowerCase().includes(q) || t.ticketCode.toLowerCase().includes(q) || t.reporterName.toLowerCase().includes(q)) &&
      (!filterPriority || t.priority === filterPriority) &&
      (!filterBranch || t.branchName === filterBranch)
    );
  });

  const counts = MOCK_TICKETS.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">Helpdesk — Tiket IT</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola dan pantau semua tiket kendala operasional IT dari seluruh depo.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-800 overflow-hidden">
            <button
              onClick={() => setView("kanban")}
              className={`px-3 py-1.5 text-xs font-medium transition ${view === "kanban" ? "bg-blue-600/20 text-blue-400" : "text-slate-400 hover:bg-slate-800"}`}
            >
              Kanban
            </button>
            <button
              onClick={() => setView("table")}
              className={`px-3 py-1.5 text-xs font-medium transition ${view === "table" ? "bg-blue-600/20 text-blue-400" : "text-slate-400 hover:bg-slate-800"}`}
            >
              Tabel
            </button>
          </div>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition">
            <Plus className="h-3.5 w-3.5" /> Buat Tiket
          </button>
        </div>
      </div>

      {/* Stat Chips */}
      <div className="flex flex-wrap gap-2">
        {COLUMNS.map((col) => {
          const cfg = STATUS_CONFIG[col.status];
          return (
            <div key={col.status} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${cfg.bg} ${cfg.border} ${cfg.color}`}>
              <cfg.icon className="h-3.5 w-3.5" />
              {cfg.label}: {counts[col.status] ?? 0}
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Cari tiket, kode, atau pelapor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-[#0B0F17] py-2.5 pl-9 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as TicketPriority | "")}
              className="rounded-xl border border-slate-800 bg-[#0B0F17] py-2.5 pl-9 pr-8 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50 transition appearance-none cursor-pointer"
            >
              <option value="">Semua Prioritas</option>
              <option value="critical">🔴 Kritis</option>
              <option value="high">Tinggi</option>
              <option value="medium">Sedang</option>
              <option value="low">Rendah</option>
            </select>
          </div>
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

      {/* Kanban View */}
      {view === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {COLUMNS.map((col) => {
            const columnTickets = filtered.filter((t) => t.status === col.status);
            const cfg = STATUS_CONFIG[col.status];
            return (
              <div key={col.status} className="rounded-2xl border border-slate-800 bg-[#0B0F17]/60 p-3">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <cfg.icon className={`h-4 w-4 ${cfg.color}`} />
                    <span className={`text-xs font-bold ${cfg.color}`}>{cfg.label}</span>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                    {columnTickets.length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {columnTickets.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-800 p-6 text-center text-xs text-slate-700">
                      Tidak ada tiket
                    </div>
                  ) : (
                    columnTickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {view === "table" && (
        <div className="rounded-2xl border border-slate-800 bg-[#0B0F17] overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40">
                <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider">Kode / Subjek</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider">Kategori</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider">Prioritas</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider">Depo</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider">Pelapor</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((ticket) => {
                const pCfg = PRIORITY_CONFIG[ticket.priority];
                const sCfg = STATUS_CONFIG[ticket.status];
                const SIcon = sCfg.icon;
                return (
                  <tr key={ticket.id} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-200">{ticket.subject}</p>
                      <p className="font-mono text-[10px] text-slate-600">{ticket.ticketCode}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{ticket.category}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ${pCfg.bg} ${pCfg.color}`}>
                        {pCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${sCfg.bg} ${sCfg.border} ${sCfg.color}`}>
                        <SIcon className="h-3 w-3" />
                        {sCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{ticket.branchName.replace("Depo ", "")}</td>
                    <td className="px-4 py-3 text-slate-300">{ticket.reporterName}</td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-[10px]">{formatDate(ticket.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-blue-400 transition">
                          <MessageSquare className="h-3.5 w-3.5" />
                        </button>
                        <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-amber-400 transition">
                          <ChevronDown className="h-3.5 w-3.5" />
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
  );
}
