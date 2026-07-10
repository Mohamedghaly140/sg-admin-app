import "server-only";
import { notFound, redirect } from "next/navigation";
import { ApiError } from "./api-error";

/**
 * Central mapping for read-path ApiError codes — call from queries or pages,
 * never scatter try/catch. Branches on `code`, never HTTP status (two
 * distinct 403s exist).
 */
export function handleAuthError(error: unknown): never {
  if (!(error instanceof ApiError)) {
    throw error;
  }

  switch (error.code) {
    case "RESOURCE_NOT_FOUND":
      notFound();
    case "UNAUTHENTICATED":
      redirect("/sign-in");
    case "ACCOUNT_DISABLED":
      redirect("/account-disabled");
    case "FORBIDDEN":
      redirect("/access-denied");
    default:
      throw error;
  }
}
