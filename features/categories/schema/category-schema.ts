import { z } from "zod";

const optionalImageField = z
  .string()
  .transform((value) => value.trim() || undefined)
  .optional();

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  imageId: optionalImageField,
  imageUrl: optionalImageField,
});

export const updateCategorySchema = createCategorySchema.partial();
