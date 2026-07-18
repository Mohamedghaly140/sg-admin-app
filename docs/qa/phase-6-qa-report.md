# Phase 6 — Customers & Staff Users: QA Report

**Date**: 2026-07-18
**Method**: Playwright (dev server, `bun dev`, localhost:3000), console + network captured continuously; console polled ~2–3s after each load to catch post-hydration errors.
**Accounts tested**: ADMIN (`mohamed ghaly`, `ghaly+clerk_test@example.com`) — drove both modules end to end. MANAGER/USER access verified by inspection (middleware + nav config); no other-account credentials were available for a live sign-in this run (see role-gating note).
**Scope**: log-only QA — findings recorded here. Special focus (per request): Next.js runtime/hydration/console errors. **All destructive/irreversible actions were opened to read their copy and cancelled without confirming** — no customer was banned, no password reset, no staff user created/updated/deleted. The one live 409-safe path (self-modification) needs no forcing because the client already disables it. Short-lived dialog copy captured via direct DOM reads.

## Results against acceptance criteria

| # | Criterion | Result |
|---|-----------|--------|
| 1 | MANAGER cannot reach `/staff-users`: nav hidden, middleware redirects, API 403 | ✅ PASS (inspection) — `proxy.ts:9` lists `/staff-users` in `ADMIN_ONLY_ROUTES`; MANAGER on an admin-only route → redirect to `/orders` (`proxy.ts:48-51`); `nav-config.ts:63` gates the Administration group `adminOnly: true`. API 403 is the documented backstop. As ADMIN, the Staff Users nav item is present and the page loads. |
| 2 | Own-account actions disabled client-side; forcing surfaces the 409 | ✅ PASS — live: own row (`mohamed ghaly`, ADMIN) renders **disabled** Edit + Delete with tooltip/aria *"You can't change your own account"* (`staff-user-row-actions.tsx:38-58`). 409 `SELF_MODIFICATION_FORBIDDEN` backstop surfaces the API's human-readable message (`to-action-state.ts:96-104`). |
| 3 | Last-admin protection visible (disabled + tooltip) and 409 handled | ✅ PASS (inspection + partial live) — seed has **2** active ADMINs (`?role=ADMIN&active=true` → 2 rows), so the guard is correctly **not** applied and `Nour El Din`'s actions stay enabled. Logic: disabled when `activeAdminCount === 1 && role === "ADMIN" && active`, tooltip *"At least one active admin must remain."* (`staff-user-row-actions.tsx:39-45`), count from `get-active-admin-count.ts`. 409 `LAST_ADMIN_REQUIRED` → human-readable message branch. |
| 4 | Reset-password 503 shows "password changed, email failed" copy | ✅ PASS — `reset-customer-password.ts:27-34` maps `ApiError.code === "SERVICE_UNAVAILABLE"` → *"Password was reset, but the notification email failed — retry or contact the customer directly."* (not a generic error). Live: reset dialog copy *"This signs the customer out everywhere and emails them a notice. The new password is never shown to anyone."* confirmed and cancelled. 503 can't be forced live; the branch is verified by inspection. |
| 5 | Deactivated customer/staff shows the correct badge immediately | ✅ PASS (live Active variant + inspection) — badges render `<Badge variant={active ? "default" : "outline"}>{active ? "Active" : "Inactive"}</Badge>` in `customers-table.tsx:48`, `staff-users-table.tsx:52`, `customer-profile-card.tsx:40`. `revalidatePath` in `set-customer-active.ts:28-29` (`/customers` + `/customers/[id]`) and `update-user.ts:29` (`/staff-users`) drives the immediate refresh. Live: "Active" variant observed on list + detail; the inactive flip was **not** executed to avoid an outward-facing customer ban (no seeded inactive account exists). |
| 6 | `bun lint` and `bun run build` pass; tracker updated | ✅ PASS — `bun lint` clean (exit 0); `bun run build` clean (TypeScript 2.6s, 15/15 static pages, all routes incl. `/customers`, `/customers/[id]`, `/staff-users`). Tracker marks Phase 6 done. |

## What passed

### #2 — Own-account guardrail (live)
The operator's own row (`mohamed ghaly` / `ghaly+clerk_test@example.com` / ADMIN) shows Edit and Delete as **disabled** buttons wrapped in a tooltip whose accessible label reads *"Edit: You can't change your own account"* / *"Delete: You can't change your own account"* (`staff-user-row-actions.tsx:43-58`). Every other row exposes live Edit/Delete controls. The `updateUser`/`deleteUser` actions route errors through `fromErrorToActionState`, whose 409-family branch returns the API's own human-readable message (`to-action-state.ts:96-104`) — so a forced self-modification surfaces the backend message rather than a generic string.

