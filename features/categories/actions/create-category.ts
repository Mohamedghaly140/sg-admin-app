"use server";

import { revalidatePath } from "next/cache";

import {
  fromErrorToActionState,
  toActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { ApiError } from "@/lib/api/api-error";
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
    if (error instanceof ApiError && error.code === "DUPLICATE_RESOURCE") {
      return toActionState(
        "ERROR",
        "A category with this name already exists.",
        formData,
      );
    }
    return fromErrorToActionState(error, formData);
  }
}
