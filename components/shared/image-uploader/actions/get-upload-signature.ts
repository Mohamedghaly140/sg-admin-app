"use server";

import { ApiError } from "@/lib/api/api-error";
import { apiFetch } from "@/lib/api/http";
import { redirectOnAuthError } from "@/lib/api/redirect-on-auth-error";

import { uploadSignatureSchema } from "../schema/upload-signature-schema";
import type { UploadSignature, UploadSignatureResult } from "../types";

const GENERIC_UPLOAD_PREP_ERROR =
  "Could not prepare the upload. Please try again.";

export async function getUploadSignature(
  input: unknown,
): Promise<UploadSignatureResult> {
  try {
    const parsedInput = uploadSignatureSchema.parse(input);
    const { data } = await apiFetch<UploadSignature>(
      "/admin/uploads/signature",
      {
        method: "POST",
        body: parsedInput,
      },
    );

    return { ok: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      redirectOnAuthError(error);

      return {
        ok: false,
        message:
          error.code === "FORBIDDEN"
            ? "You don't have permission to do this."
            : error.message,
      };
    }

    return { ok: false, message: GENERIC_UPLOAD_PREP_ERROR };
  }
}
