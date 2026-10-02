# AGENTS.md

Guidance for any coding agent working in this repository. The human's latest message wins over this file. This file wins over guesses.

## Project

A packaging catalog for Bangladesh. Buyers arrive from a Meta ad on a phone, browse combo packs and single products, and open WhatsApp. The owner edits offers in a form. There is no server to operate and no monthly hosting bill.

- Business brief: `init-plan.md`
- Build spec: `.cursor/plans/whatsapp-combo-catalog.plan.md`

Read the plan before writing code. Follow its todos in order. If this file and the plan disagree about an implementation detail, the plan wins. If a task is not in the plan, do not add it.

## Stack

| Layer | Use |
| --- | --- |
| Public site | Astro 7 SSR on Vercel. React `.tsx` rendered on the server to HTML. Images from Sanity CDN. Publish → `/api/revalidate` refreshes the ISR/edge cache for near-instant updates. |
| Editing | Sanity Studio 6 in `studio/`, its own package. Offer documents (`combo` or `product`) plus one `siteSettings` document. |
| Hosting | Vercel (SSR). `npm run build`. |
| Runtime | Node 24 for builds (`.node-version`). Requests run on Vercel. |
| Tests | `node --test` on `src/lib/whatsapp.test.ts`. |

React in `src/` renders on the server only. Never add a `client:*` directive, and do not use hooks, event handlers, or browser APIs in `src/components/`. Browser behavior goes in `src/scripts/catalog.ts`. The root `package.json` must not depend on `sanity` (Studio package). Do not add Next.js, Tailwind, a React and Vite SPA, or a custom admin.

## Product rules

- The WhatsApp link is the conversion. Path A: an `<a href="https://wa.me/...">` on each card must work with JavaScript off. Path B: an inquiry list (localStorage, max 12) can send several offers in one WhatsApp message; it needs JS and is not a checkout cart (no qty, no payment).
- Prices are starting prices in BDT, shown as `Starting at ৳1,200`. They are not checkout prices.
- Offers are either `combo` (pack with included items) or `product` (single item; items list may be empty). Same card layout.
- The owner changes the phone number, Pixel ID, prices, photos, copy, accent color, and labels in Sanity. Do not hardcode those in components.
- Default colors and spacing live in `src/styles/tokens.css`. Default UI words live in `src/lib/brand.ts`. Components use CSS variables and a `Brand` object only.
- Hidden offers and offers without an image do not appear.
- `?offer={slug}` highlights that card (`?combo=` is an alias). A bad slug still shows the full menu.
- When the page URL has `utm_source`, `utm_campaign`, or `utm_content`, the pre-filled WhatsApp text gains an `Ad:` line after JavaScript runs. The no-JS Path A link still names the offer and omits that line.
- A Meta `Lead` fires on WhatsApp navigation only (not on Add to inquiry): Path A uses `packaging-combo` or `packaging-product`; Path B uses `packaging-inquiry`. Do not delay or block navigation. If the Pixel ID is empty, do not load the Meta script.

## Commands

The app is not scaffolded until the plan's first todo is done. After it exists:

- Install: `npm install`
- Install Studio: `npm install --prefix studio`
- Dev (sample data, no Sanity required): `npm run dev`
- Test: `npm test`
- Production build: `npm run build`
- Studio: `npm run studio`

Run `npm test` after any change to `src/lib/whatsapp.ts`. Run `npm run build` after any change to the page or content loader. Run `npm run studio` after any change to `studio/`.

## Code map

Implement only the files listed in the plan. Message text, phone normalization, and `wa.me` URLs live in `src/lib/whatsapp.ts` with no DOM and no Sanity imports. `src/scripts/catalog.ts` imports that module. Pages receive plain `Offer` objects from `src/lib/content.ts`. `studio/` never imports from `src/`.

Local preview may use `src/data/fallback.json`. A production / Vercel build with no Sanity env vars must fail. Do not deploy sample combos.

## Known traps

- Catalog fetch uses `useCdn: false` so a publish is visible as soon as the cache is revalidated.
- The GROQ projection includes `hotspot` and `crop`, or the owner's focal point is lost.
- Build `wa.me` query strings with `encodeURIComponent`. `URLSearchParams` turns spaces into `+`.
- Render the Pixel snippet with `is:inline set:html`, not `define:vars`.
- Astro 7 rejects unclosed HTML tags.
- Studio env vars must start with `SANITY_STUDIO_` and be referenced in full as `process.env.SANITY_STUDIO_...`.
- The Sanity webhook keeps Drafts off. Otherwise each keystroke thrash-revalidates the cache.
- Set `REVALIDATE_SECRET` in Vercel **before** build so ISR bypass and `/api/revalidate` share the same token.

## Style

- TypeScript, strict. ESM imports.
- React function components for the page UI (`CatalogHeader`, `OfferCard`, `InquiryBar`, `CatalogFooter`, `EmptyMenu`), Astro for the page shell and `<head>`.
- Design tokens: `src/styles/tokens.css`. Layout styles: `src/styles/global.css` (variables only, no raw hex).
- Brand defaults and `resolveBrand`: `src/lib/brand.ts`. Pass `brand` into components. Do not hardcode business name, button labels, inquiry copy, badges, or footer copy.
- Astro's `<Image>` is not used in `.tsx`. Offer images use Sanity CDN URLs (`imageUrl` / `imageSrcSet`) prepared in `content.ts`.
- System font from `--font-family`. No web fonts, carousels, modals, or animation libraries.
- Content width `--content-max`, tap target `--tap-min`. Accent from `--color-accent`, overridable by Sanity `accentColor`.
- Match names in the plan: `offer`, `offerType`, `startingPrice`, `whatsappText`, `sortOrder`, `siteSettings`, `resolveBrand`, `composeInquiryText`, `composeInquiryListText`, `buildWhatsAppUrl`.
- Content updates: Sanity webhook → `POST /api/revalidate` (not a full Vercel rebuild). Keep `REVALIDATE_SECRET` out of git.

## Security

- Do not commit `.env`, `studio/.env`, Sanity tokens, or deploy secrets.
- The Sanity dataset is public. Do not add a read token to the static site.
- Validate the WhatsApp number as `^8801\d{9}$`, the Pixel ID as empty or `^\d{5,20}$`, and `accentColor` as empty or `^#[0-9A-Fa-f]{6}$`.

## Before you finish

1. `npm test` passes.
2. `npm run build` succeeds for the case you changed, on Node 24.
3. The plan's Acceptance section still holds for the behavior you touched.
4. You did not add a checkout cart, login, payment, file upload, or a new page. An inquiry list (Path B) is allowed as specified in the plan.

## Commits

Commit only when the human asks. Do not push unless they ask. Leave `init-plan.md` and the plan file unchanged unless they ask to update the spec.
