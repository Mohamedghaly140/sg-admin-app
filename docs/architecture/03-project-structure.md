# 03 — Project Structure

No `src/` folder. The `@/*` path alias resolves from the repo root (`tsconfig.json`).

```
app/                      # thin pages + layouts only — zero business logic
  layout.tsx              # root layout: fonts + providers (Clerk, Nuqs, Theme, Toaster)
  (auth)/sign-in/         # Clerk sign-in page (public)
  ...admin routes         # one folder per screen; see screens/00-overview.md for the route map
features/                 # ← core of the codebase, one folder per admin feature
  <feature>/
    components/           # UI components for this feature
    hooks/                # nuqs params schema: use-<feature>-params.ts
    actions/              # Server Actions — one file per action
    queries/              # read functions: cache()-wrapped apiFetch calls
    schema/               # Zod schemas mirroring the API request bodies
    types/                # response types hand-written from the API contract
    index.tsx             # export default <Name>Feature — always a Server Component
lib/
  utils.ts                # cn() helper
  env.ts                  # zod-validated env singleton (phase 1)
  api/                    # server-only API client: apiFetch, ApiError (phase 1)
  format.ts               # formatEGP(), date formatting (phase 1)
components/
  ui/                     # shadcn primitives only (base-nova / Base UI) — no business logic
  shared/                 # cross-feature building blocks (see below)
actions/
  cookies.actions.ts      # allow-listed cookie Server Actions ("toast" flash cookie)
proxy.ts                  # Next.js 16 middleware: Clerk auth + role gating (phase 1)
docs/                     # this documentation
```

## `components/shared/` inventory

| Component | Purpose |
|---|---|
| `form/` | The form system: `Form` (wires `ActionState` → sonner toasts), `FieldError`, `useActionFeedback`, `toActionState` / `fromErrorToActionState` utils. See [conventions/02-forms.md](../conventions/02-forms.md) |
| `form-control/` | `FormControl` — Label + Input + FieldError in one |
| `submit-button/` | `SubmitButton` — `useFormStatus` pending spinner |
| `confirm-dialog/` | `ConfirmDialog` — AlertDialog wrapper for destructive actions |
| `empty-state/` | `EmptyState` — icon + title + description + optional action |
| `spinner/` | `Spinner` — centered loading indicator |
| `redirect-toast/` | `RedirectToast` — shows the "toast" cookie message after a redirect |

Prefer these over reinventing. New cross-feature components go here; feature-specific ones stay in `features/<feature>/components/`.

## Feature contract

- Every feature exports exactly **one default** from `index.tsx`: `<Name>Feature`, a Server Component.
- Pages are thin: a `page.tsx` awaits the nuqs searchParams loader (if any) and renders the feature. Nothing else.
- Nothing outside a feature imports from inside it, except its matching page file.
- `queries/` holds thin read wrappers around `apiFetch` — no business logic (the backend owns that).
- `actions/` is one file per Server Action (`create-category.ts` → `createCategory`).

## Current state (don't overstate)

Check [`../phases/README.md`](../phases/README.md) before assuming anything exists. As of the docs restructure: `features/`, `lib/env.ts`, `lib/api/`, `lib/format.ts`, `proxy.ts`, and all admin routes are **not built yet** (phase 1+). What exists: the `components/shared/` inventory above, `components/ui/button.tsx` + `alert-dialog.tsx`, `lib/utils.ts`, `actions/cookies.actions.ts`, and a default starter `app/` with **no providers mounted**.