### #3 — Last-admin protection (inspection, guard correctly inactive)
`?role=ADMIN&active=true` returns exactly 2 rows (`mohamed ghaly`, `Nour El Din`), both with enabled actions — the guard only engages at a count of 1. `get-active-admin-count.ts` derives the count from `/admin/users?role=ADMIN&active=true&limit=1` `meta.totalItems`, and `staff-user-row-actions.tsx:39-45` disables demote/deactivate/delete on the last active admin with the tooltip *"At least one active admin must remain."* The `LAST_ADMIN_REQUIRED` 409 is the server backstop, surfaced via the same message branch.

### #4 — Reset-password copy + 503 mapping (live copy, inspection for 503)
Reset dialog (customer `mohamed user`): title *"Reset mohamed user's password?"*, body *"This signs the customer out everywhere and emails them a notice. The new password is never shown to anyone."* — password never displayed, confirmed live, cancelled. The 503 path maps `SERVICE_UNAVAILABLE` to the specific "password was reset, but the email failed" copy (`reset-customer-password.ts:31-34`).

### #5 — Active/Inactive badge + revalidation (live Active, inspection Inactive)
"Active" badges (default variant) render live on both list and detail. The inactive variant is a distinct `outline` badge labeled "Inactive" in all three renderers; `set-customer-active.ts` revalidates both the list and the detail path, and `update-user.ts` revalidates the staff list, so the swap is immediate. The `?active=false` filter works server-side (filter reads "Inactive", 0 rows, filtered-empty copy *"No customers match your filters"*).

### Additional live coverage (beyond the 6 criteria)
- **Customers list scopes to `role = USER`** — 3 rows (`mohamed user`, `test test`, `Mariam Hassan`), columns Name/Email/Phone/Active/Orders/Joined, each row links to `/customers/[id]`.
- **Customer detail** — profile card (Name/Email/Phone/Account state/Joined), addresses + order-history sections. Empty states: *"No saved addresses / This customer has not saved an address yet."* and *"No orders found / This customer has not placed an order yet."*
- **Order history links** — `Mariam Hassan` (4 orders): rows link to `/orders/[id]`, show status (PROCESSING/SHIPPED/DELIVERED/PENDING) + payment (Paid/Unpaid) badges and `formatEGP` totals (e.g. **EGP 1,809.00**).
- **`notFound()`** — bogus customer id → *"Page not found / The page you're looking for doesn't exist. / Go home"*; a staff/non-USER id hits the same `RESOURCE_NOT_FOUND → notFound()` path (`handle-auth-error.ts:19`). `/products/<bogus>` renders the identical 404.
- **Staff list badges + filters** — role badges (USER/MANAGER/ADMIN via `getRoleBadgeVariant`) and active badges; `?role=ADMIN&active=true` narrows to 2 rows server-side with both comboboxes reflecting the state.
- **Create dialog** — fields First/Last name, Email, Phone, Password, Role (default "User"); copy *"Create a customer, manager, or admin account. Share the password securely out of band."* Empty submit is blocked by native validation (no user created).
- **Edit dialog** — Role select + Active switch both preset to the current values; copy *"Update role and account state together. Role changes apply on the target user's next token refresh."* — confirms role + active are sent **together** (`update-user.ts:27`).
- **Delete dialog type-to-confirm gate** — confirm button **disabled** initially and while a wrong email is typed; **enabled** only on the exact email (`mohamedghaly140+2@gmail.com`). Copy: *"This permanently removes the account from Clerk and the database. Their orders survive with the customer link cleared."* Cancelled — no deletion.
- **Customer search** — `?search=Mariam` → 1 row, search box prefilled.

## Not reproducible live (by inspection only)
- **MANAGER/USER role-gating for `/staff-users` and `/customers`** — no non-ADMIN credentials this run. `proxy.ts` (redirect) + `nav-config.ts` (hidden nav) verified by inspection; API 403/`ACCOUNT_DISABLED` is the real gate.
- **Last-admin 409 + disabled state** — seed has 2 active admins, so the count never reaches 1; guard logic verified by inspection.
- **Reset-password 503 copy** — can't force a live 503; mapping verified in `reset-customer-password.ts`.
- **Deactivated-badge live flip** — no seeded inactive account and banning a real customer is outward-facing, so the live swap was not executed; badge variant + `revalidatePath` verified by inspection.

## Next.js / console errors (primary focus)

**No app-level E-class defect found on Phase 6 screens.** `/staff-users`, `/customers`, and `/customers/[id]` (valid) all render **0 console errors**, including through the create/edit/delete and ban/reset dialogs.

