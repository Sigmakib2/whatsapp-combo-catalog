---
name: Catalog UI/UX design brief
overview: Design brief for a mobile packaging catalog that leads to WhatsApp. Use for UI/UX demos and prototypes. Product rules are fixed; visual craft is open within the constraints.
todos:
  - id: buyer-flow-demo
    content: Demo Path A (direct Inquire) and Path B (inquiry list) on a phone-width frame
    status: pending
  - id: card-states
    content: Show combo card, product card, highlighted card, and empty menu
    status: pending
  - id: inquiry-bar
    content: Show sticky inquiry bar empty-hidden, with 1 item, and with several items
    status: pending
  - id: brand-swap
    content: Show the same layout with a second accent color and business name to prove modular branding
    status: pending
isProject: false
---

# UI/UX design brief — Packaging catalog → WhatsApp

**Audience for this file:** UI/UX designers and demo / prototype builders.  
**Product context:** Bangladesh packaging sellers. Buyers come from Facebook/Instagram ads on phones.  
**Engineering plan (implementation):** `.cursor/plans/whatsapp-combo-catalog.plan.md`  
**Business brief:** `init-plan.md`

Use your own design judgment for typography, spacing craft, microcopy polish, and visual atmosphere. Do **not** invent product features that contradict the constraints below. This is a **lead menu**, not an e-commerce shop.

---

## 1. One-sentence product

A fast, single-page packaging menu where a buyer picks one or more offers and continues the conversation on **WhatsApp** — no cart checkout, no login, no payment on the site.

---

## 2. Why this exists (use case)

### Market reality

- Buyers are local shop owners, small e-commerce brands, and corporate buyers in **Bangladesh**.
- Packaging is customized: size, GSM, print, logo files, MOQ. They rarely “buy now” on a website.
- Habit: negotiate on **WhatsApp**.
- Traffic: mostly **Meta ads** inside in-app browsers on mid-range Android phones, often on slow mobile data.

### Funnel

```text
Meta ad (FB/IG) → Catalog page (this design) → WhatsApp chat (pre-filled) → Human quote
```

### What the site must do

1. Load quickly and make sense in the first screenful on a phone.
2. Show each offer clearly: photo, name, starting price (BDT), MOQ, what’s included (if a combo).
3. Let the buyer either:
   - **Path A:** inquire about **one** offer in one tap, or
   - **Path B:** add **several** offers to an inquiry list and send them in **one** WhatsApp message.
4. Never feel like a broken checkout. Prices are **starting prices**, not final invoices.

### What the owner needs (not the buyer UI)

The owner edits content in Sanity Studio (separate admin). The public design must assume:

- Business name, headline, colors, and button labels can change without redesigning the layout.
- Offers can be combos or single products, hidden, reordered, or photo-swapped.

You do **not** need to design Studio. Focus on the **public catalog**.

---

## 3. Personas

### Buyer — “Rafi” (primary)

- Runs a small online shop from Dhaka.
- Tapped a carousel ad for mailers while scrolling Instagram.
- Wants to know starting price and MOQ, then ask about custom print.
- Impatient; will leave if the page is blank or confusing.
- Comfortable with WhatsApp; not looking for a credit-card checkout.

### Buyer — “Nusrat” (secondary)

- Comparing a **combo pack** and a standalone product (e.g. stickers only).
- Wants to message about **both** in one chat so she doesn’t open WhatsApp twice.

### Owner — “Karim” (indirect)

- Non-technical. Changes prices and photos in a form.
- Cares that the WhatsApp number and button text can be updated without a designer.
- Brand accent may change (default WhatsApp-like green is fine as a starting point).

---

## 4. Hard constraints (do not break)

