# Phase 2 — Categories & Uploads

## Goal

The first real feature — proving the full list → dialog form → CRUD → error-mapping → toast loop — plus the image-upload capability every later phase reuses.

## Depends on

Phase 1 (API client, providers, shell, form primitives).

## Consumes

[`integration/admin/04-categories.md`](../integration/admin/04-categories.md), [`10-uploads.md`](../integration/admin/10-uploads.md) · [`screens/04-categories.md`](../screens/04-categories.md) · [`conventions/05-media.md`](../conventions/05-media.md)

## Tasks

### 1. `ImageUploader` (shared)

- [x] `components/shared/image-uploader/` — client component: Server Action fetches the signature (`POST /admin/uploads/signature`), browser uploads direct to Cloudinary, emits `{ imageId, imageUrl }` into hidden form fields; preview + progress + remove-before-save.
- [x] Client-side guards: `jpg/jpeg/png/webp` only, ≤ 5 MB, fresh signature per upload.

### 2. `features/categories/`

- [x] `hooks/use-categories-params.ts` — `search`, `page`, `limit`.
- [x] `queries/get-categories.ts` — `GET /admin/categories` (sub-categories arrive nested).
- [x] `types/` + `schema/` per the contract (name ≤ 120; optional `imageId`/`imageUrl`).
- [x] List table with expandable sub-category rows/panel, `EmptyState`, skeleton `loading.tsx`.
- [x] Actions (one file each): `create-category`, `update-category`, `delete-category`, `create-sub-category`, `update-sub-category`, `delete-sub-category`.
- [x] Dialog forms with `Form` + `FormControl` + `SubmitButton`; deletes behind `ConfirmDialog`.
- [x] Error mapping: `409 DUPLICATE_RESOURCE` ("name already exists") and `409 FOREIGN_KEY_CONSTRAINT` ("still has sub-categories/products") with specific copy.

## Acceptance criteria

- [x] Full category + sub-category CRUD works against the live API.
- [x] Backend 422s render under the matching inputs (same UI path as Zod errors).
- [x] Both 409s toast their specific human messages.
- [x] A cover image uploads browser → Cloudinary, renders transformed via `cldUrl`, and survives create/edit round-trips.
- [x] `slug` is displayed but never editable and never sent.
- [x] Search + pagination are URL-shareable; page resets to 1 on search change.
- [x] `bun lint` and `bun run build` pass; [tracker](./README.md) updated.

**Phase 2 signed off — 2026-07-16.** All acceptance criteria verified via Playwright as MANAGER against the live API and live Cloudinary; full QA in [`docs/qa/phase-2-qa-report.md`](../qa/phase-2-qa-report.md).
