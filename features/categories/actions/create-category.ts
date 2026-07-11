"use server";

import { revalidatePath } from "next/cache";

import {
  fromErrorToActionState,
  toActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { apiFetch } from "@/lib/api/http";

import { createCategorySchema } from "../schema/category-schema";

export async function createCategory(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const input = createCategorySchema.parse(Object.fromEntries(formData));
    await apiFetch("/admin/categories", { method: "POST", body: input });
    revalidatePath("/categories");
    return toActionState("SUCCESS", "Category created");
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }
}
