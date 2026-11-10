"use client";

import React, { useState } from "react";
import { Search, Bell, MapPin, ChevronDown } from "lucide-react";
import { LogoutButton } from "./logout-button";

interface HeaderProps {
  user?: {
    name: string;
    role: string;
  } | null;
  branches: Array<{
    id: number;
    branchCode: string;
    branchName: string;
  }>;
}

export function EnterpriseHeader({ user, branches }: HeaderProps) {
  const [selectedBranch, setSelectedBranch] = useState("all");

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-[#0E131F]/95 px-6 backdrop-blur sticky top-0 z-40">
      {/* Branch Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-300">
          <MapPin className="h-3.5 w-3.5 text-blue-400" />
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-transparent font-medium text-slate-200 outline-none cursor-pointer pr-2"
          >
            <option value="all" className="bg-slate-900 text-slate-200">
              Semua Depo / Cabang
            </option>
            {branches.map((b) => (
              <option key={b.id} value={b.branchCode} className="bg-slate-900 text-slate-200">
                {b.branchName} ({b.branchCode})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="hidden md:flex relative w-80 items-center">
        <Search className="absolute left-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari Asset Tag, Serial, atau Karyawan..."
          className="w-full rounded-lg border border-slate-800 bg-slate-900/90 py-1.5 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <kbd className="absolute right-2.5 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
          ⌘K
        </kbd>
      </div>

      {/* Controls & User Profile */}
      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
          </span>
        </button>

        <div className="h-5 w-[1px] bg-slate-800" />

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-blue-600/30">
            {user ? user.name.slice(0, 2).toUpperCase() : "PT"}
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-semibold text-slate-200 leading-tight">
              {user ? user.name : "Tamu / Pengunjung"}
            </span>
            <span className="block text-[10px] text-blue-400 font-semibold tracking-wide uppercase">
              {user ? user.role : "Portal"}
            </span>
          </div>
          {user && <LogoutButton />}
        </div>
      </div>
    </header>
  );
}
