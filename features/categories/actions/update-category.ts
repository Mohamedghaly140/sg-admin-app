"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  fromErrorToActionState,
  toActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { apiFetch } from "@/lib/api/http";

import { updateCategorySchema } from "../schema/category-schema";

const categoryIdSchema = z.string().trim().min(1);

export async function updateCategory(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const categoryId = categoryIdSchema.parse(id);
    const input = updateCategorySchema.parse(Object.fromEntries(formData));
    await apiFetch(`/admin/categories/${categoryId}`, {
      method: "PATCH",
      body: input,
    });
    revalidatePath("/categories");
    return toActionState("SUCCESS", "Category updated");
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }
}
