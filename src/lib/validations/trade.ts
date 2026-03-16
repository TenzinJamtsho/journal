import { z } from "zod";

const enumValues = <T extends readonly [string, ...string[]]>(values: T) => z.enum(values);

export const createTradeSchema = z.object({
  date: z.iso.date(),
  pair: z
    .string()
    .trim()
    .min(1, "Pair is required.")
    .max(20, "Pair must be 20 characters or less."),
  direction: enumValues(["LONG", "SHORT"]),
  pnl: z
    .string()
    .trim()
    .min(1, "PnL is required.")
    .refine((value) => !Number.isNaN(Number(value)), "PnL must be a valid number."),
  setupCategory: enumValues(["CONT", "REVERSAL"]),
  bias: enumValues(["BULLISH", "BEARISH", "RANGE"]),
  rr: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || !Number.isNaN(Number(value)), "R:R must be a valid number."),
  notes: z.string().trim().max(2000).optional(),
  reasonStructure: z
    .string()
    .min(2, "Reason structure is required.")
    .refine((value) => {
      try {
        const parsed = JSON.parse(value) as Record<string, { bias: string; confluences: string[] }>;
        return Object.values(parsed).some((entry) => entry.confluences.length > 0);
      } catch {
        return false;
      }
    }, "Select at least one valid reason."),
  summarizedReasons: z.string().trim().min(1, "Select at least one valid reason."),
});
