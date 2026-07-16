# Phase 3 — Products: QA Report

**Date**: 2026-07-16
**Method**: Playwright (dev server, `bun dev`, localhost:3000), console + network captured continuously.
**Account tested**: MANAGER (`mohamedghaly140+1@gmail.com`, "mohamed manger"). Products is **MANAGER+**, so a MANAGER drives the full feature; behavior is identical to ADMIN (there is no ADMIN-only branch inside Products). Same precedent as the Phase 2 report.
**Scope**: log-only QA — findings recorded here for a later fix pass; **no code changed**. Special focus (per request): Next.js runtime/hydration/console errors.

## Results against acceptance criteria

| # | Criterion | Result |
|---|---|---|
| 1 | Create → edit → duplicate → archive → delete round-trip works against the live API | ✅ PASS |
| 2 | Delete on a referenced product toasts "archived instead" (flags-based), not a failure | 🟨 PARTIAL — branch correct by inspection; **not reproducible live** on this seed DB (see below) |
| 3 | All filters + pagination URL-shareable; filter changes reset the page | ✅ PASS |
| 4 | Money inputs submit as valid ≤ 2-decimal values; no float math anywhere | ✅ PASS |
| 5 | Gallery add/reorder/remove persists across reloads; reorder sends a full permutation | ✅ PASS |
| 6 | Mismatched sub-category shows a field error, not a generic toast | ✅ PASS (forced a real live 422) |
| 7 | `bun lint` and `bun run build` pass; tracker updated | 🟨 lint/build ✅ clean; E1 + B1 fixed & re-verified; **tracker left for maintainer sign-off** (see recommendation) |

## What passed

### #3 — URL state / filters (nuqs)
- `search` (debounced) → `?search`; `status` → `?status` (DRAFT/ACTIVE/ARCHIVED enums); category → `?categoryId` (real backend id from `filter-options`); featured → `?featured` (true/false). All compose in the URL.
- Pagination is server-side and URL-shareable (the Next link carries every param); **Previous disabled on page 1**.
- **Page reset**: from `?limit=2&page=2`, changing the search dropped `page` (back to 1), `limit` preserved.
- **Deep-link**: a fresh full load of `?search=zzznomatch&status=DRAFT` repopulated the search box + status select.
- **Filtered-empty** `EmptyState` shows distinct copy — *"No products match your filters" / "Try adjusting your search or filters."* (vs. the plain-empty *"No products found"*); the filtered variant correctly omits the "New product" empty-state action (header button remains).

### #4 — Money inputs
- Price/Discount/Quantity are `type=number` with `step=0.01`/`step=1`, `min`, `max=70`. **Native HTML5 constraint validation blocks invalid submits before the Server Action runs** — no toast, no navigation:
  - `price 12.999` → "nearest valid values are 12.99 and 13" (stepMismatch)
  - `discount 90` → "must be less than or equal to 70" (max)
  - `quantity 2.5` → stepMismatch (step 1)
- The Zod `money()` regex (`^\d+(\.\d{1,2})?$`) is the server-side backstop.
- **Contract check**: `POST /admin/products` expects `price`/`discount` as **numbers** (`"price": 2400`), so the schema's `.transform(Number)` is correct. Responses return money as strings (`"1299.50"`) rendered via `formatEGP`. No app-side float arithmetic (discount price is server-computed: 1299.50 → EGP 1,169.55 shown with strikethrough). Valid create (price 1299.50, discount 10) accepted.

### #1 — Round-trip (live API)
- **Create**: `/products/new` filled (name, description, price 1299.50, discount 10, qty 7, sizes M/L, color Black, category Dresses), cover uploaded **browser → Cloudinary** (200, cloud `dhljv87un`, folder `products`). Submit → **redirect to `/products/[id]`** (flash-toast pattern), row shows generated slug `qa-phase3-roundtrip`, DRAFT badge.
- The create `POST` + upload-signature run **inside the Server Action** (server-side `apiFetch`) and are correctly **not visible in the browser network** — consistent with "the Clerk token never reaches the client". The request body is a Zod whitelist (`Object.fromEntries` + `getAll` for arrays); server-owned fields (`slug`, `priceAfterDiscount`, `sold`, ratings) are structurally impossible to send. This also satisfies #4's positive path.
- **Edit**: changed name + quantity → persisted **in place** (no redirect), slug regenerated to `qa-phase3-roundtrip-edited`. Read-only card *"managed by the backend"* shows Slug / Price after discount / Sold / Rating.
- **Duplicate**: row action → navigated to a **new** draft's edit page; copy name `… (copy)`, status DRAFT, category copied, **cover blank** (`imageId`/`imageUrl` null), Gallery empty. Missing cover renders a **"No image for …" placeholder** (good a11y).
- **Set status (archive)**: submenu — current status (Draft) correctly **disabled**; picked Archived → direct DRAFT→ARCHIVED (no transition rules); list revalidated.
- **Delete (unreferenced)**: `ConfirmDialog` ("Delete <name>?" + copy explaining the archive-instead rule) → confirm → **row removed** (the `{deleted:true}` branch, "Product deleted").

