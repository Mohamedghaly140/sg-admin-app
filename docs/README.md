# SG Couture — Admin Dashboard Documentation

This repo is the **admin dashboard** for SG Couture: a standalone Next.js 16 frontend that consumes the SG Couture backend REST API at `https://<api-host>/api/v1`. It has **no database and no backend of its own** — no Prisma, no Stripe/Resend/Cloudinary server SDKs. The backend owns data, validation truth, slugs, totals, payments, emails, and Cloudinary asset lifecycle. This app owns the UI: screens, forms, UX validation, URL state, and Clerk session handling.

## Doc map

| Folder | Role | Authority |
|---|---|---|
| [`integration/admin/`](./integration/admin/README.md) | **The API contract** — every endpoint, body, envelope, error code. Vendored from the backend repo; read-only here. | **Source of truth.** If any other doc contradicts it, the API contract wins. Never invent endpoints or fields not documented there. |
| [`architecture/`](./architecture/01-overview.md) | System context, tech stack, project structure, auth & roles, environment. | Normative for this repo. |
| [`conventions/`](./conventions/01-data-flow.md) | How we write code: data flow (API client + Server Actions), forms, URL state, UI, media, style. | Normative for this repo. |
| [`screens/`](./screens/00-overview.md) | Per-screen UX specs (what each admin page shows and does). Numbering mirrors `integration/admin/` — `screens/05-orders.md` pairs with `integration/admin/05-orders.md`. | UX spec; defers to the API contract on data/behavior. |
| [`phases/`](./phases/README.md) | Phased build plan + **living status tracker** (what exists vs. what is planned). | Build order; check before assuming any infrastructure exists. |

## Reading order for AI agents

1. [`integration/admin/00-conventions.md`](./integration/admin/00-conventions.md) — auth, envelope, pagination, error codes. Everything assumes it.
2. [`conventions/01-data-flow.md`](./conventions/01-data-flow.md) — how reads and mutations flow through this app.
3. [`phases/README.md`](./phases/README.md) — current status; find the phase you're working in.
4. For a feature: its `screens/` doc **and** its `integration/admin/` twin, side by side.

## Ground rules

- The dashboard serves two roles: **ADMIN** (everything) and **MANAGER** (everything except Dashboard home, Analytics, and Staff Users, which are ADMIN-only). `USER` accounts have no access.
- All payments are **CASH** today. Card payments (Geidea) are backend Phase 7; notifications are backend Phase 9 — both 404 today. Do not build against them.
- Docs must never overstate reality: implementation status lives only in [`phases/README.md`](./phases/README.md).
