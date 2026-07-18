# Phase 5 — Coupons & Shipping Zones: QA Report

**Date**: 2026-07-18
**Method**: Playwright (dev server, `bun dev`, localhost:3000), console + network captured continuously.
**Accounts tested**: ADMIN (`moghaly140`, "Mohamed Ghaly") — drove both modules end to end. MANAGER/USER access verified by inspection (middleware + nav config); no other-account credentials were available for a live sign-in this run (see role-gating note).
**Scope**: log-only QA for the initial pass — findings recorded here; the sole defect (**E1**) was then **fixed and re-verified in a follow-up pass** (see the E1 section). Special focus (per request): Next.js runtime/hydration/console errors. Destructive/one-way dialogs were opened to read their copy and **cancelled without confirming**; the two throwaway test entities created for the create/duplicate flows were cleaned up (see Side effects). Redeemed-coupon and duplicate-resource deletes/creates were confirmed live because the backend **rejects** them, leaving state intact.

## Results against acceptance criteria

| # | Criterion | Result |
|---|-----------|--------|
| 1 | Deactivated coupon stays visible with the Deactivated badge; no re-enable control anywhere | ✅ PASS — verified live on `SUMMER20`: row + Deactivated badge present; action menu = Edit/Delete only; edit form has no active toggle |
| 2 | Deleting a redeemed coupon shows the specific conflict message + deactivate suggestion | ✅ PASS — verified live on `WELCOME15` (usedCount 1): toast *"This coupon has been used and can't be deleted. Deactivate it instead."* + **Deactivate** action; coupon preserved |
| 3 | Coupon codes display uppercased after create regardless of input case | ✅ PASS — input `qa-test-cpn` rendered as **QA-TEST-CPN**; field also live-uppercases while typing |
| 4 | Zone fees render as EGP strings (no float math); governorate-wide rows labeled | ✅ PASS — fees `EGP 90.00` / `EGP 75.00` via `formatEGP`; null-city row labeled **"All cities (governorate-wide)"** |
| 5 | `bun lint` and `bun run build` pass; tracker updated | ✅ PASS — `bun lint` clean and `bun run build` clean (exit 0, all 15 routes generated) against the final working tree incl. the E1 fix; tracker already marks Phase 5 done |

## What passed

### #1 — Deactivated coupon, no re-enable (live)
- `SUMMER20` (isActive false) stays in the list with the **Deactivated** badge (expiry Jul 1, 2026 is also past, but `getCouponStatus` gives deactivated precedence — `coupon-status-badge.tsx:32`).
- Its action menu offers exactly **Edit** and **Delete** — no Deactivate, no reactivate/re-enable.
- The **Edit** dialog for `SUMMER20` exposes only Code / Discount / Max usage / Per-user limit / Expiry — **no active toggle**. Description confirms the update "expire now" path: *"Update the coupon fields. A past expiry date expires it immediately."*
- Active coupons (`WELCOME15`) correctly add a **Deactivate** menu item; its confirm copy: *"Deactivate WELCOME15? This cannot be re-enabled — create a new coupon instead."*

### #2 — Redeemed-coupon delete conflict (live)
- `WELCOME15` (usage 1/100) delete confirm → backend 409; toast captured live: **"This coupon has been used and can't be deleted. Deactivate it instead."** with a **Deactivate** action button (hands off to the deactivate dialog — `coupon-row-actions.tsx:62`). Delete dialog closed; the coupon remained in the list (not deleted). Source: `delete-coupon.ts:23-32`.

### #3 — Uppercase-on-create (live)
- Created a coupon with code `qa-test-cpn`, discount 25, maxUsage 0, perUserLimit 1, expiry 2027-01-15 → table row **QA-TEST-CPN**, 25%, Active, expiry Jan 15, 2027, 0 console errors on the resulting render.
- Bonus: the code field live-uppercases keystrokes (`onInput` → `toUpperCase`, `coupon-form-dialog.tsx:76`); schema also normalizes server-side.

### #4 — Zone fees + governorate-wide label (live)
- Seed zones render: `Egypt / Cairo / All cities (governorate-wide) / EGP 90.00` and `Egypt / Cairo / Nasr City / EGP 75.00`. Governorate-wide label + `formatEGP` string formatting both confirmed live (`shipping-zones-table.tsx:62-68`).

