# Phase 1 — Foundation: QA Report

**Date**: 2026-07-16
**Method**: Playwright (dev server, `bun dev`, localhost:3000)
**Account tested**: ADMIN (`moghaly140`) only — no MANAGER or USER credentials available this session.

## Results against acceptance criteria

| # | Criterion | Result |
|---|---|---|
| 1 | Sign-in works; signed-out users redirected to `/sign-in` from any route | ✅ PASS — `/` and `/orders` both redirected while signed out |
| 2 | MANAGER: no Dashboard/Analytics/Staff Users in nav; `/`, `/analytics`, `/staff-users` redirect to `/orders`; lands on `/orders` after sign-in | ⬜ NOT TESTED — no MANAGER account provided |
| 3 | `USER` role sees access-denied screen everywhere | ⬜ NOT TESTED — no USER account provided |
| 4 | Smoke read renders live API data; invalid token path redirects to `/sign-in`, not a crash | 🟨 PARTIAL — live data confirmed (Dashboard KPIs, Categories list all real). Invalid-token path not exercised (would require forcing an expired/invalid Clerk session). |
| 5 | Test toast renders (Toaster mounted); theme toggle switches light/dark and persists | 🟨 PARTIAL — see bugs below. Success toast + theme toggle both pass; error toast does not fire on at least one path. |
| 6 | `bun lint` and `bun run build` pass | Not re-run this session (already marked done in tracker) |
| 7 | Tracker updated | Pending — see recommendation |

## What passed

- **Sign-in flow**: username/password sign-in via Clerk works end to end; lands on `/` (Dashboard) for ADMIN.
- **ADMIN nav/routing**: Dashboard, Analytics, Staff Users all visible in sidebar and all three ADMIN-only routes (`/`, `/analytics`, `/staff-users`) render without redirect.
- **Live API data**: Dashboard KPIs (Revenue, Orders, New customers, AOV, charts, recent orders, top products) and Categories list all render real backend data — no mocks.
- **Category CRUD**: create (success path), delete, and `ConfirmDialog` on delete all work correctly against the live API; list revalidates immediately.
- **Success toast**: confirmed rendering (sonner Toaster is mounted and functional for the happy path).
- **Theme toggle**: switches light ↔ dark instantly, and the choice persists across a full page reload.

## Bugs found

1. ✅ **FIXED — Error toast did not render for 409 duplicate-category** (`components/shared/form` / `features/categories/actions/create-category.ts` path). Category and sub-category dialogs now await their Server Actions directly and synchronously show error toasts.
2. ✅ **FIXED — React warning: "An async function with useActionState was called outside of a transition"**. The affected category, sub-category, and product forms now use the established manual-await `useState<ActionState>` pattern.
3. ✅ **FIXED — Hydration mismatch on every authenticated page** at `components/shared/app-shell/topbar.tsx` (`<UserButton />`). The Clerk user button now renders through a client-only dynamic boundary with a stable avatar-sized skeleton.
4. ✅ **FIXED — Base UI uncontrolled-field warning and stale values when reopening dialogs**. The affected category dialogs now reset their action state on close; the same preventative reset was added to coupon and shipping-zone dialogs.
5. **Minor/data**: seed data has broken Cloudinary image URLs (`res.cloudinary.com/demo/...`) — every category thumbnail and the Dashboard "Top products" image 404s via `/_next/image`. Not a code bug, but worth fixing the seed data or documenting as known noise.

## Re-verification (2026-07-16, post-fix)

Re-ran the exact repro steps via Playwright after Codex's fix:

- Categories → New category → submit "Dresses" (duplicate) → error toast "A category with this name already exists." now fires immediately (confirmed via a tight DOM poll — sonner's ~4s display duration had made it easy to miss with a naive fixed-delay wait).
- Console: the `useActionState`/transition warning is gone. No hydration-mismatch error on any authenticated page (checked `/categories`, `/coupons`).
- Reopening "New category" after the failed submit now shows a blank Name field (previously showed stale "Dresses").
- One harmless residual: Base UI's "uncontrolled FieldControl default value" console warning still appears *within* a single open dialog session (when `actionState.payload.name` echoes back the same value the user just typed) — this is cosmetic/dev-only, unrelated to the stale-reopen bug (which is fixed), and wasn't in the fix's scope. Would require converting the field to controlled to fully silence; not worth the churn unless it starts causing real issues.
- `coupon-form-dialog.tsx` / `shipping-zone-form-dialog.tsx` reset fixes verified via code review only (trivial 3-line additions using the same proven `setActionState(EMPTY_ACTION_STATE)` call already validated in categories) — not independently re-driven through the browser.

## Recommendation

- To finish phase 1 sign-off, still need: a MANAGER test account (criterion #2) and a USER test account (criterion #3), plus a way to exercise the invalid-token path (criterion #4's second half).
