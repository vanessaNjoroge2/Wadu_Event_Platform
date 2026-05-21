# WADU PROJECT — CRITICAL IMPLEMENTATION GUIDE

## Overview

This guide outlines the critical fixes needed to bring the WADU project from 30% completion to full compliance with the official brief.

**Current Architecture:** Vite + React Router  
**Required Architecture:** Next.js 14 (per brief)

---

## ⚠️ DECISION POINT: Framework Migration

### Option 1: Migrate to Next.js 14 (RECOMMENDED - Per Brief)

**Effort:** 2-3 days  
**Benefits:**

- ✅ Exact match to official brief
- ✅ Next.js 14 features (App Router, API routes, image optimization)
- ✅ Better for production (SSR, ISR, static generation)
- ✅ Better SEO support
- ✅ Industry standard

**Challenges:**

- Need to restructure all routes
- Need to move components from React Router to Next.js structure
- May need to rewrite some page logic
- Config files change significantly

### Option 2: Keep Vite + React Router (NOT RECOMMENDED - Diverges from Brief)

**Effort:** 1-2 days to complete remaining features  
**Benefits:**

- ✅ Faster to implement remaining features
- ✅ Works well for SPA
- ✅ No restructuring needed

**Challenges:**

- ❌ Does NOT match official brief
- ❌ Client-side only (no SSR)
- ❌ Less suitable for scaling

---

## PHASE 1: FRAMEWORK MIGRATION (IF GOING WITH NEXT.JS 14)

### Step 1.1: Initialize Next.js Project

```bash
npx create-next-app@latest wadu-nextjs --typescript --tailwind
cd wadu-nextjs
```

Choose options:

- ✅ TypeScript: Yes
- ✅ Tailwind CSS: Yes
- ✅ App Router: Yes
- ✅ ESLint: Yes

### Step 1.2: Port Tailwind Configuration

Copy and adapt:

- `tailwind.config.ts` → Update for Next.js format
- `postcss.config.js` → Should work as-is
- `client/global.css` → Copy to `app/globals.css`

### Step 1.3: Port Components

Move from:

```
client/components/ui/* → app/components/ui/*
client/hooks/* → app/hooks/*
client/lib/* → app/lib/*
```

**No code changes needed** — React components work the same.

### Step 1.4: Port Pages

Convert React Router pages to Next.js App Router:

```
client/pages/Index.tsx → app/page.tsx
client/pages/Explore.tsx → app/events/page.tsx
client/pages/EventDetail.tsx → app/events/[id]/page.tsx
client/pages/Checkout.tsx → app/checkout/page.tsx
client/pages/CreateEvent.tsx → app/organizer/create-event/page.tsx
client/pages/NotFound.tsx → app/not-found.tsx
```

### Step 1.5: Handle Layout Components

Next.js uses nested layouts:

```typescript
// app/layout.tsx
import { Layout } from '@/components/Layout'

export const metadata = {
  title: 'WADU',
  description: 'Global Event Ticketing Platform'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
```

### Step 1.6: Remove React Router

Delete from `package.json`:

```json
"react-router-dom": "^6.30.1",
```

Run:

```bash
npm uninstall react-router-dom
npm install
```

### Step 1.7: Test Migration

```bash
npm run dev
# Test all pages at http://localhost:3000
npm run build
npm run start
```

---

## PHASE 2: IMPLEMENT MISSING CRITICAL FEATURES

### Feature 1: Implement Attendee Dashboard

**File:** `app/dashboard/page.tsx`

