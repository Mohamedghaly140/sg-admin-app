# Screens — Overview

Per-screen UX specs for the admin dashboard. **Numbering mirrors [`../integration/admin/`](../integration/admin/README.md)**: when building a screen, read its spec here and its API twin side by side. On any disagreement about data or behavior, **the API contract wins**.

## Route map

| Route | Feature | Screen doc | API twin | Access |
|---|---|---|---|---|
| `/` | `DashboardFeature` | [01-dashboard.md](./01-dashboard.md) | [§01](../integration/admin/01-dashboard.md) | **ADMIN** |
| `/analytics` | `AnalyticsFeature` | [02-analytics.md](./02-analytics.md) | [§02](../integration/admin/02-analytics.md) | **ADMIN** |
| `/products`, `/products/new`, `/products/[id]` | `ProductsFeature`, `ProductFormFeature` | [03-products.md](./03-products.md) | [§03](../integration/admin/03-products.md) | MANAGER+ |
| `/categories` | `CategoriesFeature` | [04-categories.md](./04-categories.md) | [§04](../integration/admin/04-categories.md) | MANAGER+ |
| `/orders`, `/orders/[id]` | `OrdersFeature`, `OrderDetailFeature` | [05-orders.md](./05-orders.md) | [§05](../integration/admin/05-orders.md) | MANAGER+ |
| `/coupons` | `CouponsFeature` | [06-coupons.md](./06-coupons.md) | [§06](../integration/admin/06-coupons.md) | MANAGER+ |
| `/shipping-zones` | `ShippingZonesFeature` | [07-shipping-zones.md](./07-shipping-zones.md) | [§07](../integration/admin/07-shipping-zones.md) | MANAGER+ |
| `/customers`, `/customers/[id]` | `CustomersFeature`, `CustomerDetailFeature` | [08-customers.md](./08-customers.md) | [§08](../integration/admin/08-customers.md) | MANAGER+ |
| `/staff-users` | `StaffUsersFeature` | [09-staff-users.md](./09-staff-users.md) | [§09](../integration/admin/09-staff-users.md) | **ADMIN** |
| `/sign-in` | Clerk sign-in | — | — | public |
| `/account-disabled` | disabled-account notice (Clerk sign-out on mount) | — | — | public |
| `/access-denied` | access-denied notice | — | — | any authenticated role (redirect target for USER) |

- The dashboard home **is the app root `/`** and is ADMIN-only. **MANAGERs land on `/orders`** (middleware redirect — see [auth & roles](../architecture/04-auth-and-roles.md)).
- `USER` role → access-denied screen everywhere.
- There is no `/settings` screen: the only settings-like surface with a live API is shipping zones, which is its own MANAGER+ screen. Store info and tax configuration have **no backend** — do not build them.

## Layout (`app/layout.tsx` + admin shell)

- **Sidebar** (collapsible; a `sheet` on mobile) with role-filtered groups:
  - *Overview* — Dashboard `/`, Analytics `/analytics` — **rendered only for ADMIN**
  - *Operations* — Orders, Customers
  - *Catalog* — Products, Categories
  - *Marketing* — Coupons
  - *Configuration* — Shipping Zones
  - *Administration* — Staff Users — **rendered only for ADMIN**
- **Topbar**: breadcrumb, theme toggle (next-themes), Clerk user menu (sign out).
- Route-level `loading.tsx` (skeletons), `error.tsx`, `not-found.tsx`, and a shared access-denied screen.

## Cross-cutting rules (apply to every screen)

- **Role enforcement**: middleware + hidden nav are UX; **the backend 401/403 is the security gate**. Handle both per [auth & roles](../architecture/04-auth-and-roles.md#handling-auth-failures-from-the-api).
- **Tables**: server-rendered shadcn tables; filters/pagination/search via [nuqs](../conventions/03-url-state.md); pagination from the API's `meta`. **No bulk actions** — the API has no bulk endpoints.
- **Mutations**: one file per Server Action, returning `ActionState` ([data flow](../conventions/01-data-flow.md)); forms per [forms](../conventions/02-forms.md).
- **Destructive actions** always go through `ConfirmDialog`.
- **Empty / loading / error states** on every list and detail (`EmptyState`, skeletons, `error.tsx`).
- **Money** renders via `formatEGP()`; record decimals are strings, dashboard/analytics values are numbers.
