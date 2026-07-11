"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { setCookieByKey } from "@/actions/cookies.actions";
import {
  fromErrorToActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { apiFetch } from "@/lib/api/http";

const productIdSchema = z.string().trim().min(1);

export async function duplicateProduct(id: string): Promise<ActionState> {
  let newId: string;

  try {
    const productId = productIdSchema.parse(id);
    const { data } = await apiFetch<{ id: string }>(
      `/admin/products/${productId}/duplicate`,
      { method: "POST" },
    );
    newId = data.id;
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath("/products");
  await setCookieByKey("toast", "Product duplicated as a new draft");
  redirect(`/products/${newId}`);
}
