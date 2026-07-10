# 08 — Customers (`/customers`, `/customers/[id]`)

> **Access: MANAGER+.**
> API twin: [`../integration/admin/08-customers.md`](../integration/admin/08-customers.md)

**`role = USER` accounts only.** Staff accounts are deliberately invisible here (their IDs 404) — staff and **role management** live on [Staff Users](./09-staff-users.md) (ADMIN-only). This screen has no role controls.

## List (`/customers`)

**Data:** `GET /admin/customers`.

**URL params (nuqs):** `search` (name/email/phone), `active` (boolean), `page`, `limit`.

**Table columns:** name, email, phone, active badge, `ordersCount`, joined date. Rows link to detail.

## Detail (`/customers/[id]`)

**Data:** `GET /admin/customers/:id`. Unknown ID **or a staff account's ID** → 404 → `notFound()`.

**Sections:**

- Profile card: name, email, phone, active badge, joined date.
- Addresses: cards per saved address (alias, full location fields, default badge).
- Order history: mini orders table (humanOrderId → `/orders/[id]`, status, paid, total, date).

## Actions (both behind `ConfirmDialog`)

| Action | Server Action → endpoint | UX / errors |
|---|---|---|
| Activate / Deactivate | `setCustomerActive` → `PATCH /admin/customers/:id/active` `{ active }` | Deactivating = ban: the customer gets `403 ACCOUNT_DISABLED` everywhere (storefront included) — say so in the confirm copy. `409 SELF_MODIFICATION_FORBIDDEN` (own account) and `409 FORBIDDEN_TARGET` (staff account) → toast the API message. |
| Reset password | `resetCustomerPassword` → `POST /admin/customers/:id/reset-password` | No body. Generates a strong random password in Clerk, **signs the customer out everywhere**, emails them a notice; the password is never shown to anyone. Confirm copy must warn about the sign-out. `409 FORBIDDEN_TARGET` (staff — applies even to ADMIN). **`503 SERVICE_UNAVAILABLE` is special: the password WAS changed but the email failed** — show exactly that: "Password was reset, but the notification email failed — retry or contact the customer directly." |

## Edge cases

- Managers viewing their own USER-side? Not possible — operators are staff, and staff aren't in this module; self-modification 409s exist as a backstop.
- Customer with zero orders/addresses → `EmptyState` inside those sections, not a broken page.
- There is no customer create/edit/delete here — accounts self-register on the storefront; deletion is an ADMIN action in Staff Users.
