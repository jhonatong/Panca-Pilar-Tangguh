import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const FALLBACK_BRANCHES = [
  { id: 1, branchCode: "HQ-JKT-01", branchName: "Headquarters Jakarta", address: "Jl. Jend. Sudirman No. 45-46", city: "Jakarta", phone: "021-5551234", isActive: true },
  { id: 2, branchCode: "MDN-MAR-01", branchName: "Depo Medan Marelan", address: "Jl. Tembung Marelan Raya No. 88", city: "Medan", phone: "061-7789012", isActive: true },
  { id: 3, branchCode: "SUB-RNG-01", branchName: "Depo Surabaya Rungkut", address: "Kawasan Industri Rungkut Industri III No. 12", city: "Surabaya", phone: "031-8431122", isActive: true },
  { id: 4, branchCode: "MKS-BKY-01", branchName: "Depo Makassar Biringkanaya", address: "Jl. Perintis Kemerdekaan KM 15", city: "Makassar", phone: "0411-5109988", isActive: true },
];

const FALLBACK_PRODUCTS = [
  { id: 1, sku: "TOB-PILAR-MILD-16", name: "Pilar Supreme Mild 16", category: "Tobacco & Cigarettes", description: "Cengkeh pilihan aroma halus.", imageUrl: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=600", isActive: true },
  { id: 2, sku: "TOB-PILAR-GOLD-12", name: "Pilar Gold Kretek 12", category: "Tobacco & Cigarettes", description: "Kretek racikan rempah nusantara.", imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600", isActive: true },
  { id: 3, sku: "BEV-FRESH-TEA-350", name: "Pilar Fresh Jasmine Tea 350ml", category: "Beverages", description: "Teh melati segar siap minum.", imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600", isActive: true },
  { id: 4, sku: "SNK-CRISP-BALADO-60", name: "Nusantara Cassava Chips Balado 60g", category: "Snacks & Confectionery", description: "Keripik singkong gurih renyah bumbu balado.", imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600", isActive: true },
];

export default async function HomePage() {
  let branches = FALLBACK_BRANCHES;
  let products = FALLBACK_PRODUCTS;

  try {
    const [dbBranches, dbProducts] = await Promise.all([
      prisma.branch.findMany({ where: { isActive: true }, orderBy: { id: "asc" } }),
      prisma.product.findMany({ where: { isActive: true }, orderBy: { id: "asc" }, take: 4 }),
    ]);
    if (dbBranches.length > 0) branches = dbBranches;
    if (dbProducts.length > 0) products = dbProducts;
  } catch (error) {
    console.warn("Database unreachable, using fallback seed data for homepage.", error);
  }

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
