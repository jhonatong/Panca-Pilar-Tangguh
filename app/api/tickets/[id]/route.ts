import { NextResponse } from "next/server";
import { getAuthenticatedUser, isStaff } from "@/lib/auth";
import { isRecord, readJson } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const statuses = ["open", "in_progress", "resolved", "closed"];

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Login diperlukan." }, { status: 401 });
  }
  if (!isStaff(user.role)) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  const { id: rawId } = await context.params;
  const id = Number(rawId);
  if (!Number.isSafeInteger(id) || id <= 0) {
    return NextResponse.json({ error: "ID tiket tidak valid." }, { status: 400 });
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
    typeof body.status !== "string" ||
    !statuses.includes(body.status)
  ) {
    return NextResponse.json(
      { error: "Status tiket tidak valid." },
      { status: 400 },
    );
  }

  try {
    const updated = await prisma.iTTicket.updateMany({
      where: { id },
      data: { status: body.status },
    });
    if (updated.count === 0) {
      return NextResponse.json({ error: "Tiket tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ data: { id, status: body.status } });
  } catch (error) {
    console.error(`PATCH /api/tickets/${id} failed:`, error);
    return NextResponse.json(
      { error: "Status tiket tidak dapat diperbarui." },
      { status: 500 },
    );
  }
}
