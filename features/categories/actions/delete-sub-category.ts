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

const subCategoryIdSchema = z.string().trim().min(1);

export async function deleteSubCategory(id: string): Promise<ActionState> {
  try {
    const subCategoryId = subCategoryIdSchema.parse(id);
    await apiFetch(`/admin/sub-categories/${subCategoryId}`, {
      method: "DELETE",
    });
    revalidatePath("/categories");
    return toActionState("SUCCESS", "Sub-category deleted");
  } catch (error) {
    if (error instanceof ApiError && error.code === "FOREIGN_KEY_CONSTRAINT") {
      return toActionState(
        "ERROR",
        "This sub-category still has products. Move or delete them first.",
      );
    }
    return fromErrorToActionState(error);
  }
}
