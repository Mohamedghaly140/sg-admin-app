# 06 — Coupons (`/coupons`)

> **Access: MANAGER+.** `discount` is a **string** percent (`"20.00"`).
> API twin: [`../integration/admin/06-coupons.md`](../integration/admin/06-coupons.md)

## List

**Data:** `GET /admin/coupons`.

**URL params (nuqs):** `search`, `status` (derived lifecycle: `active | expired | exhausted | deactivated`), `page`, `limit`.

**Table columns:** code (`name`, monospace), discount %, usage — `usedCount` / `maxUsage` as a progress bar (`maxUsage = 0` → "∞", no bar), `perUserLimit` (0 → "∞"), expiry date, lifecycle **status badge** computed with the API's exact semantics:

| Badge | Condition |
|---|---|
| Active | `isActive` AND not expired AND (`maxUsage = 0` OR `usedCount < maxUsage`) |
| Expired | `expire <= now` |
| Exhausted | `maxUsage > 0` AND `usedCount >= maxUsage` |
| Deactivated | `isActive = false` |

## Actions

| Action | Server Action → endpoint | UX / errors |
|---|---|---|
| Create | `createCoupon` → `POST /admin/coupons` | Dialog: `name` (normalized UPPERCASE server-side, `^[A-Z0-9_-]{3,30}$` — uppercase the input live), `discount` (1–70 %), `maxUsage` (int ≥ 0, **0 = unlimited**), `perUserLimit` (int ≥ 0, 0 = unlimited, default 1), `expire` (**must be future on create**). `409 DUPLICATE_RESOURCE` → "This code already exists". |
| Edit | `updateCoupon` → `PATCH /admin/coupons/:id` | Same dialog prefilled. **`expire` may be set in the past** here — that immediately expires the coupon (offer it as "expire now"). Same 409 on rename collision. |
| Deactivate | `deactivateCoupon` → `PATCH /admin/coupons/:id/deactivate` | `ConfirmDialog`: "This cannot be re-enabled — create a new coupon instead." **There is no reactivate endpoint by design — do not build a re-enable toggle.** Row stays visible with the Deactivated badge. |
| Delete | `deleteCoupon` → `DELETE /admin/coupons/:id` | `ConfirmDialog`; 204 on success. `409 COUPON_IN_USE` (`usedCount > 0`) → error toast **offering "Deactivate instead"** (order history must be preserved). |

## Rules

- `usedCount` is server-owned — read-only, never sent.
- Deactivate ≠ delete ≠ expire: three distinct lifecycle actions; keep them visually separate in the row menu.
- Empty state: `EmptyState` with "New coupon".
