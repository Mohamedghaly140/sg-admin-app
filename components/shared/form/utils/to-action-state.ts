// import { AxiosError } from "axios";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { ZodError } from "zod";

export type ActionState = {
  status?: "SUCCESS" | "ERROR";
  message: string;
  payload?: Record<string, string | string[]>;
  fieldErrors: Record<string, string[] | undefined>;
  timestamp: number;
  response?: Record<string, string | number | undefined | null>;
};

export const EMPTY_ACTION_STATE: ActionState = {
  message: "",
  fieldErrors: {},
  timestamp: Date.now(),
};

const toPayload = (
  formData?: FormData,
): Record<string, string | string[]> | undefined => {
  if (!formData) return undefined;
  // Object.fromEntries would collapse repeated keys (multi-selects, tag
  // inputs like sizes/colors) down to their last value — group them instead.
  const payload: Record<string, string | string[]> = {};
  for (const key of new Set(formData.keys())) {
    const values = formData
      .getAll(key)
      .filter((value): value is string => typeof value === "string");
    if (values.length === 0) continue;
    payload[key] = values.length === 1 ? values[0] : values;
  }
  return payload;
};

export const fromErrorToActionState = (
  error: unknown,
  formData?: FormData,
  response?: Record<string, string | number>
): ActionState => {
  if (isClerkAPIResponseError(error)) {
    const message = error.errors[0]?.longMessage ?? error.errors[0]?.message ?? "An error occurred";
    return {
      status: "ERROR",
      message,
      fieldErrors: {},
      payload: toPayload(formData),
      timestamp: Date.now(),
      response,
    };
  }
  if (error instanceof ZodError) {
    return {
      status: "ERROR",
      message: "",
      fieldErrors: error.flatten().fieldErrors,
      payload: toPayload(formData),
      timestamp: Date.now(),
      response,
    };
  }
  // if (error instanceof AxiosError) {
  //   return {
  //     status: "ERROR",
  //     message: error.response?.data.message,
  //     fieldErrors: {},
  //     payload: toPayload(formData),
  //     timestamp: Date.now(),
  //     response,
  //   };
  // }
  if (error instanceof Error) {
    return {
      status: "ERROR",
      message: error.message,
      fieldErrors: {},
      payload: toPayload(formData),
      timestamp: Date.now(),
      response,
    };
  }
  return toActionState(
    "ERROR",
    "An unknown error occurred",
    formData,
    response
  );
};

export const toActionState = (
  status: ActionState["status"],
  message: string,
  formData?: FormData,
  response?: Record<string, string | number | undefined | null>
): ActionState => {
  return {
    status,
    message,
    fieldErrors: {},
    timestamp: Date.now(),
    payload: toPayload(formData),
    response,
  };
};
