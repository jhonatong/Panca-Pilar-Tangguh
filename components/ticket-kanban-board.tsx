"use client";

import React, { useState } from "react";
import { TicketStatus } from "@/components/ticket-status";
import { Badge, BadgeVariant } from "@/components/ui/badge";
import { AlertCircle, Clock, CheckCircle2, XCircle } from "lucide-react";

interface TicketRecord {
  id: number;
  ticketCode: string;
  category: string;
  priority: string;
  subject: string;
  status: string;
  branchName: string;
  reporterName: string;
}

interface TicketBoardProps {
  tickets: TicketRecord[];
  isStaff: boolean;
}

export function TicketKanbanBoard({ tickets, isStaff }: TicketBoardProps) {
  const [activeTab, setActiveTab] = useState<"table" | "kanban">("kanban");

  const columns = [
    { key: "open", label: "Open (Menunggu)", icon: AlertCircle, color: "text-blue-400", border: "border-blue-500/30" },
    { key: "in_progress", label: "Dalam Penanganan", icon: Clock, color: "text-amber-400", border: "border-amber-500/30" },
    { key: "resolved", label: "Resolved", icon: CheckCircle2, color: "text-emerald-400", border: "border-emerald-500/30" },
    { key: "closed", label: "Closed", icon: XCircle, color: "text-slate-400", border: "border-slate-700" },
  ];

  const getPriorityBadgeVariant = (priority: string): BadgeVariant => {
    switch (priority) {
      case "critical":
        return "critical";
      case "high":
        return "warning";
      default:
        return "available";
    }
  };

  return (
    <div className="space-y-4">
      {/* Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-[#111827] border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("kanban")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "kanban"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setActiveTab("table")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "table"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Tabel Rinci
          </button>
        </div>
      </div>

      {activeTab === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {columns.map((col) => {
            const Icon = col.icon;
            const colTickets = tickets.filter((t) => t.status === col.key);

            return (
              <div
                key={col.key}
                className="bg-[#111827] border border-slate-800/80 rounded-2xl p-4 flex flex-col min-h-[360px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${col.color}`} />
                    <span className="text-xs font-bold text-slate-200 tracking-wide">
                      {col.label}
                    </span>
                  </div>
                  <span className="rounded-md bg-[#161F30] border border-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                    {colTickets.length}
                  </span>
                </div>

                {/* Card Stack */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-1">
                  {colTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-3.5 rounded-xl bg-[#0E131F] border border-slate-800/90 hover:border-blue-500/40 transition shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-[11px] font-bold text-blue-400">
                          {ticket.ticketCode}
                        </span>
                        <Badge variant={getPriorityBadgeVariant(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-100 mb-1 leading-snug">
                        {ticket.subject}
                      </h4>
                      <p className="text-[10px] text-slate-400 mb-3">
                        {ticket.category} · {ticket.branchName}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px]">
                        <span className="text-slate-400">{ticket.reporterName}</span>
                        {isStaff && (
                          <div className="scale-90 origin-right">
                            <TicketStatus id={ticket.id} status={ticket.status} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {colTickets.length === 0 && (
                    <div className="text-center py-10 text-slate-600 text-xs italic">
                      Kosong
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-[#111827] overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0B0F17] text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Kode Tiket</th>
                <th className="py-3 px-4">Subjek & Kategori</th>
                <th className="py-3 px-4">Cabang</th>
                <th className="py-3 px-4">Prioritas</th>
                <th className="py-3 px-4">Status</th>
                {isStaff && <th className="py-3 px-4">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-400">{t.ticketCode}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-100">{t.subject}</div>
                    <div className="text-[10px] text-slate-400">{t.category} · {t.reporterName}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{t.branchName}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={getPriorityBadgeVariant(t.priority)}>{t.priority}</Badge>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-300">{t.status}</td>
                  {isStaff && (
                    <td className="py-3.5 px-4">
                      <TicketStatus id={t.id} status={t.status} />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
