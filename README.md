# Packaging catalog (WhatsApp)

SSR menu for packaging **combo packs** and **single products**. Buyers inquire on WhatsApp. The owner edits content in Sanity Studio. Publish updates the live site within seconds via cache revalidation (not a full rebuild).

- **Public site:** Vercel + Astro SSR (`npm run build`)
- **Studio:** `studio/` — run/deploy from your machine (`npm run studio` / `npm run studio:deploy`)

## Quick start (local site, sample data)

```bash
npm install
cp .env.example .env
npm run dev
```

Open the URL Astro prints (usually `http://localhost:4321`). No Sanity project is required for local sample offers.

With Sanity filled in `.env`, `npm run dev` loads live published content on each request.

```bash
npm test
npm run build
npm run preview
```

## Sanity Studio (in this repo)

Studio is a separate package so Cloudflare never installs it as part of the site app.

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage) with a **public** dataset named `production`.
2. Fill both env files with the same project id and dataset:

```bash
cp .env.example .env
cp studio/.env.example studio/.env
```

Root `.env` (site):

```text
SANITY_PROJECT_ID=yourProjectId
SANITY_DATASET=production
PUBLIC_SITE_URL=https://your-app.vercel.app
REVALIDATE_SECRET=long-random-string
```

`studio/.env`:

```text
SANITY_STUDIO_PROJECT_ID=yourProjectId
SANITY_STUDIO_DATASET=production
```

3. Install and run Studio locally:

```bash
npm install --prefix studio
npm run studio
```

Sign in at `http://localhost:3333`. Create and **Publish** Site settings and at least one Offer.

4. Deploy Studio to Sanity’s hosting (not Cloudflare):

```bash
npm run studio:deploy
```

Invite the owner as Administrator. They edit at `https://YOUR-HOSTNAME.sanity.studio`.

## Vercel (SSR)

1. Import this GitHub repository into [Vercel](https://vercel.com/new).
2. Framework preset: **Astro** (auto-detected).
3. Build command: `npm run build` (default).
4. Node.js version: `24` (Project Settings → General, or `.node-version`).
5. Environment variables (Production and Preview):

| Name | Value |
| --- | --- |
| `SANITY_PROJECT_ID` | your project id |
| `SANITY_DATASET` | `production` |
| `PUBLIC_SITE_URL` | your production URL (no trailing slash), e.g. `https://your-app.vercel.app` |
| `REVALIDATE_SECRET` | long random string (also used as ISR bypass token — set **before** the first production build) |

A Vercel deploy without Sanity env vars **fails on purpose** so sample data never goes live.

Hobby is fine to try; a live business site usually needs **Pro**.

### Publish → instant update (webhook)

Content changes do **not** need a full Vercel rebuild. Sanity calls the revalidate API, which busts the ISR cache. The next visitor gets fresh SSR HTML from Sanity.

1. In Sanity → API → Webhooks:

| Setting | Value |
| --- | --- |
| URL | `https://YOUR_DOMAIN/api/revalidate` |
| HTTP headers | `x-revalidate-secret: YOUR_REVALIDATE_SECRET` |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| Filter | `_type in ["offer", "siteSettings"]` |
| Drafts | **Off** |
| Versions | Off |
| Method | POST |

Drafts must stay off or every Studio keystroke can thrash the cache.

2. After Publish: wait a few seconds, hard-refresh the live site.

Git push is only needed when **code** changes, not when offers change.

## Owner workflow

1. Open hosted Studio (`*.sanity.studio`).
2. Edit Site settings or an Offer.
3. Press **Publish**.
4. Within seconds (after cache purge), check the live catalog.

Hide an offer with `hidden`. Reorder with `sortOrder`. Add several photos under **Images** in Studio (first photo is the menu cover; all show on the detail page).

## Ad links

Prefer the detail URL:

```text
/offer/{slug}?utm_source=facebook&utm_campaign={{campaign.name}}&utm_content={{ad.name}}
```

`/?offer={slug}` and `/?combo={slug}` still work — they redirect to `/offer/{slug}`.

On the menu, tapping an offer image or title opens that detail page.

## Buyer actions

- **Open offer** — image or title → `/offer/{slug}`.
- **Inquire on WhatsApp** — one offer (works without JavaScript).
- **Add to inquiry** — build a list, then **Ask on WhatsApp** from the sticky bar (needs JavaScript; not a checkout cart).