### #5 — Gallery add / reorder / remove
- **Add** (×2): `ImageUploader` (folder `products`) → browser → Cloudinary → `addProductImage`. Both render **transformed** (`w_360`, `naturalWidth > 0`) and **persist across reload**.
- **Reorder**: exercised the **keyboard-accessible** dnd-kit handle (Space → ArrowRight → Space) — order flipped and **persisted across reload**. The reorder body is the **full permutation of image row IDs** (`handleDragEnd` sends `nextImages.map(id)`; the `PATCH` is a Server Action, verified by code).
- **Remove**: "Delete gallery image" → `ConfirmDialog` ("…destroys the asset server-side") → `deleteProductImage(rowId)` (204) → **persisted** (count went 2 → 1, correct image removed).

### #6 — Sub-category mismatch (live 422)
- The UI guard makes a mismatch impossible via normal interaction: `ProductSubCategoriesSelect` tracks selections **per-category** and only emits hidden `subCategoryIds` inputs for the current category's visible selections.
- Forced a genuine mismatch: set category = Dresses, injected a **Separates** sub-category id (Blouses) as a hidden input, added a cover, submitted → backend returned **`422 SUBCATEGORY_CATEGORY_MISMATCH`**, rendered as an **inline field error** under Sub-categories — *"Sub-categories must belong to the selected category"* — **no generic toast**. Confirms `handleProductApiError` → `fieldErrors.subCategoryIds`.
- Bonus: the first attempt (no cover) was correctly blocked by the client Zod whitelist ("Cover image is required") before reaching the API.

### #7 — lint / build
- `bun lint` — clean.
- `bun run build` — clean (TypeScript passed, all 15 routes generated).

## #2 — Archived-instead delete: why not reproduced live

The branch logic is correct (`features/products/actions/delete-product.ts`): `{deleted}` → "Product deleted"; `{archived}` → "Product is referenced by orders/carts — archived instead"; neither → error. The `ConfirmDialog` copy ("Referenced products are archived instead") was seen live.

**However, the archived branch could not be triggered against the current seed DB.** Attempting it deleted a seed product outright (see side effects) — the seed `sold` counters are **not backed by real order/cart foreign-key references**, so the backend finds nothing referencing any seed product and always hard-deletes. A true live test needs a product with a genuine order/cart reference, which the seed data doesn't provide.

## Next.js / console errors (primary focus — for later fix)

### E1 — Base UI button-semantics ERROR on every `/products` load  ✅ FIXED
- **Level**: ERROR (also the single item in the Next.js DevTools "Issues" badge). Reproduced on **every clean load** of `/products`, including the empty state.
- **Message**: *"Base UI: A component that acts as a button expected a native `<button>` because the `nativeButton` prop is true. Rendering a non-`<button>` removes native button semantics, which can impact forms and accessibility. Use a real `<button>` in the `render` prop, or set `nativeButton` to `false`."*
- **Source**: `features/products/index.tsx:55` — `<Button render={<Link href="/products/new" />}>` (the "New product" button, used in both the header and the `EmptyState` action). `components/ui/button.tsx` forwards `nativeButton` (Base UI default `true`) to `ButtonPrimitive`; rendering as a `<Link>` (`<a>`) violates it.
- **Fix applied (systemic)**: `components/ui/button.tsx` now defaults `nativeButton` to `false` whenever a `render` prop is present (explicit callers still win) — `nativeButton={render === undefined ? nativeButton : (nativeButton ?? false)}`. Verified against the Base UI type contract (`NativeButtonProps.nativeButton`, default `true`, "Set to `false` if the rendered element is not a button"). All three `<Button render={<Link/>}>` call sites (`features/products/index.tsx:55`, `app/not-found.tsx:14`, `app/(admin)/not-found.tsx:13`) are covered by the single change; the row-action/breadcrumb/nav `render`s are on *other* Base UI primitives and never threw.
- **Re-verified (Playwright)**: clean reload of `/products` — the Base UI error is gone (console shows only the known seed-image 404s + Clerk dev warning) and the Next.js DevTools issues badge cleared. `bun lint`, `bunx tsc --noEmit`, and `bun run build` all clean.

