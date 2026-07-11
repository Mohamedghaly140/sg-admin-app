import {
  toActionState,
  type ActionState,
} from "@/components/shared/form/utils/to-action-state";
import { ApiError } from "@/lib/api/api-error";

export function handleProductApiError(
  error: unknown,
  formData: FormData,
): ActionState | null {
  if (
    error instanceof ApiError &&
    error.code === "SUBCATEGORY_CATEGORY_MISMATCH"
  ) {
    return {
      ...toActionState("ERROR", error.message, formData),
      fieldErrors: { subCategoryIds: [error.message] },
    };
  }

  return null;
}
