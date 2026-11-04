import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

export function SiteHeader({
  internal = false,
  user,
}: {
  internal?: boolean;
  user?: { name: string; role: string };
}) {
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">PPT</span>
          <span>
            <span className="brand-title">{internal ? "MANAJEMEN OPERASIONAL & IT" : "PT PANCA PILAR TANGGUH"}</span>
            <span className="brand-subtitle">{internal ? "Portal internal & helpdesk" : "FMCG & Tobacco Distribution"}</span>
          </span>
        </Link>
        <nav className="nav-links" aria-label="Navigasi utama">
          {internal ? (
            <>
              <span className="badge">{user ? `${user.name} · ${user.role}` : "PORTAL INTERNAL"}</span>
              <Link href="/">Portal Publik</Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/">Beranda</Link>
              <Link href="/products">Katalog Produk</Link>
              <Link href="/b2b">Kemitraan B2B</Link>
              <Link className="button" href="/login">Login Dashboard</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return <footer><div className="footer-inner"><span>© 2026 PT Panca Pilar Tangguh. All rights reserved.</span><span>Distribusi FMCG & consumer goods Indonesia</span></div></footer>;
}
