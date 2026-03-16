import { NextResponse } from "next/server";

import { setSessionCookie } from "@/lib/auth/cookies";
import { getErrorMessage } from "@/lib/http";
import { loginUser } from "@/lib/auth/users";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, user } = await loginUser(body);

    await setSessionCookie(token);

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 400 },
    );
  }
}
