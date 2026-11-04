import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export type AppRole =
  | "superadmin"
  | "it_staff"
  | "branch_manager"
  | "employee";

export interface SessionData {
  userId?: number;
}

const sessionPassword = process.env.SESSION_PASSWORD ?? "";
const sessionOptions: SessionOptions = {
  cookieName: "ppt_session",
  password: sessionPassword,
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  },
};

export async function getSession() {
  if (sessionPassword.length < 32) {
    throw new Error("SESSION_PASSWORD harus diatur minimal 32 karakter.");
  }
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

export async function getAuthenticatedUser() {
  const session = await getSession();
  if (!session.userId) return null;
  return prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true, branchId: true },
  });
}

export function isStaff(role: string) {
  return role === "superadmin" || role === "it_staff";
}

export function isAdmin(role: string) {
  return role === "superadmin";
}
