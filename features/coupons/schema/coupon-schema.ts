import { z } from "zod";

const money = (min: number, max?: number) =>
  z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a value with up to 2 decimal places")
    .transform(Number)
    .refine((value) => value >= min, `Must be at least ${min}`)
    .refine(
      (value) => max === undefined || value <= max,
      `Must be at most ${max}`,
    );

const wholeNumber = (min: number) =>
  z
    .string()
    .trim()
    .regex(/^\d+$/, "Enter a whole number")
    .transform(Number)
    .refine((value) => value >= min, `Must be at least ${min}`);

const expireDate = z
  .string()
  .trim()
  .min(1, "Expiry date is required")
  .refine(
    (value) => !Number.isNaN(Date.parse(value)),
    "Enter a valid expiry date",
  )
  .transform((value) => new Date(value).toISOString());

const couponFields = {
  name: z
    .string()
    .trim()
    .transform((value) => value.toUpperCase())
    .pipe(
      z
        .string()
        .regex(
          /^[A-Z0-9_-]{3,30}$/,
          "Use 3–30 letters, numbers, underscores, or hyphens",
        ),
    ),
  discount: money(1, 70),
  maxUsage: wholeNumber(0).prefault("0"),
  perUserLimit: wholeNumber(0).prefault("1"),
};

export const createCouponSchema = z.object({
  ...couponFields,
  expire: expireDate.refine(
    (value) => new Date(value).getTime() > Date.now(),
    "Expiry date must be in the future",
  ),
});

export const updateCouponSchema = z.object({
  ...couponFields,
  expire: expireDate,
});
