import { NextResponse } from "next/server";

import { setSessionCookie } from "@/lib/auth/cookies";
import { registerUser } from "@/lib/auth/users";
import { getErrorMessage } from "@/lib/http";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, user } = await registerUser(body);

    await setSessionCookie(token);

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 400 },
    );
  }
}
