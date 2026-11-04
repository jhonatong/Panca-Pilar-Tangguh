import { NextResponse } from "next/server";
import { getAuthenticatedUser, isStaff } from "@/lib/auth";
import { isRecord, nonEmptyString, readJson } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Login diperlukan." }, { status: 401 });
  }

  try {
    const where = isStaff(user.role)
      ? {}
      : user.role === "branch_manager"
        ? { branchId: user.branchId }
        : { id: -1 };
    const assets = await prisma.iTAsset.findMany({
      where,
      include: { branch: true, user: { select: { id: true, name: true } } },
      orderBy: { assetTag: "asc" },
    });
    return NextResponse.json({ data: assets });
  } catch (error) {
    console.error("GET /api/assets failed:", error);
    return NextResponse.json(
      { error: "Gagal mengambil inventaris aset." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Login diperlukan." }, { status: 401 });
  }
  if (!isStaff(user.role)) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
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
    !nonEmptyString(body.assetTag) ||
    body.assetTag.length > 80 ||
    !nonEmptyString(body.name) ||
    body.name.length > 160 ||
    !nonEmptyString(body.category) ||
    body.category.length > 100 ||
    !nonEmptyString(body.serialNumber) ||
    body.serialNumber.length > 120 ||
    !Number.isSafeInteger(body.branchId) ||
    Number(body.branchId) <= 0
  ) {
    return NextResponse.json(
      { error: "Data aset tidak valid atau belum lengkap." },
      { status: 400 },
    );
  }

  try {
    const branch = await prisma.branch.findUnique({
      where: { id: Number(body.branchId) },
      select: { id: true },
    });
    if (!branch) {
      return NextResponse.json({ error: "Cabang tidak ditemukan." }, { status: 400 });
    }
    const asset = await prisma.iTAsset.create({
      data: {
        assetTag: body.assetTag.trim(),
        name: body.name.trim(),
        category: body.category.trim(),
        serialNumber: body.serialNumber.trim(),
        branchId: branch.id,
        condition: "good",
        status: "in_stock",
      },
    });
    return NextResponse.json({ data: asset }, { status: 201 });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Tag aset sudah digunakan." },
        { status: 409 },
      );
    }
    console.error("POST /api/assets failed:", error);
    return NextResponse.json(
      { error: "Aset tidak dapat disimpan." },
      { status: 500 },
    );
  }
}
