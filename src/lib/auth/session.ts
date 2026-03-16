import { redirect } from "next/navigation";

import { getSessionCookie } from "@/lib/auth/cookies";
import { verifySessionToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";

export async function getCurrentSession() {
  const token = await getSessionCookie();

  if (!token) {
    return null;
  }

  try {
    const payload = await verifySessionToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        selectedPhase: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  } catch {
    return null;
  }
}

export async function requireCurrentSession() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
