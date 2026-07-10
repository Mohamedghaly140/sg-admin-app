# 01 — System Overview

## Context

```
┌──────────────────────────────┐         ┌───────────────────────────────┐
│  sg-admin-app (this repo)    │  HTTPS  │  SG Couture backend API       │
│  Next.js 16 admin dashboard  │ ──────► │  https://<api-host>/api/v1    │
│  server-side fetch + Bearer  │         │  (separate repo & deployment) │
└──────────────────────────────┘         └───────────────────────────────┘
        │                                        │
        │ Clerk session (auth)                   │ owns: DB, validation truth,
        ▼                                        │ slugs, totals, payments,
┌──────────────┐    browser-direct upload        │ emails, Cloudinary cleanup
│    Clerk     │   ┌────────────┐                │
└──────────────┘   │ Cloudinary │ ◄── signed params issued by the API
                   └────────────┘
```

This app is a **frontend-only client** of the backend REST API. Every admin capability — products, orders, customers, analytics — is an API call documented in [`../integration/admin/`](../integration/admin/README.md).

## Responsibility split

| This app owns | The backend owns |
|---|---|
| Screens, layout, navigation | All data (database) |
| Client-side UX validation (Zod, pre-flight) | Validation truth (strict 422s) |
| URL state (filters, pagination, search) | Server-owned fields: `slug`, `priceAfterDiscount`, `sold`, ratings, order totals, `usedCount` |
| Clerk session handling + per-request Bearer token | Roles source of truth (mirrored to Clerk `publicMetadata.role`) |
| Rendering Cloudinary delivery URLs; direct browser upload with signed params | Cloudinary account, signatures, asset deletion/cleanup |
| Role-aware nav + route gating (UX layer) | **Actual security enforcement** (401/403 per request) |

## What this app deliberately does NOT contain

Do not (re)introduce any of these — they belong to the backend or don't apply:

- **No Prisma, no database, no migrations.** All data access is `apiFetch` against the REST API.
- **No Stripe/Geidea SDKs.** Payments are CASH-only today; card payments are backend Phase 7 (`verify-payment` 404s — see the [API README](../integration/admin/README.md#what-is-not-available-yet)).
- **No Resend/email sending.** The backend sends emails (e.g. on password reset).
- **No Cloudinary server SDK, no asset deletion.** Uploads go browser → Cloudinary with signed params from the API; cleanup is backend-owned.
- **No webhooks.** Role changes propagate backend → Clerk; this app just reads session claims.
- **No API route handlers for business logic.** This app exposes no API of its own.

## Request flows in one paragraph each

**Reads** — Server Components call a server-only `apiFetch` helper (fresh Clerk token per request → `Authorization: Bearer`) and render the result. No client-side data fetching for page data.

**Mutations** — Server Actions validate `FormData` with Zod, call `apiFetch`, and return an `ActionState` consumed by the shared `Form` component (sonner toasts + inline field errors). Then `revalidatePath` refreshes the affected route.

Full spec: [`../conventions/01-data-flow.md`](../conventions/01-data-flow.md).