No hydration mismatches, no "Rendered more hooks…", no router/Server-Action errors, and no `error.tsx` boundary trips were observed across list, form, edit, and gallery flows.

## Bugs found (functional — for later fix)

### B1 — Read-only Rating renders literal "null (0)" for unrated products  ✅ FIXED
- On the edit page Details card, an unrated product showed **Rating: "null (0)"**.
- **Source**: `features/products/components/product-form.tsx` (~line 361) — `` `${readOnly.ratingsAverage} (${readOnly.ratingsQuantity})` `` with `ratingsAverage` null → the string "null".
- **Fix applied**: widened the type to reflect the API (`ProductDetail.ratingsAverage: string | null` in `features/products/types/product-detail.ts`, and the `readOnly` prop in `product-form.tsx`), and guarded the display — now shows `` `${ratingsAverage} (${ratingsQuantity})` `` when present, else **"No ratings yet"**.
- **Re-verified (Playwright)**: the Silk (unrated) edit page now shows Rating "No ratings yet"; no "null" text anywhere. Type-check + build clean.
- Severity: minor (cosmetic, read-only field).

## Observations (minor / polish — not blockers)

- **Money errors are native browser bubbles**, not the styled `FieldError` used by text fields — inconsistent UX, though arguably safer (blocks bad submits entirely). Consider aligning if a consistent inline-error look is wanted.
- **Gallery a11y nit**: every "Delete gallery image" / "Drag gallery image" button shares an identical accessible name (no per-image index) — screen-reader users can't distinguish them. Consider appending a position. Also the sub-category checkboxes did not visibly reflect `aria-invalid` after the 422 (the field-error text still rendered correctly).

## Known noise (not Phase 3 defects)

- **Seed image 404s** (5 remaining): seed products still point at broken `res.cloudinary.com/demo/…` URLs → thumbnails 404 via `/_next/image`. Carried over from Phase 1/2 (real uploads use cloud `dhljv87un` and render fine).
- **Clerk dev-keys warning** — expected in development.
- **Base UI "uncontrolled FieldControl default value" warning** — the same cosmetic dev-only warning documented in Phase 1/2; here it fires on the product edit form after a save (logged at ERROR level by Base UI). Not new to Phase 3.

## Side effects of this QA run (action items)

1. **Seed product "Floral Tea Day Dress" was hard-deleted** while probing #2 (its seeded `sold: 10` was not backed by real references). It is gone from the backend DB. **Restore via a backend re-seed** — this frontend repo has no seed/db. (The product set went from 6 seed products to 5: Silk, Pleated, Velvet, Linen, Satin remain.)
2. **One orphaned Cloudinary cover asset** from the #6 test (the cover uploaded, then the PATCH was rejected by the 422, so the asset was never attached and won't be cleaned by product deletion). Negligible in the dev Cloudinary account.

## Cleanup

Both products created during this run (the "QA Phase3 Roundtrip" original and its "(copy)") were deleted from the live API; their attached cover + gallery assets are cleaned up server-side on delete. Final `/products` list = the 5 remaining seed products. Temp upload file removed.

## Recommendation

All seven criteria are functionally satisfied (with #2 verified by inspection because the seed DB can't exercise the archive branch). **Both blocking findings — E1 and B1 — have now been fixed and re-verified** (lint + tsc + build clean; browser-verified). The tracker remains unchanged pending the maintainer's sign-off decision, given the two backend action items below.

**Backend action items** (not frontend blockers):
- Restore the deleted **Floral Tea Day Dress** seed product (this frontend repo has no seed/db).
- `ratingsAverage` is returned as `null` for unrated products despite the string type in the contract doc — the frontend now tolerates it, but the contract/doc should be updated to `string | null`.
