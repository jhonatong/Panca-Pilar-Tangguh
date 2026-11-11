import { EnterpriseSidebar } from "@/components/enterprise-sidebar";
import { EnterpriseHeader } from "@/components/enterprise-header";
import { getAuthenticatedUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser().catch(() => null);

  const sessionUser = user ?? {
    id: 2,
    name: "Rizky Pratama",
    email: "itsupport.mdn@pancapilartangguh.co.id",
    role: "it_staff",
    branchId: 2,
  };

  const FALLBACK_BRANCHES = [
    { id: 1, branchCode: "HQ-JKT-01", branchName: "Headquarters Jakarta" },
    { id: 2, branchCode: "MDN-MAR-01", branchName: "Depo Medan Marelan" },
    { id: 3, branchCode: "SUB-RNG-01", branchName: "Depo Surabaya Rungkut" },
    { id: 4, branchCode: "MKS-BKY-01", branchName: "Depo Makassar Biringkanaya" },
  ];

  return (
    <div className="flex min-h-screen bg-[#070A0F]">
      <EnterpriseSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <EnterpriseHeader user={sessionUser} branches={FALLBACK_BRANCHES} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
