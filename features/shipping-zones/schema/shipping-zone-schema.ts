import { z } from "zod";

const fee = z
  .string()
  .trim()
  .regex(/^\d+(\.\d{1,2})?$/, "Enter a fee with up to 2 decimal places")
  .transform(Number)
  .refine((value) => value >= 0, "Fee can't be negative");

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} is required`);

// Base-UI Switch submits "on" when checked and omits the field when unchecked,
// so an absent value is a deliberate "inactive". Always emit a boolean → an
// unchecked create sends `isActive: false` instead of letting the API default
// it to `true`.
const isActive = z
  .string()
  .optional()
  .transform((value) => value === "on");

// Empty city input means governorate-wide: drop it so the field is omitted from
// the request body (the API treats an omitted city as covering the governorate).
const city = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || undefined);

const shippingZoneFields = {
  country: requiredText("Country"),
  governorate: requiredText("Governorate"),
  city,
  fee,
  isActive,
};

export const createShippingZoneSchema = z.object(shippingZoneFields);
export const updateShippingZoneSchema = z.object(shippingZoneFields);
