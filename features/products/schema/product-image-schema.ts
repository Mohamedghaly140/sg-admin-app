import { z } from "zod";

export const addProductImageSchema = z.object({
  productId: z.string().trim().min(1),
  imageId: z.string().trim().min(1),
  imageUrl: z.url(),
  sortOrder: z.number().int().min(0).optional(),
});

export const reorderProductImagesSchema = z.object({
  productId: z.string().trim().min(1),
  order: z.array(z.string().trim().min(1)).min(1),
});

export const deleteProductImageSchema = z.object({
  productId: z.string().trim().min(1),
  imageRowId: z.string().trim().min(1),
});
