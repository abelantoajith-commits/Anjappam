# Anjappam — Product Requirements Document (PRD)

**Document purpose:** Build brief for Antigravity (AI coding agent) to design and implement the Anjappam website.
**Version:** 2.0 | **Status:** Ready for build
**Scope change in v2.0:** Frontend only (no backend, no database server). Must deploy on Vercel as a static site.

---

## 1. Product Overview

**Anjappam** is a Christian charitable initiative and website where restaurant owners, caterers and individuals can give away their **excess food for free** to people and institutions in need.

**Name / brand story (assumption):** "Anjappam" means "five breads" in Malayalam, echoing the feeding of the five thousand with five loaves. Use this as a subtle brand motif (warm bread/loaf imagery, gentle tone).

**Mission:** Reduce food waste and hunger by connecting those who have surplus food with those who need it, as an act of Christian love and service.

**Region (assumption):** Kerala, India (Kochi area first). Use Indian phone formats (+91), Indian English, and Kerala localities in sample data.

---

## 2. Scope: Frontend-Only Build

This version is a **fully working frontend prototype**. There is **no server, no external database and no paid third-party service**.

- All data (users, donations, requests) is stored in the browser's **`localStorage`**.
- Authentication is **simulated on the client** (see §9).
- The app ships with **seed (sample) data** so every page looks populated on first load.
- Data access goes through a **service layer** (`src/services/`) so a real backend (Supabase, Firebase, etc.) can replace it later without rewriting the UI.

### Known limitations (must be shown in a README and a small "Demo mode" notice in the footer)
1. Data lives only in the current browser. A donation posted on one device will **not** appear on another device or for another user.
2. Passwords stored locally are **not secure** and must not be real passwords. Show a note on Sign Up: "Demo version: do not use a password you use elsewhere."
3. Contact details are shown only from locally stored data. There is no real notification (SMS/email) to anyone.

---

## 3. Goals & Non-Goals

### Goals
- Let donors post surplus food (item, quantity, date, time, location).
- Let receivers browse donations and accept them.
- Let receivers post requests, and donors accept them.
- Present a warm, trustworthy, faith-inspired homepage.
- Deploy to Vercel with zero configuration beyond a standard build.

### Non-Goals (v1)
- No backend, database server, serverless functions or API routes.
- No real email/SMS/OTP, payments, maps API, chat or delivery tracking.
- No admin panel.
- No native mobile app (responsive web only).

---

## 4. Users & Roles

| Role | Who | Can do |
|---|---|---|
| **Visitor** | Anyone not logged in | View Home, view Receive list (read-only), use Login/Sign Up |
| **Donor** | Restaurants, caterers, individuals | Post donations, view own donations, view receiver requests, accept requests |
| **Receiver** | Orphanages, shelters, churches, NGOs, individuals | Browse donations, accept donations, post food requests |

User type is chosen at sign-up and controls available actions (enforced in the UI via route guards and conditional buttons).

---

## 5. Tech Stack & Deployment

- **Framework:** React 18 + Vite
- **Routing:** React Router (client-side routing)
- **Styling:** Tailwind CSS
- **State:** React Context (`AuthContext`, `DataContext`) + `localStorage`
- **Icons:** lucide-react
- **Fonts:** Playfair Display (headings) + Inter (body) via Google Fonts or `@fontsource`
- **No backend packages** (no Firebase, Supabase, Express, etc.)

### Vercel deployment requirements
- Build command: `npm run build`; output directory: `dist`; framework preset: **Vite**.
- Include a **`vercel.json`** so deep links (e.g., `/receive`, `/requests`) do not 404 on refresh:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
- No environment variables required.
- All images must be either bundled in `/public` / `/src/assets` or loaded from free CDNs (e.g., Unsplash URLs). No local file system dependencies.
- The README must include deploy steps: push to GitHub → import repo in Vercel → click Deploy (or `npx vercel` from the CLI).
- The app must pass `npm run build` with no errors or warnings that block the build.

---

## 6. Design Direction

