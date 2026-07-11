import { z } from "zod";

export const createSubCategorySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  categoryId: z.string().trim().min(1, "Category is required"),
});

export const updateSubCategorySchema = createSubCategorySchema.partial();
