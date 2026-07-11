"use server";

import { revalidatePath } from "next/cache";

import {
  fromErrorToActionState,
  toActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { apiFetch } from "@/lib/api/http";

import { deleteProductImageSchema } from "../schema/product-image-schema";

export async function deleteProductImage(
  productId: string,
  imageRowId: string,
): Promise<ActionState> {
  try {
    const input = deleteProductImageSchema.parse({ productId, imageRowId });
    await apiFetch(
      `/admin/products/${input.productId}/images/${input.imageRowId}`,
      { method: "DELETE" },
    );
    revalidatePath(`/products/${input.productId}`);
    return toActionState("SUCCESS", "Gallery image deleted");
  } catch (error) {
    return fromErrorToActionState(error);
  }
}
