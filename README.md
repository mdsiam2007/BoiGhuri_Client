<div align="center">

# 📚 BoiGhuri (বইঘুরি) — Modern Online Library System

<img src="public/assets/BoiGhuri_horizontal_logo.png" alt="BoiGhuri Logo" width="360" />

<br />

[![Next.js](https://img.shields.io/badge/Next.js-15.1.0-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-Radix_Primitives-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
[![BetterAuth](https://img.shields.io/badge/BetterAuth-MongoDB_Adapter-orange?style=for-the-badge)](https://www.better-auth.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.15+-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

<p align="center">
  <b>An elegant, interactive, and full-featured online library management system.</b>
  <br />
  Explore curated classic & contemporary literature, manage your collection, borrow books seamlessly, and participate in verified reader discussions.
</p>

---

🌐 **Live Application:** [https://boighuri-client.vercel.app](https://boighuri-client.vercel.app)  
🔗 **Backend Server Repository:** [https://github.com/mdsiam2007/BoiGhuri_Server](https://github.com/mdsiam2007/BoiGhuri_Server)

---

</div>

## 🌟 Feature Highlights (Core & Bonus Capabilities)

### 1. 🎬 6-Slide Swiper Banner & 10s Promo Video Showcase
- **Hero Slider:** Built with **Swiper.js** and **Framer Motion**, featuring 6 distinct literary genres (Fiction, Science, History, Kids, Knowledge Exchange, and Community) with custom flat modern navigation buttons and interactive micro-animations.
- **Teaser Video Section:** Integrated high-definition 10-second promotional trailer with responsive playback controls, interactive feature pills, and dynamic audio toggle.

### 2. 🌐 Complete Bilingual Support (বাংলা ↔ English)
- **Instant Language Switcher:** One-click language toggle across Navbar, forms, cards, modals, and dynamic document titles.
- **Pure Localization:** Eliminates awkward dual-language strings (`বাংলা (English)`); all headings, labels, password criteria, and toast alerts render purely in the selected locale.

### 3. ⚡ Atomic Real-Time Stock Tracking (Challenge 1)
- Borrowing a book atomically decrements available copies (`$inc: { totalCopies: -1 }`), while returning immediately increments (`$inc: { totalCopies: +1 }`).
- When a book reaches `0` copies, the "Borrow" button is automatically disabled and displays a stylish **"Not Available / কপি নেই"** badge.

### 4. 🚫 Double-Borrow Prevention (Challenge 2)
- Built-in dual-layer verification (client & server) preventing a user from borrowing the same title twice concurrently. Clear informative notifications guide the user to return existing copies first.

### 5. ⭐ Verified Reader Review System (Borrowers Only)
- Authenticated readers can submit ratings (1-5 stars) and detailed reviews.
- **Borrow-Verified Policy:** Only users who have genuinely borrowed the title can submit reviews, preventing spam and ensuring authentic feedback.
- Includes review editing with an automated `(সম্পাদিত / edited)` tag and dynamic average rating calculation.

### 6. 📸 Direct Avatar Upload & Dual-Platform Cloud Integration
- **Direct Avatar Upload:** Interactive circular profile picture selector with live local preview, camera overlay, and automated cloud upload.
- **Dual-Platform Cloud Storage:** Primary upload to **ImgBB** with seamless automated fallback to **Postimages**, ensuring 100% upload reliability.

### 7. 🛡️ BetterAuth & Zero-Flicker Private Route Guards
- Robust session management via **BetterAuth** with MongoDB Adapter and JWT synchronizer.
- **PrivateRouteGuard:** Prevents accidental redirects to login during page reload and displays an elegant shimmer hydration state.
- **GuestRouteGuard:** Automatically redirects logged-in users away from `/login` and `/register` directly to their requested destination.

### 8. 🌓 Seamless Dark & Light Mode
- Powered by `next-themes` with a blocking inline script in `<head>` eliminating light/dark flickering before DOM hydration.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router, Server & Client Components) |
| **Language** | TypeScript (Strict mode enabled) |
| **Styling** | Tailwind CSS with CSS Variables |
| **Component System** | Shadcn UI (Radix UI Primitives) |
| **Authentication** | BetterAuth (MongoDB Adapter) + Stateless JWT |
| **Slider & Animation** | Swiper.js, Framer Motion, Lucide React Icons |
| **Notifications** | React Hot Toast |
| **Cloud Storage** | ImgBB API & Postimages API (Dual Fallback) |

---

## 🧭 Application Routes

- `/` — Homepage with Hero Slider, 10-Book New Arrivals Grid, Top Categories, 4-Step Borrow Guide, and 10s Promo Video.
- `/books` — Complete catalog with real-time category filters, title/author search, sorting (Newest, Oldest, Most Copies), and responsive card grids.
- `/books/[id]` — Detailed book overview, authentic cover art, synopsis, borrower details, borrow modal, and verified reader reviews *(Private)*.
- `/add-book` — New book addition form with direct image upload, category selection, and total copies configuration *(Private)*.
- `/my-books` — Personal bookshelf of user-contributed titles with pre-filled edit modal and custom confirmation dialog deletion *(Private)*.
- `/my-borrows` — Real-time borrowed books table with return date countdown and one-click return action *(Private)*.
- `/login` & `/register` — Authentication screens with direct avatar upload, strict password validator, and Google social login *(Guest Only)*.

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the root of `boi-ghuri-client`:

```env
# Backend API Base URL
NEXT_PUBLIC_SERVER_URL=http://localhost:5000

# BetterAuth Configuration
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_better_auth_secret_key_here

# MongoDB Connection URI (for BetterAuth Adapter)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
DB_NAME=boighuri

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Image Upload Providers
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
NEXT_PUBLIC_POSTIMAGES_API_KEY=your_postimages_api_key
```

---

## 🚀 Local Installation & Execution

### 1. Clone the repository
```bash
git clone https://github.com/mdsiam2007/BoiGhuri_Client.git
cd BoiGhuri_Client
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Folder Structure

```
boi-ghuri-client/
├── public/
│   ├── assets/                # Logos, WebP compressed slides & promo video
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── (auth)/            # Guarded login & register routes
│   │   ├── add-book/          # Add book private route
│   │   ├── books/             # All books & dynamic book details route
│   │   ├── my-books/          # My added books management
│   │   ├── my-borrows/        # Active borrowed books & returns
│   │   ├── layout.tsx         # Root layout with providers & blocking theme script
│   │   ├── not-found.tsx      # Custom 404 page
│   │   └── page.tsx           # Homepage
│   ├── components/
│   │   ├── books/             # Book cards, skeleton, borrow & review modals
│   │   ├── home/              # HeroSlider, NewArrivals, PromoVideoSection
│   │   ├── shared/            # Navbar, Footer, LanguageToggle, ThemeToggle
│   │   └── ui/                # Shadcn UI primitives
│   ├── context/
│   │   └── LanguageContext.tsx# Bilingual localization context
│   ├── lib/
│   │   ├── api.ts             # JWT token sync & authenticated fetch
│   │   ├── auth.ts            # BetterAuth server-side config
│   │   ├── auth-client.ts     # BetterAuth React client
│   │   └── imageUpload.ts     # ImgBB & Postimages dual-platform uploader
│   ├── translations/
│   │   └── index.ts           # Complete Bengali & English dictionary
│   └── types/
│       └── index.ts           # Shared TypeScript interfaces
├── .env.example
├── package.json
└── README.md
```

---

<div align="center">
  <p>Crafted with ❤️ for <b>BoiGhuri (বইঘুরি)</b></p>
</div>
