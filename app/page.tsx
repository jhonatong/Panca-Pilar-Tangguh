import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [branches, products] = await Promise.all([
    prisma.branch.findMany({ where: { isActive: true }, orderBy: { id: "asc" } }),
    prisma.product.findMany({ where: { isActive: true }, orderBy: { id: "asc" }, take: 4 }),
  ]);

  return (
    <>
      <div className="announcement">Jaringan distribusi nasional FMCG & Tobacco - melayani outlet retail di seluruh Indonesia</div>
      <SiteHeader />
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Mitra distribusi nasional terpercaya</span>
            <h1>Mitra Distribusi FMCG & Produk Consumer Goods Terpercaya</h1>
            <p>Mengintegrasikan jaringan logistik depo di berbagai wilayah Indonesia dengan dukungan operasional dan teknologi terkini.</p>
            <div className="button-row"><Link className="button" href="/b2b">Daftar Outlet Kemitraan B2B</Link><Link className="button secondary" href="/products">Lihat Katalog Produk</Link></div>
          </div>
          <section className="card">
            <div className="section-heading"><div><h2>Jaringan Depo & Cabang</h2><p>Pusat distribusi aktif di Indonesia</p></div><span className="badge">{branches.length} depo aktif</span></div>
            <div className="branch-list">
              {branches.map((branch) => <div className="branch-row" key={branch.id}><div><strong>{branch.branchName}</strong><br /><small>{branch.address}, {branch.city}</small></div><span className="badge">{branch.branchCode}</span></div>)}
              {branches.length === 0 && <p className="empty">Data cabang belum tersedia.</p>}
            </div>
          </section>
        </div>
      </section>
      <main className="container">
        <div className="section-heading"><div><h2>Unggulan Produk FMCG & Tobacco</h2><p>Produk berkualitas untuk toko, grosir, dan ritel.</p></div><Link className="link" href="/products">Lihat semua produk →</Link></div>
        <ProductGrid products={products} />
      </main>
      <SiteFooter />
    </>
  );
}