- **Mood:** Warm, hopeful, reverent, welcoming. Not corporate, not preachy.
- **Palette:** Cream background `#FFF8EE`, wheat-gold accent `#C98A2B`, deep brown text `#3B2A1A`, olive green success `#5E7B3A`, muted burgundy secondary `#7A2E2E`. Define as CSS variables / Tailwind theme tokens.
- **Imagery:** Bread, shared tables, hands giving food, community meals. Use royalty-free images, easy to swap.
- **Components:** Rounded cards, pill/capsule buttons and list rows, soft shadows, generous whitespace.
- **Responsive:** Mobile-first; must work at 360px width.
- **Accessibility:** WCAG AA contrast, keyboard navigation, alt text, labelled form fields.
- (Optional) If Google Stitch designs exist for these pages, treat them as the visual reference and match them.

---

## 7. Global Layout

### Navigation bar (all pages)
- **3-Column Centering:** Exact horizontal centering of the Anjappam wordmark/logo using a 3-column layout (`grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]`) independent of the widths of left and right elements.
- **Left:** `Requests` button (and desktop quick links "I Have Food" and "I Need Food").
- **Center:** Anjappam logo/wordmark linking to Home, never wrapping onto two lines.
- **Right:** `Login` button (becomes user account dropdown when logged in).
- **Mobile (360px):** Wordmark remains locked in the exact horizontal center; "Requests" and "Login" collapse into compact icon buttons or hamburger menu.
- **Login & Sign Up Pages:** Anjappam logo and wordmark are centered above the form card.

### Footer
Tagline, links (Home, I Have Food, I Need Food, Requests, Registration Form), placeholder contact, food-safety disclaimer, "A Christian initiative" line, and a small "Demo version — data is stored in your browser" note.

---

## 8. Pages & Features

### 8.1 Home Page (`/`)

**Hero**
- Large title **ANJAPPAM** (centered text and container).
- Rotating **Bible quote** (see §10): centered verse, reference, and carousel dot indicators; changes automatically every ~8 seconds with a fade, pauses on hover.
- Two buttons (centered horizontally): **I Have Food** (gold filled pill) → `/donate`, **I Need Food** (outlined pill) → `/receive`.

**Saints on Sharing Food**
- Rotating feature placed immediately after the hero block and before the Impact counters.
- 5 Christian saints renowned for hospitality, charity, and feeding the poor (Mother Teresa, St. Anthony of Padua, St. Elizabeth of Hungary, St. Vincent de Paul, St. Nicholas).
- Rotates automatically every 10s with crossfade (~600ms), previous/next arrow controls, dot indicators, pause on hover/focus, and prefers-reduced-motion support.
- Renders entries according to kind: quotes with quotation marks and italic serif, "about" with author attribution, "teaching" and "tradition" with descriptive labels in regular serif.
- Uses transparent cutout images with warm gold backdrop arches/glows, rendered with `object-contain`.

**Scroll sections** (layout inspired by feedingindia.org for structure only; do not copy content, branding or assets):
1. **Impact counters** (animated on scroll): Meals shared, Active donors, Receiving institutions, Cities served. Placeholder numbers; optionally derive "Meals shared" from locally stored accepted donations plus a base number.
2. **How it works** (4 steps): donor posts → receiver accepts → pickup arranged → food reaches those in need.
3. **Who can give / who can receive** (two cards): action buttons labeled **I Have Food** (gold filled pill) and **I Need Food** (outlined pill).
4. **Why food waste matters** (short paragraph + 3 highlights).
5. **Stories / testimonials** (placeholder cards).
6. **Closing emphasis section, "Sharing food is an act of kindness":** feature **Matthew 25:40** as a large pull-quote: *"Verily I say unto you, Inasmuch as ye have done it unto one of the least of these my brethren, ye have done it unto me."* Support with 2–3 paragraphs on dignity, community, Christ's call to serve, and turning waste into blessing. End with **I Have Food** / **I Need Food** buttons.

### 8.2 Donate Page (`/donate`)

