# 04 — Auth & Roles

Authentication is **Clerk**; authorization is the **backend's job**. This app never verifies permissions itself — it reads the role for UX decisions and lets the API return 401/403 as the real gate.

## Clerk wiring (frontend-only)

- `ClerkProvider` wraps the app in `app/layout.tsx`.
- `proxy.ts` (Next.js 16 middleware) runs `clerkMiddleware`: every route requires a session except `/sign-in` and `/account-disabled`. There is **no other public content** in this app.
- Sign-in page at `app/(auth)/sign-in/` using Clerk components. No self-serve sign-up — staff accounts are created by an ADMIN via the [staff-users API](../integration/admin/09-staff-users.md).
- `app/(auth)/account-disabled/` — the central disabled-account path `lib/api/handle-auth-error.ts` and `fromErrorToActionState` redirect to on `ACCOUNT_DISABLED`. A Client Component: calls `useClerk().signOut({ redirectUrl: "/account-disabled" })` once on mount, then shows the notice. Must stay outside the middleware's auth requirement — after `signOut()` completes the visitor is unauthenticated on this same route.

## Token flow

The backend issues no tokens of its own — it accepts the **Clerk session JWT** as a Bearer token ([API conventions](../integration/admin/00-conventions.md#authentication--clerk-bearer-token)):

```ts
// inside lib/api — server-only
import { auth } from "@clerk/nextjs/server";

const { getToken } = await auth();
const token = await getToken(); // fresh per request — short-lived, never cache
// → Authorization: Bearer ${token}
```

Rules:

- Fetch a **fresh token per request**; never cache or reuse one.
- The token stays **server-side only** — it must never reach a Client Component or the browser. All API calls happen in Server Components / Server Actions via `lib/api`.

## Roles

`USER · MANAGER · ADMIN` — source of truth is the backend DB, mirrored to Clerk `publicMetadata.role`. Read it server-side from `sessionClaims`:

```ts
const { sessionClaims } = await auth();
const role = sessionClaims?.publicMetadata?.role; // requires the JWT claim (below)
```

> **Clerk setup (one-time, dashboard):** customize the session token to include `publicMetadata` so `sessionClaims.publicMetadata.role` is available without an extra API call: Sessions → Customize session token → `{ "publicMetadata": "{{user.public_metadata}}" }`.

### Route matrix

| Route(s) | Minimum role |
|---|---|
| `/` (dashboard home), `/analytics`, `/staff-users` | **ADMIN** |
| `/products`, `/categories`, `/orders`, `/coupons`, `/shipping-zones`, `/customers` (+ their subroutes) | MANAGER |
| any route | `USER` role → access-denied screen (no admin access at all) |

- After sign-in: ADMIN lands on `/`; **MANAGER is redirected to `/orders`** (their landing page — `/` is ADMIN-only).
- Sidebar navigation is role-filtered: a MANAGER never sees Dashboard, Analytics, or Staff Users entries.

## Three-layer enforcement

1. **`proxy.ts` middleware** — redirects unauthenticated users to `/sign-in`; redirects MANAGERs off ADMIN-only routes (to `/orders`); shows access-denied to `USER` role. *This is UX, not security.*
2. **The backend** — the real gate. Every request is authorized server-side; expect `401 UNAUTHENTICATED`, `403 FORBIDDEN`, `403 ACCOUNT_DISABLED` regardless of what the UI allowed.
3. **UI** — hide/disable actions the role can't perform (also UX).

## Handling auth failures from the API

Always branch on the **error `code`** — never on the HTTP status (403 carries two distinct codes). The mapping lives in one central helper (`lib/api/handle-auth-error.ts`, phase 1) shared by reads and actions:

| Code | Handling |
|---|---|
| `401 UNAUTHENTICATED` | `redirect("/sign-in")` — session expired or invalid |
| `403 FORBIDDEN` | Render the access-denied screen; if it happens on an action, return an ActionState error ("You don't have permission to do this") |
| `403 ACCOUNT_DISABLED` | The signed-in account was deactivated — sign out via Clerk and show a "account disabled" notice |
