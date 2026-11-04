import { NextResponse } from "next/server";
import { isRecord, nonEmptyString, readJson } from "@/lib/http";
import { getAuthenticatedUser, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type B2BRequestBody = {
  storeName: string;
  ownerName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
};

function isB2BRequestBody(body: unknown): body is B2BRequestBody {
  if (!isRecord(body)) return false;
  return (
    nonEmptyString(body.storeName) &&
    body.storeName.length <= 120 &&
    nonEmptyString(body.ownerName) &&
    body.ownerName.length <= 120 &&
    nonEmptyString(body.phone) &&
    body.phone.length <= 32 &&
    nonEmptyString(body.city) &&
    body.city.length <= 100 &&
    nonEmptyString(body.address) &&
    body.address.length <= 500 &&
    (body.notes === undefined ||
      (typeof body.notes === "string" && body.notes.length <= 1000))
  );
}

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Login diperlukan." }, { status: 401 });
  }
  if (!isAdmin(user.role)) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }
  try {
    const requests = await prisma.b2BPartnerRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ data: requests });
  } catch (error) {
    console.error("GET /api/b2b-requests failed:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data permohonan." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await readJson(request);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "JSON tidak valid." },
      { status: 400 },
    );
  }

  if (!isB2BRequestBody(body)) {
    return NextResponse.json(
      { error: "Data permohonan tidak valid atau belum lengkap." },
      { status: 400 },
    );
  }

  try {
    const created = await prisma.b2BPartnerRequest.create({
      data: {
        storeName: body.storeName.trim(),
        ownerName: body.ownerName.trim(),
        phone: body.phone.trim(),
        city: body.city.trim(),
        address: body.address.trim(),
        notes: typeof body.notes === "string" ? body.notes.trim() : "",
      },
    });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/b2b-requests failed:", error);
    return NextResponse.json(
      { error: "Permohonan tidak dapat disimpan." },
      { status: 500 },
    );
  }
}