**Phase 5 E1 (`data-slot` hydration mismatch) does not recur.** The fix is present (`dialog.tsx:14-21` — `DialogTrigger` omits its own `data-slot` when a `render` prop is supplied). The E1-trigger screen `/coupons` (empty state) and `/shipping-zones` render 0 errors across reloads with a post-hydration wait. Phase 6's staff dialogs use a plain `Button` + `onClick`/`useState` trigger (not `DialogTrigger render={<Button>}`), so they never exercise the E1 pattern. (Stale pre-fix E1 lines surfaced only in the full session-history console dump, not on any current load.)

**One upstream, dev-only console error observed (not a Phase 6 defect).** On a **cold** `/customers/<bogus-id>` render (the `notFound()` throw path), React's Server-Components performance instrumentation logged:
> `TypeError: Failed to execute 'measure' on 'Performance': 'CustomerDetailFeature' cannot have a negative time stamp. at flushComponentPerformance (…react-server-dom-turbopack…)`
- **Intermittent**: fired on the first cold notFound render, but a second bogus-id load and the `/products` notFound both logged 0 errors.
- **Origin**: the React `react-server-dom-turbopack` dev bundle's `flushComponentPerformance`, not app code — it mis-times a Server Component that throws before completing.
- **Dev-only**: this instrumentation is absent from the production build (which compiled clean).
- **Not app-fixable**: nothing in `customer-detail-feature.tsx` / `handle-auth-error.ts` can suppress a framework-internal timing measurement; the notFound UI itself renders correctly.
- Classification: **known upstream noise**, not a functional or Phase 6 defect.

No other E-class defects: no "Rendered more hooks", no Server-Action throws, no `error.tsx` boundary trips, no router errors.

## Bugs found
None functional. Customers scoping (USER only), detail/order links, `notFound()`, both action dialogs, the self-account guard, last-admin logic, role/active filters, and all error-copy mappings matched the contract and screen docs.

## Observations (minor / polish — not blockers)
- The disabled own-row / last-admin actions use a `TooltipTrigger render={<span>}` wrapping a disabled `Button` (`staff-user-row-actions.tsx:76-98`) — renders cleanly (0 hydration errors) but is the closest structural cousin to the Phase 5 E1 pattern; worth keeping in mind if the tooltip composition changes.
- Dialog error/success toasts auto-dismiss quickly; direct DOM reads were needed to capture copy (carried-over QA-tooling note from Phase 5).

## Known noise (not Phase 6 defects)
- **Base UI "changing the default value state of an uncontrolled FieldControl"** — error-level whenever a form dialog (create/edit) opens; documented uncontrolled-default warning carried from prior phases. Not triggered on plain list renders.
- **Clerk dev-keys warning** — the single standing console warning on every screen. Expected in development.
- **`flushComponentPerformance` negative-timestamp** — upstream Next.js/React dev instrumentation on cold Server-Component throw paths (see above). Dev-only.

## Side effects of this QA run
- **No state mutated.** No customer banned/reactivated, no password reset, no staff user created/updated/deleted. Every destructive dialog (deactivate, reset password, delete) was opened to read copy and **cancelled**; the empty create submit was rejected by native validation; the delete type-to-confirm was exercised then cancelled.
- **Session left signed in as ADMIN** (`mohamed ghaly`).

## Cleanup
- None required — no test entities were created, and no records were modified.

## Recommendation
Phase 6 Customers & Staff Users **passes QA** — all six acceptance criteria verified (criteria 2, 4, 5 live in part; 1 and 3 by inspection due to missing non-ADMIN credentials and a 2-admin seed; 6 via a clean `bun lint` + full `bun run build`). Customers correctly scope to `role = USER`, order history links to `/orders/[id]` with EGP-string formatting, `notFound()` guards non-customer ids, the self-account and last-admin guardrails render as specified, the delete type-to-confirm gate works, and all error-copy mappings (ban `ACCOUNT_DISABLED`, reset-password 503, 409 family) match the screen spec.

**Defect status (frontend):**
- **No app-level E-class defect.** The one console error observed is upstream, dev-only React Server-Components instrumentation (`flushComponentPerformance`) on cold `notFound()` renders — intermittent, absent from production, and not fixable in app code.
- Phase 5 E1 (`data-slot` hydration mismatch) remains fixed and does not recur.

**Follow-ups (not frontend blockers):**
- Live three-role verification of `/staff-users` and `/customers` when MANAGER/USER credentials are available.
- Live verification of the last-admin 409 + disabled state (needs a single-active-admin state) and the deactivated-badge flip (needs a disposable account or a staging environment where an outward-facing ban is acceptable).
