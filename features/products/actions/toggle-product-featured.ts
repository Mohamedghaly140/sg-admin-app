"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  fromErrorToActionState,
  toActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { apiFetch } from "@/lib/api/http";

const toggleProductFeaturedSchema = z.object({
  id: z.string().trim().min(1),
  featured: z.boolean(),
});

export async function toggleProductFeatured(
  id: string,
  featured: boolean,
): Promise<ActionState> {
  try {
    const input = toggleProductFeaturedSchema.parse({ id, featured });
    await apiFetch(`/admin/products/${input.id}/featured`, {
      method: "PATCH",
      body: { featured: input.featured },
    });
    revalidatePath("/products");
    return toActionState(
      "SUCCESS",
      input.featured ? "Product featured" : "Product no longer featured",
    );
  } catch (error) {
    return fromErrorToActionState(error);
  }
}
