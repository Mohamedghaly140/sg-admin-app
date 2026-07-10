# 07 — Shipping Zones (`/shipping-zones`)

> **Access: MANAGER+.** `fee` is a **string** (`"65.00"`, EGP).
> API twin: [`../integration/admin/07-shipping-zones.md`](../integration/admin/07-shipping-zones.md)

The only "settings"-like screen with a live backend. A zone is `(country, governorate, city?)` → flat delivery fee. **`city = null` means governorate-wide**; a row with a `city` is a more specific override — checkout picks the most-specific active match.

> There is no store-info or tax-configuration screen: those have **no backend endpoints**. Do not build them.

## List

**Data:** `GET /admin/shipping-zones`.

**URL params (nuqs):** `search` (country/governorate/city), `page`, `limit`.

**Table columns:** country, governorate, city (**`null` → "All cities (governorate-wide)"**), fee (formatEGP), active badge (`isActive`), updated date.

## Actions

| Action | Server Action → endpoint | UX / errors |
|---|---|---|
| Create | `createShippingZone` → `POST /admin/shipping-zones` | Dialog: `country` (required), `governorate` (required), `city` (optional — omit for governorate-wide), `fee` (≥ 0, ≤ 2 decimals), `isActive` (default true). `409 DUPLICATE_RESOURCE` → "A zone for this country/governorate/city already exists". |
| Edit | `updateShippingZone` → `PATCH /admin/shipping-zones/:id` | Same dialog prefilled; includes the `isActive` toggle. Same 409 on collision. |
| Toggle active | `updateShippingZone` (same PATCH, `{ isActive }`) | Switch in the row; prefer this over delete for temporary suspensions. |
| Delete | `deleteShippingZone` → `DELETE /admin/shipping-zones/:id` | `ConfirmDialog` with warning: hard delete, no referential block (past orders keep their fee snapshot), **but removing the only zone covering an area makes it un-checkout-able for customers**. 204 on success. |

## Rules

- Group or sort rows by governorate so overrides sit under their governorate-wide row.
- Empty state: `EmptyState` — "No shipping zones yet. Customers can't check out without at least one active zone."
