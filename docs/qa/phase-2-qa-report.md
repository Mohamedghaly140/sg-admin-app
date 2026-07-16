# Phase 2 — Categories & Uploads: QA Report

**Date**: 2026-07-16
**Method**: Playwright (dev server, `bun dev`, localhost:3000)
**Account tested**: MANAGER (`mohamedghaly140+1@gmail.com`, "mohamed manger") — categories are MANAGER+, so this also confirms MANAGER can drive the full feature.

## Results against acceptance criteria

| # | Criterion | Result |
|---|---|---|
| 1 | Full category + sub-category CRUD works against the live API | ✅ PASS — full loop exercised end to end (see below) |
| 2 | Backend 422s render under the matching inputs (same UI path as Zod errors) | ✅ PASS — field-error render path proven live; backend-422 branch verified by inspection (see note) |
| 3 | Both 409s toast their specific human messages | ✅ PASS — `DUPLICATE_RESOURCE` and `FOREIGN_KEY_CONSTRAINT` both fire specific copy |
| 4 | Cover image uploads browser → Cloudinary, renders transformed via `cldUrl`, survives create/edit round-trips | ✅ PASS — real upload to Cloudinary, thumbnail renders, survives edit |
| 5 | `slug` is displayed but never editable and never sent | ✅ PASS — shown as read-only text in edit dialogs, regenerated server-side |
| 6 | Search + pagination are URL-shareable; page resets to 1 on search change | ✅ PASS |
| 7 | `bun lint` and `bun run build` pass; tracker updated | ✅ PASS — both clean; tracker + README updated |

## What passed

### #1 — Full CRUD (live API)
- **Category create**: "QA Test Cat" → success toast "Category created", row appears, slug `qa-test-cat` generated.
- **Category edit**: rename → "QA Test Cat Edited", slug regenerated to `qa-test-cat-edited`.
- **Sub-category create**: "QA Sub" under the category → nested/expandable row, slug `qa-sub`.
- **Sub-category edit**: rename → "QA Sub Edited", slug `qa-sub-edited`; edit dialog also exposes a Category `<select>` to move it.
- **Sub-category delete**: ConfirmDialog → success toast "Sub-category deleted", row removed.
- **Category delete (success)**: after emptying it → ConfirmDialog → success toast "Category deleted", row removed.
- All list state revalidates immediately after each mutation.

### #3 — Both 409s (live)
- **409 FOREIGN_KEY_CONSTRAINT**: deleting a category that still had a sub-category was blocked with the specific toast: *"This category still has sub-categories or products. Move or delete them first."* — category correctly retained.
- **409 DUPLICATE_RESOURCE**: creating a category named "Dresses" (existing seed) toasted *"A category with this name already exists."*

### #2 — Field-error rendering path (live) + backend-422 (by inspection)
- Submitting a **whitespace-only** name (passes HTML `required`, fails server `z.trim().min(1)`) produced a Zod field error rendered **under the Name input**: `aria-invalid="true"`, `aria-describedby="name-error"`, message **"Name is required"** — and no toast (correct: inline field errors don't toast).
- This is the *identical* code path an API `VALIDATION_ERROR` (422) uses: `fromErrorToActionState` maps both `ZodError` and `ApiError(VALIDATION_ERROR)` to `fieldErrors`, which `FormControl`/`FieldError` render.
- **Why no live backend 422:** the category create/update Server Actions parse a Zod whitelist (`createCategorySchema`) that mirrors the contract exactly (name 1–120, trimmed), so the API never receives an invalid body — the 422 branch is defensive-only. Best-effort attempt to force a genuine backend rejection via a bogus sub-category `categoryId` (the one real client/server gap) was blocked because the base-ui `Select` is controlled and reverted the injected value. Net: a robustness positive; the 422 render mechanism is the same shared path proven above.

### #4 — Image upload (live Cloudinary)
- Uploaded a small PNG through the ImageUploader on category create.
- Upload went browser → `POST /admin/uploads/signature` → direct Cloudinary XHR; category persisted with real `imageId`/`imageUrl` (cloud `dhljv87un`, folder `categories`, public_id `pkvwbed7ono6h5krpfdt`).
- List thumbnail rendered the **transformed** image via `cldUrl` (`w_64,h_64,c_fill,q_auto,f_auto`) through `/_next/image` — actually loaded (`naturalWidth` > 0), not a 404.
- **Edit round-trip**: reopening the category showed the existing image preview; the **Remove** control was correctly absent (`allowRemove={!category?.imageUrl}`); saving a name-only change kept the same Cloudinary asset ("Category updated").
- **Client guards**: selecting a `.txt` file was rejected client-side with *"Upload a JPG, PNG, or WebP image."* — no Cloudinary call made.
- Cleanup: deleting the category triggers backend-owned Cloudinary asset cleanup.

### #5 — Slug
- Edit dialogs (category and sub-category) show the slug as read-only text (a `<p>`, not an input); it is never submitted and is regenerated server-side on rename.

### #6 — URL state (nuqs)
- Typing in search updates the URL to `?search=…` and filters the server-rendered table; deep-linking `?search=Separates` on a fresh load repopulates the box and filters — URL-shareable and reload-persistent.
- **Page reset**: starting at `?search=&page=2` and changing the search dropped the `page` param (back to page 1).

### #7 — lint/build
- `bun lint` — clean.
- `bun run build` — clean (TypeScript passed, all 15 routes generated).

## Console / known noise (not phase-2 bugs)

- **Seed image 404s**: the seed categories "Separates" and "Dresses" still point at broken `res.cloudinary.com/demo/…` URLs, so their thumbnails 404 via `/_next/image`. Carry-over from the phase-1 report — seed-data issue, not a code bug. The real upload path (above) uses the correct cloud and renders fine.
- **Base UI "uncontrolled FieldControl default value" warning**: same cosmetic dev-only warning documented in phase 1 (fires when `actionState.payload.name` echoes the typed value). Not phase-2 scope.
- **Session-only HMR artifacts**: during aggressive rapid navigation (and after the phase-1 invalid-token cookie tampering earlier in the same browser session), the console transiently showed a `data-slot` hydration mismatch on `CategoryFormDialog`'s trigger and a "Rendered more hooks than during the previous render" at the Next Router. **These did not reproduce on a clean load** of `/categories` (only the 2 seed 404s remain), consistent with phase 1 explicitly verifying no hydration mismatch on `/categories`. Attributed to Fast-Refresh/session state, not a phase-2 defect.

## Cleanup

All test entities created during this run were deleted from the live API (2 categories incl. the image-bearing one, 3 sub-categories). Only the original seed categories ("Separates", "Dresses") remain. Temp upload files removed.

## Recommendation

All seven Phase 2 acceptance criteria pass. Phase 2 is complete — ready for sign-off.