| Rule | Detail |
| --- | --- |
| **One page** | Only `/`. No product detail pages, cart page, login, or blog. |
| **Mobile first** | Design for ~360–430px width first. Desktop is the same single column, centered, max ~40rem. |
| **No checkout** | No quantity steppers, no “Buy now”, no payment UI, no stock counters. |
| **Path A always works** | “Inquire on WhatsApp” is a real link. Must look and work as the primary action even if JS fails. |
| **Path B is progressive** | “Add to inquiry” + sticky bar may require JS. Hide or de-emphasize if imagining no-JS; never replace Path A. |
| **Inquiry list ≠ cart** | No qty, no totals-as-checkout, no “Proceed to payment”. Label it as inquiry / ask, not cart / bag / checkout. |
| **Max 12 items** in the inquiry list. |
| **Prices** | Format like `Starting at ৳2,500` (BDT, Bangladesh-style grouping ok). Always “starting”, not “price”. |
| **Language** | English UI for v1. Content may later be Bangla via CMS; keep string lengths flexible. |
| **Performance mood** | Feel light: few fonts, no heavy carousels, no modal galleries, no animation libraries for their own sake. |
| **Modular brand** | Colors and labels come from tokens / CMS. Demo at least one accent swap. |

### Explicitly out of scope for the demo

- Search, filters, categories sidebar
- Image zoom lightbox / carousel of many photos per offer
- User accounts, wishlists, coupons
- Messenger / phone-call CTAs as equals to WhatsApp (WhatsApp is the only conversion)
- Multi-step checkout, address forms, file upload for logos
- Dark mode as a requirement (optional exploration only)
- Desktop mega-nav or dashboard layouts

---

## 5. Information architecture

```text
Catalog page
├── Header (business name, headline, subheadline)
├── Offer list (vertical stack of cards)
│   ├── Combo card(s)
│   └── Product card(s)
├── Empty state (if no offers)
├── Sticky inquiry bar (only when list has items; Path B)
└── Footer (disclaimer about starting prices)
```

Deep link: `/?offer={slug}` scrolls to and **highlights** that card (ads can open a specific combo). Invalid slug → full menu, no error page.

---

## 6. Offer types (same card shell)

| Type | Badge | “Included” list |
| --- | --- | --- |
| **Combo** | e.g. “Combo” | Required — bullet list of pack contents |
| **Product** | e.g. “Product” | Optional — omit the whole block if empty |

Everything else is shared: image, name, starting price, MOQ, summary line, actions.

---

## 7. Conversion paths (design both)

### Path A — Direct inquire (primary)

1. Buyer scrolls to an offer.
2. Taps **Inquire on WhatsApp**.
3. WhatsApp opens with a pre-filled message about **that** offer.
4. (Analytics) Meta Lead may fire; do not design a loading spinner that blocks the tap.

**Visual priority:** Primary button = filled accent, full width, ≥44px tall.

### Path B — Inquiry list (secondary, side by side)

1. Buyer taps **Add to inquiry** on offer 1 (button may briefly show “Added”).
2. Sticky bar appears: e.g. “1 in inquiry” + **Ask on WhatsApp** + **Clear**.
3. Adds more offers (max 12). Bar count updates.
4. Taps **Ask on WhatsApp** → one chat listing all selected offers.
5. Clear empties the list and hides the bar.

**Visual priority:** Secondary = outline / quieter than Inquire. Do not look like “Add to cart” from Shopify (no bag icon with checkout metaphor if it confuses). Prefer “inquiry” language.

### Suggested WhatsApp copy (Path B) — for realism in demos

```text
Hi, I am interested in these offers:

1. *Starter Shop Pack* (Combo) — Starting at ৳2,500 — MOQ 300 pcs
2. *Poly Mailers* (Product) — Starting at ৳1,200 — MOQ 500 pcs

Please share sizes, materials, and the final price for my quantity.

Ad: facebook / mailers / carousel-starter
```

(`Ad:` line only when the page URL had UTM params — optional to show in a demo caption.)

---

## 8. Screen & state inventory (build these in the demo)

Design **one main screen** with these states / variants:

| # | State | Notes |
| --- | --- | --- |
| 1 | Default catalog | 2–4 offers mixed combo + product |
| 2 | Ad deep link highlight | One card visually highlighted + scrolled into view |
| 3 | Inquiry bar with 1 item | Bar visible; page content not fully covered |
| 4 | Inquiry bar with 3+ items | Count text, primary Ask, Clear |
| 5 | After “Add” feedback | Card secondary control shows “Added” briefly |
| 6 | Empty menu | Header + calm empty message, no fake CTAs |
| 7 | Brand swap | Same layout, different business name + accent color |
| 8 | Long content stress | Long offer name, long included list, long footer — no overflow bugs |

Optional: a tiny “no JS” annotation frame where only Inquire shows and Add is absent.

---

## 9. Component brief

### 9.1 Header

- **Business name** — strongest brand signal on the page (not a tiny nav logo only).
- Headline (one line).
- Subheadline (short paragraph).
- No hamburger menu. No extra links.

### 9.2 Offer card

Top → bottom:

1. **Image** — 4:3, product/packaging photography. First card eager; others lazy (note for eng).
2. **Badge** — Combo / Product.
3. **Name** — clear hierarchy.
4. **Starting price** — second strongest after name (`Starting at ৳…`).
5. **MOQ** — e.g. `MOQ 300 pcs`.
6. **Summary** — optional one-liner.
7. **Included** — only if items exist; labelled e.g. “Included”.
8. **Actions** (stacked, full width):
   - Primary: Inquire on WhatsApp
   - Secondary: Add to inquiry

**Highlight state:** visible accent border/ring when `?offer=` matches — readable next to the primary button color.

### 9.3 Inquiry bar

- Sticky bottom.
- Shows count (`{count} in inquiry`).
- Primary: Ask on WhatsApp.
- Secondary text button: Clear.
- Must not permanently hide the last card’s actions — add bottom safe padding on the page when bar is open.
- Feels like a **message composition helper**, not a mini-cart with prices summing to “Pay ৳X”.

### 9.4 Footer

One disclaimer line, e.g. starting prices depend on size, material, print, quantity; final price confirmed on WhatsApp.

### 9.5 Empty state

Quiet, centered under header. No decorative empty cart illustration that implies shopping bag checkout.

---

## 10. Visual direction (guidance, not a locked brand)

### Goals

- Trustworthy B2B packaging supplier.
- Readable on a bright phone outdoors.
- Accent clearly marks WhatsApp actions.
- Layout stays modular so another seller can recolor without redesign.

### Suggested starting tokens (demo defaults)

| Token | Suggestion | Notes |
| --- | --- | --- |
| Background | Warm off-white / paper light | Avoid flat pure `#fff` only; keep subtle |
| Surface (cards) | White / slightly lifted | Prefer light border over heavy shadow |
| Text | Near-black | Strong contrast |
| Muted text | Mid gray | MOQ, summary |
| Accent | `#128C7E` (WhatsApp-adjacent teal-green) | Buttons + highlight; overridable |
| Accent text | White | On filled buttons |
| Focus | Visible blue or strong outline | Keyboard / a11y |
| Radius | Modest (e.g. 8px) | Not pill-everything |
| Font | System UI stack | No fancy web font required for v1 |
| Content width | ~40rem max | Single column |

### Avoid (common AI-demo clichés)

- Purple-to-indigo gradients as the whole theme
- Cream page + terracotta + big serif “editorial” look unless the client brand truly is that
- Dense newspaper / broadsheet columns
- Glowing glassmorphism, neon, dark cyber dashboards
- Floating badge stickers all over the hero image
- Fake stats row (“2k+ happy clients”) on the first screen

### Motion (keep minimal)

If you animate: (1) inquiry bar slide-up, (2) brief “Added” confirmation, (3) smooth scroll to highlighted offer. Respect reduced-motion (instant scroll / no slide).

---

## 11. Sample content for realistic demos

**Business:** Northline Packaging  

**Headline:** Packaging for your shop  

**Subheadline:** Browse combo packs and single products, then message us on WhatsApp. We will confirm size, print, and the final price.