- Heading: **"Every Donation Matters"** with a short supporting line.
- Login required to submit; Visitors are redirected to Login and returned afterward.
- **Form fields:**

  | Field | Type | Validation |
  |---|---|---|
  | Item | Text with suggestions (Biriyani, Rice, Chapati, Bread) | Required |
  | Quantity | Number | Required, > 0 |
  | Unit | Dropdown: Plates / Packets / Kg / Litres | Required |
  | Date | Date picker | Required, not in the past |
  | Time | Time picker (pickup-by) | Required |
  | Location | Text address | Required |

- **Add button:** saves the entry (to `localStorage`) and shows it in the **bottom section** ("Your Donations") as capsule cards with Edit / Remove and a status (Available / Accepted by [Receiver name]). Multiple entries allowed; entries persist on refresh.
- Success toast: "Thank you! Your donation has been added."

### 8.3 Receive Page (`/receive`)

- Heading: **"Food Available Near You"**.
- **Capsule list** of all available donations, newest first. Each capsule: `Item · Quantity · Date/Time · Location · [Accept]`
  Example: `Biriyani · 50 plates · 10 Nov, 6:00 PM · Edappally, Kochi · [Accept]`
- **Accept:**
  - Visitor → redirected to Login.
  - Donor → button disabled with tooltip "Only receivers can accept".
  - Receiver → confirmation dialog; status becomes **Accepted**, donor contact (name, phone) is revealed to the receiver, capsule leaves the available list.
- **Search and filters:** by item, location, date.
- **Request Food** (logged-in Receivers): opens a form (Item, Quantity, Location, Needed-by date/time); saved requests appear on the Requests page.
- Empty state with friendly message.
- Donations whose date/time has passed are shown as **expired** and hidden (computed on load).

### 8.4 Requests Page (`/requests`)

- Opened via the top-left **Requests** button.
- Capsule list of food requests: `Biriyani · 50 · Needed by 7 PM · Location · [Accept]`
- **Accept (Donors only):** request becomes **Accepted**, requester's contact is revealed to the donor.
- Receivers see their own requests with status. Visitors are redirected to Login.

### 8.5 Login Page (`/login`)
- Username and Password (show-password toggle), Login button, clear error messages.
- "Don't have an account? **Sign up**" link.
- After login: return to the previous page, or Donate (Donors) / Receive (Receivers).

### 8.6 Sign Up Page (`/signup`)

| Field | Type | Validation |
|---|---|---|
| Name of the institution | Text | Required (individuals may enter "Individual") |
| Name of the contact | Text | Required |
| Phone number | Tel | Required, 10-digit Indian mobile |
| User type | Radio: Donor / Receiver | Required |
| Username | Text | Required, unique in local storage, 4–20 chars |
| Password | Password | Required, min 8 chars |
| Repeat password | Password | Must match |

- Inline validation; on success create the account, auto-login, redirect by user type.
- Show the demo-mode password notice (see §2).

### 8.7 Donor Ratings & Reviews (`/donors/:id`)

- **Rating Eligibility & Flow:**
  - Only logged-in Receivers can rate, and only for donations they previously accepted and marked as "Picked up".
  - Status progression for donations: `available` → `accepted` → `completed` (marked as picked up).
  - One rating per donation per receiver; editing afterwards is allowed without creating duplicates.
  - Donors cannot rate themselves or others. Visitors can view ratings but cannot submit ratings.
- **Rating Specification:**
  - Whole numbers: 1 to 5 stars.
  - Optional review comment: up to 200 characters (sanitized/escaped on render).
- **Pick-up and Rating UX:**
  - Receive page provides a "My Claimed Meals" view for logged-in receivers.
  - Accepted donations display a "Mark as picked up" button.
  - Confirming pickup prompts an immediate "Rate this donor" dialog with interactive star selector (arrow key and click accessible), character counter, and Submit / Skip options.
  - Skipped donations retain a "Rate now" button; already-rated donations offer an "Edit rating" button.
