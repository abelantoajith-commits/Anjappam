---
name: Anjappam
colors:
  surface: '#fff8f5'
  surface-dim: '#f2d5bd'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1e8'
  surface-container: '#ffeada'
  surface-container-high: '#ffe3cd'
  surface-container-highest: '#fbddc5'
  on-surface: '#27180a'
  on-surface-variant: '#514536'
  inverse-surface: '#3e2d1d'
  inverse-on-surface: '#ffeee1'
  outline: '#837564'
  outline-variant: '#d6c4b1'
  surface-tint: '#845400'
  primary: '#845400'
  on-primary: '#ffffff'
  primary-container: '#c98a2b'
  on-primary-container: '#442900'
  inverse-primary: '#ffb958'
  secondary: '#984543'
  on-secondary: '#ffffff'
  secondary-container: '#fe9693'
  on-secondary-container: '#782c2c'
  tertiary: '#4b6728'
  on-tertiary: '#ffffff'
  tertiary-container: '#81a05b'
  on-tertiary-container: '#1e3500'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffddb5'
  primary-fixed-dim: '#ffb958'
  on-primary-fixed: '#2a1800'
  on-primary-fixed-variant: '#643f00'
  secondary-fixed: '#ffdad8'
  secondary-fixed-dim: '#ffb3b0'
  on-secondary-fixed: '#3f0207'
  on-secondary-fixed-variant: '#7a2e2e'
  tertiary-fixed: '#cceea0'
  tertiary-fixed-dim: '#b0d186'
  on-tertiary-fixed: '#102000'
  on-tertiary-fixed-variant: '#344e12'
  background: '#fff8f5'
  on-background: '#27180a'
  surface-variant: '#fbddc5'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 34px
    fontWeight: '600'
    lineHeight: 42px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 2rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system embodies the ethos of humble service, spiritual warmth, and community nourishment rooted in the tradition of shared meals in Kerala. The emotional tone is reverent yet deeply approachable, radiant with hope, avoiding the sterile and transactional aesthetic of corporate charity portals. 

The aesthetic marries organic tactile warmth with modern clarity: pill-shaped capsules, generous breathing room, hand-crafted touchpoints, and soft, natural layering. It balances pastoral reverence—nodding to the biblical motif of the five loaves—with functional accessibility for everyday volunteers, local donors, and community members across Kerala.

## Colors

The palette is derived from wholesome grains, fertile earth, and quiet fellowship:

- **Canvas & Surfaces:**
  - Base Canvas: `#FFF8EE` (Warm, comforting cream)
  - Surface Warm: `#FAF1E4` (Tonal containers, nested cards, card fills)
  - Surface Light: `#FFFFFF` (Elevated content cards, modals, focused inputs)
  - Surface Muted: `#F3E5D0` (Subtle dividers, input fills, passive chips)
- **Primary Accent (Wheat Gold):** `#C98A2B`
  - Used for key action pills, focus highlights, and badges of hope.
  - Hover: `#B37722`, Active: `#9E671B`, Subtle Container: `#F9EEDD`.
- **Primary Dark & Typography (Deep Brown):** `#3B2A1A`
  - High-contrast text, foundational framing, solemn banners, and footers.
  - Muted Text: `#6E553F`, Subtle Borders: `#E6D5C0`.
- **Secondary (Muted Burgundy):** `#7A2E2E`
  - Used for reverent milestones, urgent needs, seasonal drives, and heart accents.
  - Burgundy Light: `#F4E7E7`.
- **Tertiary (Olive Green):** `#5E7B3A`
  - Represents harvest, abundance, "Meals Ready" states, and active fulfillment tags.
  - Olive Light: `#EBF2E3`.

## Typography

Typography establishes an intentional contrast between graceful classic warmth and functional, high-legibility interface design:

- **Playfair Display** serves all display titles, banner intros, and narrative anchors. Its organic serifs provide dignity and quiet reverence.
- **Inter** handles all body content, data tables, status badges, and interactive controls to guarantee pristine legibility on low-spec mobile screens and in outdoor sunlight across Kerala communities.
- Line heights remain spacious across body styles to create a relaxed, welcoming cadence.

