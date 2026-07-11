"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  fromErrorToActionState,
  toActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { apiFetch } from "@/lib/api/http";

import { updateProductSchema } from "../schema/product-schema";
import { handleProductApiError } from "./utils/handle-product-api-error";

const productIdSchema = z.string().trim().min(1);

export async function updateProduct(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const productId = productIdSchema.parse(id);
    const input = updateProductSchema.parse({
      ...Object.fromEntries(formData),
      sizes: formData.getAll("sizes"),
      colors: formData.getAll("colors"),
      subCategoryIds: formData.getAll("subCategoryIds"),
    });
    await apiFetch(`/admin/products/${productId}`, {
      method: "PATCH",
      body: input,
    });
    revalidatePath("/products");
    revalidatePath(`/products/${productId}`);
    return toActionState("SUCCESS", "Product updated");
  } catch (error) {
    const handled = handleProductApiError(error, formData);
    if (handled) return handled;
    return fromErrorToActionState(error, formData);
  }
}
