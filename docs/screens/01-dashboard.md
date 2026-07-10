# 01 — Dashboard Home (`/`)

> **Access: ADMIN only** (middleware redirects MANAGERs to `/orders`; the API returns 403 regardless).
> API twin: [`../integration/admin/01-dashboard.md`](../integration/admin/01-dashboard.md)

Read-only overview of the store. **One endpoint powers the whole page**: `GET /admin/dashboard/metrics` — a single `queries/get-dashboard-metrics.ts` call, no other data fetching. All values are plain JSON **numbers**.

## Layout

```
┌ KPI row ───────────────────────────────────────────────────────┐
│ Revenue | Orders | New customers | Avg order value             │  ← {current, previous} cards
├ Quick stats ───────────────────────────────────────────────────┤
│ Pending orders · Low stock count · Active coupons              │  ← single-number cards, linked
├────────────────────────────┬───────────────────────────────────┤
│ Revenue by day (30d chart) │ Orders by status (chart)          │
├────────────────────────────┴───────────────────────────────────┤
│ Recent orders (table, 10)  │ Top products (5) │ Low stock list │
└────────────────────────────────────────────────────────────────┘
```

## Rendering rules (from the API field notes)

| Section | Source field | Rules |
|---|---|---|
| KPI cards | `revenue`, `orders`, `newCustomers`, `avgOrderValue` | Each is `{ current, previous }` = current month-to-date vs. full previous month. Show % delta vs. previous; **guard `previous = 0`** (show "—", not `Infinity`). Revenue/AOV count paid orders only. |
| Quick stats | `pendingOrders`, `lowStockCount`, `activeCoupons` | Link to `/orders?status=PENDING`, the low-stock list anchor, and `/coupons`. |
| Revenue chart | `revenueByDay` | Trailing 30 days, ascending dates; **fill missing days with 0** before charting. |
| Status chart | `ordersByStatus` | All-time counts; **default absent statuses to 0** so all six statuses render. |
| Recent orders | `recentOrders` | 10 most recent, any status. `customerName` falls back to `"Guest"`. Rows link to `/orders/[id]`. Columns: humanOrderId, customer, status badge, payment method, total, date. |
| Top products | `topProducts` | Top 5 by all-time paid revenue: thumbnail (`imageUrl`), name, category, revenue, units. Link to `/products/[id]`. |
| Low stock | `lowStockProducts` | `quantity < 10` and ACTIVE, ascending, max 20. Link to `/products/[id]`. Highlight quantity ≤ 2. |

## Behavior

- No URL params, no filters — the server computes all windows from "now".
- Refresh: on navigation/focus or a manual refresh button. **No polling faster than 60 s** (global rate limit).
- Loading: skeleton grid matching the layout above (`loading.tsx`).
- Charts follow [UI conventions](../conventions/04-ui-and-styling.md#charts-recharts--dashboard--analytics-only): CSS-variable colors, `formatEGP` axes, empty-state handling.

## Actions

None — this screen is read-only.
