import { NextResponse } from "next/server";
import { isRecord, nonEmptyString, readJson } from "@/lib/http";
import { getAuthenticatedUser, isStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const priorities = ["low", "medium", "high", "critical"];

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Login diperlukan." }, { status: 401 });
  }
  try {
    const where =
      user.role === "superadmin" || user.role === "it_staff"
        ? {}
        : user.role === "branch_manager"
          ? { branchId: user.branchId }
          : { userId: user.id };
    const tickets = await prisma.iTTicket.findMany({
      include: { branch: true },
      orderBy: { createdAt: "desc" },
      where,
    });
    return NextResponse.json({ data: tickets });
  } catch (error) {
    console.error("GET /api/tickets failed:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data tiket." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Login diperlukan." }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await readJson(request);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "JSON tidak valid." },
      { status: 400 },
    );
  }

  if (
    !isRecord(body) ||
    !Number.isSafeInteger(body.branchId) ||
    Number(body.branchId) <= 0 ||
    !nonEmptyString(body.category) ||
    body.category.length > 100 ||
    typeof body.priority !== "string" ||
    !priorities.includes(body.priority) ||
    !nonEmptyString(body.subject) ||
    body.subject.length > 180 ||
    !nonEmptyString(body.description) ||
    body.description.length > 3000
  ) {
    return NextResponse.json(
      { error: "Data tiket tidak valid atau belum lengkap." },
      { status: 400 },
    );
  }

  try {
    const branchId = isStaff(currentUser.role)
      ? Number(body.branchId)
      : currentUser.branchId;
    const branch = await prisma.branch.findUnique({ where: { id: branchId } });
    if (!branch) {
      return NextResponse.json(
        { error: "Cabang tidak ditemukan." },
        { status: 400 },
      );
    }

    const now = new Date();
    const ticket = await prisma.iTTicket.create({
      data: {
        ticketCode: `TKT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}-${crypto.randomUUID()}`,
        userId: currentUser.id,
        branchId: branch.id,
        category: body.category.trim(),
        priority: body.priority,
        subject: body.subject.trim(),
        description: body.description.trim(),
      },
    });
    return NextResponse.json({ data: ticket }, { status: 201 });
  } catch (error) {
    console.error("POST /api/tickets failed:", error);
    return NextResponse.json(
      { error: "Tiket tidak dapat disimpan." },
      { status: 500 },
    );
  }
}
