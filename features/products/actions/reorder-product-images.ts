"use server";

import { revalidatePath } from "next/cache";

import {
  fromErrorToActionState,
  toActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { apiFetch } from "@/lib/api/http";

import { reorderProductImagesSchema } from "../schema/product-image-schema";
import type { ProductFormImage } from "../types";

export async function reorderProductImages(
  productId: string,
  order: string[],
): Promise<ActionState> {
  try {
    const input = reorderProductImagesSchema.parse({ productId, order });
    await apiFetch<ProductFormImage[]>(
      `/admin/products/${input.productId}/images/reorder`,
      {
        method: "PATCH",
        body: { order: input.order },
      },
    );
    revalidatePath(`/products/${input.productId}`);
    return toActionState("SUCCESS", "Gallery order saved");
  } catch (error) {
    return fromErrorToActionState(error);
  }
}
