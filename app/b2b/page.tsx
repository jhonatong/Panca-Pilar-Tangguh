import { B2BForm } from "@/components/b2b-form";
import { SiteFooter, SiteHeader } from "@/components/site-shell";

export default function B2BPage() {
  return (
    <>
      <SiteHeader />
      <main className="container" style={{ maxWidth: 850 }}>
        <section className="panel">
          <h1 style={{ fontSize: 30 }}>Formulir Kemitraan Outlet B2B</h1>
          <p className="muted">
            Daftarkan toko atau grosir Anda untuk mendapatkan alokasi barang
            langsung.
          </p>
          <B2BForm />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
