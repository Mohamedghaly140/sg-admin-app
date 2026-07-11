"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  fromErrorToActionState,
  toActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { ApiError } from "@/lib/api/api-error";
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
