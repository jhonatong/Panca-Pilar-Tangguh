"use client";

import { FormEvent, useState } from "react";

export function B2BForm() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      const response = await fetch("/api/b2b-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form.entries())),
      });
      const result: { error?: string } = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Permohonan tidak dapat dikirim.");
      formElement.reset();
      setError(false);
      setMessage("Permohonan kemitraan berhasil dikirim.");
    } catch (cause) {
      setError(true);
      setMessage(cause instanceof Error ? cause.message : "Terjadi kesalahan saat mengirim permohonan.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="stack" onSubmit={submit}>
      {message && <p className={`notice ${error ? "error" : "success"}`} role="status">{message}</p>}
      <div className="form-grid">
        <div className="field"><label htmlFor="store_name">Nama toko / outlet *</label><input id="store_name" name="storeName" required maxLength={120} placeholder="Contoh: Toko Kelontong Jaya" /></div>
        <div className="field"><label htmlFor="owner_name">Nama pemilik *</label><input id="owner_name" name="ownerName" required maxLength={120} placeholder="Nama pemilik / penanggung jawab" /></div>
        <div className="field"><label htmlFor="phone">Nomor HP / WhatsApp *</label><input id="phone" name="phone" required maxLength={32} placeholder="081260112233" /></div>
        <div className="field"><label htmlFor="city">Kota / Kabupaten *</label><input id="city" name="city" required maxLength={100} placeholder="Medan" /></div>
        <div className="field full"><label htmlFor="address">Alamat lengkap toko *</label><textarea id="address" name="address" required maxLength={500} rows={3} /></div>
        <div className="field full"><label htmlFor="notes">Catatan perkiraan pesanan bulanan</label><textarea id="notes" name="notes" maxLength={1000} rows={2} placeholder="Contoh: Permohonan alokasi 50 karton/bulan" /></div>
      </div>
      <button className="button" type="submit" disabled={submitting}>{submitting ? "Mengirim..." : "Kirim Permohonan Kemitraan"}</button>
    </form>
  );
}
