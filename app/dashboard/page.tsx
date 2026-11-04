import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { TicketForm } from "@/components/ticket-form";
import { TicketStatus } from "@/components/ticket-status";
import { AssetControls } from "@/components/asset-controls";
import { AssetForm } from "@/components/asset-form";
import { getAuthenticatedUser, isAdmin, isStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const staff = isStaff(user.role);
  const admin = isAdmin(user.role);
  const ticketWhere =
    user.role === "superadmin" || user.role === "it_staff"
      ? {}
      : user.role === "branch_manager"
        ? { branchId: user.branchId }
        : { userId: user.id };
  const assetWhere = admin || user.role === "it_staff"
    ? {}
    : user.role === "branch_manager"
      ? { branchId: user.branchId }
      : { id: -1 };

  const [tickets, assets, branches, requestCount, requests, branch] = await Promise.all([
    prisma.iTTicket.findMany({
      include: { branch: true, user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      where: ticketWhere,
    }),
    prisma.iTAsset.findMany({
      include: { branch: true, user: true },
      orderBy: { id: "asc" },
      where: assetWhere,
    }),
    prisma.branch.findMany({
      where: staff ? { isActive: true } : { id: user.branchId },
      orderBy: { branchName: "asc" },
    }),
    admin ? prisma.b2BPartnerRequest.count() : Promise.resolve(null),
    admin
      ? prisma.b2BPartnerRequest.findMany({ orderBy: { createdAt: "desc" }, take: 10 })
      : Promise.resolve([]),
    prisma.branch.findUnique({ where: { id: user.branchId } }),
  ]);

  const counts = tickets.reduce(
    (result, ticket) => {
      result[ticket.status] = (result[ticket.status] ?? 0) + 1;
      result[`priority:${ticket.priority}`] =
        (result[`priority:${ticket.priority}`] ?? 0) + 1;
      return result;
    },
    {} as Record<string, number>,
  );
  const totalTickets = tickets.length;
  const assetsNeedingRepair = assets.filter((asset) => asset.condition !== "good").length;
  const statuses = [
    { key: "open", label: "Open", color: "#2563eb" },
    { key: "in_progress", label: "Dalam proses", color: "#d97706" },
    { key: "resolved", label: "Selesai", color: "#059669" },
    { key: "closed", label: "Ditutup", color: "#64748b" },
  ];
  const priorities = [
    { key: "critical", label: "Critical" },
    { key: "high", label: "High" },
    { key: "medium", label: "Medium" },
    { key: "low", label: "Low" },
  ];

  return (
    <>
      <SiteHeader internal user={user} />
      <main className="container">
        <div className="section-heading">
          <div>
            <h1 style={{ fontSize: 30, marginBottom: 7 }}>
              Dashboard {admin ? "Administrator" : user.role === "it_staff" ? "IT Support" : user.role === "branch_manager" ? "Kepala Cabang" : "Karyawan"}
            </h1>
            <p className="muted" style={{ marginBottom: 0 }}>
              {branch?.branchName ?? "Cabang tidak ditentukan"} · Statistik dan data sesuai akses akun Anda.
            </p>
          </div>
        </div>
        <section className="metrics">
          <div className="panel metric">
            <span>Total tiket {user.role === "employee" ? "saya" : "terlihat"}</span>
            <strong>{totalTickets}</strong>
          </div>
          <div className="panel metric">
            <span>Tiket open</span>
            <strong>{counts.open ?? 0}</strong>
          </div>
          <div className="panel metric">
            <span>Dalam proses</span>
            <strong>{counts.in_progress ?? 0}</strong>
          </div>
          {(admin || user.role === "it_staff" || user.role === "branch_manager") && (
            <div className="panel metric">
              <span>Aset IT</span>
              <strong>{assets.length}</strong>
            </div>
          )}
          {admin && <div className="panel metric"><span>Depo aktif</span><strong>{branches.length}</strong></div>}
          {admin && <div className="panel metric"><span>Lead kemitraan B2B</span><strong>{requestCount}</strong></div>}
        </section>

        {admin && (
          <section className="panel" style={{ marginTop: 22 }}>
            <h2>Permohonan Kemitraan Terbaru</h2>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Toko</th><th>Pemilik</th><th>Kontak</th><th>Kota</th><th>Status</th></tr></thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.storeName}<br /><span className="muted">{request.address}</span></td>
                      <td>{request.ownerName}</td>
                      <td>{request.phone}</td>
                      <td>{request.city}</td>
                      <td><span className="badge">{request.status}</span></td>
                    </tr>
                  ))}
                  {requests.length === 0 && <tr><td colSpan={5} className="empty">Belum ada permohonan.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="two-col">
          <div className="panel stack">
            <div>
              <h2>Statistik status tiket</h2>
              <p className="muted">Ringkasan tiket yang dapat Anda akses.</p>
            </div>
            {statuses.map((status) => {
              const count = counts[status.key] ?? 0;
              const width = totalTickets ? Math.round((count / totalTickets) * 100) : 0;
              return (
                <div className="bar-row" key={status.key}>
                  <div className="bar-label"><span>{status.label}</span><strong>{count}</strong></div>
                  <div className="bar-track"><span style={{ width: `${width}%`, background: status.color }} /></div>
                </div>
              );
            })}
            <h3 style={{ margin: "8px 0 0" }}>Prioritas</h3>
            <div className="priority-grid">
              {priorities.map(({ key, label }) => (
                <div className="priority-stat" key={key}>
                  <span>{label}</span>
                  <strong>{counts[`priority:${key}`] ?? 0}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="panel stack">
            {staff || user.role === "branch_manager" ? (
              <section>
                <div className="section-heading">
                  <div>
                    <h2>Inventaris IT</h2>
                    <p className="muted">Daftar perangkat yang tersedia sesuai cakupan akses Anda.</p>
                  </div>
                  {staff && <AssetForm branches={branches.map(({ id, branchName }) => ({ id, name: branchName }))} />}
                </div>
                <p className="muted" style={{ fontSize: 12 }}>
                  {assets.length} aset · {assetsNeedingRepair} perlu pemeriksaan/perbaikan
                </p>
                <div className="assets">
                  {assets.map((asset) => (
                    <article className="asset-card" key={asset.id}>
                      <span className="badge">{asset.condition}</span>
                      <h3>{asset.name}</h3>
                      <p className="muted" style={{ fontSize: 12 }}>
                        {asset.assetTag} · {asset.category}
                      </p>
                      <p className="muted" style={{ fontSize: 11, marginBottom: 0 }}>
                        {asset.branch.branchName}
                        {asset.user ? ` · ${asset.user.name}` : ""}
                      </p>
                      {staff && <AssetControls id={asset.id} condition={asset.condition} status={asset.status} />}
                    </article>
                  ))}
                  {assets.length === 0 && <p className="empty">Belum ada aset.</p>}
                </div>
              </section>
            ) : (
              <section>
                <h2>Buat Tiket Helpdesk</h2>
                <p className="muted">Laporkan kendala operasional atau perangkat.</p>
                <TicketForm
                  branches={branches.map(({ id, branchName }) => ({ id, name: branchName }))}
                  canChooseBranch={false}
                />
              </section>
            )}
            {user.role === "branch_manager" && (
              <section>
                <h2>Buat Tiket untuk Cabang</h2>
                <TicketForm
                  branches={branches.map(({ id, branchName }) => ({ id, name: branchName }))}
                  canChooseBranch={false}
                />
              </section>
            )}
          </div>
        </section>

        <section className="panel" style={{ marginTop: 22 }}>
          <div className="section-heading">
            <div>
              <h2>{user.role === "employee" ? "Riwayat Tiket Saya" : "Daftar Tiket Kendala Operasional & IT"}</h2>
              <p>Jumlah tiket ditampilkan: {tickets.length}</p>
            </div>
            {staff && (
              <div className="ticket-action-form">
                <span className="muted">Buat tiket</span>
                <details>
                  <summary className="button">Tiket baru</summary>
                  <div className="ticket-popover">
                    <TicketForm
                      branches={branches.map(({ id, branchName }) => ({ id, name: branchName }))}
                      canChooseBranch={true}
                    />
                  </div>
                </details>
              </div>
            )}
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Kode tiket</th>
                  <th>Kategori & subjek</th>
                  <th>Cabang</th>
                  <th>Prioritas</th>
                  <th>Status</th>
                  {staff && <th>Ubah status</th>}
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td><strong>{ticket.ticketCode}</strong></td>
                    <td>
                      <strong>{ticket.subject}</strong>
                      <br />
                      <span className="muted">{ticket.category} · {ticket.user.name}</span>
                    </td>
                    <td>{ticket.branch.branchName}</td>
                    <td><span className="badge">{ticket.priority}</span></td>
                    <td>{ticket.status}</td>
                    {staff && <td><TicketStatus id={ticket.id} status={ticket.status} /></td>}
                  </tr>
                ))}
                {tickets.length === 0 && (
                  <tr><td colSpan={staff ? 6 : 5} className="empty">Belum ada tiket.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
