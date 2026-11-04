import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function requiredSeedPassword(name: string) {
  const password = process.env[name];
  if (!password || password.length < 12) {
    throw new Error(`${name} must be set and at least 12 characters.`);
  }
  return password;
}

async function main() {
  const passwords = {
    superadmin: requiredSeedPassword("SEED_SUPERADMIN_PASSWORD"),
    it_staff: requiredSeedPassword("SEED_IT_STAFF_PASSWORD"),
    branch_manager: requiredSeedPassword("SEED_BRANCH_MANAGER_PASSWORD"),
    employee: requiredSeedPassword("SEED_EMPLOYEE_PASSWORD"),
  };
  const passwordHashes = {
    superadmin: await bcrypt.hash(passwords.superadmin, 12),
    it_staff: await bcrypt.hash(passwords.it_staff, 12),
    branch_manager: await bcrypt.hash(passwords.branch_manager, 12),
    employee: await bcrypt.hash(passwords.employee, 12),
  };

  const branches = [
    { id: 1, branchCode: "HQ-JKT-01", branchName: "Headquarters Jakarta", address: "Jl. Jend. Sudirman No. 45-46", city: "Jakarta", phone: "021-5551234" },
    { id: 2, branchCode: "MDN-MAR-01", branchName: "Depo Medan Marelan", address: "Jl. Tembung Marelan Raya No. 88", city: "Medan", phone: "061-7789012" },
    { id: 3, branchCode: "SUB-RNG-01", branchName: "Depo Surabaya Rungkut", address: "Kawasan Industri Rungkut Industri III No. 12", city: "Surabaya", phone: "031-8431122" },
    { id: 4, branchCode: "MKS-BKY-01", branchName: "Depo Makassar Biringkanaya", address: "Jl. Perintis Kemerdekaan KM 15", city: "Makassar", phone: "0411-5109988" },
  ];

  for (const branch of branches) {
    await prisma.branch.upsert({
      where: { branchCode: branch.branchCode },
      update: branch,
      create: branch,
    });
  }

  

  const users = [
    { id: 1, name: "Budi Santoso (Super Admin)", email: "admin@pancapilartangguh.co.id", role: "superadmin" as const, branchId: 1 },
    { id: 2, name: "Rizky Pratama (IT Support Medan)", email: "itsupport.mdn@pancapilartangguh.co.id", role: "it_staff" as const, branchId: 2 },
    { id: 3, name: "Hendra Wijaya (IT Support Surabaya)", email: "itsupport.sub@pancapilartangguh.co.id", role: "it_staff" as const, branchId: 3 },
    { id: 4, name: "Dewi Lestari (Branch Manager Medan)", email: "bm.medan@pancapilartangguh.co.id", role: "branch_manager" as const, branchId: 2 },
    { id: 5, name: "Agus Kurniawan (Field Sales Rep)", email: "agus.sales@pancapilartangguh.co.id", role: "employee" as const, branchId: 2 },
  ];

  for (const user of users) {
    const password = passwordHashes[user.role as keyof typeof passwordHashes];
    await prisma.user.upsert({
      where: { email: user.email },
      update: { ...user, passwordHash: password },
      create: { ...user, passwordHash: password },
    });
  }

  const products = [
    { sku: "TOB-PILAR-MILD-16", name: "Pilar Supreme Mild 16", category: "Tobacco & Cigarettes", description: "Premium filter clove cigarette with smooth aroma and rich Indonesian tobacco blend.", imageUrl: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=600" },
    { sku: "TOB-PILAR-GOLD-12", name: "Pilar Gold Kretek 12", category: "Tobacco & Cigarettes", description: "Hand-rolled traditional clove cigarette with rich spice notes.", imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600" },
    { sku: "BEV-FRESH-TEA-350", name: "Pilar Fresh Jasmine Tea 350ml", category: "Beverages", description: "Ready-to-drink aromatic jasmine green tea made from high-land tea leaves.", imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600" },
    { sku: "SNK-CRISP-BALADO-60", name: "Nusantara Cassava Chips Balado 60g", category: "Snacks & Confectionery", description: "Crunchy cassava chips seasoned with authentic Padang spicy balado chili.", imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600" },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: product,
      create: product,
    });
  }

  const requests = [
    { id: 1, storeName: "Toko Kelontong Jaya Abadi", ownerName: "Haji Mansyur", phone: "081260112233", address: "Jl. Marelan Raya Pasar III No. 12", city: "Medan", status: "pending", notes: "Store applying for monthly allocation of Pilar Supreme Mild (50 crates/month)." },
    { id: 2, storeName: "Grosir Sembako Rungkut Makmur", ownerName: "Siti Rahmawati", phone: "081331998877", address: "Jl. Rungkut Asri Timur IV No. 45", city: "Surabaya", status: "approved", notes: "Survey verified by Branch Manager. Outlet approved for credit terms." },
  ];

  for (const request of requests) {
    await prisma.b2BPartnerRequest.upsert({
      where: { id: request.id },
      update: request,
      create: request,
    });
  }

  const assets = [
    { id: 1, assetTag: "AST-MDN-PDA-001", name: "Honeywell EDA51 Sales PDA", category: "Sales PDA / SFA Device", serialNumber: "HWEDA51-99882211", branchId: 2, userId: 5, condition: "good", status: "in_use" },
    { id: 2, assetTag: "AST-SUB-LTP-004", name: "Lenovo ThinkPad L14 Gen 3", category: "Laptop", serialNumber: "PF-3982A1", branchId: 3, userId: 3, condition: "good", status: "in_use" },
    { id: 3, assetTag: "AST-MDN-PRN-002", name: "Epson TM-T82X Thermal Receipt Printer", category: "Printer", serialNumber: "EPS-882710-MDN", branchId: 2, userId: null, condition: "needs_repair", status: "under_maintenance" },
  ];

  for (const asset of assets) {
    await prisma.iTAsset.upsert({
      where: { assetTag: asset.assetTag },
      update: asset,
      create: asset,
    });
  }

  const tickets = [
    { id: 1, ticketCode: "TKT-202610-0001", userId: 5, branchId: 2, category: "Software / SFA App", priority: "high", subject: "SFA Mobile App barcode scanner fails to sync inventory", description: "Field sales app hangs on data sync screen when processing large stock transfers in Medan Marelan depo.", status: "in_progress", assignedTo: 2 },
    { id: 2, ticketCode: "TKT-202610-0002", userId: 4, branchId: 2, category: "Printer & Network", priority: "medium", subject: "Warehouse thermal receipt printer printing garbled text", description: "Delivery invoice printer on dock 2 printing corrupted characters.", status: "open", assignedTo: null },
  ];

  for (const ticket of tickets) {
    await prisma.iTTicket.upsert({
      where: { ticketCode: ticket.ticketCode },
      update: ticket,
      create: ticket,
    });
  }

  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('branches', 'id'), (SELECT COALESCE(MAX(id), 1) FROM branches), true)`;
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT COALESCE(MAX(id), 1) FROM users), true)`;
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('b2b_partner_requests', 'id'), (SELECT COALESCE(MAX(id), 1) FROM b2b_partner_requests), true)`;
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('it_assets', 'id'), (SELECT COALESCE(MAX(id), 1) FROM it_assets), true)`;
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('it_tickets', 'id'), (SELECT COALESCE(MAX(id), 1) FROM it_tickets), true)`;
}

main()
  .catch((error: unknown) => {
    console.error("Database seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