```typescript
'use client'

import { Layout } from '@/components/Layout'
import { Sidebar } from '@/components/ui/sidebar'
import { MoreVertical, Download, Wallet } from 'lucide-react'
import { useState } from 'react'

interface Ticket {
  id: string
  eventTitle: string
  eventDate: string
  location: string
  ticketType: string
  qrCode: string
  ticketNumber: string
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('tickets')

  const tickets: Ticket[] = [
    {
      id: '1',
      eventTitle: 'AfroNation Nairobi 2025',
      eventDate: 'Aug 15-17, 2025',
      location: 'Uhuru Gardens, Nairobi',
      ticketType: 'VIP Access',
      qrCode: 'QR_CODE_1',
      ticketNumber: 'TKT-2025-001',
    },
  ]

  const navItems = [
    { id: 'tickets', label: 'My Tickets', icon: '🎫' },
    { id: 'upcoming', label: 'Upcoming Events', icon: '📅' },
    { id: 'past', label: 'Past Events', icon: '📦' },
    { id: 'saved', label: 'Saved Events', icon: '❤️' },
    { id: 'settings', label: 'Account Settings', icon: '⚙️' },
  ]

  return (
    <Layout>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-slate-900 border-r border-slate-800 p-6">
          <h2 className="text-white font-bold text-lg mb-8">My Account</h2>
          <div className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition ${
                  activeTab === item.id
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'text-gray-400 hover:bg-slate-800'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8">My Tickets</h1>

            <div className="grid gap-6">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700 hover:border-purple-500 transition"
                >
                  <div className="grid md:grid-cols-3 gap-6 p-8">
                    {/* QR Code */}
                    <div className="flex items-center justify-center">
                      <div className="bg-white p-4 rounded-lg">
                        <div className="w-32 h-32 bg-gray-300 rounded flex items-center justify-center text-gray-600 text-sm text-center">
                          [QR Code Here]
                        </div>
                      </div>
                    </div>

                    {/* Ticket Details */}
                    <div>
                      <p className="text-teal-400 font-semibold text-sm uppercase mb-2">
                        {ticket.ticketType}
                      </p>
                      <h3 className="text-white text-xl font-bold mb-3">
                        {ticket.eventTitle}
                      </h3>
                      <div className="space-y-2 text-gray-400 text-sm">
                        <p>📅 {ticket.eventDate}</p>
                        <p>📍 {ticket.location}</p>
                        <p>🎫 {ticket.ticketNumber}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                      <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2">
                        <Download size={18} />
                        Download PDF
                      </button>
                      <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2">
                        <Wallet size={18} />
                        Add to Wallet
                      </button>
                      <button className="text-gray-400 hover:text-white transition">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
```

**Mobile Version:** Add responsive sidebar that collapses to bottom tab bar.

---

### Feature 2: Implement Organizer Dashboard

**File:** `app/organizer/page.tsx`

```typescript
'use client'

import { Layout } from '@/components/Layout'
import { BarChart3, TrendingUp, Calendar, Users } from 'lucide-react'

export default function OrganizerDashboard() {
  const stats = [
    { label: 'Total Revenue', value: 'KES 2,450,000', icon: '💰', trend: '+12%' },
    { label: 'Tickets Sold', value: '4,320', icon: '🎫', trend: '+8%' },
    { label: 'Active Events', value: '12', icon: '📅', trend: '+2' },
    { label: 'Upcoming Events', value: '5', icon: '📆', trend: '' },
  ]

  const navItems = [
    'Dashboard',
    'My Events',
    'Create Event',
    'Attendees',
    'Analytics',
    'Payouts',
    'Settings',
  ]

  const transactions = [
    {
      id: 1,
      event: 'AfroNation Nairobi 2025',
      amount: 'KES 1,250,000',
      status: 'Completed',
      date: 'May 20, 2026',
    },
    {
      id: 2,
      event: 'Tech Summit 2025',
      amount: 'KES 450,000',
      status: 'Pending',
      date: 'May 19, 2026',
    },
  ]

  return (
    <Layout>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-slate-900 border-r border-slate-800 p-6">
          <h2 className="text-white font-bold text-lg mb-8">Organizer</h2>
          <div className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item}
                className={`w-full text-left px-4 py-3 rounded-lg transition ${
                  item === 'Dashboard'
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'text-gray-400 hover:bg-slate-800'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8">Organizer Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700"
                >
                  <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                  <p className="text-white text-3xl font-bold mb-2">{stat.value}</p>
                  {stat.trend && (
                    <p className="text-teal-400 font-semibold text-sm">{stat.trend}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Chart Placeholder */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 mb-12">
              <h2 className="text-white text-2xl font-bold mb-6">Revenue Trend</h2>
              <div className="h-64 bg-slate-950 rounded-lg flex items-center justify-center text-gray-500">
                [Chart Placeholder]
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-white text-2xl font-bold">Recent Transactions</h2>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-900/50">
                    <th className="px-6 py-4 text-left text-gray-400 font-semibold">Event</th>
                    <th className="px-6 py-4 text-left text-gray-400 font-semibold">Amount</th>
                    <th className="px-6 py-4 text-left text-gray-400 font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-gray-400 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-slate-700">
                      <td className="px-6 py-4 text-white">{tx.event}</td>
                      <td className="px-6 py-4 text-white font-semibold">{tx.amount}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            tx.status === 'Completed'
                              ? 'bg-teal-500/20 text-teal-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
```

---

### Feature 3: Digital Ticket Page

**File:** `app/ticket/page.tsx`

```typescript
'use client'

import { Layout } from '@/components/Layout'
import { Download, Wallet, Share2 } from 'lucide-react'

export default function TicketPage() {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Digital Ticket Card */}
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
              <p className="text-sm opacity-90">DIGITAL TICKET</p>
              <h2 className="text-2xl font-bold">AfroNation Nairobi 2025</h2>
            </div>

            {/* QR Code */}
            <div className="p-8 flex justify-center">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="w-40 h-40 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-500 text-center text-sm">[QR Code]</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="px-8">
              <div className="border-t border-dashed border-slate-600"></div>
            </div>

            {/* Details */}
            <div className="p-8 space-y-4">
              <div>
                <p className="text-gray-400 text-sm">EVENT</p>
                <p className="text-white font-bold">AfroNation Nairobi 2025</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">DATE</p>
                  <p className="text-white font-bold">Aug 15-17, 2025</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">TIME</p>
                  <p className="text-white font-bold">5:00 PM</p>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm">LOCATION</p>
                <p className="text-white font-bold">Uhuru Gardens, Nairobi</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">SEAT</p>
                  <p className="text-white font-bold">A-142</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">TICKET ID</p>
                  <p className="text-white font-bold text-sm">TKT-2025-001</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-slate-700 space-y-3">
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2">
                <Download size={18} />
                Download PDF
              </button>
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2">
                <Wallet size={18} />
                Add to Wallet
              </button>
              <button className="w-full text-gray-300 hover:text-white transition flex items-center justify-center gap-2 p-3">
                <Share2 size={18} />
                Share Ticket
              </button>
            </div>
          </div>

          {/* Info */}
          <p className="text-center text-gray-400 text-sm mt-8">
            🎫 Present this QR code at the entrance or scan with the mobile app
          </p>
        </div>
      </div>
    </Layout>
  )
}
```

---

### Feature 4: Add Framer Motion Animations

**Example: Hero Section Animation**

```typescript
'use client'

import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="hero-section"
    >
      <h1 className="text-5xl font-bold text-white">
        Discover. Book. Experience.
      </h1>
      <p className="text-xl text-gray-300">
        The global platform for unforgettable events.
      </p>
    </motion.div>
  )
}
```

**Example: Card Hover Animation**

```typescript
<motion.div
  whileHover={{ scale: 1.05, y: -5 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 300 }}
  className="card"
