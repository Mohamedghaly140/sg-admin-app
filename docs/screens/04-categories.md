# 04 — Categories (`/categories`)

> **Access: MANAGER+.**
> API twin: [`../integration/admin/04-categories.md`](../integration/admin/04-categories.md) (+ [§10 uploads](../integration/admin/10-uploads.md))

Categories with nested sub-categories, managed on one screen. This is the **first CRUD feature built** (phase 2) — it proves the full list → dialog form → mutation → toast loop.

## List

**Data:** `GET /admin/categories` — sub-categories arrive **nested** (there is no separate sub-category list endpoint).

**URL params (nuqs):** `search`, `page`, `limit`.

**Layout:** table (or card list) of categories: image thumbnail (nullable → placeholder), name (+ slug muted), sub-category count, created date, row actions. Each row expands (or opens a panel) showing its sub-categories with their own edit/delete actions and an "Add sub-category" button.

## Actions

| Action | Server Action → endpoint | UX / errors |
|---|---|---|
| Create category | `createCategory` → `POST /admin/categories` | Dialog with `Form`: `name` (≤ 120, required), optional image via `ImageUploader` (folder `"categories"`, hidden `imageId`/`imageUrl`). `409 DUPLICATE_RESOURCE` → "A category with this name already exists". |
| Edit category | `updateCategory` → `PATCH /admin/categories/:id` | Same dialog prefilled. Replacing the image destroys the old asset server-side — no frontend cleanup. Same 409. |
| Delete category | `deleteCategory` → `DELETE /admin/categories/:id` | `ConfirmDialog`. 204 on success. `409 FOREIGN_KEY_CONSTRAINT` → "This category still has sub-categories or products — move or delete them first". |
| Create sub-category | `createSubCategory` → `POST /admin/sub-categories` | Small dialog: `name` + fixed `categoryId` (hidden). `409 DUPLICATE_RESOURCE` on name. |
| Edit sub-category | `updateSubCategory` → `PATCH /admin/sub-categories/:id` | May also move it to another category (`categoryId` select). Same 409. |
| Delete sub-category | `deleteSubCategory` → `DELETE /admin/sub-categories/:id` | `ConfirmDialog`. `409 FOREIGN_KEY_CONSTRAINT` → "Products still reference this sub-category". |

All dialogs close on success (`Form`'s `onSuccess`); the list refreshes via `revalidatePath("/categories")`.

## Rules

- `slug` is **server-generated** — display it muted, never editable, never sent.
- Deletion is hard-blocked while referenced (409) — no cascade UI; just explain the block in the error toast.
- Empty state: `EmptyState` with a "New category" action.
