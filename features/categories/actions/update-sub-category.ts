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

import { updateSubCategorySchema } from "../schema/sub-category-schema";

const subCategoryIdSchema = z.string().trim().min(1);

export async function updateSubCategory(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const subCategoryId = subCategoryIdSchema.parse(id);
    const input = updateSubCategorySchema.parse(Object.fromEntries(formData));
    await apiFetch(`/admin/sub-categories/${subCategoryId}`, {
      method: "PATCH",
      body: input,
    });
    revalidatePath("/categories");
    return toActionState("SUCCESS", "Sub-category updated");
  } catch (error) {
    if (error instanceof ApiError && error.code === "DUPLICATE_RESOURCE") {
      return toActionState(
        "ERROR",
        "A sub-category with this name already exists.",
        formData,
      );
    }
    return fromErrorToActionState(error, formData);
  }
}
