# Project Brief: High-Converting Packaging Combo Catalog & Direct WhatsApp Funnel

---

## 1. Executive Summary

This project establishes a low-cost, high-converting digital catalog system tailored specifically for the packaging supply market in Bangladesh. Instead of a traditional e-commerce cart—which introduces high user friction and fails to handle custom B2B printing needs (logos, GSM, sizes, order quantities)—this strategy uses a lightweight, menu-style static website paired with a pre-filled **WhatsApp lead generator** and **Meta Ad tracking**.

---

## 2. Business Use Case & Market Context

* **Target Audience:** Local business owners, e-commerce brand founders, and corporate buyers in Bangladesh.
* **Core Problem:** B2B packaging orders are highly customized. Buyers rarely purchase packages via direct e-commerce gateways; they require direct consultation to negotiate, share vector/logo files, request samples, and confirm Minimum Order Quantities (MOQs).
* **Current Market Habit:** Buyers prefer communicating directly through direct messaging apps like WhatsApp or Messenger.
* **The Funnel Architecture:**
  $$\text{Meta Ad (FB/IG)} \longrightarrow \text{Fast Static Combo Menu} \longrightarrow \text{1-Click WhatsApp Direct Chat}$$

---

## 3. Key Business & Technical Requirements

### Client & Operational Constraints
* **Non-Technical Management:** The owner cannot touch or edit HTML, CSS, or JSON files directly. All edits must occur through a clear, form-based dashboard.
* **Strict Zero-Cost Server Hosting:** Zero ongoing monthly infrastructure or server maintenance costs ($0/month hosting & database).
* **High Performance for Mobile Ads:** Over 90% of Facebook ad traffic arrives via smartphones. Pages must load under 1 second, even on slow mobile networks.

### Functional Requirements
* **Combo Menu Cards:** Visual cards displaying package title, price (BDT), list of included items (e.g., mailers, stickers, thank-you cards), and package image.
* **WhatsApp Deep-Linking:** Dynamic "Inquire via WhatsApp" buttons on each combo card embedded with unique pre-filled messages:
  `https://wa.me/8801XXXXXXXXX?text=Hi,%20I%20am%20interested%20in%20the%20*Starter%20Packaging%20Combo*.`
* **Ad Tracking & Conversion Integration:** Meta Pixel event listeners (`fbq('track', 'Lead')`) attached directly to the WhatsApp button clicks.

---

## 4. Architecture & Recommended Tech Stack

| Layer | Recommended Technology | Why Chosen |
| :--- | :--- | :--- |
| **Frontend Hosting** | **Cloudflare Pages** | 100% Free static hosting, global CDN, instant loading, sub-second deployment. |
| **Backend CMS** | **Sanity CMS** | Free tier (10k docs, 20 users), auto-generates admin UI, battle-tested cloud API. |
| **Frontend Framework** | **Astro / Next.js / HTML** | Modern static site generator (SSG) with zero runtime bundle overhead. |
| **Ad Engine** | **Meta Ads Manager** | Running "Leads" objective campaigns targeted at Bangladesh business owners. |


```

```
             ┌──────────────────────────────────────┐
             │          Owner / Client              │
             │   (Edits Combos via Sanity Dashboard) │
             └──────────────────┬───────────────────┘
                                │ (Publish Event)
                                ▼

```

┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   Meta Pixel     │◄──── │ Cloudflare Pages │ ◄─── │    Sanity CMS    │
│ (Tracks 'Lead')  │      │  (Static Site)   │      │ (Content Engine) │
└──────────────────┘      └─────────┬────────┘      └──────────────────┘
│
│ (User clicks "Inquire")
▼
┌──────────────────┐
│   WhatsApp Chat  │
└──────────────────┘

```

---

## 5. Final Recommendations

### 1. CMS & Content Workflow
Use **Sanity CMS** paired with Cloudflare Pages deploy hooks. Define a simple schema for the owner:
* `Combo Name` (Text)
* `Price (BDT)` (Number)
* `Included Items` (List/Text)
* `Combo Image` (Image Upload)
* `Custom WhatsApp Text` (Text)

When the owner hits **"Publish"** in the dashboard, Sanity triggers a Cloudflare deploy hook to update the live menu page automatically in under 20 seconds.

### 2. Advertising Strategy
* **Campaign Objective:** **Leads** (Conversion Location: **Website**).
* **Optimization Event:** **`Lead`** (Triggered via Meta Pixel whenever a user taps the WhatsApp inquiry button).
* **Creative Format:** **Carousel Ads** showcasing individual packaging combos side-by-side, or a short mobile video unboxing the materials.
* **Retargeting:** Create a custom audience targeting site visitors who viewed the combo menu within 30 days but didn't tap the WhatsApp button.

---

## 6. Implementation Checklist

- [ ] **Step 1:** Set up Cloudflare Pages project connected to a GitHub repository.
- [ ] **Step 2:** Define Sanity CMS schema for the Combo Cards and deploy Sanity Studio (`admin.yourdomain.com`).
- [ ] **Step 3:** Configure Meta Pixel base script and bind `fbq('track', 'Lead')` to all WhatsApp CTA button click handlers.
- [ ] **Step 4:** Set up Cloudflare build webhook inside Sanity project settings.
- [ ] **Step 5:** Record a brief 2-minute video walkthrough showing the owner how to add and publish combos.
- [ ] **Step 6:** Launch Meta Ad campaign optimized for `Lead` conversions.