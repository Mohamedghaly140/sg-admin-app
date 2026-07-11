"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  fromErrorToActionState,
  toActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
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
    return fromErrorToActionState(error, formData);
  }
}
