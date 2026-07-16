# 01 — Data Flow (read this before writing any feature code)

Every byte of data in this app flows through one of two paths. Both go through the server-only API client in `lib/api/` — the browser never talks to the backend directly (sole exception: the direct Cloudinary upload, [05-media.md](./05-media.md)).

```
READS      page.tsx → nuqs loader → <Feature> (RSC) → queries/get-x.ts → apiFetch → API
MUTATIONS  <Form> → useActionState → actions/do-x.ts → zod parse → apiFetch → API
                                          │ success: revalidatePath + ActionState/redirect
                                          └ error:   fromErrorToActionState → toasts + field errors
```

All request/response shapes come from [`../integration/admin/`](../integration/admin/README.md) — never invent endpoints or fields.

## The API client (`lib/api/`, built in phase 1)

**`lib/api/api-error.ts`**

```ts
export class ApiError extends Error {
  constructor(
    public status: number,                                  // HTTP status
    public code: string,                                    // stable machine code — branch on this, never on message
    message: string,                                        // human-readable summary from the API
    public errors?: { field: string; message: string }[],   // field-level details (422)
  ) {
    super(message);
    this.name = "ApiError";
  }
}
```

**`lib/api/http.ts`** — `import "server-only"`. One function:

```ts
apiFetch<TData>(path: string, init?: ApiFetchInit): Promise<{ data: TData; meta?: PageMeta }>
```

Behavior (implement exactly this):

