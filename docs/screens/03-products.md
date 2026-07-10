# 03 — Products (`/products`, `/products/new`, `/products/[id]`)

> **Access: MANAGER+.** Money/percent fields are **strings**.
> API twin: [`../integration/admin/03-products.md`](../integration/admin/03-products.md) (+ [§10 uploads](../integration/admin/10-uploads.md))

The largest module: list, create/edit form, and gallery management.

## List (`/products`)

**Data:** `GET /admin/products` + `GET /admin/products/filter-options` (categories for the filter dropdown), fetched with `Promise.all`.

**URL params (nuqs):** `search`, `status`, `categoryId`, `featured`, `page`, `limit` — names match the API exactly.

**Table columns:** thumbnail (`imageUrl`, transformed), name (+ slug muted underneath), category, price / `priceAfterDiscount` (show discount strikethrough when `discount > 0`), quantity (highlight < 10), sold, status badge (DRAFT/ACTIVE/ARCHIVED), featured star, created date.

**Toolbar:** debounced search, status select, category select (from `filter-options`), featured toggle filter, "New product" → `/products/new`. **No bulk actions.**

**Row actions** (dropdown):

| Action | Server Action → endpoint | UX |
|---|---|---|
| Edit | → `/products/[id]` | |
| Duplicate | `duplicateProduct` → `POST /admin/products/:id/duplicate` | Toast + navigate to the new draft's edit page. Copy has blank images, name "`… (copy)`", status DRAFT. |
| Toggle featured | `toggleProductFeatured` → `PATCH /admin/products/:id/featured` | Optimistic star, toast on error |
| Set status | `setProductStatus` → `PATCH /admin/products/:id/status` | Direct set, no transition rules |
| Delete | `deleteProduct` → `DELETE /admin/products/:id` | `ConfirmDialog`. **Response is 200 with flags, not 204**: `{deleted: true}` → "Product deleted"; `{archived: true}` → "Product is referenced by orders/carts — archived instead". |

## Form (`/products/new` and `/products/[id]`)

**Data:** `GET /admin/products/form-data` (category + sub-category selects); edit additionally hydrates from `GET /admin/products/:id/form` (raw `categoryId`/`subCategoryIds`/`imageId`s — the shape built for this form).

**Fields** (mirror the documented body exactly — the Zod schema is the whitelist):

- `name` (≤ 120), `description` (≤ 5000, textarea)
- `price` (≥ 0.01, ≤ 2 decimals), `discount` (0–70 %), `quantity` (int ≥ 0)
- `sizes`, `colors` (string[] — tag inputs; may be empty)
- `categoryId` (select, required); `subCategoryIds` (multi-select **filtered client-side by the chosen category**; sending one from another category → `422 SUBCATEGORY_CATEGORY_MISMATCH` — surface it on this field)
- `status` (default DRAFT), `featured` (default false)
- Cover image: `imageId` + `imageUrl` hidden fields fed by `ImageUploader` (folder `"products"`)

**Read-only (server-owned — never send, render as display-only):** `slug`, `priceAfterDiscount`, `sold`, `ratingsAverage`/`ratingsQuantity`.

**Submit:** create → `POST /admin/products`, then flash-toast + redirect to `/products/[id]`. Edit → `PATCH /admin/products/:id` with only the form's fields (partial update), toast in place. Note: `subCategoryIds` **replaces** the whole set; replacing the cover destroys the old asset server-side.

## Gallery (edit page section)

Managed via the dedicated image endpoints — not the PATCH `images` diffing (simpler and incremental):

| Action | Server Action → endpoint | UX |
|---|---|---|
| Add image | `addProductImage` → `POST /admin/products/:id/images` | `ImageUploader` → `{imageId, imageUrl, sortOrder}` |
| Reorder | `reorderProductImages` → `PATCH /admin/products/:id/images/reorder` | Drag to reorder; body `{ order: [...] }` must be an **exact permutation of image row IDs** |
| Remove | `deleteProductImage` → `DELETE /admin/products/:id/images/:imageId` | `ConfirmDialog`; ⚠️ `:imageId` = the **row ID** (`images[].id`), not the Cloudinary public ID. 204 on success. |

## Edge cases

- Delete is idempotent and never 409s — but always branch on the `{deleted, archived}` flags.
- Duplicate copies everything except images; prompt the user to upload new ones.
- Unknown `categoryId` → `404 RESOURCE_NOT_FOUND` on create/update.
- Empty list → `EmptyState` with a "New product" action; filtered-empty → "no products match your filters".
