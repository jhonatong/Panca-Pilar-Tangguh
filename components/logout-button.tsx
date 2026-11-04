"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function logout() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Logout gagal. Coba lagi.");
      router.replace("/login");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Logout gagal.");
      setBusy(false);
    }
  }

  return (
    <>
      <button className="button secondary" onClick={() => void logout()} disabled={busy}>
        {busy ? "Keluar..." : "Keluar"}
      </button>
      {error && <span role="alert" className="notice error">{error}</span>}
    </>
  );
}