| Type | Name | Price | MOQ | Summary | Included |
| --- | --- | --- | --- | --- | --- |
| Combo | Starter Shop Pack | ৳2,500 | 300 pcs | For a first order | Poly mailers, Thank-you cards, Round stickers |
| Combo | Brand Mailer Pack | ৳6,500 | 500 pcs | For shops that print their logo | Printed mailers, Tissue paper, Logo stickers, Thank-you cards |
| Product | Poly Mailers | ৳1,200 | 500 pcs | Plain mailers, no print | — |

Use real-looking packaging photos or simple flat mock packs — not abstract 3D gradients.

---

## 12. Default UI strings (editable later in CMS)

| Key | Default |
| --- | --- |
| Inquire | Inquire on WhatsApp |
| Add | Add to inquiry |
| Bar count | `{count} in inquiry` |
| Ask list | Ask on WhatsApp |
| Clear | Clear |
| Added feedback | Added |
| Empty | Offers will appear here after they are published. |
| Badges | Combo / Product |
| Price prefix | Starting at |
| Items heading | Included |

Design so longer Bangla or alternate English labels still fit (buttons wrap or stay full-width stacked).

---

## 13. Accessibility & usability checklist

- Tap targets ≥ 44×44px.
- Focus rings visible on links/buttons.
- Image `alt` text meaningful (offer name / description).
- Color contrast: text and accent button labels WCAG AA where practical.
- Don’t rely on color alone for Combo vs Product (badge text required).
- Sticky bar: announce count updates politely (demo can note `aria-live` for eng).
- Highlighted card still readable if accent is customized to a light color (demo brand-swap with a dark accent too).

---

## 14. What you may invent freely

- Exact spacing scale, type sizes, card padding.
- Badge shape (subtle pill vs quiet tag) — keep small.
- Secondary button style (outline, ghost, text+icon).
- Empty-state illustration **if** it doesn’t read as “shopping cart empty”.
- Micro-interactions for Add / bar.
- A second brand skin (e.g. navy accent, different business name) to prove modularity.
- Presentation format: Figma, Framer, Webflow, static HTML demo — your choice.

---

## 15. What to deliver

1. **Phone-frame prototype** of the catalog with Path A and Path B clickable.
2. **State set** listed in section 8 (or clearly labelled frames).
3. **Annotation layer** (or short notes) calling out:
   - Primary vs secondary actions
   - Inquiry bar ≠ checkout
   - Modular accent / labels
   - Deep-link highlight
4. **Optional:** one desktop frame showing the same single column centered (not a redesign).
5. **Export:** shareable link + (if possible) specs or a simple token list matching section 10.

---

## 16. Success criteria for the design

A reviewer should answer **yes** to all:

- [ ] I understand what to do in under 5 seconds on a phone mock.
- [ ] I can inquire about one offer without hunting.
- [ ] I can inquire about several offers without thinking it’s a payment cart.
- [ ] Starting prices and MOQ are obvious.
- [ ] Combo vs product is clear.
- [ ] The business name feels like the brand owner of the page.
- [ ] Changing accent color wouldn’t require a new layout.
- [ ] Nothing suggests login, payment, or a multi-page store.

---

## 17. Reference flows (copy into prototype notes)

### Flow A

```text
Land → See header → Scroll to Brand Mailer Pack → Inquire on WhatsApp → External WhatsApp
```

### Flow B

```text
Land → Add Starter Shop Pack → Bar appears → Add Poly Mailers → Ask on WhatsApp → External WhatsApp (multi-line) → List clears
```

### Flow C (ad)

```text
Land with ?offer=starter-shop-pack → Card highlighted in view → Inquire or Add
```

---

## 18. Relationship to engineering

Engineering will implement this as a **static** page (Astro): HTML first, small JS for inquiry list / highlight / analytics. Prefer designs that:

- Work as plain stacked HTML/CSS.
- Don’t depend on client-only React widgets.
- Keep the Inquire control as a normal link in the prototype’s mental model.

If a visual idea needs a heavy JS library or a second route, drop it or mark it “future / out of scope”.

---

*End of brief. Prefer clarity and conversion over novelty.*
