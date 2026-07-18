# Phase 7 — Dashboard Home & Analytics: QA Report

**Date**: 2026-07-18
**Method**: Playwright (dev server, `bun dev`, localhost:3000), console + network captured continuously; console polled ~2–3s after each load to catch post-hydration errors.
**Accounts tested**: ADMIN (`mohamed ghaly`, `ghaly+clerk_test@example.com`) — drove both screens end to end, including direct-URL reloads, tab switches, date-range changes, and both themes. MANAGER/USER access verified by inspection (middleware + nav config); no other-account credentials were available for a live sign-in this run.
**Scope**: Both screens are fully read-only (no Server Actions, no mutations) — no destructive-action caveat applies. Special focus (per repo convention): Next.js runtime/hydration/console errors.

## Results against acceptance criteria

| # | Criterion | Result |
|---|-----------|--------|
| 1 | MANAGER never sees `/` or `/analytics` (nav + redirect) — regression-check phase 1 gating | ✅ PASS (inspection) — `proxy.ts:9,40-51`: `/`, `/analytics`, `/staff-users` are `ADMIN_ONLY_ROUTES`; non-ADMIN staff on any of them redirect to `/orders`. `nav-config.ts:29-36`: the "Overview" group (Dashboard + Analytics) is `adminOnly: true`, filtered out for non-ADMIN in `app-sidebar.tsx:18`. As ADMIN, both nav items are present and both routes load. |
| 2 | Date-range changes are URL-shareable and re-fetch server-side | ✅ PASS (live) — clicking "Last 7 days" wrote `?from=2026-07-12&to=2026-07-18` to the URL; a **hard reload** of that exact URL (`page.goto`) reproduced the correct 7-day-scoped data (different KPI values than the 30-day default), confirming a fresh server render, not a client cache. |
| 3 | Charts use `--chart-*` CSS variables and `formatEGP` axes; both themes look right | ✅ PASS (live + inspection) — `revenue-chart.tsx:40`, `orders-status-chart.tsx:34`, and all analytics chart configs use `var(--chart-1)`/`var(--chart-2)`. Dashboard and Analytics both screenshotted in light and dark; axes, gridlines, and card backgrounds all render with correct contrast in both themes, 0 console errors on toggle. `formatEGP` used on revenue/geography Y-axes and tables. |
| 4 | Zero-data ranges render empty states, not broken axes; `previous = 0` KPI shows "—" | ✅ PASS (live) — Dashboard: all 4 KPI cards show "—" live (seed's previous-month data is 0), matching the guard in `kpi-cards.tsx:91-97` (`getPercentageDelta` returns `null` when `metric.previous === 0`, rendered as `delta === null ? "—" : …`). Analytics: a forced empty range (`2020-01-01`–`2020-01-07`) rendered `EmptyState` on **every** chart across Sales and Products tabs ("No revenue data", "No order status data", "No payment method data", "No category revenue data") — no broken/blank axes anywhere. |
| 5 | `bun lint` and `bun run build` pass; tracker updated | ✅ PASS — `bun lint` clean (no output, exit 0). `bun run build` clean: TypeScript passed, 15/15 static pages, all routes including `/` and `/analytics` compiled. `docs/phases/README.md` already shows Phase 7 as ✅ done — no change needed. |

## What passed

### #1 — ADMIN-only route gating (inspection)
`proxy.ts:9` lists `/`, `/analytics`, `/staff-users` in `ADMIN_ONLY_ROUTES`; `proxy.ts:48-51` redirects any authenticated non-ADMIN staff off those routes to `/orders`. `nav-config.ts:29-36` and `:61-65` both use `adminOnly: true` on their group, enforced by the identical filter in `app-sidebar.tsx:18`. This is the same pattern verified for Staff Users in Phase 6 — no regression.

### #2 — URL-shareable, server-refetched date range (live)
`?from=2026-07-12&to=2026-07-18` (from the "Last 7 days" preset) was reloaded via a fresh `page.goto`. The Sales tab showed **EGP 0.00** total revenue and 3 orders (all unpaid, all outside the one paid order's date) — visibly different from the 30-day default (**EGP 1,710.00**, 5 orders) — proving the server re-executed the query for the URL's params rather than serving a cached client view. Only the active tab's Server Component renders per `features/analytics/index.tsx:31-47` (`renderActiveTab` switch), so only one endpoint fires per navigation.

### #3 — Chart CSS vars + both themes (live)
Screenshotted Dashboard and Analytics in light and dark (toggle via the theme button, confirmed `document.documentElement` class flips `light`/`dark`). Both render cleanly: dark backgrounds use the app's dark card/border tokens, chart lines/bars/axis text stay legible, `formatEGP` axis labels (`EGP 1,800.00`, etc.) render correctly in both themes. 0 console errors across every toggle.

### #4 — Zero-data empty states + `previous=0` guard (live)
Dashboard KPI guard: `kpi-cards.tsx:91-97` returns `null` when `metric.previous === 0`; the live seed has 0 revenue/orders/customers/AOV in the "previous month" window, so **all four** KPI cards show "—" instead of a delta, live, on first load — no `Infinity` or `NaN` anywhere.
Analytics empty range: navigating to `?from=2020-01-01&to=2020-01-07` (a window with zero orders) rendered `EmptyState` components on every chart in Sales (revenue-over-time, orders-by-status, payment-methods) and Products (revenue-by-category) tabs, each with distinct copy ("No revenue data", "No order status data", etc.) — confirmed via `EmptyState` usage in `revenue-over-time-chart.tsx`, `orders-by-status-chart.tsx` (analytics), `payment-method-chart.tsx`, `revenue-by-category-chart.tsx`.

### Additional live coverage (beyond the 5 criteria)

**Dashboard (`/`)**
- KPI row: Revenue, Orders, New customers, AOV all render live values (`EGP 1,710.00`, `5`, `3`, `EGP 1,710.00`) with correct `formatEGP` on money fields.
- Quick stats: "Pending orders" → `/orders?status=PENDING` (live click), "Low-stock products" → `#low-stock` in-page anchor (live click, scrolls to card), "Active coupons" → `/coupons` (live click) — all 0 console errors.
- Revenue-by-day chart: `fillRevenueGaps` (`revenue-chart.tsx:133-152`) fills all 30 trailing days with 0 before charting — live chart showed a continuous 12-tick axis (Jun 19–Jul 18) with only one non-zero day (Jul 11), matching the seed.
- Orders-by-status chart: `withDefaultOrderStatuses` (`orders-status-chart.tsx:118-129`) defaults absent statuses to 0 — live chart rendered all 6 statuses (Pending 2, Processing 1, Shipped 1, Delivered 1, Cancelled 0, Refunded 0).
- Recent orders (5 seeded, all shown, under the 10-row cap): links to `/orders/[id]`, status badges, `CASH` payment, `formatEGP` totals, `formatDateTime` timestamps. `customerName || "Guest"` fallback confirmed in code (`recent-orders-table.tsx:75`) — not exercised live (no guest orders in seed).
- Top products: 1 row (Velvet Wrap Dress, Dresses, EGP 1,620.00, 1 unit), links to `/products/[id]`, thumbnail rendered.
- Low-stock list: 1 row (Pleated Chiffon Gown, 6 left, Dresses · ACTIVE), links to `/products/[id]`. The `quantity ≤ 2` "critical" highlight (`bg-destructive/5` + destructive badge, `low-stock-list.tsx:36,43,57`) was **not** live-exercised — no seeded product at that threshold — verified by inspection only.
- Manual refresh: `dashboard-metrics.tsx:25-29` uses `useTransition` + `router.refresh()` — no `setInterval`/polling anywhere in the component; button live-clicked, re-rendered cleanly, 0 console errors. Satisfies "no polling < 60s" (there's no polling at all).
- No client-visible `/admin/dashboard/metrics` network request — confirms the read happens server-side in the Server Component, per architecture convention.

**Analytics (`/analytics`)**
- **Products tab**: "Active products (current)" = 4 and "Out of stock (current)" = 0 — labels correctly flag these as current-state, not range-bound, per the screen spec. "Revenue by category" correctly lists **both** `Dresses` (EGP 1,620.00) and the zero-revenue `Separates` (EGP 0.00) — confirms all categories render, not just ones with sales.
- **Customers tab**: `Total customers (all time)` = 3, `New customers (in range)` = 3, `Active customers (in range)` = 1; "Top spenders" table links to `/customers/[id]`.
- **Coupons tab**: both seeded coupons rendered with lifetime usage (`1 / 100`, `0 / 50`), period redemptions, discount given, expiry. The `maxUsage === 0 → "∞"` branch (`coupons-table.tsx:58-60`) was **not** live-exercised — no unlimited coupon in the seed — verified by inspection only.
- **Geography tab**: table + horizontal bar charts (Orders, Revenue) for `Cairo`, `formatEGP` on the revenue axis.
- **Grouping-based axis labels**: `formatGroupingAxisLabel` (`utils.ts:23-32`) switches to `formatMonthYear` when `grouping === "month"`, else `formatDayMonth`. Live-observed day-level labels on the 7/30-day ranges and a week-anchored label (`Jul 6`) on the 90-day range; the `month` branch wasn't reachable live (would need a much wider seeded date range) — verified by inspection.
- **Paid-vs-all asymmetry**: Sales tab correctly showed `Total orders (all statuses) = 5` vs `Total revenue (paid) = EGP 1,710.00` (only 1 of 5 orders is paid) — rendered as-is, not "corrected," per spec.
- Tab switching preserves the active date-range query params (confirmed: switching tabs while on the empty 2020 range kept `from`/`to` in the URL).

## Not reproducible live (by inspection only)

- **MANAGER/USER role-gating for `/` and `/analytics`** — no non-ADMIN credentials this run; `proxy.ts` + `nav-config.ts` verified by inspection (same pattern confirmed live-correct for ADMIN in Phases 1 and 6).
- **Low-stock "critical" highlight** (`quantity ≤ 2`) — no seeded product at that threshold.
- **Coupon `maxUsage === 0 → "∞"`** — no seeded unlimited coupon.
- **Month-grouping axis label branch** — no seeded range wide enough to force month bucketing from the server.

## Next.js / console errors (primary focus)

**One genuine defect found and fixed in this session**, plus one environmental false-positive (documented and dismissed below).

### Defect (fixed): malformed `from`/`to` crashed to the generic error boundary
Navigating directly to `/analytics?from=not-a-date&to=2026-07-18` (a plausible real-world path — a stale bookmark, a shared link, manual URL editing, or browser autofill) threw an uncaught `ApiError: Validation failed` (422 `VALIDATION_ERROR` from the backend), logged **3 console errors**, and rendered the generic `error.tsx` boundary ("Something went wrong / An unexpected error occurred. Please try again.") instead of a scoped, friendly message.

**Root cause**: every analytics tab component (`sales-tab.tsx:18-22`, `products-tab.tsx:16-20`, and the customers/coupons/geography tabs follow the identical pattern) did:
```ts
try {
  response = await getXAnalytics(params);
} catch (error) {
  handleAuthError(error);
}
```
`handleAuthError` (`lib/api/handle-auth-error.ts:11-26`) only maps auth-shaped codes: `RESOURCE_NOT_FOUND → notFound()`, `FORBIDDEN → redirect("/access-denied")`, plus the 401 redirect. Any other `ApiError` — including `VALIDATION_ERROR` — falls through the `default: throw error;` branch (line 24) and propagated uncaught, tripping the nearest `error.tsx`.

**Not reachable through normal UI use**: the date-picker (`analytics-toolbar.tsx:59-66`) validates every selection with `parseDateOnly` before ever calling `setParams`, so the picker itself cannot write a malformed date to the URL — this satisfies the screen spec's literal instruction ("validate the date picker output before writing to the URL"). But `use-analytics-params.ts:21-22` used a raw `parseAsString` for `from`/`to` (no format enforcement on read), so any externally-supplied malformed URL still reached the server unguarded. `features/orders/hooks/use-orders-params.ts:30-31` had the identical `parseAsString` pattern and was confirmed to have the same live failure mode on `/orders?from=not-a-date&to=2026-07-18`.

**Fix**: consulted `fable-advisor` before implementing (per `CLAUDE.md`, since `handleAuthError` is shared by 14+ read-path components). Verdict: validate at the URL-parsing boundary rather than touch the shared error handler. Added `lib/nuqs-parsers.ts` — a `parseAsDateOnly` nuqs parser (`createParser`) that strictly roundtrip-validates `YYYY-MM-DD` and returns `null` on anything malformed, so nuqs falls back to the field's default instead of ever handing an invalid string to the API. `handleAuthError`'s `default: throw` was deliberately left untouched — a `VALIDATION_ERROR` on a read with otherwise-valid params is a real contract bug and should still surface loudly.

A same-session Codex review (`/codex:review`) then flagged a regression this introduced on `/orders`: `docs/integration/admin/00-conventions.md:94` documents the *general* date convention as full ISO 8601 UTC strings (`"2026-07-09T12:00:00.000Z"`), with date-only `YYYY-MM-DD` called out as an exception **only** for analytics buckets — so `parseAsDateOnly` was too strict for orders' `from`/`to` (`05-orders.md:24` just says "ISO date," inheriting the general rule) and would have silently discarded a documented-valid timestamp instead of applying it. Added a second parser, `parseAsApiDate`, accepting either `YYYY-MM-DD` or a full ISO UTC datetime; orders now use it while analytics keeps the stricter `parseAsDateOnly` (its doc explicitly narrows to date-only). Also fixed `features/orders/components/orders-date-range-filter.tsx`'s toolbar label, which had its own local date-only-only validity check and silently degraded to a generic "Date range" label for a timestamp value even though filtering worked — it now shares `parseAsApiDate`'s validation. `docs/conventions/03-url-state.md` documents both parsers and when to use each.

**Re-verified live after both fixes**: `/analytics?from=not-a-date&to=2026-07-18`, `/analytics?from=garbage&to=also-garbage`, `/analytics?from=2026-02-31&to=2026-13-45` (calendar-invalid, not just malformed), and `/orders?from=not-a-date&to=2026-07-18` / `?from=garbage&to=also-garbage` all render cleanly with **0 console errors** — malformed params fall back to the default range instead of crashing. `/orders?from=2026-07-16T00:00:00.000Z&to=2026-07-18T23:59:59.999Z` (a documented-valid full ISO timestamp) is now correctly **applied** — the order table narrows from 5 to 3 rows and the toolbar label reads "Jul 16, 2026 – Jul 19, 2026" (the Cairo-local rendering of the UTC bound), rather than being silently dropped. The normal preset-button and calendar-picker flows were re-tested for regression on both features and behave identically to before the fix (orders picker still writes plain `yyyy-MM-dd`). `bunx tsc --noEmit`, `bun lint`, and `bun run build` all clean after both rounds of changes.

### Environmental false-positive (not a defect)
Mid-session, one navigation logged 8 console errors, all `net::ERR_INTERNET_DISCONNECTED` / `net::ERR_NAME_NOT_RESOLVED` on Clerk's client-side token-refresh endpoint (`teaching-colt-37.clerk.accounts.dev`). Confirmed via `ping`/`nslookup`/`curl` that this was a transient local network blip (DNS temporarily unresolvable), not an app issue — the very next reload was clean (0 errors), and DNS/connectivity were verified working immediately after.

No other E-class defects: no hydration mismatches, no "Rendered more hooks," no Server-Action throws (screens are read-only, no actions exist), no router errors.

## Bugs found

**One defect, fixed in this session** (see above): malformed `from`/`to` query params on `/analytics` and `/orders` crashed to the generic error boundary instead of falling back gracefully. Fixed via a validating `parseAsDateOnly` nuqs parser rather than touching the shared `handleAuthError`; re-verified live with 0 console errors and a clean `bunx tsc --noEmit` / `bun lint` / `bun run build`.

No other functional bugs. KPI guards, empty-state coverage, chart defaulting/gap-filling, category/coupon/geography rendering, and both-theme chart rendering all matched the contract and screen docs.

## Observations (minor / polish — not blockers)

- "Top products" table on the Products analytics tab still renders all 6 catalog products (with 0 units/0 revenue) even on a fully empty date range, rather than showing an `EmptyState` like the charts do. Not a documented requirement ("empty range → EmptyState per **chart**" — the spec doesn't mention tables), so not flagged as a defect, just noted.

## Known noise (not Phase 7 defects)

- **Clerk dev-keys warning** — the single standing console warning on every screen. Expected in development.
- **Transient network DNS blip** — see above; environmental, not app-caused, not reproducible on demand.

## Side effects of this QA run

- **No state mutated.** Both screens are fully read-only; no orders, products, customers, or coupons were created, edited, or deleted.
- Session left signed in as ADMIN (`mohamed ghaly`), theme left toggled to dark on the last-visited page.

## Cleanup

- No test entities were created or records modified. Screenshot files saved to the repo root during this session (`dashboard-dark.png`, `analytics-dark.png`, `analytics-dark2.png`) were QA scratch output and have been deleted.

## Recommendation

Phase 7 Dashboard & Analytics **passes QA** — all five acceptance criteria verified (criteria 2, 3, 4 fully live; criterion 1 by inspection due to missing non-ADMIN credentials; criterion 5 via a clean `bun lint` + full `bun run build`). The `previous=0` KPI guard, 30-day gap-filling, all-status defaulting, URL-shareable server-refetched date ranges, per-chart empty states, zero-revenue category inclusion, and both-theme chart rendering all work exactly as specified.

**Defect status (frontend):**
- **One real defect, fixed (in two passes)**: malformed `from`/`to` URL params (on both `/analytics` and `/orders`) crashed to the generic error boundary instead of falling back gracefully. Fixed via `lib/nuqs-parsers.ts`, per `fable-advisor`'s reviewed verdict — validate at the URL-parsing boundary, leave `handleAuthError`'s auth-only contract unchanged. A same-session Codex review then caught that the first pass over-applied analytics' strict `YYYY-MM-DD`-only parser to orders, which documents the looser general ISO-datetime convention — split into `parseAsDateOnly` (analytics) and `parseAsApiDate` (orders, accepts both shapes) and fixed a related toolbar-label regression in `orders-date-range-filter.tsx`.
- No hydration mismatches, no other uncaught Server-Component errors, no broken chart axes.

**Follow-ups (not frontend blockers):**
- Live three-role verification of `/` and `/analytics` when MANAGER/USER credentials are available.
- Live verification of the low-stock critical highlight and the coupon `∞` unlimited-usage rendering (both need different seed data than currently exists).