- **Donor Badges & Public Profile:**
  - Receive page capsules display a donor star badge: `★ 4.6 (23)` or a muted `New donor` pill. Clicking the donor name opens their public profile.
  - Public Donor Profile (`/donors/:id`): Displays institution name, contact first name only (phone number is hidden for privacy), computed average rating, star distribution bars (5 to 1), total completed donations count, and list of reviews. Shows "No ratings yet" when empty.
  - Donate page: Shows donor's own average rating, review count, and a direct link to their public profile in the "Your Donations" section.
  - Home page: "Top-Rated Donors" section placed after the Saints section, featuring up to 4 qualified donors with at least 3 ratings (hidden if fewer than 3 qualify).

---

## 9. Client-Side Data & Auth

### Storage keys (`localStorage`)
`anjappam_users`, `anjappam_donations`, `anjappam_requests`, `anjappam_ratings`, `anjappam_session`

### Seed data
On first load (if keys are empty), insert: 4 sample donors, 2 sample receivers, sample donations (including active and completed items), 4–5 sample requests, and 10–15 sample ratings across donors with realistic Kerala feedback comments. Generate dates relative to today so they never look expired. Provide demo credentials in the README (e.g., `donor_demo` / `receiver_demo`) and optionally a "Use demo account" link on the Login page.

### Auth (simulated)
- Sign Up writes a user object to `anjappam_users`. Hash the password with the Web Crypto API (SHA-256) before storing; never store plain text.
- Login compares hashes and writes the user id to `anjappam_session`.
- `AuthContext` exposes `user`, `login`, `signup`, `logout`.
- `ProtectedRoute` component enforces role access (§4).
- Wrap all storage reads/writes in try/catch and handle corrupted or missing data by resetting to seed data.

### Data model
**users:** `id, institutionName, contactName, phone, userType (donor|receiver), username, passwordHash, createdAt`  
**donations:** `id, donorId, item, quantity, unit, date, time, location, status (available|accepted|completed|expired), acceptedBy, acceptedByName, acceptedByPhone, pickedUpAt, ratingId, createdAt`  
**requests:** `id, receiverId, item, numberOfPeople, neededByDate, neededByTime, location, status (open|accepted), acceptedBy, createdAt`  
**ratings:** `id, donationId, donorId, receiverId, receiverName, stars (1-5), comment (up to 200 chars), createdAt, updatedAt`  
**derived (computed, not stored):** per-donor `averageRating` (1 decimal), `ratingCount`, rating distribution `[1..5]`.

### Service layer (swap-ready)
`authService`, `donationsService`, `requestsService`, `ratingsService` expose async functions (e.g., `listDonations()`, `addDonation()`, `acceptDonation()`, `markAsPickedUp()`, `addRating()`, `updateRating()`, `listRatingsForDonor()`, `getDonorSummary()`, `listTopDonors()`) that read/write `localStorage`. UI components must call only these services, never `localStorage` directly.

---

## 10. Bible Quotes (Rotating Hero)

KJV (public domain). Store in `src/data/quotes.js`.

1. *"Is it not to deal thy bread to the hungry, and that thou bring the poor that are cast out to thy house?"* — Isaiah 58:7
2. *"He that hath a bountiful eye shall be blessed; for he giveth of his bread to the poor."* — Proverbs 22:9
3. *"For I was an hungred, and ye gave me meat: I was thirsty, and ye gave me drink."* — Matthew 25:35
4. *"He that hath meat, let him do likewise."* — Luke 3:11
5. *"But to do good and to communicate forget not: for with such sacrifices God is well pleased."* — Hebrews 13:16
6. *"He that hath pity upon the poor lendeth unto the Lord; and that which he hath given will he pay him again."* — Proverbs 19:17

Closing-section verse on Home: Matthew 25:40.

---

## 11. Key User Flows

1. **Donor posts food:** Sign up as Donor → Donate page → fill form → Add → appears in "Your Donations" and on the Receive page.
2. **Receiver accepts donation:** Login as Receiver → Receive page → Accept → donor contact revealed.
3. **Receiver requests food:** Receive page → Request Food → appears on Requests page.
4. **Donor accepts request:** Requests button → Accept → requester contact revealed.

(For demos on one device, use two browser profiles or log out and back in as the other role.)

---

## 12. Non-Functional Requirements

