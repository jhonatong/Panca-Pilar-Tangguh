import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      where: { isActive: true },
      orderBy: { branchName: "asc" },
    });
    return NextResponse.json({ data: branches });
  } catch (error) {
    console.error("GET /api/branches failed:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data cabang." },
      { status: 500 },
    );
  }
}
