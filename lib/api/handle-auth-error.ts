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
      // TODO(phase-1 task 3): route to the shared access-denied screen once
      // it exists — for now this falls through to the segment's error.tsx.
      throw error;
    default:
      throw error;
  }
}
