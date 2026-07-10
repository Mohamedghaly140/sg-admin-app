# 09 — Staff Users (`/staff-users`)

> **Access: ADMIN only** — route gated in middleware, nav entry hidden from MANAGERs, and the API 403s regardless.
> API twin: [`../integration/admin/09-staff-users.md`](../integration/admin/09-staff-users.md)

Account management across **all roles** (`USER | MANAGER | ADMIN`). Accounts are created/mutated through Clerk by the backend — Clerk-side rules (duplicate email, weak/breached password) surface as `422 VALIDATION_ERROR` with Clerk's reason in `message`.

## List

**Data:** `GET /admin/users`.

**URL params (nuqs):** `search` (name/email), `role`, `active`, `page`, `limit`.

**Table columns:** name, email, phone, role badge (USER/MANAGER/ADMIN), active badge, created date, row actions.

## Actions

| Action | Server Action → endpoint | UX / errors |
|---|---|---|
| Create user | `createUser` → `POST /admin/users` | Dialog: `name` (2–120), `email`, `phone` (Egyptian `+2010…`), `password` (≥ 8 — **never echoed or stored**; the operator hands it over out-of-band), `role` select. `422 VALIDATION_ERROR` carries Clerk's reason (duplicate email/phone, weak/breached password) → show `message` and any `errors[]` on fields. |
| Edit role + active | `updateUser` → `PATCH /admin/users/:id` | Dialog with role select + active switch. **Both fields are required by the API** — always send the current value of the untouched one. `409 SELF_MODIFICATION_FORBIDDEN` / `409 LAST_ADMIN_REQUIRED` → toast the API message. |
| Delete user | `deleteUser` → `DELETE /admin/users/:id` | **Destructive and irreversible** — removes the account from Clerk + DB; their addresses, cart, wishlist, reviews are deleted; orders survive with the customer link cleared. `ConfirmDialog` with **type-to-confirm** (type the user's email). 204 on success. Same two 409s. |

## UI guardrails (build these — the API 409s are the backstop, not the UX)

- **Own row:** disable role/active/delete controls on the signed-in ADMIN's own row (compare against `auth()` userId).
- **Last active ADMIN:** when only one active ADMIN exists, disable demote/deactivate/delete on that row with an explanatory tooltip.
- Role changes take effect on the target's next token refresh — no action needed here, but don't promise instant effect in the UI copy.

## Edge cases

- Creating a `USER` here is allowed (e.g. support creating an account for a customer) — it then appears in [Customers](./08-customers.md), not in this list's default mental model; the `role` filter covers it.
- Filtered-empty vs. truly empty list → different `EmptyState` copy.
