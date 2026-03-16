"use server";

import { revalidatePath } from "next/cache";
import { Bias, Direction, Phase, Prisma, SetupCategory } from "@/generated/prisma";

import { requireCurrentSession } from "@/lib/auth/session";
import { isAdminEmail } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";
import { createTradeSchema } from "@/lib/validations/trade";

const phaseValues = new Set(["PHASE_1", "PHASE_2", "LIVE"]);

export async function updateSelectedPhaseAction(formData: FormData) {
  const session = await requireCurrentSession();
  const phase = formData.get("phase");

  if (typeof phase !== "string" || !phaseValues.has(phase)) {
    return;
  }

  await prisma.user.update({
    where: { id: session.id },
    data: {
      selectedPhase: phase as Phase,
    },
  });

  revalidatePath("/dashboard");
}

export type CreateTradeFormState = {
  error?: string;
  success?: string;
  successId?: string;
};

export type UpdateTradeFormState = {
  error?: string;
  success?: string;
  successId?: string;
};

export type ResetPhasesFormState = {
  error?: string;
  success?: string;
  successId?: string;
};

export type AdminActionState = {
  error?: string;
  success?: string;
  successId?: string;
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function createTradeAction(
  _prevState: CreateTradeFormState,
  formData: FormData,
): Promise<CreateTradeFormState> {
  const session = await requireCurrentSession();

  try {
    const values = createTradeSchema.parse({
      date: getString(formData, "date"),
      pair: getString(formData, "pair").toUpperCase(),
      direction: getString(formData, "direction"),
      pnl: getString(formData, "pnl"),
      setupCategory: getString(formData, "setupCategory"),
      bias: getString(formData, "bias"),
      rr: getString(formData, "rr"),
      notes: getString(formData, "notes"),
      reasonStructure: getString(formData, "reasonStructure"),
      summarizedReasons: getString(formData, "summarizedReasons"),
    });

    await prisma.$transaction(async (tx) => {
      const lastTrade = await tx.trade.findFirst({
        where: {
          userId: session.id,
          phase: session.selectedPhase,
        },
        orderBy: {
          tradeNumber: "desc",
        },
        select: {
          tradeNumber: true,
        },
      });

      await tx.trade.create({
        data: {
          tradeNumber: (lastTrade?.tradeNumber ?? 0) + 1,
          date: new Date(values.date),
          pair: values.pair,
          direction: values.direction as Direction,
          pnl: new Prisma.Decimal(values.pnl),
          setupCategory: values.setupCategory as SetupCategory,
          bias: values.bias as Bias,
          rr: values.rr ? new Prisma.Decimal(values.rr) : null,
          notes: values.notes || null,
          phase: session.selectedPhase,
          reasonStructure: JSON.parse(values.reasonStructure),
          summarizedReasons: values.summarizedReasons,
          userId: session.id,
        },
      });
    });

    revalidatePath("/dashboard");
    return { success: "Trade saved.", successId: crypto.randomUUID() };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Unable to save trade." };
  }
}

export async function updateGoalAction(formData: FormData) {
  const session = await requireCurrentSession();
  const goal = formData.get("goal");

  if (typeof goal !== "string" || Number.isNaN(Number(goal))) {
    return;
  }

  await prisma.phaseSettings.upsert({
    where: {
      userId_phase: {
        userId: session.id,
        phase: session.selectedPhase,
      },
    },
    update: {
      goal: new Prisma.Decimal(goal),
    },
    create: {
      userId: session.id,
      phase: session.selectedPhase,
      startingBalance: new Prisma.Decimal("0"),
      goal: new Prisma.Decimal(goal),
      phaseTargetPercent: new Prisma.Decimal("0"),
    },
  });

  revalidatePath("/dashboard");
}

export async function updateStartingBalanceAction(formData: FormData) {
  const session = await requireCurrentSession();
  const startingBalance = formData.get("startingBalance");

  if (typeof startingBalance !== "string" || Number.isNaN(Number(startingBalance))) {
    return;
  }

  await prisma.phaseSettings.upsert({
    where: {
      userId_phase: {
        userId: session.id,
        phase: session.selectedPhase,
      },
    },
    update: {
      startingBalance: new Prisma.Decimal(startingBalance),
    },
    create: {
      userId: session.id,
      phase: session.selectedPhase,
      startingBalance: new Prisma.Decimal(startingBalance),
      goal: new Prisma.Decimal("0"),
      phaseTargetPercent: new Prisma.Decimal("0"),
    },
  });

  revalidatePath("/dashboard");
}

export async function deleteTradeAction(formData: FormData) {
  const session = await requireCurrentSession();
  const tradeId = formData.get("tradeId");

  if (typeof tradeId !== "string" || tradeId.length === 0) {
    return;
  }

  await prisma.trade.deleteMany({
    where: {
      id: tradeId,
      userId: session.id,
      phase: session.selectedPhase,
    },
  });

  revalidatePath("/dashboard");
}

export async function updateTradeAction(
  _prevState: UpdateTradeFormState,
  formData: FormData,
): Promise<UpdateTradeFormState> {
  const session = await requireCurrentSession();
  const tradeId = getString(formData, "tradeId");

  if (!tradeId) {
    return { error: "Trade id is missing." };
  }

  try {
    const values = createTradeSchema
      .pick({
        date: true,
        pair: true,
        direction: true,
        pnl: true,
        setupCategory: true,
        bias: true,
        rr: true,
        notes: true,
        reasonStructure: true,
        summarizedReasons: true,
      })
      .parse({
        date: getString(formData, "date"),
        pair: getString(formData, "pair").toUpperCase(),
        direction: getString(formData, "direction"),
        pnl: getString(formData, "pnl"),
        setupCategory: getString(formData, "setupCategory"),
        bias: getString(formData, "bias"),
        rr: getString(formData, "rr"),
        notes: getString(formData, "notes"),
        reasonStructure: getString(formData, "reasonStructure"),
        summarizedReasons: getString(formData, "summarizedReasons"),
      });

    await prisma.trade.updateMany({
      where: {
        id: tradeId,
        userId: session.id,
        phase: session.selectedPhase,
      },
      data: {
        date: new Date(values.date),
        pair: values.pair,
        direction: values.direction as Direction,
        pnl: new Prisma.Decimal(values.pnl),
        setupCategory: values.setupCategory as SetupCategory,
        bias: values.bias as Bias,
        rr: values.rr ? new Prisma.Decimal(values.rr) : null,
        notes: values.notes || null,
        reasonStructure: JSON.parse(values.reasonStructure),
        summarizedReasons: values.summarizedReasons,
      },
    });

    revalidatePath("/dashboard");
    return { success: "Trade updated.", successId: crypto.randomUUID() };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Unable to update trade." };
  }
}

const phaseDefaults = {
  PHASE_1: {
    startingBalance: "10000",
    goal: "800",
    phaseTargetPercent: "8",
  },
  PHASE_2: {
    startingBalance: "10000",
    goal: "500",
    phaseTargetPercent: "5",
  },
  LIVE: {
    startingBalance: "10000",
    goal: "1000",
    phaseTargetPercent: "10",
  },
} as const;

export async function resetPhasesAction(
  _prevState: ResetPhasesFormState,
  formData: FormData,
): Promise<ResetPhasesFormState> {
  const session = await requireCurrentSession();
  const phases = formData
    .getAll("phases")
    .filter((value): value is keyof typeof phaseDefaults => typeof value === "string" && value in phaseDefaults);

  if (phases.length === 0) {
    return { error: "Select at least one phase to reset." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.trade.deleteMany({
        where: {
          userId: session.id,
          phase: {
            in: phases,
          },
        },
      });

      await Promise.all(
        phases.map((phase) =>
          tx.phaseSettings.upsert({
            where: {
              userId_phase: {
                userId: session.id,
                phase,
              },
            },
            update: {
              startingBalance: new Prisma.Decimal(phaseDefaults[phase].startingBalance),
              goal: new Prisma.Decimal(phaseDefaults[phase].goal),
              phaseTargetPercent: new Prisma.Decimal(phaseDefaults[phase].phaseTargetPercent),
            },
            create: {
              userId: session.id,
              phase,
              startingBalance: new Prisma.Decimal(phaseDefaults[phase].startingBalance),
              goal: new Prisma.Decimal(phaseDefaults[phase].goal),
              phaseTargetPercent: new Prisma.Decimal(phaseDefaults[phase].phaseTargetPercent),
            },
          }),
        ),
      );
    });

    revalidatePath("/dashboard");
    return {
      success: `Reset ${phases.length === 1 ? "1 phase" : `${phases.length} phases`}.`,
      successId: crypto.randomUUID(),
    };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Unable to reset the selected phases." };
  }
}

export async function deleteUserAction(formData: FormData) {
  const session = await requireCurrentSession();

  if (!isAdminEmail(session.email)) {
    return;
  }

  const userId = formData.get("userId");

  if (typeof userId !== "string" || userId.length === 0 || userId === session.id) {
    return;
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  revalidatePath("/dashboard");
}
