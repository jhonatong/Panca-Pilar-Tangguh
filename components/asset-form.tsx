"use client";

import { useState, type FormEvent } from "react";

type Branch = { id: number; name: string };

export function AssetForm({ branches }: { branches: Branch[] }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = Object.fromEntries(form.entries());
    setSubmitting(true);
    setMessage("");
    try {
      const response = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, branchId: Number(payload.branchId) }),
      });
      const result: { error?: string } = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Aset tidak dapat ditambahkan.");
      setError(false);
      setMessage("Aset berhasil ditambahkan. Muat ulang halaman untuk melihatnya.");
      formElement.reset();
    } catch (cause) {
      setError(true);
      setMessage(cause instanceof Error ? cause.message : "Aset tidak dapat ditambahkan.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <details className="asset-add">
      <summary className="button">Tambah aset</summary>
      <form className="stack asset-popover" onSubmit={submit}>
        {message && <p className={`notice ${error ? "error" : "success"}`} role="status">{message}</p>}
        <div className="field"><label htmlFor="assetTag">Tag aset</label><input id="assetTag" name="assetTag" required maxLength={80} /></div>
        <div className="field"><label htmlFor="assetName">Nama perangkat</label><input id="assetName" name="name" required maxLength={160} /></div>
        <div className="field"><label htmlFor="assetCategory">Kategori</label><input id="assetCategory" name="category" required maxLength={100} /></div>
        <div className="field"><label htmlFor="serialNumber">Nomor seri</label><input id="serialNumber" name="serialNumber" required maxLength={120} /></div>
        <div className="field"><label htmlFor="assetBranch">Cabang</label><select id="assetBranch" name="branchId" required>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></div>
        <button className="button" disabled={submitting}>{submitting ? "Menyimpan..." : "Simpan aset"}</button>
      </form>
    </details>
  );
}
