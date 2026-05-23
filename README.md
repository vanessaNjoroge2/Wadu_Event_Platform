# WADU — Global Event Ticketing Platform

A premium, globally scalable event ticketing platform built with React 18, Tailwind CSS, Framer Motion, and Express backend.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

Clone the repository, navigate to the project directory, and install dependencies:

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open your browser and navigate to: **http://localhost:5000**

The development server uses a unified Vite server with Express middleware mounted directly.

### Build for Production

To package and run the platform in a production-optimized state:

```bash
# Compile client and server bundles
npm run build

# Start production server (listens on port 3000 by default)
npm run start
```

Open your browser and navigate to: **http://localhost:3000**

---

## 📄 Pages & Routes

The platform is fully implemented with strict adherence to the WADU brand identity system:

| Page                | Route       | Description                                                          |
| ------------------- | ----------- | -------------------------------------------------------------------- |
| **Homepage**        | `/`         | Dynamic hero, autoplay background video, trending grids, and CTAs    |
| **Event Listing**   | `/explore`  | Multi-category search, filters, and dynamic event cards grid         |
| **Single Event**    | `/event/:id`| Comprehensive event detail, schedules, and ticket quantity selectors |
| **Checkout**        | `/checkout` | 3-step ticket booking, billing info, and simulated payment flow     |
| **Categories**      | `/categories`| Clean category listing grid with brand navy/purple aesthetics        |
| **Cities**          | `/cities`   | Dynamic location showcase maps and location event listings           |
| **Sign In / Auth**  | `/sign-in`  | Role-based authentication interface (Organizer vs. Attendee)          |
| **Organizer Dashboard** | `/organizer-dashboard` | Full control center: metrics overview, sales charts, and transaction audits |
| **My Events**       | `/organizer-dashboard/events` | Organizer's active, draft, and sold-out event listings |
| **Create Event**    | `/post-event` | Multi-step event creation form rendering inside the dashboard menu  |
| **Attendees Audit** | `/organizer-dashboard/attendees` | Live QR check-in tracker and attendance registration log |
| **Sales Analytics** | `/organizer-dashboard/analytics` | Traffic breakdowns, daily revenue scales, and channel analysis |
| **Earnings & Payouts** | `/organizer-dashboard/payouts` | Wallet payouts, Safaricom M-Pesa setup, and NCBA bank transfer audits |
| **Profile Settings**| `/organizer-dashboard/settings` | Branding log upload, profile settings, and email alerts configuration |
| **Help & Support**  | `/help`     | Help Center FAQ center rendering inside the dashboard menu shell    |

---

## 🎨 WADU Brand Identity System

### Color Palette

Strictly enforced color guidelines throughout all user interfaces:

*   **Primary Accent (`#0A1F44`):** Solid Deep Royal Blue used for Navbars, headers, and major action buttons.
*   **CTA Accent (`#6C4DFF`):** Electric Purple highlights, active navigation tabs, selected states, and banners.
*   **Secondary Interactive (`#00C2A8`):** Vibrant Teal applied to all hover transitions, glow states, active focuses, and success badges.
*   **Background (`#F9FAFB`):** Sleek off-white background with spacious section padding (`py-24 md:py-32`) to ensure generous breathing room.
*   **Dark Mode (`#0F172A`):** Beautiful Charcoal base when dark mode is toggled.

### Spacing & Spacers
- All major layout sections feature increased margins and `py-24`/`py-32` padding variables to avoid cramped designs and achieve WADU's luxurious spacious aesthetic.

---

## 🛠 Tech Stack

- **Frontend:** React 18 with TypeScript, React Router 6, Tailwind CSS
- **Animations:** Framer Motion (micro-animations, smooth transition effects)
- **UI Foundations:** Radix UI primitives, Lucide React icons
- **Form State:** React Hook Form + Zod validation schemas
- **Queries:** TanStack React Query (server state synchronization)
- **Server:** Express.js (middleware, API routing, SSR bundling)
- **Compiling:** Vite, Rollup, SWC
- **Testing:** Vitest

---

## 📁 Project Structure

```
client/
├── public/                    # Public assets (JPG event thumbnails, loops, favicon, robots.txt)
└── src/
    ├── components/            # Reusable UI components (EventCard, Checkout steps)
    │   ├── layout/            # Layout shells (Layout, Navbar, Footer, DarkModeToggle)
    │   └── ui/                # Radix primitive components
    ├── pages/                 # Full pages (HomePage, ExplorePage, OrganizerDashboardPage, etc.)
    ├── styles/                # global.css (design tokens, colors system)
    ├── App.tsx                # Client Routing configuration
    └── main.tsx               # Client entry point
server/
├── index.ts                   # Express server core configuration
├── node-build.ts              # Production startup and static assets server
├── routes/                    # API routes (events, auth, etc.)
├── middleware/                # Error handling and validation middlewares
└── utils/                     # Server utility helpers
shared/                        # Shared TypeScript validation schemas and interfaces
netlify/                       # Serverless Netlify edge functions config
```

---

## 🧪 Testing & Diagnostics

Verify system type safety, code formatting, and run test suites:

```bash
# Run unit tests
npm run test

# Validate type safety
npm run typecheck

# Format codebase
npm run format.fix
```

---

## 🔌 API Endpoints

- `GET /api/ping` - Server health diagnostic
- `GET /api/demo` - API functionality demo
- `GET /api/events` - Fetch public event listings
- `POST /api/auth/sign-in` - Client role authentication mock

---

**Last Updated:** May 23, 2026  
**Branding Agency:** WitzCG  
**Client:** WADU Global
