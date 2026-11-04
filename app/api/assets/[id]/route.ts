import { NextResponse } from "next/server";
import { getAuthenticatedUser, isStaff } from "@/lib/auth";
import { isRecord, readJson } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const conditions = ["good", "needs_repair", "damaged"];
const statuses = ["in_use", "under_maintenance", "in_stock"];

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

  const id = Number((await context.params).id);
  if (!Number.isSafeInteger(id) || id <= 0) {
    return NextResponse.json({ error: "ID aset tidak valid." }, { status: 400 });
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
    Object.keys(body).length === 0 ||
    Object.keys(body).some((key) => !["condition", "status"].includes(key)) ||
    (body.condition !== undefined &&
      (typeof body.condition !== "string" || !conditions.includes(body.condition))) ||
    (body.status !== undefined &&
      (typeof body.status !== "string" || !statuses.includes(body.status)))
  ) {
    return NextResponse.json({ error: "Perubahan aset tidak valid." }, { status: 400 });
  }

  try {
    const result = await prisma.iTAsset.updateMany({
      where: { id },
      data: {
        ...(typeof body.condition === "string" && { condition: body.condition }),
        ...(typeof body.status === "string" && { status: body.status }),
      },
    });
    if (result.count === 0) {
      return NextResponse.json({ error: "Aset tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ data: { id, ...body } });
  } catch (error) {
    console.error(`PATCH /api/assets/${id} failed:`, error);
    return NextResponse.json(
      { error: "Aset tidak dapat diperbarui." },
      { status: 500 },
    );
  }
}