1. **Token** — `const { getToken } = await auth()` (`@clerk/nextjs/server`), `await getToken()` fresh on every call. `null` token → throw `ApiError(401, "UNAUTHENTICATED", …)`. The token never leaves the server.
2. **Request** — `${env.API_URL}/api/v1${path}` with `Authorization: Bearer <token>`; `Content-Type: application/json` + `JSON.stringify(body)` when a body is given; `cache: "no-store"` (admin data is live — per-request dedupe comes from React `cache()` around query functions, not HTTP caching).
3. **Response** — `204` → return `{ data: undefined }` without touching the body (DELETE endpoints return no JSON). Otherwise parse the [envelope](../integration/admin/00-conventions.md#response-envelope): `status === "success"` → return `{ data, meta }`; anything else → `throw new ApiError(res.status, json.code, json.message, json.errors)`.

`PageMeta` is the documented pagination meta: `{ page, limit, totalItems, totalPages, hasNext, hasPrev }`.

## Reads (Server Components)

- `page.tsx` is thin: await the feature's nuqs searchParams loader, render `<XxxFeature params={...} />`.
- The feature's `queries/` functions are `cache()`-wrapped `apiFetch` calls, typed by hand against the contract doc:

```ts
// features/categories/queries/get-categories.ts
import "server-only";
import { cache } from "react";
import { apiFetch } from "@/lib/api/http";
import type { Category } from "../types";

export const getCategories = cache((params: CategoriesParams) =>
  apiFetch<Category[]>(`/admin/categories?${toSearchParams(params)}`),
);
```

- Independent reads fan out with `Promise.all`.
- Read errors bubble to route conventions, **branched on `ApiError.code` (never on HTTP status — two different 403s exist)**: `RESOURCE_NOT_FOUND` → `notFound()`; `UNAUTHENTICATED` → `redirect("/sign-in")`; `ACCOUNT_DISABLED` → the central disabled-account path (Clerk sign-out + "account disabled" notice); `FORBIDDEN` → access-denied UI; anything else → the segment's `error.tsx`. Put this mapping in one helper (`lib/api/handle-auth-error.ts`) and call it from queries or pages — don't scatter try/catch.

## Mutations (Server Actions)

One file per action in `features/<feature>/actions/`. Signature matches `useActionState` + the shared `Form`:

```ts
// features/categories/actions/create-category.ts
"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/http";
import { toActionState, fromErrorToActionState, type ActionState } from "@/components/shared/form/utils/to-action-state";
import { createCategorySchema } from "../schema/category-schema";

export async function createCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const input = createCategorySchema.parse(Object.fromEntries(formData));
    await apiFetch("/admin/categories", { method: "POST", body: input });
    revalidatePath("/categories");
    return toActionState("SUCCESS", "Category created");
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }
}
```

Rules:

1. **Zod parse first.** The schema (in `features/<feature>/schema/`) mirrors the documented request body **exactly** — it doubles as the whitelist, because the API rejects unknown fields with `422 VALIDATION_ERROR`. Build the request body from the parsed output only; never spread raw `formData`. Never include [server-owned fields](../integration/admin/00-conventions.md#server-side-truths-never-send-these) (`slug`, `priceAfterDiscount`, `sold`, ratings, totals, `usedCount`).
   ⚠️ `Object.fromEntries(formData)` **collapses repeated keys** — fine for simple forms, wrong for multi-value fields (`sizes`, `colors`, `subCategoryIds`). For those, read arrays explicitly (`formData.getAll("sizes")`) or use a shared helper that groups repeated keys, and give the Zod schema array types.
2. **Always pass `formData` to `fromErrorToActionState`** so `ActionState.payload` repopulates the form inputs.
3. **Success, same page:** `revalidatePath(...)` + `return toActionState("SUCCESS", "...")` — the `Form` toasts the message.
4. **Success, then navigate** (e.g. create → detail): `revalidatePath(...)` + `await setCookieByKey("toast", "...")` (from `actions/cookies.actions.ts`) + `redirect(...)` — `RedirectToast` shows the message after navigation. (`redirect()` throws; call it outside the `try` or rethrow it.)
5. **Row deletions** triggered by a confirmation dialog use the direct-action pattern below instead of `Form`.

### ConfirmDialog row deletions

`ConfirmDialog.onConfirm` is not a form submit, so row deletion controls call
their delete Server Action directly inside `useTransition`. The client wrapper
shows exactly one toast based on `actionState.status` (`SUCCESS` or `ERROR`),
never by matching message text. Do not wrap the action call in a client-side
`try/catch`: `fromErrorToActionState` intentionally throws redirects for
`UNAUTHENTICATED` and `ACCOUNT_DISABLED`, and those redirects must propagate.

## Error mapping — the `ApiError` branch in `fromErrorToActionState`

Phase 1 extends `components/shared/form/utils/to-action-state.ts` with an `ApiError` branch (the commented-out `AxiosError` block marks the slot):

`redirectOnAuthError` (`lib/api/redirect-on-auth-error.ts`) is the shared hard-redirect helper reused by `handleAuthError` and `fromErrorToActionState`: `UNAUTHENTICATED` → `/sign-in`, `ACCOUNT_DISABLED` → `/account-disabled`.

- **`code === "VALIDATION_ERROR"` with `errors[]`** → group into `fieldErrors: Record<string, string[]>` (`{ field, message }[]` → `{ [field]: [messages] }`) and keep `message` so the toast still fires. Backend 422s then render in `FieldError` exactly like Zod failures — one UI path.
- **409 family** (`DUPLICATE_RESOURCE`, `FOREIGN_KEY_CONSTRAINT`, `INVALID_STATUS_TRANSITION`, `LAST_ADMIN_REQUIRED`, `SELF_MODIFICATION_FORBIDDEN`, `FORBIDDEN_TARGET`, `COUPON_IN_USE`) → the API's `message` is human-readable; it becomes the error toast. Actions may pre-map specific codes to friendlier copy before returning. Stash `code`/`status` in `ActionState.response` when a caller needs to branch.
- **`401 UNAUTHENTICATED`** → `redirect("/sign-in")` (a thrown redirect, not an ActionState).
- **`403 ACCOUNT_DISABLED`** → the acting account was deactivated: route through the **central disabled-account path** (Clerk sign-out + "account disabled" notice) — never a generic toast. ⚠️ Two different 403s exist; this is why auth failures branch on `code`, never on HTTP status.
- **`403 FORBIDDEN`** → ActionState error: "You don't have permission to do this."

Branch on `code`, **never** on `message` or HTTP status ([error-code table](../integration/admin/00-conventions.md#error-codes-used-by-admin-endpoints)).

## Data-format cribs (from the API conventions — repeated here because agents keep getting them wrong)

- **Money and record decimals are JSON strings** (`"1299.00"`, EGP only). Never do float math; display via `formatEGP()` in `lib/format.ts`. Exception: [dashboard](../integration/admin/01-dashboard.md) and [analytics](../integration/admin/02-analytics.md) return plain **numbers** (chart inputs).
- **Dates** are ISO 8601 UTC; analytics buckets are `"YYYY-MM-DD"`.
- **Pagination** is server-side: send `page`/`limit`, render from `meta`. No client-side pagination anywhere. Every paginated list feature must call `redirectToLastPageIfOutOfRange(meta, buildHref)` after its fetch so a mutation that empties the current page redirects to the last valid page instead of stranding the operator.
- **Rate limit**: 100 req/60s per IP — no polling loops (dashboard metrics at most ~1/min).
