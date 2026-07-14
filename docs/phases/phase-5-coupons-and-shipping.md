# Phase 5 — Coupons & Shipping Zones

## Goal

Two small CRUD modules with distinct lifecycle rules.

## Depends on

Phase 1 (independent of 3/4 — reorder freely).

## Consumes

[`integration/admin/06-coupons.md`](../integration/admin/06-coupons.md), [`07-shipping-zones.md`](../integration/admin/07-shipping-zones.md) · [`screens/06-coupons.md`](../screens/06-coupons.md), [`07-shipping-zones.md`](../screens/07-shipping-zones.md)

## Tasks

### 1. `features/coupons/` (`/coupons`)

- [x] `hooks/use-coupons-params.ts` — `search`, `status` (lifecycle), `page`, `limit`.
- [x] Table with lifecycle badge computed by the API's exact semantics (active/expired/exhausted/deactivated), usage progress bar (`maxUsage 0` → ∞), `perUserLimit`.
- [x] Actions: `create-coupon` (uppercase-normalized code `^[A-Z0-9_-]{3,30}$`, discount 1–70, `maxUsage`/`perUserLimit` 0 = unlimited, future `expire`), `update-coupon` (past `expire` allowed = "expire now"), `deactivate-coupon` (**no reactivate exists — no re-enable toggle**), `delete-coupon`.
- [x] Errors: `409 DUPLICATE_RESOURCE` on code; `409 COUPON_IN_USE` on delete → toast offering "Deactivate instead".

### 2. `features/shipping-zones/` (`/shipping-zones`)

- [ ] `hooks/use-shipping-zones-params.ts` — `search`, `page`, `limit`.
- [ ] Table: country / governorate / city (`null` → "All cities (governorate-wide)") / fee (formatEGP) / active badge.
- [ ] Actions: `create-shipping-zone`, `update-shipping-zone` (incl. `isActive` toggle), `delete-shipping-zone` (confirm warns the area becomes un-checkout-able).
- [ ] Errors: `409 DUPLICATE_RESOURCE` on the `(country, governorate, city)` combination.

## Acceptance criteria

- [ ] Deactivated coupon stays visible with the Deactivated badge; no re-enable control anywhere.
- [ ] Deleting a redeemed coupon shows the specific conflict message + deactivate suggestion.
- [ ] Coupon codes display uppercased after create regardless of input case.
- [ ] Zone fees render as EGP strings, no float math; governorate-wide rows are labeled.
- [ ] `bun lint` and `bun run build` pass; [tracker](./README.md) updated.
