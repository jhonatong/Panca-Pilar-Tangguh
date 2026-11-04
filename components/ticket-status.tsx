"use client";

import { useState } from "react";

export function TicketStatus({ id, status }: { id: number; status: string }) {
  const [value, setValue] = useState(status);
  const [error, setError] = useState("");

  async function update(nextStatus: string) {
    setValue(nextStatus);
    setError("");
    try {
      const response = await fetch(`/api/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!response.ok) {
        const result: { error?: string } = await response.json();
        throw new Error(result.error ?? "Status tiket tidak dapat diperbarui.");
      }
    } catch (cause) {
      setValue(status);
      setError(cause instanceof Error ? cause.message : "Gagal memperbarui status.");
    }
  }

  return (
    <div>
      <select
        aria-label={`Status tiket ${id}`}
        value={value}
        onChange={(event) => void update(event.target.value)}
      >
        <option value="open">Open</option>
        <option value="in_progress">In progress</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>
      {error && <small className="notice error">{error}</small>}
    </div>
  );
}
