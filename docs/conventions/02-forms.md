# 02 — Forms

The shared form system in `components/shared/form/` is the **only** way forms are built in this app. It connects Server Actions to toasts (sonner) and inline field errors through one type: `ActionState`.

## `ActionState` (`components/shared/form/utils/to-action-state.ts`)

```ts
export type ActionState = {
  status?: "SUCCESS" | "ERROR";
  message: string;                                  // toast text
  payload?: Record<string, string | string[]>;      // submitted FormData — repopulates inputs
  fieldErrors: Record<string, string[] | undefined>; // per-field errors → <FieldError>
  timestamp: number;                                 // lets repeat submissions re-trigger toasts
  response?: Record<string, string | number | undefined | null>; // extra data for callers that branch
};
```

Helpers in the same file:

- `EMPTY_ACTION_STATE` — the initial state for `useActionState`.
- `toActionState(status, message, formData?, response?)` — build a success/error state.
- `fromErrorToActionState(error, formData?, response?)` — the catch-all: Clerk API errors → message; `ZodError` → `fieldErrors`; `ApiError` → see [01-data-flow.md](./01-data-flow.md#error-mapping--the-apierror-branch-in-fromerrortoactionstate); generic `Error` → message. **Always pass `formData`** so `payload` repopulates the form.

## Wiring a form (the caller owns `useActionState`)

`Form` is presentational + feedback only — the caller wires React's `useActionState`:

```tsx
"use client";

import { useActionState } from "react";
import Form from "@/components/shared/form/form";
import FormControl from "@/components/shared/form-control";
import SubmitButton from "@/components/shared/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/shared/form/utils/to-action-state";
import { createCategory } from "../actions/create-category";

const CategoryCreateForm = () => {
  const [actionState, action] = useActionState(createCategory, EMPTY_ACTION_STATE);

  return (
    <Form action={action} actionState={actionState}>
      <FormControl label="Name" name="name" defaultValue={actionState.payload?.name} />
      <SubmitButton label="Create category" />
    </Form>
  );
};
```

What each piece does:

- **`Form`** (`form/form.tsx`) — renders `<form action={...}>`; watches `actionState` via `useActionFeedback` and fires `toast.success(message)` / `toast.error(message)` automatically. Optional `onSuccess`/`onError` callbacks (e.g. close a dialog, `router.push`). `suppressBuiltInToasts` skips the automatic toasts — use it when the submitting UI unmounts on success (delete row + `revalidatePath`) and toast from a client wrapper instead.
- **`useActionFeedback`** (`form/hooks/use-action-feedback.ts`) — diffs `actionState.timestamp` in a ref so feedback fires exactly once per submission, including repeat submissions with identical messages.
- **`FieldError`** (`form/field-error.tsx`) — `<FieldError actionState={actionState} name="price" />` renders the first error in `fieldErrors[name]`, or nothing. `FormControl` already includes it; use `FieldError` directly for custom inputs (selects, switches, textareas) that `FormControl` doesn't cover.
- **`FormControl`** (`components/shared/form-control/`) — Label + Input + FieldError. Accepts all native input props; `type="hidden"` renders a bare input. ⚠️ It imports `@/components/ui/input` and `@/components/ui/label`, which are **not installed yet** — installing them is a phase-1 task.
- **`SubmitButton`** (`components/shared/submit-button/`) — reads `useFormStatus().pending`; shows a spinner and disables itself while the action runs. Props: `label`, `icon`, `variant`, `size`, `disabled`, `loading`.

## Repopulating inputs after an error

Server Actions pass `formData` into `fromErrorToActionState`, which stores it as `actionState.payload`. Give every input `defaultValue={actionState.payload?.<name>}` so a failed submission doesn't wipe what the user typed.

**Multi-value fields** (multi-selects, tag inputs — e.g. `sizes`, `colors`, `subCategoryIds`): `payload` preserves repeated keys as `string[]` (a single value stays a `string`). Custom multi-value components must handle both shapes when repopulating — dropping array entries here silently loses selections on resubmit (and `subCategoryIds` replaces the whole set on the API side).

## Toast after a redirect

Success toasts from `Form` die with the page on `redirect()`. For create-then-navigate flows, the action sets the flash cookie and redirects:

```ts
await setCookieByKey("toast", "Category created"); // actions/cookies.actions.ts (allow-list: "toast" only)
redirect(`/categories`);
```

`RedirectToast` (`components/shared/redirect-toast/`, mounted once in the root layout) reads the cookie on the next navigation, shows `toast.success`, and deletes it.

## Validation split

- **Zod in the Server Action** = instant, field-level UX validation (no API round-trip) **and** the request-body whitelist.
- **Backend 422s** = the truth. They arrive as `ApiError` with `errors[]` and land in the same `fieldErrors` → same `FieldError` UI. Don't build a second error-rendering path.
