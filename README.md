# WADU — Global Event Ticketing Platform

A premium, globally scalable event ticketing platform built with React 18, Tailwind CSS, Framer Motion, and Express backend.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

Clone or open the project folder, then run:

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open your browser and go to: http://localhost:8080

The server runs on a single port with both Vite dev server and Express middleware.

### Build for Production

```bash
npm run build
npm run start
```

---

## 📄 Pages & Routes

| Page                | Route       | Description                                                |
| ------------------- | ----------- | ---------------------------------------------------------- |
| Homepage            | /           | Hero, trending events, categories, how it works, app promo |
| Event Listing       | /explore    | Browse and filter all events with search                   |
| Single Event        | /event/:id  | Event details and ticket purchasing                        |
| Checkout            | /checkout   | 3-step ticket booking and payment flow                     |
| Create Event        | /post-event | Event creation form for organizers                         |
| Categories          | /categories | Browse by event category (coming soon)                     |
| Cities              | /cities     | Events by location (coming soon)                           |
| Sign In             | /sign-in    | User authentication (coming soon)                          |
| Organizer Dashboard | /dashboard  | Coming soon                                                |

---

## 🎨 Design System

### Colors

| Token     | Hex     | Usage                     |
| --------- | ------- | ------------------------- |
| Purple    | #6C4DFF | Primary CTA, accents      |
| Teal      | #00C2A8 | Secondary highlights      |
| Navy      | #0A1F44 | Headers, dark backgrounds |
| Charcoal  | #0F172A | Dark mode base            |
| Off-white | #F9FAFB | Light backgrounds         |

### Typography

- Font: Inter (Google Fonts)
- H1: 56–72px Bold
- H2: 36–48px Bold
- H3: 24–28px Bold
- Body: 16–18px Regular

### Spacing & Layout

- Mobile-first responsive design
- Generous white space throughout
- Max-width container: 1280px
- Tailwind CSS utility-first styling

---

## 🛠 Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Routing:** React Router 6
- **Styling:** Tailwind CSS with dark mode
- **Animations:** Framer Motion
- **UI Components:** Radix UI
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod validation
- **State Management:** TanStack React Query
- **Backend:** Express.js
- **Testing:** Vitest
- **Font:** Inter via Google Fonts

---

## 📁 Project Structure

```
client/
├── pages/
│   ├── Index.tsx              # Homepage
│   ├── Explore.tsx            # Event listing
│   ├── EventDetail.tsx        # Single event
│   ├── Checkout.tsx           # Checkout flow
│   ├── CreateEvent.tsx        # Event creation
│   ├── PlaceholderPage.tsx    # Coming soon pages
│   └── NotFound.tsx           # 404 page
├── components/
│   ├── Layout.tsx             # Navbar + Footer wrapper
│   └── ui/                    # Radix UI component library
├── lib/
│   └── utils.ts               # Utility functions
├── hooks/
│   ├── use-mobile.tsx         # Mobile detection
│   └── use-toast.ts           # Toast notifications
├── App.tsx                    # Route configuration
├── global.css                 # Global styles & theme
└── vite-env.d.ts             # Vite environment types

server/
├── index.ts                   # Express server setup
├── routes/
│   └── demo.ts                # Example API route
└── node-build.ts              # Build configuration

shared/
└── api.ts                     # Shared TypeScript types

public/
├── favicon.ico                # WADU favicon
└── robots.txt                 # SEO robots file
```

---

## ✅ Key Features

- **Full-height hero section** with dark overlay
- **Responsive grid layouts** for desktop, tablet, mobile
- **Dark mode toggle** with localStorage persistence
- **Smooth Framer Motion animations** throughout
- **3-step checkout flow** with form validation
- **Event filtering and search** on listing page
- **Trending events showcase** on homepage
- **Category browsing** with icon-based cards
- **Mobile-optimized navigation** with hamburger menu
- **How It Works split view** for attendees & organizers
- **App promotion section** with store badges
- **Skeleton loading states** for better UX
- **Toast notifications** via Sonner
- **Accessible form components** from Radix UI
- **Type-safe API communication** with shared types

---

## 📋 Environment Variables

Create a `.env` file in the project root:

```
PING_MESSAGE=Hello from WADU API!
```

---

## 🧪 Testing

```bash
npm run test              # Run tests with Vitest
npm run typecheck         # Check TypeScript types
npm run format.fix        # Format code with Prettier
```

---

## 🚀 Deployment

### Netlify

The project is pre-configured for Netlify deployment:

```bash
npm run build
# Deploy the dist/ folder to Netlify
```

### Other Platforms

- Build: `npm run build`
- Start: `npm run start`
- Output directory: `dist/spa` (client), `dist/server` (server)

---

## 📝 Available Scripts

```bash
npm run dev              # Start development server (port 8080)
npm run build            # Build client and server
npm run build:client     # Build client only
npm run build:server     # Build server only
npm run start            # Start production server
npm run test             # Run tests
npm run typecheck        # Type check with TypeScript
npm run format.fix       # Format code with Prettier
```

---

## 🎯 Development Workflow

1. Create a new branch for your feature
2. Make changes in `client/pages` or `client/components`
3. Test locally with `npm run dev`
4. Run type checking: `npm run typecheck`
5. Format code: `npm run format.fix`
6. Push and create a pull request

---

## 🔌 API Routes

- `GET /api/ping` - Health check endpoint
- `GET /api/demo` - Demo endpoint example

API endpoints are prefixed with `/api/` and handled by Express middleware during development.

---

## 📞 Support & Contact

**Client:** WADU Global  
**Agency:** WitzCG  
**Email:** info@witzcg.com  
**Phone:** +254 768 622 525  
**Location:** Westlands, Nairobi, Kenya

---

## 📚 Documentation

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [React Router Docs](https://reactrouter.com/)
- [Radix UI Docs](https://www.radix-ui.com/docs/primitives/overview/introduction)

---

## ✨ License

WADU Global 2025 — All Rights Reserved

---

**Last Updated:** May 21, 2026