### Additional live coverage (beyond the 5 criteria)
- **∞ usage bar**: maxUsage 0 renders `∞` (no progress bar) instead of `used / max` — `coupon-usage-bar.tsx:10`.
- **Discount bound 1–70**: native HTML5 constraint blocks submit with *"Value must be less than or equal to 70."* on discount 71 (form-level, before the server action).
- **Duplicate coupon code → 409**: creating `SUMMER20` again → toast **"A coupon with this code already exists."**; dialog stayed open, no duplicate row (`create-coupon.ts:25`).
- **Duplicate zone (country/governorate/city) → 409**: creating `Egypt/Cairo` blank-city again → toast **"A zone for this country/governorate/city already exists."**; row count unchanged (`create-shipping-zone.ts:25`).
- **Inline active toggle**: `Switch` on the Nasr City zone flips optimistically (label swaps Deactivate↔Activate via `useOptimistic`) and **persists** across a reload; toggled back to restore state.
- **Zone delete confirm copy**: *"Hard delete. Past orders keep their fee snapshot, but removing the only zone covering an area blocks checkout there — deactivate instead to suspend temporarily."* — warns the area becomes un-checkout-able (opened, then cancelled).
- **URL-driven filters (server-side)**: `/coupons?status=deactivated` → 1 row + filter reflects "Deactivated"; `/shipping-zones?search=Nasr` → 1 row + search box prefilled. Both narrow server-side and are shareable.
- **Filtered-empty vs no-filter states**: coupons filtered-empty = *"No coupons match your filters" / "Try a different code or lifecycle status."*; zones filtered-empty = *"No shipping zones match your search" / "Try a different country, governorate, or city."* — both distinct from the no-filter empty copy.

## Not reproducible live (by inspection only)
- **Role-gating for `/coupons` and `/shipping-zones`** — `proxy.ts:9` `ADMIN_ONLY_ROUTES = ["/", "/analytics", "/staff-users"]` excludes both routes, so they are MANAGER+; any non-staff role (USER/undefined/malformed) is redirected to `/access-denied` everywhere (`proxy.ts:40`). `nav-config.ts` places Coupons (Marketing) and Shipping Zones (Configuration) in groups without `adminOnly`. The full three-role live matrix was exercised in the Phase 4 report; no other-account credentials were on hand this run.
- **No-filter empty states** (*"No coupons found…"* / *"No shipping zones yet…"*) — cannot reach 0 rows with the seeded data; verified by inspection (`coupons/index.tsx:76`, `shipping-zones/index.tsx:72`). The filtered-empty variants were verified live.
- *(Resolved)* The initial pass ran only `bunx tsc --noEmit`; the **full `bun run build` was subsequently run** against the final working tree (after the E1 fix) — clean, exit 0, all 15 routes generated. No longer inspection-only.

## Next.js / console errors (primary focus)

**E1 — Intermittent hydration mismatch on Base UI `<DialogTrigger render={<Button>}>`.**
React logs *"A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up."* The diffed attribute is `data-slot`: server renders `data-slot="dialog-trigger"`, client renders `data-slot="button"` on the "New coupon" / "New zone" trigger button. Observed on **`/coupons`** (filtered-empty render, ~1–2s after load) and **`/shipping-zones`** (header trigger, populated). It is **intermittent** — repeat loads of the same URL sometimes log 0 errors — and the console header count reads too early to catch it (poll ~2s after load).
- Root: the shared `Button` (which stamps `data-slot="button"`) is passed to Base UI's `DialogTrigger render={…}`, whose own `data-slot="dialog-trigger"` should win; SSR and client disagree on the merge. Both feature roots also reuse a **single** trigger element across the header and empty-state dialogs (`coupons/index.tsx:41`, `shipping-zones/index.tsx:38`), which is what surfaces it on the empty state.
- Impact: **low/cosmetic** — the button works; only a `data-slot` attribute differs — but it is a genuine hydration **error** in the console, which is the primary focus of this pass.

