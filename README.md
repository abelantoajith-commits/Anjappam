# Anjappam — Christian Food-Sharing Platform

**Anjappam** ("Five Breads" in Malayalam) is a faith-inspired Christian food-sharing sanctuary connecting restaurants, wedding caterers, neighborhood bakeries, and families with community shelters, orphanages, care homes, and people in need across Kerala, India.

---

## 🌟 Key Features

- **Home Sanctuary:**
  - Hero header with the title **ANJAPPAM** and subtitle *"Five Loaves · Bread for All"*.
  - Rotating Scripture Rotator displaying 6 KJV Bible verses from `prd.md` §10 (rotating every ~8s with smooth fade, dot indicators, and pause on hover).
  - Four-part community impact counter tracking meals shared, active donors, receiving institutions, and Kerala districts.
  - 4-step "How Food Flows in Fellowship" walkthrough.
  - "Who Can Give / Who Can Receive" comparative guidance.
  - "Why Food Waste Matters" stewardship highlights.
  - Testimonial stories from Kerala community kitchens and shelters.
  - Reverent closing section featuring **Matthew 25:40** as a large pull-quote.

- **Global Navigation & Layout:**
  - Navbar present on all pages **except Login and Sign Up** (per PRD Override).
  - Left: **Requests** button.
  - Center: Anjappam emblem and wordmark linking to `/`.
  - Right: **Login** button (or user's name with role and Sign Out dropdown when authenticated).
  - Full mobile navigation drawer optimized for 360px viewport widths.

- **Food Donations (`/donate`):**
  - "Every Donation Matters" banner with consecrated portion indicator.
  - Required fields: Item (with quick-pick chips: Biriyani, Rice, Chapati, Bread), Quantity, Unit (Plates, Packets, Kg, Litres), Pickup Date, Pickup-by Time, and Location Address.
  - "Your Donations" bottom section with capsule cards, edit modal, and remove confirmation.

- **Food Receiving (`/receive`):**
  - "Food Available Near You" directory of available surplus food.
  - Multi-criteria filter: search query, Kerala districts (Kochi, Thrissur, Kozhikode, Kottayam, Trivandrum), and urgency.
  - Capsule format: `Item · Quantity · Date/Time · Location · [Accept]`.
  - Role-aware Accept action:
    - **Visitor:** Prompts to log in.
    - **Donor:** Disabled with tooltip *"Only receivers can accept"*.
    - **Receiver:** Opens confirmation dialog, claims meal, and reveals donor contact details.
  - "Request Food" button opening modal.

- **Food Requests (`/requests`):**
  - **PRD Override Applied:** Food requests are sized by **NUMBER OF PEOPLE**, not plates!
  - Request fields: Item, Number of people, Location, Needed-by date/time.
  - Capsule readout: `"Biriyani · for 50 people · Kakkanad, Kochi · Accept"`.
  - Open to Donors to accept, revealing shelter caretaker contact details.

- **Authentication (`/login` & `/signup`):**
  - Sign Up page title: **"Registration Form"** with **"Submit"** button (per PRD Override).
  - 7 fields: Institution Name, Contact Name, Phone (+91 10-digit validation), User Type (Donor/Receiver radio toggle), Username (4–20 chars), Password (min 8 chars), Repeat Password.
  - Client-side password hashing with **Web Crypto SHA-256** before saving.
  - Quick 1-click Demo Account login buttons on the Login page for instant role switching.

---

## 🔑 Demo Credentials

The platform ships with pre-populated realistic Kerala sample data (relative dates from today, so items are always fresh on initial load).

| Role | Username | Password | Institution | Locality |
|---|---|---|---|---|
| **Food Donor** | `donor_demo` | `demo1234` | Malabar Palace Caterers | Edappally Toll, Kochi |
| **Food Donor** | `cochin_breads` | `demo1234` | Cochin Breadworks & Bakery | Aluva, Kochi |
| **Food Receiver** | `receiver_demo` | `demo1234` | St. Joseph's Children's Home & Shelter | Kakkanad, Kochi |
| **Food Receiver** | `snehabhavan` | `demo1234` | Snehabhavan Old Age Care Home | Kaloor, Kochi |

*(You can also use the one-click **"Donor Demo"** or **"Receiver Demo"** buttons directly on the Login page).*

---

## ⚠️ Known Limitations (Demo Mode)

1. **Browser-Only Storage:** All accounts, donations, and requests are stored in the browser's `localStorage`. A donation posted on one device or browser profile will **not** synchronize to another device.
2. **Demo Passwords:** While passwords are cryptographic SHA-256 hashes in `localStorage`, do **not** use real-world passwords you use elsewhere.
3. **Contact Coordination:** Phone numbers and addresses are simulated Kerala sample data; no external SMS, OTP, or email gateways are triggered.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS with custom earth & wheat theme tokens
  - Cream Background: `#FFF8EE`
  - Wheat Gold: `#C98A2B`
  - Deep Brown: `#3B2A1A`
  - Olive Green: `#5E7B3A`
  - Muted Burgundy: `#7A2E2E`
- **Icons:** `lucide-react`
- **Typography:** Playfair Display (headings) + Inter (body)
- **Data Architecture:** 100% pure client-side service layer (`src/services/`):
  - `storage.js`: LocalStorage wrapper with error recovery and fallback.
  - `authService.js`: User registration, SHA-256 password hashing, session management.
  - `donationsService.js`: Listing, adding, updating, removing, and accepting donations.
  - `requestsService.js`: Sized by number of people, creation, and fulfillment.
  - `AuthContext.jsx` & `DataContext.jsx`: Centralized application state.

---

## 📂 Project Structure

```
anjappam/
├── public/
│   └── logo.svg                 # Five Loaves emblem
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ConfirmDialog.jsx    # Modal dialog for accept/confirmations
│   │   ├── DonationCapsule.jsx  # Capsule row for food donations
│   │   ├── Footer.jsx           # Global footer with scripture & demo notice
│   │   ├── Navbar.jsx           # Requests left, Logo center, Login right
│   │   ├── ProtectedRoute.jsx   # Role route guard
│   │   ├── QuoteRotator.jsx     # Rotating 6 Bible verses with dot indicators
│   │   ├── RequestCapsule.jsx   # Capsule row sized by number of people
│   │   └── Toast.jsx            # Toast alert system
│   ├── context/
│   │   ├── AuthContext.jsx      # User session & role state
│   │   └── DataContext.jsx      # Donations & requests data state
│   ├── data/
│   │   ├── quotes.js            # KJV Bible quotes (PRD §10)
│   │   └── seed.js              # Kerala sample seed data with relative dates
│   ├── pages/
│   │   ├── Donate.jsx           # Food donation form & donor history
│   │   ├── Home.jsx             # Landing page with hero & sections
│   │   ├── Login.jsx            # Sign in & quick demo account buttons
│   │   ├── NotFound.jsx         # 404 error page
│   │   ├── Receive.jsx          # Available food directory & request modal
│   │   ├── Requests.jsx         # Community food requests board
│   │   └── Signup.jsx           # "Registration Form" with "Submit" button
│   ├── services/
│   │   ├── authService.js
│   │   ├── donationsService.js
│   │   ├── requestsService.js
│   │   └── storage.js
│   ├── utils/
│   │   └── crypto.js            # Web Crypto SHA-256 hashing
│   ├── App.jsx                  # Main route configuration
│   ├── index.css                # Tailwind directives & base styles
│   └── main.jsx
├── vercel.json                  # SPA deep-link rewrite to /index.html
├── tailwind.config.js
├── vite.config.js
├── package.json
└── README.md
```

---

## 🚀 Local Development Setup

1. **Clone or navigate to the directory:**
   ```bash
   cd Anjappam
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Run the production build & preview:**
   ```bash
   npm run build
   npm run preview
   ```

5. **Run the Automated End-to-End Test Suite:**
   ```bash
   node test-e2e.mjs
   ```

---

## ☁️ Step-by-Step Vercel Deployment Instructions

The application is fully pre-configured for static deployment on Vercel with zero environment variables needed.

### Method 1: Deploy via Vercel Web Dashboard (Recommended)

1. Push this repository to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Anjappam"
   git remote add origin https://github.com/<your-username>/anjappam.git
   git branch -M main
   git push -u origin main
   ```
2. Log in to [vercel.com](https://vercel.com).
3. Click **"Add New..."** → **"Project"**.
4. Import your `anjappam` repository.
5. In the project configuration:
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variables:** None required!
6. Click **"Deploy"**.
7. Vercel will build and assign a production URL (e.g., `https://anjappam.vercel.app`).
8. Deep routes (such as `/receive`, `/requests`, `/donate`) and browser page refreshes will work seamlessly thanks to the included `vercel.json` SPA rewrite rule:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

### Method 2: Deploy via Vercel CLI

1. Install the Vercel CLI globally if not already installed:
   ```bash
   npm i -g vercel
   ```
2. In the project directory, run:
   ```bash
   vercel
   ```
3. Follow the CLI prompts (accept defaults for Vite).
4. For production deployment:
   ```bash
   vercel --prod
   ```

