"use client";

import {
  Settings,
  User,
  Bell,
  Shield,
  Database,
  Globe,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="space-y-6 max-w-3xl mx-auto w-full">
      {/* Page Header */}
      <div className="pb-5 border-b border-slate-800">
        <h1 className="text-xl font-extrabold tracking-tight text-white">Pengaturan Sistem</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Konfigurasi profil, notifikasi, dan preferensi akun Anda.
        </p>
      </div>

      {/* Profile Section */}
      <section className="rounded-2xl border border-slate-800 bg-[#0B0F17] overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
          <User className="h-4 w-4 text-blue-400" />
          <h2 className="text-sm font-bold text-white">Profil Akun</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4 mb-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-xl font-black text-white shadow-lg shadow-blue-600/30">
              RP
            </div>
            <div>
              <p className="font-bold text-white">Rizky Pratama</p>
              <p className="text-xs text-slate-400">IT Support · Depo Medan Marelan</p>
              <span className="inline-flex mt-1 items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                it_staff
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Nama Lengkap", value: "Rizky Pratama", type: "text" },
              { label: "Email", value: "itsupport.mdn@pancapilartangguh.co.id", type: "email" },
              { label: "Nomor HP", value: "081234567890", type: "tel" },
              { label: "Jabatan", value: "IT Support Specialist", type: "text" },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">{f.label}</label>
                <input
                  type={f.type}
                  defaultValue={f.value}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 py-2.5 px-3.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password Baru</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Kosongkan jika tidak ingin ubah"
                className="w-full rounded-xl border border-slate-800 bg-slate-900/60 py-2.5 pl-3.5 pr-10 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 transition"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition">
              <Save className="h-3.5 w-3.5" /> Simpan Perubahan
            </button>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-2xl border border-slate-800 bg-[#0B0F17] overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
          <Bell className="h-4 w-4 text-blue-400" />
          <h2 className="text-sm font-bold text-white">Notifikasi</h2>
        </div>
        <div className="p-5 space-y-4">
          {[
            { label: "Tiket baru masuk", desc: "Notifikasi saat ada tiket helpdesk baru", enabled: true },
            { label: "Update status tiket", desc: "Notifikasi saat status tiket berubah", enabled: true },
            { label: "Aset mendekati masa garansi habis", desc: "30 hari sebelum garansi berakhir", enabled: false },
            { label: "Laporan mingguan", desc: "Ringkasan performa aset & tiket setiap Senin", enabled: true },
          ].map((n) => (
            <div key={n.label} className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-200">{n.label}</p>
                <p className="text-xs text-slate-500">{n.desc}</p>
              </div>
              <button
                className={`relative h-5 w-9 rounded-full transition-colors ${n.enabled ? "bg-blue-600" : "bg-slate-700"}`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${n.enabled ? "translate-x-4" : "translate-x-0.5"}`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* System Info */}
      <section className="rounded-2xl border border-slate-800 bg-[#0B0F17] overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
          <Shield className="h-4 w-4 text-blue-400" />
          <h2 className="text-sm font-bold text-white">Informasi Sistem</h2>
        </div>
        <div className="p-5 space-y-3">
          {[
            { icon: Globe, label: "Versi Aplikasi", value: "v1.4.2 (Nov 2026)" },
            { icon: Database, label: "Database", value: "PostgreSQL 16 · Prisma ORM" },
            { icon: Settings, label: "Backend API", value: "Go 1.23 · Gin Framework · Port 8080" },
            { icon: Globe, label: "Frontend", value: "Next.js 15 · App Router · TypeScript" },
          ].map((info) => {
            const InfoIcon = info.icon;
            return (
              <div key={info.label} className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <InfoIcon className="h-3.5 w-3.5" />
                  {info.label}
                </div>
                <span className="text-xs font-mono font-semibold text-slate-300">{info.value}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
