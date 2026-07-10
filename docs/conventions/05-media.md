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
1. Server Action  → POST /admin/uploads/signature { folder: "products" | "categories" }
2. Browser        → POST https://api.cloudinary.com/v1_1/<cloudName>/image/upload
                    multipart/form-data with the signed params, sent exactly as returned
3. Form fields    → imageId = public_id, imageUrl = secure_url  (hidden inputs)
4. Server Action  → product/category endpoint receives imageId + imageUrl
```

The shared **`ImageUploader`** client component (`components/shared/image-uploader/`, built in phase 2) encapsulates steps 1–3: it takes `folder` and an `onUploaded({ imageId, imageUrl })` callback (or hidden-input names), calls a Server Action for the signature, uploads with progress, and previews the result.

### Rules (from the API contract — enforced client-side where noted)

- Formats: `jpg, jpeg, png, webp` — the restriction is inside the signature; Cloudinary rejects others.
- **Max 5 MB — enforce client-side before uploading** (not part of the signature).
- **Fresh signature per upload** — signatures are time-boxed; never cache one for a batch.
- Send the signed fields (`timestamp`, `folder`, `allowed_formats`) **exactly as returned** — any change invalidates the signature.
- Upload as late as UX allows (on save, not on file-pick) — an abandoned form after upload orphans the asset in Cloudinary.
