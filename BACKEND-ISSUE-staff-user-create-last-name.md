# Backend Issue — Staff user creation fails with Clerk `last_name` error

**Endpoint:** `POST /admin/users`
**Reported from:** admin dashboard, Staff Users → Create user
**Severity:** blocks user creation

---

## Symptom

Creating a staff user returns a `422 VALIDATION_ERROR` and the operator sees a toast:

```
["last_name"] data doesn't match user requirements set for this instance
```

This is a **Clerk** error string (`data doesn't match user requirements set for this instance`), surfaced through the backend as documented in `docs/integration/admin/09-staff-users.md` (the 422 `message` carries Clerk's reason).

---

## Confirmed: not a frontend misalignment

The admin frontend follows the documented contract exactly. It sends a **single `name` field** — no `first_name` / `last_name`:

```json
{
  "name": "Omar Farouk",
  "email": "omar@sgcouture.com",
  "phone": "+201000000009",
  "password": "s3cure-Pass!",
  "role": "MANAGER"
}
```

Matches `POST /admin/users` request body in the contract. The frontend has no control over Clerk instance config or the name-splitting logic — both live in the backend + Clerk dashboard.

---

## Root cause (backend side)

The backend splits the incoming `name` into `first_name` / `last_name` before calling Clerk. The rejection means one of:

1. **Last name is disabled** in the Clerk instance
   (Dashboard → User & Authentication → Personal information → Name → Last name = off),
   but the backend still sends a `last_name` field → Clerk rejects the unknown/disallowed param.

2. **Last name is required** in the Clerk instance, but the operator entered a
   **single-token name** (e.g. `"Omar"`), so the split produced an **empty `last_name`** → Clerk rejects it.

---

## Requested fix (pick one, align backend ↔ Clerk)

- **If last name is disabled in Clerk:** stop sending `last_name` to Clerk (only send `first_name`, or put the whole `name` in `first_name`).
- **If last name is required in Clerk:** handle single-token names — e.g. fall back to a placeholder / duplicate the token / relax the requirement — so a name like `"Omar"` doesn't produce an empty `last_name`.
- Either way, make the split tolerant of names with 1 token and names with 3+ tokens.

## Acceptance

- Creating a user with a single-word name (`"Omar"`) succeeds.
- Creating a user with a multi-word name (`"Omar Farouk"`, `"Mary Anne Smith"`) succeeds.
- Any remaining Clerk rejection still returns `422 VALIDATION_ERROR` with a human-readable `message`.
