# Phase 1 — Foundation

## Goal

Everything cross-cutting: a signed-in MANAGER/ADMIN sees an empty but fully navigable, role-aware app, and one smoke read proves the API client works end to end.

## Consumes

[`integration/admin/00-conventions.md`](../integration/admin/00-conventions.md) · all of [`architecture/`](../architecture/01-overview.md) · [`conventions/01-data-flow.md`](../conventions/01-data-flow.md), [`02-forms.md`](../conventions/02-forms.md), [`04-ui-and-styling.md`](../conventions/04-ui-and-styling.md) · [`screens/00-overview.md`](../screens/00-overview.md)

## Tasks

### 1. Environment & API client

- [ ] `lib/env.ts` — Zod-validated singleton: `API_URL`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` ([spec](../architecture/05-environment.md)).
- [ ] `lib/api/api-error.ts` — `ApiError { status, code, message, errors? }`.
- [ ] `lib/api/http.ts` — server-only `apiFetch<T>` exactly per [data flow](../conventions/01-data-flow.md#the-api-client-libapi-built-in-phase-1): fresh Clerk token, envelope unwrap, 204 handling, `cache: "no-store"`.
- [ ] `lib/api/handle-auth-error.ts` — central mapping **branched on `ApiError.code`** (never HTTP status): `RESOURCE_NOT_FOUND` → `notFound()`, `UNAUTHENTICATED` → `redirect("/sign-in")`, `ACCOUNT_DISABLED` → disabled-account path (Clerk sign-out + notice), `FORBIDDEN` → access-denied.
- [ ] Extend `fromErrorToActionState` (`components/shared/form/utils/to-action-state.ts`) with the `ApiError` branch: 422 `errors[]` → `fieldErrors`, `ACCOUNT_DISABLED` → the central disabled-account path, otherwise `message` (the commented-out AxiosError block marks the slot).
- [ ] `lib/format.ts` — `formatEGP()` (`Intl.NumberFormat`), date helpers, `cldUrl()` transform helper.

### 2. Providers & auth

- [ ] `app/layout.tsx` — mount `ClerkProvider`, `NuqsAdapter`, next-themes `ThemeProvider`, sonner `<Toaster />`, `<RedirectToast />`; set real metadata (title "SG Couture Admin").
- [ ] `proxy.ts` — `clerkMiddleware`: everything requires a session except `/sign-in`; ADMIN-only routes (`/`, `/analytics`, `/staff-users`) redirect MANAGERs to `/orders`; `USER` role → access-denied ([matrix](../architecture/04-auth-and-roles.md#route-matrix)).
- [ ] `app/(auth)/sign-in/` — Clerk sign-in page. No sign-up route.
- [ ] Clerk dashboard one-time: session token includes `publicMetadata` (role claim).

### 3. UI primitives & shell

- [ ] Install shadcn batch: `input`, `label` (**unblocks the existing `FormControl` imports**), `card`, `table`, `badge`, `select`, `dialog`, `dropdown-menu`, `separator`, `skeleton`, `sheet`, `tabs`, `avatar`, `textarea`, `checkbox`, `switch`, `tooltip` — via `bunx shadcn@latest add …`.
- [ ] Admin shell: role-filtered sidebar (groups per [screens overview](../screens/00-overview.md#layout-applayouttsx--admin-shell), `sheet` on mobile) + topbar (breadcrumb, theme toggle, Clerk user menu).
- [ ] Placeholder page for every route in the [route map](../screens/00-overview.md#route-map) (empty feature shells).
- [ ] Global `error.tsx`, `not-found.tsx`, root `loading.tsx`, shared access-denied screen.
- [ ] `next.config.ts`: `images.remotePatterns` for `res.cloudinary.com`.

### 4. Smoke test

- [ ] One Server Component calls `GET /admin/categories` through `apiFetch` and renders names from the envelope's `data`.

## Acceptance criteria

- [ ] Sign-in works; signed-out users are redirected to `/sign-in` from any route.
- [ ] MANAGER: no Dashboard/Analytics/Staff Users in the nav; hitting `/`, `/analytics`, or `/staff-users` redirects to `/orders`; lands on `/orders` after sign-in.
- [ ] `USER` role sees the access-denied screen everywhere.
- [ ] The smoke read renders live API data; an invalid token path produces a redirect to `/sign-in`, not a crash.
- [ ] A test toast renders (Toaster mounted); theme toggle switches light/dark and persists.
- [ ] `bun lint` and `bun run build` pass.
- [ ] [Tracker](./README.md) updated.
