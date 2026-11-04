import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { getAuthenticatedUser } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getAuthenticatedUser();
  if (user) redirect("/dashboard");

  return (
    <>
      <SiteHeader />
      <main className="container" style={{ maxWidth: 560 }}>
        <section className="panel">
          <span className="eyebrow">Portal internal</span>
          <h1 style={{ fontSize: 32 }}>Masuk ke dashboard</h1>
          <p className="muted">
            Gunakan email dan password akun perusahaan. Akses data mengikuti
            role dan cabang akun Anda.
          </p>
          <LoginForm />
          <p className="muted" style={{ fontSize: 12, marginTop: 18 }}>
            Belum punya akun? Minta admin perusahaan mengatur akun Anda.
          </p>
          <Link className="link" href="/">Kembali ke halaman utama</Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
