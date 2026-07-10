# 05 — Orders (`/orders`, `/orders/[id]`)

> **Access: MANAGER+.** Money fields are **strings**. All orders are **CASH** today (cards = backend Phase 7).
> API twin: [`../integration/admin/05-orders.md`](../integration/admin/05-orders.md)

**Explicitly out of scope** (no endpoints exist): refunds with money movement, manual order creation, editing order contents, un-marking paid, `verify-payment` (Phase 7, 404s today).

## List (`/orders`)

**Data:** `GET /admin/orders`.

**URL params (nuqs):** `status`, `paymentMethod`, `isPaid`, `search` (order number / customer name / email / phone — registered and guest), `from`, `to`, `page`, `limit`.

**Table columns:** `humanOrderId` (link to detail), customer (`customerName`, falls back to `"Guest"`), status badge, payment method, paid badge (`isPaid`), `itemsCount`, `totalOrderPrice` (formatEGP), created date.

**Toolbar:** debounced search, status select, isPaid select, date-range picker (`from`/`to`). This is also the **MANAGER landing page** after sign-in.

## Detail (`/orders/[id]`)

**Data:** `GET /admin/orders/:id`. Unknown id → `notFound()`.

An order is **either registered or guest** — render the customer panel from whichever side is present:

- **Registered:** `user` (name, email, phone — link to `/customers/[id]`) + `shippingAddress` (alias, country/governorate/city/area, address lines, phone, postal code).
- **Guest:** the `anon*` snapshot (`anonName`/`anonPhone`/`anonEmail` contact + `anonCountry` … `anonPostalCode` shipping); show a "Guest order" badge.

**Sections:**

- Header: `humanOrderId`, status badge, created date, payment method + paid state.
- Items table: image, name (link via `item.product.slug`/id to `/products/[id]`), color/size, quantity, `price` (snapshot), `lineTotal`.
- Totals card (all server-computed, display-only): `itemsSubtotal`, `discountApplied` (+ `coupon.name` when present), `shippingFees`, `totalOrderPrice`.
- Status control + mark-paid (below).

## Actions

| Action | Server Action → endpoint | UX / errors |
|---|---|---|
| Change status | `updateOrderStatus` → `PATCH /admin/orders/:id/status` | Body `{ status, notes? }` (`notes` ≤ 1000, **overwrites** existing notes). See the state machine below. `409 INVALID_STATUS_TRANSITION` → show the API's message. A status-change email goes to the customer automatically — say so in the confirm copy. |
| Mark paid | `markOrderPaid` → `PATCH /admin/orders/:id/mark-paid` | CASH only, **one-way — no un-mark**. `ConfirmDialog` with an explicit warning. Hidden once `isPaid`. `409 INVALID_STATUS_TRANSITION` when CARD / already paid / CANCELLED / REFUNDED. |

### Status control — drive the UI from the state machine

```
PENDING ──► PROCESSING ──► SHIPPED ──► DELIVERED ──► REFUNDED
   │             │
   └────────► CANCELLED ◄┘   (only while unpaid)
```

Only render the **legal next statuses** for the current state:

| Current | Offer |
|---|---|
| PENDING | Processing · Cancel (only if unpaid) |
| PROCESSING | Shipped · Cancel (only if unpaid) |
| SHIPPED | Delivered — **disabled on unpaid CASH orders** with hint "mark paid first" |
| DELIVERED | Refunded (stock restored, `sold` decremented — no money movement) |
| CANCELLED / REFUNDED | terminal — no actions |

Never offer the current status (re-sending it is a 409). Cancelling restores stock and releases coupon usage — mention it in the confirm copy.

## Edge cases

- REFUNDED is a bookkeeping state (CASH world) — no payment-gateway refund exists.
- `paymentMethodSplit`-style UI can assume CASH-only today but must not hard-code it — CARD arrives with backend Phase 7.
- Filtered-empty list vs. truly empty list → different `EmptyState` copy.
