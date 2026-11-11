"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Server,
  LifeBuoy,
  Rocket,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Package,
  LogOut,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  section?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, section: "Utama" },
  { label: "Katalog FMCG", href: "/products", icon: Package, section: "Utama" },
  { label: "Permohonan B2B", href: "/b2b", icon: Building2, section: "Utama" },
  { label: "Aset IT", href: "/dashboard/assets", icon: Server, section: "IT Management" },
  { label: "Helpdesk Tiket", href: "/dashboard/tickets", icon: LifeBuoy, section: "IT Management" },
  { label: "Deployment", href: "/dashboard/deployments", icon: Rocket, section: "IT Management" },
  { label: "Laporan", href: "/dashboard/reports", icon: BarChart3, section: "IT Management" },
  { label: "Pengaturan", href: "/dashboard/settings", icon: Settings, section: "Sistem" },
];

export function EnterpriseSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const sections = Array.from(new Set(NAV_ITEMS.map((i) => i.section)));

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-800/80 bg-[#0B0F17] transition-all duration-300 min-h-screen ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="truncate">
              <span className="block font-bold text-sm tracking-tight text-slate-100">
                PANCA PILAR
              </span>
              <span className="block text-[10px] font-semibold tracking-wider text-blue-400 uppercase">
                IT Enterprise Hub
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        {sections.map((section) => {
          const items = NAV_ITEMS.filter((i) => i.section === section);
          return (
            <div key={section}>
              {!collapsed && (
                <p className="mb-1.5 px-3 text-[9px] font-bold uppercase tracking-widest text-slate-600">
                  {section}
                </p>
              )}
              <div className="space-y-0.5">
                {items.map((item) => {
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                        isActive
                          ? "bg-blue-600/10 text-blue-400 border border-blue-500/30 shadow-[inset_0_0_8px_rgba(37,99,235,0.15)]"
                          : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200"
                        }`}
                      />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                isActive
                                  ? "bg-blue-500/20 text-blue-300"
                                  : "bg-slate-800 text-slate-400"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-slate-800/80 space-y-1">
        {!collapsed && (
          <Link
            href="/api/auth/logout"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition"
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 transition"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <div className="flex w-full items-center justify-between text-xs font-medium">
              <span>Perkecil Menu</span>
              <ChevronLeft className="h-4 w-4" />
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
