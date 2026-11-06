"use client";

import { useState, type FormEvent } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
};

export function SalesOrderForm({ products }: { products: Product[] }) {
  const [storeName, setStoreName] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/sales/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName,
          productId: Number(selectedProduct),
          quantity: Number(quantity),
        }),
      });

      if (!res.ok) throw new Error("Gagal membuat pesanan sales.");

      setMessage("Pesanan sales berhasil diinput!");
      setStoreName("");
      setQuantity(1);
    } catch (err: any) {
      setMessage(err.message || "Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="stack p-4 border rounded-lg max-w-md" onSubmit={handleSubmit}>
      <h3 className="font-bold text-lg">Input Pesanan Sales (SFA)</h3>
      {message && <p className="notice">{message}</p>}

      <div className="field">
        <label htmlFor="storeName">Nama Toko / Outlet</label>
        <input
          id="storeName"
          type="text"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          placeholder="Contoh: Toko Maju Jaya"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="product">Pilih Produk</label>
        <select
          id="product"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          required
        >
          <option value="">-- Pilih Produk --</option>
          {products?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} - Rp {p.price.toLocaleString("id-ID")}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="quantity">Jumlah (Qty)</label>
        <input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
        />
      </div>

      <button className="button" disabled={submitting}>
        {submitting ? "Menyimpan Order..." : "Kirim Pesanan Sales"}
      </button>
    </form>
  );
}