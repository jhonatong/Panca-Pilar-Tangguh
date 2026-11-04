import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST() {
  try {
    const session = await getSession();
    session.destroy();
    return NextResponse.json({ data: { loggedOut: true } });
  } catch (error) {
    console.error("POST /api/auth/logout failed:", error);
    return NextResponse.json(
      { error: "Logout tidak dapat diproses." },
      { status: 500 },
    );
  }
}
