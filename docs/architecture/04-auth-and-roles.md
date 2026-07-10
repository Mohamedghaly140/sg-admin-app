# 04 — Auth & Roles

Authentication is **Clerk**; authorization is the **backend's job**. This app never verifies permissions itself — it reads the role for UX decisions and lets the API return 401/403 as the real gate.

## Clerk wiring (frontend-only)

- `ClerkProvider` wraps the app in `app/layout.tsx`.
- `proxy.ts` (Next.js 16 middleware) runs `clerkMiddleware`: every route requires a session except `/sign-in` and `/account-disabled`. The only other public route is `/sign-up`, and only when `NODE_ENV=development`.
- Sign-in page at `app/(auth)/sign-in/` using Clerk components. No production self-serve sign-up — staff accounts are created by an ADMIN via the [staff-users API](../integration/admin/09-staff-users.md). A dev-only `/sign-up` route exists for local Clerk account creation, but it is Clerk-only: it does not create the backend DB row that the real staff-users flow creates, so even after manually setting `publicMetadata.role` in Clerk, backend API calls may still return 401/403 for that test account. Use it for middleware, role-routing, and UI checks, not for a fully API-backed staff session. Production safety also depends on the production Clerk instance itself: deployed environments use production Clerk keys, and the app hides this UI outside development, but sign-up must still be disabled in the production Clerk dashboard under Restrictions -> sign-up.
- `app/(auth)/account-disabled/` — the central disabled-account path `lib/api/handle-auth-error.ts` and `fromErrorToActionState` redirect to on `ACCOUNT_DISABLED`. A Client Component: calls `useClerk().signOut({ redirectUrl: "/account-disabled" })` once on mount, then shows the notice. Must stay outside the middleware's auth requirement — after `signOut()` completes the visitor is unauthenticated on this same route.
- `app/access-denied/` — early minimal redirect target for authenticated `USER` role sessions. The user stays signed in, but cannot view admin routes.
- `proxy.ts` deliberately uses manual pathname checks plus `NextResponse.redirect()`/`.next()` instead of `createRouteMatcher` or `auth.protect()` because the former is deprecated in current Clerk examples and the latter has redirect issues in recent `@clerk/nextjs` 7.x + Next 16 proxy-on-Node-runtime combinations.

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
const role = sessionClaims?.metadata?.role; // requires the JWT claim (below)
```

> **Clerk setup (one-time, dashboard):** customize the session token to include the user's public metadata under the claim key `metadata` — Sessions → Customize session token → `{ "metadata": "{{user.public_metadata}}" }`. The claim key is `metadata` (not `publicMetadata`); it must match the accessor above exactly, or `sessionClaims` silently comes back without a `role` and every request falls through the "no role" branch.

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
