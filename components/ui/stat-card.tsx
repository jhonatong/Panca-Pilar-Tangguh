import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
}

export function StatCard({ title, value, change, trend = "neutral", icon: Icon }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-[#111827] p-5 shadow-sm transition hover:border-slate-700">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className="rounded-lg bg-blue-600/10 p-2 text-blue-400 border border-blue-500/20">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-100">{value}</span>
        {change && (
          <span
            className={`text-xs font-medium ${
              trend === "up"
                ? "text-emerald-400"
                : trend === "down"
                ? "text-rose-400"
                : "text-slate-400"
            }`}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
