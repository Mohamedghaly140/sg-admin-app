"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { setCookieByKey } from "@/actions/cookies.actions";
import {
  fromErrorToActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { apiFetch } from "@/lib/api/http";

import { createProductSchema } from "../schema/product-schema";
import type { ProductDetail } from "../types";
import { handleProductApiError } from "./utils/handle-product-api-error";

export async function createProduct(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let newId: string;

  try {
    const input = createProductSchema.parse({
      ...Object.fromEntries(formData),
      sizes: formData.getAll("sizes"),
      colors: formData.getAll("colors"),
      subCategoryIds: formData.getAll("subCategoryIds"),
    });
    const { data } = await apiFetch<ProductDetail>("/admin/products", {
      method: "POST",
      body: input,
    });
    newId = data.id;
  } catch (error) {
    const handled = handleProductApiError(error, formData);
    if (handled) return handled;
    return fromErrorToActionState(error, formData);
  }

  revalidatePath("/products");
  await setCookieByKey("toast", "Product created");
  redirect(`/products/${newId}`);
}
