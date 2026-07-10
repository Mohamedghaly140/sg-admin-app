# Development Phases

Build order for the admin dashboard. Phases 2–7 each ship one vertical feature slice against the live API; phase 1 is the shared foundation everything else needs.

## Status tracker (keep this current — it is the single source of "what exists")

| Phase | Scope | Status |
|---|---|---|
| [1 — Foundation](./phase-1-foundation.md) | Providers, auth, API client, shell, primitives | ⬜ not started |
| [2 — Categories & Uploads](./phase-2-categories-and-uploads.md) | First CRUD loop + `ImageUploader` | ⬜ not started |
| [3 — Products](./phase-3-products.md) | Product list, form, gallery | ⬜ not started |
| [4 — Orders](./phase-4-orders.md) | Order list, detail, status machine, mark-paid | ⬜ not started |
| [5 — Coupons & Shipping Zones](./phase-5-coupons-and-shipping.md) | Two small CRUD modules | ⬜ not started |
| [6 — Customers & Staff Users](./phase-6-customers-and-staff.md) | People modules + guardrails | ⬜ not started |
| [7 — Dashboard & Analytics](./phase-7-dashboard-and-analytics.md) | ADMIN KPI/chart screens (recharts) | ⬜ not started |
| [8 — Hardening](./phase-8-hardening.md) | States, a11y, responsive, QA sweep | ⬜ not started |

Statuses: ⬜ not started · 🟨 in progress · ✅ done. A phase is **done** only when every acceptance criterion passes and this table is updated. Update the row when starting a phase too.

## Sequencing rationale & dependencies

```
1 Foundation ─► 2 Categories+Uploads ─► 3 Products ─► 4 Orders ─► 5 Coupons+Zones ─► 6 People ─► 7 Dashboard+Analytics ─► 8 Hardening
```

- **Everything needs phase 1** (providers, `lib/api`, shell, form primitives).
- **Categories before products**: the product form needs category/sub-category data, and categories are the smallest full CRUD loop — it proves the whole pattern (list → nuqs → dialog `Form` → Server Action → `apiFetch` → error mapping → toast) end to end before the big module.
- **Uploads with categories**: `ImageUploader` is needed by both categories (optional image) and products (cover + gallery).
- **Dashboard/analytics near the end**: read-only ADMIN screens that are far easier to verify once earlier phases have generated data; the recharts work is isolated.
- Phases 4/5/6 are independent of each other after 3 — reorder if priorities change, but update this file.

## Deferred — backend work, not ours

Do **not** build against these until the backend ships them ([API README](../integration/admin/README.md#what-is-not-available-yet)):

- **Card payments / Geidea (backend Phase 7):** `POST /admin/orders/:id/verify-payment` 404s; all orders are CASH.
- **Notifications broadcast (backend Phase 9):** `POST /admin/notifications/broadcast` 404s ([planned shape](../integration/admin/11-notifications.md)).

When they ship: verify-payment slots into the order detail screen; notifications become a new screen + nav entry.
