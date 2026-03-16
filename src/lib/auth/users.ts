import bcrypt from "bcryptjs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { signSessionToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";
import { loginSchema, registerSchema } from "@/lib/validations/auth";

export async function registerUser(input: unknown) {
  const values = registerSchema.parse(input);
  const passwordHash = await bcrypt.hash(values.password, 12);

  try {
    const user = await prisma.user.create({
      data: {
        email: values.email.toLowerCase(),
        name: values.name,
        passwordHash,
        phaseSettings: {
          create: [
            { phase: "PHASE_1", startingBalance: 10000, goal: 800, phaseTargetPercent: 8 },
            { phase: "PHASE_2", startingBalance: 10000, goal: 500, phaseTargetPercent: 5 },
            { phase: "LIVE", startingBalance: 10000, goal: 1000, phaseTargetPercent: 10 },
          ],
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        selectedPhase: true,
      },
    });

    const token = await signSessionToken({
      sub: user.id,
      email: user.email,
    });

    return { user, token };
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("An account with this email already exists.");
    }

    throw error;
  }
}

export async function loginUser(input: unknown) {
  const values = loginSchema.parse(input);
  const user = await prisma.user.findUnique({
    where: { email: values.email.toLowerCase() },
  });

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isValidPassword = await bcrypt.compare(values.password, user.passwordHash);

  if (!isValidPassword) {
    throw new Error("Invalid email or password.");
  }

  const token = await signSessionToken({
    sub: user.id,
    email: user.email,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      selectedPhase: user.selectedPhase,
    },
  };
}