## Layout & Spacing

The layout is built around a gentle fluid-grid framework constrained by a generous maximum width of `1200px` for editorial and desktop views:

- **Mobile (< 640px):** 4-column layout with `1rem` margins and `1rem` gaps. Content flows in stacked single-column cards with pill elements spanning full or natural widths.
- **Tablet (640px – 1024px):** 8-column layout with `2rem` margins and `1.25rem` gutters. Food listings and sharing boards reflow into 2-column capsule card pairs.
- **Desktop (> 1024px):** 12-column layout with centered canvas, `3rem` margins, and `2rem` gutters.
- **Spacing Rhythm:** Internal card padding prefers generous breathing room (`space-lg` to `space-xl`) to preserve calm, avoiding cramped utility aesthetics.

## Elevation & Depth

Visual hierarchy relies on organic tonal warmth and diffused ambient lighting rather than artificial elevation tiers:

- **Surface Tiers:**
  - Base Canvas (`#FFF8EE`): Natural background foundation.
  - Embedded Well (`#FAF1E4`): Grouping containers, list backplates, and subtle section wraps.
  - Floating Surface (`#FFFFFF`): Raised interaction cards, modals, and spotlight stories.
- **Ambient Shadows:**
  - Shadows use warm umber tints instead of harsh grays: `hsla(30, 45%, 15%, 0.05)` to `hsla(30, 45%, 15%, 0.08)`.
  - Base Card Shadow: `0 4px 20px -2px rgba(59, 42, 26, 0.06)`.
  - Floating/Modal Shadow: `0 12px 32px -4px rgba(59, 42, 26, 0.10)`.
- **Soft Outlines:** Elements resting on `#FAF1E4` use a hairline border (`1px solid #EADBCA`) to provide gentle hand-drawn definition without hard boundaries.

## Shapes

The shape vocabulary emphasizes softness, community, and hand-molded bread forms:

- **Pill-shaped (Full Roundedness):** Used systematically for buttons, filter tags, search bars, counter chips, and status tags (`rounded-full` / `9999px`).
- **Cards & Enclosures:** Containers adopt large, pill-influenced radii (`2rem` / `32px` on desktop, `1.5rem` / `24px` on mobile), evoking organic plates or sharing baskets.
- **Stacked Lists:** Grouped items are styled as rounded lozenges nested within softly padded containers.

## Components

- **Buttons:**
  - *Primary:* Pill-shaped (`9999px`), background in Wheat Gold (`#C98A2B`), text in White (`#FFFFFF`) or Deep Brown (`#3B2A1A`), with `0.75rem 1.75rem` padding.
  - *Accept / Serve:* Pill-shaped in Olive Green (`#5E7B3A`) with white text.
  - *Secondary / Outlined:* Pill-shaped with a `1.5px` border in `#3B2A1A` or `#C98A2B`, transparent background, and deep brown text.
- **Chips & Badges:**
  - Status chips (e.g., "Available", "Shared", "Grace Kitchen") are pill-shaped with soft tinted fills: Olive (`#EBF2E3` with `#5E7B3A` text) or Wheat (`#F9EEDD` with `#A86F1C` text).
- **Cards (Food Sharing & Meal Drives):**
  - Surface Light (`#FFFFFF`) or Warm (`#FAF1E4`) with `2rem` rounded corners, ambient warm shadows, and subtle padding (`1.5rem` to `2rem`). Cards incorporate an optional subtle wheat sprig accent at the top-right corner.
- **Input Fields:**
  - Fully rounded capsule inputs (`rounded-full`) or soft-pill fields (`1rem` radius) with `#FFFFFF` background, `#E6D5C0` borders, `#3B2A1A` text, and a `#C98A2B` subtle focus ring.
- **Checkboxes & Radios:**
  - Radios are circular with `#C98A2B` fill and white inner dot. Checkboxes feature soft rounded squares (`6px` radius) filled with Olive Green or Wheat Gold upon selection.
- **Five Loaves Counter / Portion Tracker:**
  - Custom component representing available portions as five discrete rounded bread loaf icons, filling with Wheat Gold as meals are pledged.