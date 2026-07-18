# 03 — URL State (nuqs)

All filter, pagination, sort, and search state lives in the URL via **nuqs v2** — shareable, bookmarkable, and readable server-side. Never `useState` for any of it.

## Pattern: one schema per feature, used on both sides

```ts
// features/orders/hooks/use-orders-params.ts
import { createSearchParamsCache, parseAsInteger, parseAsString } from "nuqs/server";
import { useQueryStates } from "nuqs";
import { parseAsApiDate } from "@/lib/nuqs-parsers";

export const ordersParams = {
  status: parseAsString.withDefault(""),
  paymentMethod: parseAsString.withDefault(""),
  search: parseAsString.withDefault(""),
  from: parseAsApiDate.withDefault(""),
  to: parseAsApiDate.withDefault(""),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(20),
};

// Server Components: parse searchParams
export const loadOrdersParams = createSearchParamsCache(ordersParams);

// Client Components: read + write
export const useOrdersParams = () =>
  useQueryStates(ordersParams, { shallow: false });
```

- **`shallow: false` is required** on client writers — it makes URL changes hit the server so Server Components re-fetch. Without it, filters change the URL but not the data.
- Server side: `page.tsx` awaits `loadOrdersParams(searchParams)` and passes typed params to the feature, which forwards them to its `queries/` functions.

```tsx
// features/orders/components/orders-status-filter.tsx
"use client";
const [{ status }, setParams] = useOrdersParams();
// changing any filter resets the page:
setParams({ status: next, page: 1 });
```

## Conventions

- **Param names match the API contract exactly** — the URL param is the query param sent to the API. Check the feature's `integration/admin/` doc before naming anything.
- **Date params never use plain `parseAsString`** (`lib/nuqs-parsers.ts`) — it validates the format and falls back to the default on anything malformed (e.g. a hand-edited or stale URL), so an invalid date never reaches the API as an unvalidated string. Plain `parseAsString` on a date param lets a 422 `VALIDATION_ERROR` propagate uncaught to `error.tsx` (`lib/api/handle-auth-error.ts` only maps auth-shaped codes). Which parser depends on the endpoint's documented date format (`integration/admin/00-conventions.md#data-formats`):
  - **`parseAsDateOnly`** — strictly `YYYY-MM-DD` only. Use only where the feature's API doc narrows dates to date-only, e.g. Analytics.
  - **`parseAsApiDate`** — `YYYY-MM-DD` **or** a full ISO 8601 UTC datetime (`2026-07-09T12:00:00.000Z`). Use for `createdAt`-range filters under the general "Dates are ISO 8601 UTC strings" convention, e.g. Orders — a date-only-only parser would silently drop a documented-valid timestamp value.
- **Reset `page` to 1** whenever any other filter changes.
- Defaults are explicit via `.withDefault(...)`; empty string = "no filter" → **omit** the param from the API call (don't send `status=`).
- Debounce free-text `search` inputs (~300 ms) before writing to the URL.
- `NuqsAdapter` (from `nuqs/adapters/next/app`) wraps the app once in `app/layout.tsx` — phase 1.

## Params per screen (from the API contract)

| Screen | Params | API doc |
|---|---|---|
| Products | `search`, `status`, `categoryId`, `featured`, `page`, `limit` | [§03](../integration/admin/03-products.md) |
| Categories | `search`, `page`, `limit` | [§04](../integration/admin/04-categories.md) |
| Orders | `status`, `paymentMethod`, `isPaid`, `search`, `from`, `to`, `page`, `limit` | [§05](../integration/admin/05-orders.md) |
| Coupons | `search`, `status` (lifecycle filter), `page`, `limit` | [§06](../integration/admin/06-coupons.md) |
| Shipping zones | `search`, `page`, `limit` | [§07](../integration/admin/07-shipping-zones.md) |
| Customers | `search`, `active`, `page`, `limit` | [§08](../integration/admin/08-customers.md) |
| Staff users | `search`, `role`, `active`, `page`, `limit` | [§09](../integration/admin/09-staff-users.md) |
| Analytics | `from`, `to` (`YYYY-MM-DD` — no API range preset; the server derives grouping), `tab` (UI-only; not sent to the API) | [§02](../integration/admin/02-analytics.md) |

If a param above disagrees with the feature's `integration/admin/` doc, the API doc wins — update this table.
