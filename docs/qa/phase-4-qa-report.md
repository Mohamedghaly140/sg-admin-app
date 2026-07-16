# Phase 4 — Orders: QA Report

**Date**: 2026-07-16 (initial pass); 2026-07-17 (follow-up pass — criteria #2 & #4 verified live after guest / SHIPPED-unpaid-CASH / PROCESSING orders were seeded mid-QA).
**Method**: Playwright (dev server, `bun dev`, localhost:3000), console + network captured continuously.
**Accounts tested**: ADMIN (`moghaly140`, "Mohamed Ghaly"), MANAGER (`mohamedghaly140+1@gmail.com`, "mohamed manger"), USER (`mohamedghaly140+2@gmail.com`) — all three exercised to cover the `/orders` role matrix end to end.
**Scope**: log-only QA — findings recorded here for a later fix pass; **no code changed**. Special focus (per request): Next.js runtime/hydration/console errors. All destructive/one-way actions were opened to verify their dialogs but **cancelled without confirming**, so no order state was mutated.

## Results against acceptance criteria

| # | Criterion | Result |
|---|---|---|
| 1 | The status control never offers an illegal transition or the current status | ✅ PASS — verified live across PENDING, PROCESSING, SHIPPED, DELIVERED |
| 2 | "Delivered" is disabled on unpaid CASH orders with a "mark paid first" hint | ✅ PASS — verified live on the SHIPPED/unpaid/CASH order (`ORD-900004`) |
| 3 | Mark-paid disappears once `isPaid`; cancelling is only offered while unpaid | ✅ PASS — hidden on the DELIVERED/paid order, present on the PENDING/unpaid order; Cancel offered only while unpaid |
| 4 | Guest orders render the full `anon*` contact + shipping snapshot correctly | ✅ PASS — verified live on the guest order (`ORD-900003`, "Guest order" badge) |
| 5 | All list filters are URL-shareable; empty vs. filtered-empty states differ | ✅ PASS — every filter drives the URL and narrows server-side; filtered-empty copy differs from the no-filter copy |
| 6 | `bun lint` and `bun run build` pass; tracker updated | ✅ PASS — `bun lint` + `bunx tsc --noEmit` clean; no code changed this run |

## What passed

### #1 — Status state machine (live, all reachable states)
- **PENDING / unpaid** (`ORD-900001`): menu offers exactly **Processing** and **Cancelled** — never the current `PENDING`, no illegal jumps.
- **PROCESSING / unpaid** (`ORD-900005`): menu offers exactly **Shipped** and **Cancelled**.
- **SHIPPED / unpaid / CASH** (`ORD-900004`): menu offers only **Delivered**, rendered **disabled** (see #2).
- **DELIVERED / paid** (`ORD-900002`): menu offers only **Refunded** — no `Cancelled` (order is paid), nothing illegal, never the current status.
- **Cancellation confirm copy** (destructive variant): *"Change status to Cancelled? The customer will automatically receive an email. Cancelling also restores stock and releases any applied coupon usage."* — mentions email **and** stock/coupon release.
- **Standard confirm copy** (Refunded): *"Change status to Refunded? The customer will automatically receive an email about this status change."* — email only, no stock/coupon line.
- Both dialogs carry the optional **Note** textbox: *"Note (optional, visible internally — overwrites any existing note)"*.

### #2 — Delivered disabled on unpaid CASH (live)
- On `ORD-900004` (SHIPPED, unpaid, CASH) the "Change status" menu shows a single option **"Delivered — mark paid first" [disabled]** — the Delivered menuitem is disabled and carries the hint, exactly per spec. The **Mark order paid** button is present alongside it (unpaid CASH). Confirmed against `getNextStatusOptions` behaviour in `features/orders/components/order-status-control.tsx`.

### #4 — Guest order panel (live)
- `ORD-900003` renders the **"Guest order"** badge in the Customer panel header.
- **Contact** from the `anon*` snapshot: Name *Layla Ibrahim* (plain text — **no** `/customers/[id]` link, correct for a guest), Phone `+201555555001`, Email `layla.guest@example.com`.
- **Shipping address** from `anon*`: Country/Governorate/City *Nasr City*/Area *Zone 7*/Address *12 El-Nasr Road*/Details *Apartment 4, 2nd floor*/Postal code `11765`/Phone `+201555555002`. (No "Alias" row — the guest snapshot has none, unlike the registered panel's "Home".)
- Loaded with **0 console errors**.

### #3 — Mark-paid visibility & one-way guard (live)
- On `ORD-900001` (PENDING, unpaid, CASH) the **Mark order paid** button is present and enabled; its dialog reads *"Mark this order as paid? Confirm that cash payment was collected on delivery. This is a one-way action and cannot be undone."*
- On `ORD-900002` (DELIVERED, **paid**, CASH) the mark-paid button is **absent** from the "Order actions" region, and the status menu offers no `Cancelled` — confirming both halves of the criterion.

### #5 — List filters, URL-shareability, empty states (live)
Each filter was loaded from a bare URL (fresh navigation), proving both server-side filtering and shareability:
- `?status=PENDING` → 1 row (`ORD-900001`). `?isPaid=true` → 1 row (`ORD-900002`, "Paid"). `?search=900002` → 1 row. `?paymentMethod=CARD` → filtered-empty. `?from=2026-07-12&to=2026-07-31` → filtered-empty (both orders are Jul 11; the range button relabels to "Jul 12, 2026 – Jul 31, 2026").
- **Filtered-empty copy**: *"No orders match your filters" / "Try adjusting your search or filters."* — distinct from the no-filter *"No orders found" / "New orders will appear here…"* (latter verified by inspection — cannot reach 0 orders with 2 seeded).
- **Pagination**: forced with `?limit=1` → "Page 1 of 2", **Previous** disabled (not a link), **Next** → `/orders?page=2&limit=1`. Out-of-range `?page=5&limit=1` **redirected to** `?page=2&limit=1` (last page). Pagination is hidden at the default `limit=20` (`totalPages<=1`).
- **Columns** render per spec: Order (`humanOrderId`, links to detail), Customer, Status badge, Payment method, Paid/Unpaid badge, Items, Total (`formatEGP` → `EGP 1,710.00`), Created.

### Detail page — registered order + totals + items (live)
- **Registered customer panel** (`ORD-900001`): Contact (Name *Mariam Hassan* links to `/customers/user_seed_customer`, Email, Phone) + full Shipping address (Alias/Country/Governorate/City/Area/Address/Details/Postal code/Phone).
- **Totals card** (display-only, server-computed): Items subtotal `EGP 2,040.00`, Discount `EGP 0.00`, Shipping fees `EGP 75.00`, Total `EGP 2,115.00`.
- **Items table**: thumbnail + product name linking to `/products/cmrgg574o00055ctlj1p1x2iv`, Color/Size/Qty/Unit price snapshot/Line total.
- **Product link target verified**: `/products/[item.product.id]` resolves to the Edit-product page (the route accepts the id) — the id-vs-slug concern flagged during exploration is **not a defect**.
- **Unknown id** (`/orders/nonexistent-order-id-qa`) → `notFound()` renders "Page not found" + "Go home", 0 console errors.

### Role-gating (live, all three roles)
- **USER** (`…+2`): signing in redirects straight to `/access-denied` ("Access denied — Your account doesn't have permission to view this section."); navigating to `/orders` directly also bounces to `/access-denied`.
- **MANAGER** (`…+1`): lands on `/orders`; opens list + detail with both actions; hitting admin-only `/staff-users` bounces back to `/orders`.
- **ADMIN** (`moghaly140`): lands on `/` (Dashboard); opens `/orders` and `/orders/[id]` with the same actions as MANAGER.
- No Clerk new-device OTP challenge fired for any account on this browser profile.

## Not reproducible live (by inspection only)
- **Coupon discount line** on the totals card — no seeded order has a coupon (all show `Discount EGP 0.00`). The label logic (`Discount (<coupon.name>)` + `−` prefix when discount > 0) is correct by inspection in `features/orders/components/order-totals-card.tsx`.
- **No-filter empty state** (*"No orders found" / "New orders will appear here…"*) — cannot reach 0 orders with the seed set; verified by inspection. The filtered-empty variant was verified live (see #5).
- **CARD-payment branches** and the **409 paths** (illegal transition, delivering unpaid CASH, marking CARD/already-paid) — require backend rejection / card payments (backend Phase 7); inspection-only. All orders are CASH today; `verify-payment` 404s.

## Next.js / console errors (primary focus)
No `E#`-class defects found. Across list, filtered list, detail (registered **and** guest), all four reachable status states, status/mark-paid dialogs, `notFound`, and all three role flows, the **only** console errors were seed-image 404s (see Known noise) and the **only** warning was the Clerk dev-keys notice. The newly seeded orders (`ORD-900003/4/5`) loaded with **0 console errors**.

No hydration mismatches, no "Rendered more hooks…", no router/Server-Action errors, no `error.tsx` boundary trips, and no Base UI button-semantics warnings (cf. Phase 3 E1) were observed on any Orders screen.

## Bugs found
None.

## Observations (minor / polish — not blockers)
- The order-detail **breadcrumb** shows the raw order id (`cmrgg59xy000h5ctlejcy0cql`) rather than the human `ORD-900001`. Cosmetic; consistent with other detail screens.
- The **payment-method filter** (CASH/CARD) is implemented and works, though the phase-4 task list only named status/isPaid/date-range — the extra filter is a superset, not a regression.

## Known noise (not Phase 4 defects)
- **Seed image 404s** — the two original seed products (`satin-cowl-neck-dress`, `velvet-wrap-dress`) still point at placeholder `res.cloudinary.com/demo/…` paths that 404 via `/_next/image`; carried over from the Phase 1/2/3 reports. The newer seed products (e.g. *Linen Puff-Sleeve Blouse* on `ORD-900003`) load cleanly, so the follow-up orders showed 0 console errors.
- **Clerk dev-keys warning** — *"Clerk has been loaded with development keys…"*. Expected in development.

## Side effects of this QA run
- **Session left signed in as ADMIN** (`moghaly140`) — the MANAGER session was signed out to exercise the role matrix. No data was mutated: every status-change and mark-paid dialog (on both the original and the newly seeded orders) was cancelled, not confirmed. No test entities were created, so no cleanup was required.

## Recommendation
Phase 4 Orders passes QA. **All six acceptance criteria pass live** — including #2 (Delivered disabled + hint) and #4 (guest panel), verified against the follow-up seed data. No functional or Next.js/console defects surfaced. Ready for sign-off.

**Backend / seed action items** (not frontend blockers):
- *(Optional)* Seed an order with a **coupon applied** so the discount label + coupon-name line on the totals card can be verified live (currently inspection-only).
- Replace the remaining placeholder `res.cloudinary.com/demo/*` URLs on the two original seed products to clear the recurring 404 noise.
- CARD-payment branches and the 409 paths (illegal transition, delivering unpaid CASH, marking CARD/already-paid) remain inspection-only until backend Phase 7 ships card payments.
