"use server";

import { revalidatePath } from "next/cache";

import {
  fromErrorToActionState,
  toActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { apiFetch } from "@/lib/api/http";

import { createSubCategorySchema } from "../schema/sub-category-schema";

export async function createSubCategory(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const input = createSubCategorySchema.parse(Object.fromEntries(formData));
    await apiFetch("/admin/sub-categories", { method: "POST", body: input });
    revalidatePath("/categories");
    return toActionState("SUCCESS", "Sub-category created");
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }
}
