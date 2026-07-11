# Phase 3 — Products

## Goal

The largest module: product list with filters, create/edit form, row actions, and gallery management — 14 endpoints.

## Depends on

Phase 2 (`ImageUploader`, categories exist for the form selects).

## Consumes

[`integration/admin/03-products.md`](../integration/admin/03-products.md), [`10-uploads.md`](../integration/admin/10-uploads.md) · [`screens/03-products.md`](../screens/03-products.md)

## Tasks

### 1. List (`/products`)

- [x] `hooks/use-products-params.ts` — `search`, `status`, `categoryId`, `featured`, `page`, `limit`.
- [x] Queries: `get-products` + `get-product-filter-options` (`Promise.all`).
- [x] Table per the screen spec (thumbnail, price/discount, quantity/sold, status + featured badges).
- [x] Row actions: `duplicate-product` (navigate to new draft), `toggle-product-featured`, `set-product-status`, `delete-product` (**branch on the 200 `{deleted, archived}` flags** — two different toasts).

### 2. Form (`/products/new`, `/products/[id]`)

- [ ] Queries: `get-product-form-data`; edit hydrates from `get-product-form` (`GET /admin/products/:id/form`).
- [ ] `schema/product-schema.ts` mirroring the documented body exactly (name ≤ 120, description ≤ 5000, price ≥ 0.01 ≤ 2 decimals, discount 0–70, quantity int ≥ 0, sizes/colors arrays, categoryId, subCategoryIds, status, featured, imageId/imageUrl). Array fields are read via `formData.getAll(...)` — never `Object.fromEntries` (it collapses repeated keys).
- [ ] Sub-category multi-select filtered client-side by the chosen category; `422 SUBCATEGORY_CATEGORY_MISMATCH` surfaces on that field.
- [ ] Cover image via `ImageUploader` (folder `"products"`).
- [ ] Server-owned fields rendered read-only: `slug`, `priceAfterDiscount`, `sold`, ratings.
- [ ] Actions: `create-product` (flash-toast + redirect to edit page), `update-product` (partial PATCH, toast in place).

### 3. Gallery (edit page)

- [ ] `add-product-image` (via `ImageUploader`), `reorder-product-images` (exact permutation of **row IDs**), `delete-product-image` (row ID, not Cloudinary ID; 204).

## Acceptance criteria

- [ ] Create → edit → duplicate → archive → delete round-trip works against the live API.
- [ ] Delete on a referenced product toasts "archived instead" (flags-based), not a failure.
- [ ] All filters + pagination are URL-shareable; filter changes reset the page.
- [ ] Money inputs submit as valid ≤ 2-decimal values; no float math anywhere.
- [ ] Gallery add/reorder/remove persists across reloads; reorder sends a full permutation.
- [ ] Mismatched sub-category shows a field error, not a generic toast.
- [ ] `bun lint` and `bun run build` pass; [tracker](./README.md) updated.
