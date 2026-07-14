# Phase 6 — Customers & Staff Users

## Goal

The two people modules with their guardrails: customers (MANAGER+, `role = USER` only) and staff users (ADMIN-only, all roles).

## Depends on

Phase 1.

## Consumes

[`integration/admin/08-customers.md`](../integration/admin/08-customers.md), [`09-staff-users.md`](../integration/admin/09-staff-users.md) · [`screens/08-customers.md`](../screens/08-customers.md), [`09-staff-users.md`](../screens/09-staff-users.md)

## Tasks

### 1. `features/customers/` (`/customers`, `/customers/[id]`)

- [x] `hooks/use-customers-params.ts` — `search`, `active`, `page`, `limit` (**`active`, not `role`** — role filtering belongs to staff users).
- [x] List table + detail (profile, addresses, order history linking to `/orders/[id]`); staff IDs 404 → `notFound()`.
- [x] Actions behind `ConfirmDialog`: `set-customer-active` (ban warning: `ACCOUNT_DISABLED` everywhere) and `reset-customer-password` (signs the customer out everywhere; password never shown).
- [x] Error handling: `409 SELF_MODIFICATION_FORBIDDEN`, `409 FORBIDDEN_TARGET`; **`503` on reset-password = password WAS changed but the email failed** — exact copy per the screen spec.

### 2. `features/staff-users/` (`/staff-users`, ADMIN-only)

- [x] `hooks/use-staff-users-params.ts` — `search`, `role`, `active`, `page`, `limit`.
- [x] List table with role/active badges.
- [x] Actions: `create-user` (name/email/phone/password/role — Clerk rejections arrive as 422 with the reason in `message`), `update-user` (**role + active together, both required** — send the untouched current value), `delete-user` (type-to-confirm the email; irreversible; orders survive unlinked).
- [x] UI guardrails: disable role/active/delete on the operator's **own row**; when only one active ADMIN exists, disable demote/deactivate/delete on it with a tooltip. API `409 SELF_MODIFICATION_FORBIDDEN` / `LAST_ADMIN_REQUIRED` handled as the backstop.

## Acceptance criteria

- [x] MANAGER cannot reach `/staff-users`: nav hidden, middleware redirects, and a direct API probe would 403.
- [x] Acting on your own account is disabled client-side; forcing it surfaces the 409 message.
- [x] Last-admin protection is visible (disabled + tooltip) and the 409 is handled.
- [x] Reset-password 503 shows the "password changed, email failed" message, not a generic error.
- [x] Deactivated customer/staff shows the correct badge immediately after the action.
- [x] `bun lint` and `bun run build` pass; [tracker](./README.md) updated.
