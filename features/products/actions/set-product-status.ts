"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  fromErrorToActionState,
  toActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { apiFetch } from "@/lib/api/http";

import { productStatusValues } from "../hooks/use-products-params";
import type { ProductStatus } from "../types";

const setProductStatusSchema = z.object({
  id: z.string().trim().min(1),
  status: z.enum(productStatusValues),
});

export async function setProductStatus(
  id: string,
  status: ProductStatus,
): Promise<ActionState> {
  try {
    const input = setProductStatusSchema.parse({ id, status });
    await apiFetch(`/admin/products/${input.id}/status`, {
      method: "PATCH",
      body: { status: input.status },
    });
    revalidatePath("/products");
    return toActionState("SUCCESS", `Product status set to ${input.status}`);
  } catch (error) {
    return fromErrorToActionState(error);
  }
}
