import React from "react";

export type BadgeVariant = "available" | "deployed" | "maintenance" | "critical" | "warning";

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
}

const STYLES: Record<BadgeVariant, string> = {
  available: "bg-emerald-950/40 text-emerald-400 border-emerald-500/30",
  deployed: "bg-blue-950/40 text-blue-400 border-blue-500/30",
  maintenance: "bg-amber-950/40 text-amber-400 border-amber-500/30",
  critical: "bg-rose-950/40 text-rose-400 border-rose-500/30",
  warning: "bg-orange-950/40 text-orange-400 border-orange-500/30",
};

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${STYLES[variant]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {children}
    </span>
  );
}
