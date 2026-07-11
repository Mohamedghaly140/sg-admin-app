import { z } from "zod";

import { productStatusValues } from "../hooks/use-products-params";

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

// Empty discount means "no discount" (0), not "omit" because PATCH must be
// able to clear a previously set discount.
const optionalMoney = (min: number, max: number) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? "0" : value),
    money(min, max),
  );

const wholeNumber = (min: number) =>
  z
    .string()
    .trim()
    .regex(/^\d+$/, "Enter a whole number")
    .transform(Number)
    .refine((value) => value >= min, `Must be at least ${min}`);

export const productSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  description: z.string().trim().min(1, "Description is required").max(5000),
  price: money(0.01),
  discount: optionalMoney(0, 70),
  quantity: wholeNumber(0),
  sizes: z.array(z.string().trim().min(1)).default([]),
  colors: z.array(z.string().trim().min(1)).default([]),
  categoryId: z.string().trim().min(1, "Category is required"),
  subCategoryIds: z.array(z.string().trim().min(1)).default([]),
  status: z.enum(productStatusValues).default("DRAFT"),
  featured: z
    .preprocess((value) => value === "true" || value === "on", z.boolean())
    .default(false),
  imageId: z.string().trim().min(1, "Cover image is required"),
  imageUrl: z.url(),
});

// The edit form submits every field so unchecked booleans and cleared discount
// values still reach PATCH.
export const createProductSchema = productSchema;
export const updateProductSchema = productSchema;