- Fast load (target under 3s on 4G): optimized images, lazy loading, code-split routes.
- Works on latest Chrome, Safari, Edge, Firefox and mobile browsers.
- Sanitize and escape all user-entered text when rendering.
- Food-safety disclaimer: donors are responsible for food quality and safe handling.
- Lighthouse targets: Performance ≥ 85, Accessibility ≥ 90.

---

## 13. Suggested Project Structure

```
anjappam/
├── public/
├── src/
│   ├── components/   (Navbar, Footer, QuoteRotator, DonationCapsule, RequestCapsule, Toast, ConfirmDialog, ProtectedRoute, Counter)
│   ├── pages/        (Home, Donate, Receive, Requests, Login, Signup, NotFound)
│   ├── data/         (quotes.js, seed.js)
│   ├── services/     (storage.js, authService.js, donationsService.js, requestsService.js)
│   ├── context/      (AuthContext.jsx, DataContext.jsx)
│   ├── App.jsx
│   └── main.jsx
├── vercel.json
├── tailwind.config.js
├── vite.config.js
├── package.json
└── README.md
```

---

## 14. Build Milestones

1. **Setup:** Vite + React + Tailwind + Router, theme tokens, Navbar, Footer, `vercel.json`.
2. **Home page:** hero, quote rotator, scroll sections, closing verse section.
3. **Data layer:** storage helper, seed data, services, contexts.
4. **Auth:** Sign Up, Login, role-based protected routes.
5. **Donate page:** form, Add, "Your Donations" list with edit/remove.
6. **Receive page:** capsule list, search/filter, Accept flow, Request form.
7. **Requests page:** list and Accept flow.
8. **Polish:** responsiveness, accessibility, empty/error states, expiry logic, 404 page.
9. **Deploy:** run `npm run build`, push to GitHub, deploy on Vercel, test deep links and refresh on every route.

---

## 15. Acceptance Criteria

- `npm run build` succeeds, and the deployed Vercel site loads every route directly (including refresh on `/receive` and `/donors/:id`) without a 404.
- No backend, API keys or environment variables are needed.
- Home hero quote rotates automatically through 6 verses; both buttons route correctly; Matthew 25:40 appears in the closing section.
- Saints on Sharing Food section renders transparent saint images with exact quotes/teachings.
- Top-Rated Donors section renders up to 4 donors with >= 3 ratings and links to their profiles; hides if fewer than 3 qualify.
- Donate form validates; "Add" shows entries in the bottom section and they survive a page refresh; shows donor's own rating and profile link.
- Receive page lists donations as capsules with a working Accept per role rules and donor star ratings.
- Pick-up flow allows logged-in receivers to mark accepted donations as picked up, triggering the rating dialog with star selector and comment counter.
- Editing ratings updates the review without duplication; donors cannot rate anyone; visitors cannot rate.
- Public donor profile at `/donors/:id` shows institution name, contact first name only (phone number hidden), average rating, star distribution bars, and reviews list.
- Requests page lists requests with a working Accept for donors.
- Sign Up has all 7 fields with validation; Login works with username and password; passwords are hashed before storage.
- Role restrictions work (Visitor / Donor / Receiver).
- Seed data appears on first load; the app recovers gracefully if `localStorage` is cleared.
- The demo-mode notice and limitations are visible in the footer and README.
- Usable at 360px width.

---

## 16. Open Questions

1. In the Receive capsule example "biriyani 50 for 10 location accept", what does **"for 10"** mean (serves 10 people, the 10th, 10 o'clock)? Current assumption: pickup date/time.
2. Who creates requests? Current assumption: Receivers, via a form on the Receive page.
3. Should the Requests button be visible to everyone or Donors only? Current assumption: visible to all, with access rules in §8.4.
4. Is a real backend planned for a later version? If so, which one (Supabase, Firebase, other)? The service layer is designed to make this swap easy.
5. Should the site support **Malayalam** alongside English?
6. Should locations later use **Google Maps**, or stay plain text?
7. Should the Bible quotes be KJV, or another translation (e.g., Malayalam Bible, NIV)?
