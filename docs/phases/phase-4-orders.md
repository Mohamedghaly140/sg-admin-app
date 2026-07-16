# Phase 4 — Orders

## Goal

Order operations: list with filters, detail view (registered vs. guest), state-machine-driven status control, one-way mark-paid.

## Depends on

Phase 1 (phase 3 recommended first so order items link to real products).

## Consumes

[`integration/admin/05-orders.md`](../integration/admin/05-orders.md) · [`screens/05-orders.md`](../screens/05-orders.md)

## Out of scope (no endpoints — do not build)

Refunds with money movement · manual order creation · editing order contents · un-marking paid · `verify-payment` (backend Phase 7).

## Tasks

### 1. List (`/orders`)

- [x] `hooks/use-orders-params.ts` — `status`, `paymentMethod`, `isPaid`, `search`, `from`, `to`, `page`, `limit`.
- [x] `queries/get-orders.ts`; table per the screen spec (humanOrderId, customer w/ "Guest" fallback, status + paid badges, total, date).
- [x] Toolbar: debounced search, status/isPaid selects, date-range picker.

### 2. Detail (`/orders/[id]`)

- [x] `queries/get-order.ts`; unknown id → `notFound()`.
- [x] Customer panel: registered (`user` + `shippingAddress`) **xor** guest (`anon*` snapshot + "Guest order" badge).
- [x] Items table with price snapshots + product links; totals card (display-only, all server-computed, coupon line when present).

### 3. Actions

- [x] `update-order-status` — status control renders **only the legal next transitions** from the state machine (PENDING→PROCESSING, →CANCELLED while unpaid, PROCESSING→SHIPPED, SHIPPED→DELIVERED [CASH must be paid], DELIVERED→REFUNDED); optional `notes` (≤ 1000, overwrites); `409 INVALID_STATUS_TRANSITION` → API message. Confirm copy mentions the automatic customer email (and stock/coupon release on cancel).
- [x] `mark-order-paid` — `ConfirmDialog` with a **one-way** warning; hidden once paid; handles the 409 (CARD/paid/terminal).

## Acceptance criteria

- [x] The status control never offers an illegal transition or the current status.
- [x] "Delivered" is disabled on unpaid CASH orders with a "mark paid first" hint.
- [x] Mark-paid disappears once `isPaid`; cancelling is only offered while unpaid.
- [x] Guest orders render the full `anon*` contact + shipping snapshot correctly.
- [x] All list filters are URL-shareable; empty vs. filtered-empty states differ.
- [x] `bun lint` and `bun run build` pass; [tracker](./README.md) updated.

**Phase 4 signed off — 2026-07-17.** All acceptance criteria verified via Playwright against the live API across all three roles (ADMIN/MANAGER/USER), including the state machine over PENDING/PROCESSING/SHIPPED/DELIVERED, the Delivered-disabled-on-unpaid-CASH hint, mark-paid one-way guard, and the guest `anon*` panel. Full QA in [`docs/qa/phase-4-qa-report.md`](../qa/phase-4-qa-report.md).
