"use client";

import { useState } from "react";

export function AssetControls({
  id,
  condition,
  status,
}: {
  id: number;
  condition: string;
  status: string;
}) {
  const [currentCondition, setCurrentCondition] = useState(condition);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [message, setMessage] = useState("");

  async function update(field: "condition" | "status", value: string) {
    const previous = field === "condition" ? currentCondition : currentStatus;
    if (field === "condition") setCurrentCondition(value);
    else setCurrentStatus(value);
    setMessage("");
    try {
      const response = await fetch(`/api/assets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (!response.ok) {
        const result: { error?: string } = await response.json();
        throw new Error(result.error ?? "Perubahan aset gagal disimpan.");
      }
    } catch (cause) {
      if (field === "condition") setCurrentCondition(previous);
      else setCurrentStatus(previous);
      setMessage(cause instanceof Error ? cause.message : "Perubahan aset gagal.");
    }
  }

  return (
    <div className="asset-controls">
      <label>
        Kondisi
        <select value={currentCondition} onChange={(event) => void update("condition", event.target.value)}>
          <option value="good">Baik</option>
          <option value="needs_repair">Perlu perbaikan</option>
          <option value="damaged">Rusak</option>
        </select>
      </label>
      <label>
        Status
        <select value={currentStatus} onChange={(event) => void update("status", event.target.value)}>
          <option value="in_stock">Di gudang</option>
          <option value="in_use">Digunakan</option>
          <option value="under_maintenance">Dalam perbaikan</option>
        </select>
      </label>
      {message && <small role="alert" className="notice error">{message}</small>}
    </div>
  );
}
