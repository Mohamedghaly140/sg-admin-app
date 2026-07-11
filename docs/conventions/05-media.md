# 05 — Media (Cloudinary)

Two concerns only: **rendering** images the API gives us, and **uploading** new ones. There is no Cloudinary SDK in this app, no upload preset, no widget, and **never any asset deletion from the frontend** — replacing/removing images through the product/category endpoints triggers backend-side cleanup.

## Rendering

The API returns full delivery URLs as `imageUrl` (e.g. `https://res.cloudinary.com/<cloud>/image/upload/v.../products/abc.jpg`). Apply render-time transforms by inserting a transform segment after `/upload/`:

```ts
// lib/format.ts (or lib/cloudinary-url.ts) — pure string helper, phase 2
export const cldUrl = (imageUrl: string, transform = "f_auto,q_auto,w_400") =>
  imageUrl.replace("/upload/", `/upload/${transform}/`);
```

- Always include `f_auto,q_auto`; add `w_<px>` (and `c_fill,h_<px>` for fixed crops like table thumbnails).
- Use `next/image` with a `remotePatterns` entry for `res.cloudinary.com` in `next.config.ts`.

## Uploading (the only browser-originated network call in the app)

Flow, per [`integration/admin/10-uploads.md`](../integration/admin/10-uploads.md):

```
On form submit, if a new file was picked:
1. Server Action  → POST /admin/uploads/signature { folder: "products" | "categories" }
2. Browser        → POST https://api.cloudinary.com/v1_1/<cloudName>/image/upload
                    multipart/form-data with the signed params, sent exactly as returned
3. Form fields    → imageId = public_id, imageUrl = secure_url  (hidden inputs)
4. Server Action  → product/category endpoint receives imageId + imageUrl
```

The shared **`ImageUploader`** client component (`components/shared/image-uploader/`, built in phase 2) encapsulates steps 1–3: it takes `folder` plus hidden-input names for `imageId`/`imageUrl`, calls a Server Action for the signature, uploads with progress, and previews the result.

`getUploadSignature` is the sanctioned Server Action exception to the standard `ActionState` / `useActionState` form pattern: it is an imperative RPC invoked on form submit if a new file was picked, returns `{ ok: true, data } | { ok: false, message }`, and still redirects for auth/account-disabled failures.

### Rules (from the API contract — enforced client-side where noted)

- Formats: `jpg, jpeg, png, webp` — the restriction is inside the signature; Cloudinary rejects others.
- **Max 5 MB — enforce client-side before uploading** (not part of the signature).
- **Fresh signature per upload** — signatures are time-boxed; never cache one for a batch.
- Send the signed fields (`timestamp`, `folder`, `allowed_formats`) **exactly as returned** — any change invalidates the signature.
- `ImageUploader` validates and previews locally on file-select, then uploads on form submit. Cancelling a dialog after picking a file therefore creates no Cloudinary asset. A narrower orphaning edge remains if the upload succeeds, the subsequent server action fails validation for an unrelated field, and the user then abandons the form; without a frontend deletion endpoint, that case cannot be cleaned up here.
