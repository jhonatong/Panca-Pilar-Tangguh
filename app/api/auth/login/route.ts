import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { isRecord, nonEmptyString, readJson } from "@/lib/http";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
  if (
    !isRecord(body) ||
    !nonEmptyString(body.email) ||
    !nonEmptyString(body.password) ||
    body.email.length > 254 ||
    body.password.length > 128
  ) {
    return NextResponse.json(
      { error: "Email dan password wajib diisi." },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: body.email.trim().toLowerCase() },
    });
    const valid = user?.passwordHash
      ? await bcrypt.compare(body.password, user.passwordHash)
      : false;
    if (!user || !valid) {
      return NextResponse.json(
        { error: "Email atau password salah." },
        { status: 401 },
      );
    }

    const session = await getSession();
    session.userId = user.id;
    await session.save();
    return NextResponse.json({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("POST /api/auth/login failed:", error);
    return NextResponse.json(
      { error: "Login tidak dapat diproses. Periksa konfigurasi server." },
      { status: 500 },
    );
  }
}
