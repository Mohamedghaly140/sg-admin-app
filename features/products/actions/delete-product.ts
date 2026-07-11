"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  fromErrorToActionState,
  toActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { apiFetch } from "@/lib/api/http";

const productIdSchema = z.string().trim().min(1);

type DeleteProductResult = {
  deleted: boolean;
  archived: boolean;
};

export async function deleteProduct(id: string): Promise<ActionState> {
  try {
    const productId = productIdSchema.parse(id);
    const { data } = await apiFetch<DeleteProductResult>(
      `/admin/products/${productId}`,
      { method: "DELETE" },
    );
    revalidatePath("/products");

    if (data.deleted) {
      return toActionState("SUCCESS", "Product deleted");
    }
    if (data.archived) {
      return toActionState(
        "SUCCESS",
        "Product is referenced by orders/carts — archived instead",
      );
    }

    return toActionState("ERROR", "The product could not be deleted or archived");
  } catch (error) {
    return fromErrorToActionState(error);
  }
}