>
  {/* Card Content */}
</motion.div>
```

---

### Feature 5: Add Dark Mode Toggle

**File:** `app/components/Layout.tsx`

```typescript
'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export function Layout({ children }) {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'light') {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newState = !isDark
    setIsDark(newState)
    localStorage.setItem('theme', newState ? 'dark' : 'light')
    if (newState) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <>
      <nav className="flex items-center gap-4">
        <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-slate-700">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>
      {children}
    </>
  )
}
```

---

## PHASE 3: REFINEMENT

### Add Missing Sections to Homepage

1. **Featured Organizers** carousel
2. **How It Works** split view
3. **Mobile App** promo section
4. **Call-to-Action** section
5. **Stats** section

### Complete Event Listing

1. Add filter sidebar
2. Add sort dropdown
3. Add pagination
4. Connect to real data

### Complete Checkout

1. Finish Step 3 (Payment)
2. Add payment method selection
3. Add security badges
4. Add form validation

---

## PRIORITY CHECKLIST

- [ ] **WEEK 1**
  - [ ] Decide on framework (Vite vs Next.js)
  - [ ] If Next.js: Complete migration
  - [ ] Request design files from WitzCG
  - [ ] Update brand colors
  - [ ] Add Framer Motion animations

- [ ] **WEEK 2**
  - [ ] Implement Attendee Dashboard
  - [ ] Implement Organizer Dashboard
  - [ ] Implement Digital Ticket
  - [ ] Complete checkout flow
  - [ ] Add dark mode toggle

- [ ] **WEEK 3**
  - [ ] Complete event listing with filters
  - [ ] Add featured organizers carousel
  - [ ] Polish animations
  - [ ] Cross-browser testing
  - [ ] Mobile testing

- [ ] **WEEK 4**
  - [ ] Performance optimization
  - [ ] SEO optimization
  - [ ] Final QA
  - [ ] Deployment preparation

---

## CONTACT FOR QUESTIONS

- **Agency:** WitzCG
- **Email:** info@witzcg.com
- **Phone:** +254 768 622 525
- **Slack:** (if available)

---

**Last Updated:** May 21, 2026  
**Prepared by:** Senior UI/UX Engineer & Technical Project Auditor
