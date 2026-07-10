# Phase 7 — Dashboard Home & Analytics

## Goal

The two ADMIN-only read screens: the KPI dashboard at `/` and the five-tab analytics section. Both return plain **numbers** (not money strings). All recharts work lives here.

## Depends on

Phase 1 (middleware already gates these routes). Building after 2–6 is deliberate: real data exists to verify against.

## Consumes

[`integration/admin/01-dashboard.md`](../integration/admin/01-dashboard.md), [`02-analytics.md`](../integration/admin/02-analytics.md) · [`screens/01-dashboard.md`](../screens/01-dashboard.md), [`02-analytics.md`](../screens/02-analytics.md) · [`conventions/04-ui-and-styling.md`](../conventions/04-ui-and-styling.md#charts-recharts--dashboard--analytics-only)

## Tasks

### 1. `features/dashboard/` (`/`)

- [ ] `queries/get-dashboard-metrics.ts` — the single `GET /admin/dashboard/metrics` call.
- [ ] KPI cards with % delta vs. previous month (**guard `previous = 0`**); quick-stat cards linking to filtered screens.
- [ ] Revenue-by-day chart (fill missing days with 0) + orders-by-status chart (default absent statuses to 0).
- [ ] Recent orders table ("Guest" fallback, links to detail), top products, low-stock list.
- [ ] Skeleton `loading.tsx` matching the layout; optional manual refresh — **no polling < 60 s**.

### 2. `features/analytics/` (`/analytics`)

- [ ] `hooks/use-analytics-params.ts` — `from`, `to` (`YYYY-MM-DD`), `tab`. Preset buttons write concrete dates (no `range` param — the API has none).
- [ ] One query per tab (sales / products / customers / coupons / geography); only the active tab fetches.
- [ ] Axis labels formatted by the echoed `grouping` (day/week/month).
- [ ] Charts + tables per the screen spec; the paid-vs-all asymmetry is rendered as-is (never "corrected").
- [ ] `EmptyState` per chart for empty ranges; per-tab skeletons.

## Acceptance criteria

- [ ] MANAGER never sees these routes (nav + redirect) — regression-check phase 1 gating.
- [ ] Date-range changes are URL-shareable and re-fetch server-side.
- [ ] Charts use `--chart-*` CSS variables and `formatEGP` axes; both themes look right.
- [ ] Zero-data ranges render empty states, not broken axes; `previous = 0` KPI shows "—".
- [ ] `bun lint` and `bun run build` pass; [tracker](./README.md) updated.