**Fixed (2026-07-18, delegated to Codex).** `components/ui/dialog.tsx` — `DialogTrigger` now omits its own `data-slot="dialog-trigger"` **when a `render` prop is supplied**, letting the composed component own the single, deterministic slot (so `<DialogTrigger render={<Button>}>` renders `data-slot="button"` on both server and client); native (non-`render`) triggers still get `data-slot="dialog-trigger"`. This aligns with Base UI's `render` composition + rightmost-wins `mergeProps` semantics.
- **Selector audit**: no CSS/component selector depends on `[data-slot="dialog-trigger"]` or `[data-slot="button"]` (only the definition sites); nothing broke.
- **Re-verified live**: `/coupons?search=ZZZNOMATCH` (empty state) and `/shipping-zones` reloaded several times each with a ~2–3s post-hydration wait → **0 console errors** every time; the trigger now shows a single `data-slot="button"` with `aria-haspopup="dialog"` intact and still opens/closes its dialog. `bun lint` + `bunx tsc --noEmit` clean.
- **Related follow-up (not fixed)**: `components/ui/alert-dialog.tsx:15` (`AlertDialogTrigger`) has the same latent `render` + `data-slot` shape; it isn't rendered as a `<Button>` trigger at SSR on any current screen, so it doesn't manifest — worth the same one-line guard if it's ever used that way.

No other E-class defects: no "Rendered more hooks", no Server-Action errors, no `error.tsx` boundary trips, no router errors. The Base UI button-semantics error from Phase 3 (E1 there) did **not** recur.

## Bugs found
None functional. All CRUD, validation, lifecycle, filter, and error-path behaviors matched the contract and screen docs. (E1 above is a console/hydration defect, not a functional bug.)

## Observations (minor / polish — not blockers)
- The coupon **Edit** dialog's Expiry field showed `2026-06-30` for `SUMMER20` while the table shows `Jul 1, 2026` — a UTC-vs-local off-by-one in the date input's day (`coupon.expire.slice(0,10)` vs `formatDate`). Cosmetic.
- Coupon/zone form-error toasts and the duplicate/conflict toasts auto-dismiss quickly; only a `MutationObserver` reliably captured their text (noted for future QA tooling).

## Known noise (not Phase 5 defects)
- **Base UI "changing the default value state of an uncontrolled FieldControl"** — logged at error level whenever a coupon/zone **form dialog is opened**; the documented uncontrolled-default warning carried over from prior phases. Not triggered on plain list renders.
- **Clerk dev-keys warning** — the single standing console warning across every screen. Expected in development.
- No seed-image 404s on these screens (neither module renders images).

## Side effects of this QA run
- Created and then **deleted** a throwaway coupon `QA-TEST-CPN` (cleanup confirmed — list back to `SUMMER20`, `WELCOME15`).
- The **Nasr City** shipping zone was toggled inactive then back to active (state restored to `isActive: true`), but its `updatedAt` bumped from Jul 17 → **Jul 18, 2026** as a result. Harmless; no other field changed.
- Duplicate-create and redeemed/duplicate-delete attempts were **rejected by the backend** — no coupons/zones were created or removed by those.
- **Session left signed in as ADMIN** (`moghaly140`).

## Cleanup
- Test coupon `QA-TEST-CPN` deleted. No other test entities remain. In-page QA helpers (the toast `MutationObserver`) were disconnected and live only in the throwaway browser session.

## Recommendation
Phase 5 Coupons & Shipping Zones **passes QA** — all five acceptance criteria verified (four live; criterion 5 via `bun lint` + a full `bun run build`, both clean on the final working tree). CRUD, lifecycle rules, unlimited (∞) semantics, EGP formatting, governorate-wide labeling, inline toggle persistence, both 409 conflict paths, and URL-driven filtering all behave per the contract.

**Defect status (frontend):**
- **E1 — FIXED & re-verified.** The intermittent `data-slot` hydration mismatch on the `<DialogTrigger render={<Button>}>` "New coupon"/"New zone" triggers was resolved in `components/ui/dialog.tsx` (see the E1 section for the fix, selector audit, and live re-verification). No console errors remain on either screen.

**Follow-ups (not frontend blockers):**
- Live three-role verification of `/coupons` and `/shipping-zones` when MANAGER/USER credentials are available (gating confirmed by inspection this run).
- Consider longer-lived (or dismissible-only) error toasts so conflict messages are easier to read/verify.
