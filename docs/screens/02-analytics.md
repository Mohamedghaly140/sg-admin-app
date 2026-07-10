# 02 — Analytics (`/analytics`)

> **Access: ADMIN only.**
> API twin: [`../integration/admin/02-analytics.md`](../integration/admin/02-analytics.md)

Read-only analytics across five tabs — one endpoint per tab, all sharing the same date range. All values are plain JSON **numbers**.

## URL params (nuqs)

| Param | Notes |
|---|---|
| `from`, `to` | `YYYY-MM-DD`. Defaults (when absent): server uses `to = today`, `from = to − 30d`. **No range presets in the API** — preset buttons ("Last 7/30/90 days") are pure UI sugar that write concrete `from`/`to` values. |
| `tab` | Which tab is active: `sales` (default) \| `products` \| `customers` \| `coupons` \| `geography`. Client-side only. |

Date-range changes are URL-shareable and re-fetch server-side. Only the active tab's endpoint is called per render. The server picks the time bucket from the span and echoes it as `grouping` (`day`/`week`/`month`) — format axis labels accordingly.

> **Paid-vs-all asymmetry (by design, do not "fix"):** revenue/units are paid-only; order/redemption counts include all statuses. `totalOrders × avgOrderValue ≠ totalRevenue` is expected.

## Tabs

### Sales — `GET /admin/analytics/sales`
- KPI cards: `totalRevenue`, `totalOrders`, `avgOrderValue`, `totalDiscountApplied`.
- Line/area chart: `revenueOverTime` (bucketed by `grouping`).
- Bar or donut: `ordersByStatus`; `paymentMethodSplit` (all CASH today — render anyway).

### Products — `GET /admin/analytics/products`
- KPI cards: `totalUnitsSold` (range), `activeProductsCount`, `outOfStockCount` (both current-state, **not** range-bound — label them so).
- Table: `topProducts` (top 10 by paid units; link to `/products/[id]`).
- Bar chart: `revenueByCategory` — includes ALL categories, zero-revenue ones too.

### Customers — `GET /admin/analytics/customers`
- KPI cards: `totalCustomers` (all-time), `newThisPeriod`, `activeThisPeriod`.
- Chart: `newCustomersOverTime`.
- Table: `topSpenders` (top 10 by paid spend; link to `/customers/[id]`).

### Coupons — `GET /admin/analytics/coupons`
- KPI cards: `totalCoupons`, `totalRedemptions`, `totalDiscountGiven`.
- Table: every coupon with `usedCount`/`maxUsage` (0 = unlimited → "∞"), `expire`, `periodRedemptions`, `totalDiscountGiven`.

### Geography — `GET /admin/analytics/geography`
- Table or horizontal bar chart of `rows`: governorate, `orderCount`, `revenue`. Registered + guest orders merged; no-governorate orders excluded.

## Behavior & edge cases

- Malformed `from`/`to` → `422 VALIDATION_ERROR`; validate the date picker output before writing to the URL.
- Empty range → `EmptyState` per chart, not blank axes.
- Skeletons per tab in `loading.tsx`; charts per [UI conventions](../conventions/04-ui-and-styling.md#charts-recharts--dashboard--analytics-only).
- No polling.

## Actions

None — read-only.
