import { ProductGrid } from "@/components/product-grid";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
  return <><SiteHeader /><main className="container"><section className="panel" style={{ marginBottom: 26 }}><h1 style={{ fontSize: 34 }}>Katalog Produk FMCG & Tobacco</h1><p className="muted">Daftar pasokan produk resmi PT Panca Pilar Tangguh untuk toko kelontong, agen grosir, dan ritel modern.</p></section><ProductGrid products={products} /></main><SiteFooter /></>;
}
