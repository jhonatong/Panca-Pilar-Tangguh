"use client";

import { useState, type FormEvent } from "react";

type Option = { id: number; name: string };

export function TicketForm({
  branches,
  canChooseBranch,
}: {
  branches: Option[];
  canChooseBranch: boolean;
}) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = Object.fromEntries(form.entries());

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          branchId: Number(payload.branchId),
        }),
      });
      const result: { error?: string } = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Tiket tidak dapat dikirim.");
      }
      setError(false);
      setMessage("Tiket berhasil dibuat. Muat ulang halaman untuk melihatnya.");
      formElement.reset();
    } catch (cause) {
      setError(true);
      setMessage(
        cause instanceof Error
          ? cause.message
          : "Terjadi kesalahan saat membuat tiket.",
      );
    } finally {
      setSubmitting(false);
    }
  }
 
  return (
    <form className="stack" onSubmit={submit}>
      {message && (
        <p className={`notice ${error ? "error" : "success"}`} role="status">
          {message}
        </p>
      )}
      <div className="field">
        <label htmlFor="branchId">Lokasi depo / cabang</label>
        {canChooseBranch ? (
          <select id="branchId" name="branchId" required>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        ) : (
          <>
            <input type="hidden" name="branchId" value={branches[0]?.id ?? ""} />
            <input id="branchId" value={branches[0]?.name ?? "Cabang tidak tersedia"} readOnly />
          </>
        )}
      </div>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="category">Kategori</label>
          <select id="category" name="category">
            <option>Software / SFA App</option>
            <option>Printer & Network</option>
            <option>Hardware / Laptop</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="priority">Prioritas</label>
          <select id="priority" name="priority">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="subject">Subjek kendala</label>
        <input id="subject" name="subject" required maxLength={180} />
      </div>
      <div className="field">
        <label htmlFor="description">Deskripsi</label>
        <textarea
          id="description"
          name="description"
          required
          maxLength={3000}
          rows={3}
        />
      </div>
      <button className="button" disabled={submitting}>
        {submitting ? "Mengirim..." : "Submit Tiket IT"}
      </button>
    </form>
  );
}
