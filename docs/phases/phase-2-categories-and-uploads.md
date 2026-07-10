# Phase 2 — Categories & Uploads

## Goal

The first real feature — proving the full list → dialog form → CRUD → error-mapping → toast loop — plus the image-upload capability every later phase reuses.

## Depends on

Phase 1 (API client, providers, shell, form primitives).

## Consumes

[`integration/admin/04-categories.md`](../integration/admin/04-categories.md), [`10-uploads.md`](../integration/admin/10-uploads.md) · [`screens/04-categories.md`](../screens/04-categories.md) · [`conventions/05-media.md`](../conventions/05-media.md)

## Tasks

### 1. `ImageUploader` (shared)

- [ ] `components/shared/image-uploader/` — client component: Server Action fetches the signature (`POST /admin/uploads/signature`), browser uploads direct to Cloudinary, emits `{ imageId, imageUrl }` into hidden form fields; preview + progress + remove-before-save.
- [ ] Client-side guards: `jpg/jpeg/png/webp` only, ≤ 5 MB, fresh signature per upload.

### 2. `features/categories/`

- [ ] `hooks/use-categories-params.ts` — `search`, `page`, `limit`.
- [ ] `queries/get-categories.ts` — `GET /admin/categories` (sub-categories arrive nested).
- [ ] `types/` + `schema/` per the contract (name ≤ 120; optional `imageId`/`imageUrl`).
- [ ] List table with expandable sub-category rows/panel, `EmptyState`, skeleton `loading.tsx`.
- [ ] Actions (one file each): `create-category`, `update-category`, `delete-category`, `create-sub-category`, `update-sub-category`, `delete-sub-category`.
- [ ] Dialog forms with `Form` + `FormControl` + `SubmitButton`; deletes behind `ConfirmDialog`.
- [ ] Error mapping: `409 DUPLICATE_RESOURCE` ("name already exists") and `409 FOREIGN_KEY_CONSTRAINT` ("still has sub-categories/products") with specific copy.

## Acceptance criteria

- [ ] Full category + sub-category CRUD works against the live API.
- [ ] Backend 422s render under the matching inputs (same UI path as Zod errors).
- [ ] Both 409s toast their specific human messages.
- [ ] A cover image uploads browser → Cloudinary, renders transformed via `cldUrl`, and survives create/edit round-trips.
- [ ] `slug` is displayed but never editable and never sent.
- [ ] Search + pagination are URL-shareable; page resets to 1 on search change.
- [ ] `bun lint` and `bun run build` pass; [tracker](./README.md) updated.
