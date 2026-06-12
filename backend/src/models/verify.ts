import { PaymentMethod, DeliveryMethod } from '@prisma/client';
import prisma from './prisma';

const BASE_URL = 'http://localhost:3001/api';

async function runVerification() {
  console.log('[Info] Starting API Endpoint Verification tests on port 3001...\n');

  const testEmail = `org-${Date.now()}@wadu-test.com`;
  let token = '';
  let userId = '';
  let eventId = '';
  let ticketTypeId = '';
  let orderId = '';

  // 1. REGISTER
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'Admin',
        email: testEmail,
        password: 'password123',
        phone: '+254722222222',
        role: 'ORGANIZER'
      })
    });
    const data: any = await res.json();
    if (res.status === 201 && data.success && data.data.token) {
      userId = data.data.user.id;
      console.log('[PASS] POST /api/auth/register (Registered user successfully)');
    } else {
      console.log('[FAIL] POST /api/auth/register', data);
    }
  } catch (err: any) {
    console.log('[FAIL] POST /api/auth/register (Fetch failed)', err.message);
  }

  // 1b. VERIFY EMAIL
  try {
    const userInDb = await prisma.user.findUnique({ where: { email: testEmail } });
    const code = userInDb?.verificationCode || '';

    const res = await fetch(`${BASE_URL}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, code })
    });
    const data: any = await res.json();
    if (res.status === 200 && data.success && data.data.token) {
      token = data.data.token;
      console.log('[PASS] POST /api/auth/verify (Verified email successfully)');
    } else {
      console.log('[FAIL] POST /api/auth/verify', data);
    }
  } catch (err: any) {
    console.log('[FAIL] POST /api/auth/verify (Fetch failed)', err.message);
  }

  // 2. LOGIN
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'password123'
      })
    });
    const data: any = await res.json();
    if (res.status === 403 && !data.success && data.error.includes('verify your email')) {
      console.log('[PASS] POST /api/auth/login (Credentials valid, verification required)');
      
      // Step 2: verify code
      const userInDb = await prisma.user.findUnique({ where: { email: testEmail } });
      const code = userInDb?.verificationCode || '';
      
      const verifyRes = await fetch(`${BASE_URL}/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, code })
      });
      const verifyData: any = await verifyRes.json();
      if (verifyRes.status === 200 && verifyData.success && verifyData.data.token) {
        console.log('[PASS] POST /api/auth/verify-code (Logged in user successfully after verification)');
        token = verifyData.data.token;
      } else {
        console.log('[FAIL] POST /api/auth/verify-code', verifyData);
      }
    } else {
      console.log('[FAIL] POST /api/auth/login', data);
    }
  } catch (err: any) {
    console.log('[FAIL] POST /api/auth/login (Fetch failed)', err.message);
  }

  // 3. ME PROFILE
  try {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data: any = await res.json();
    if (res.status === 200 && data.success && data.data.email === testEmail) {
      console.log('[PASS] GET /api/auth/me (Loaded profile successfully)');
    } else {
      console.log('[FAIL] GET /api/auth/me', data);
    }
  } catch (err: any) {
    console.log('[FAIL] GET /api/auth/me (Fetch failed)', err.message);
  }

  // 4. CREATE EVENT
  try {
    const res = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Tech Expo 2026',
        description: 'East Africa tech showcase',
        category: 'Technology',
        location: 'Sarit Expo Centre',
        city: 'Nairobi',
        country: 'Kenya',
        venueName: 'Sarit Expo Centre',
        address: 'Westlands, Nairobi',
        startDate: '2026-10-15T09:00:00Z',
        endDate: '2026-10-17T18:00:00Z',
        startTime: '09:00',
        endTime: '18:00',
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600',
        status: 'PUBLISHED',
        tickets: [
          {
            name: 'General Admission',
            description: 'Regular pass',
            price: 1500,
            quantity: 100
          }
        ]
      })
    });
    const data: any = await res.json();
    if (res.status === 201 && data.success && data.data.id) {
      eventId = data.data.id;
      ticketTypeId = data.data.tickets[0].id;
      console.log('[PASS] POST /api/events (Created event successfully)');
    } else {
      console.log('[FAIL] POST /api/events', data);
    }
  } catch (err: any) {
    console.log('[FAIL] POST /api/events (Fetch failed)', err.message);
  }

  // 5. LIST EVENTS
  try {
    const res = await fetch(`${BASE_URL}/events`);
    const data: any = await res.json();
    if (res.status === 200 && data.success && data.data.events.length > 0) {
      console.log('[PASS] GET /api/events (Fetched published events successfully)');
    } else {
      console.log('[FAIL] GET /api/events', data);
    }
  } catch (err: any) {
    console.log('[FAIL] GET /api/events (Fetch failed)', err.message);
  }

  // 6. CATEGORIES & CITIES
  try {
    const resCat = await fetch(`${BASE_URL}/categories`);
    const dataCat: any = await resCat.json();
    const resCit = await fetch(`${BASE_URL}/cities`);
    const dataCit: any = await resCit.json();

    if (resCat.status === 200 && dataCat.success && resCit.status === 200 && dataCit.success) {
      console.log('[PASS] GET /api/categories & /api/cities (Fetched taxonomies successfully)');
    } else {
      console.log('[FAIL] GET taxonomies', { dataCat, dataCit });
    }
  } catch (err: any) {
    console.log('[FAIL] GET taxonomies (Fetch failed)', err.message);
  }

  // 7. CREATE ORDER
  try {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId,
        items: [
          { ticketTypeId, quantity: 2 }
        ],
        firstName: 'Jane',
        lastName: 'Customer',
        email: 'jane@example.com',
        phone: '+254711111111',
        deliveryMethod: 'EMAIL',
        paymentMethod: 'MPESA'
      })
    });
    const data: any = await res.json();
    if (res.status === 201 && data.success) {
      orderId = data.data.id;
      console.log('[PASS] POST /api/orders (Placed order successfully)');
    } else {
      console.log('[FAIL] POST /api/orders', data);
    }
  } catch (err: any) {
    console.log('[FAIL] POST /api/orders (Fetch failed)', err.message);
  }

  // 8. CARD PAYMENT
  try {
    const res = await fetch(`${BASE_URL}/payments/card`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        cardNumber: '1111222233334444',
        expiry: '12/29',
        cvc: '123'
      })
    });
    const data: any = await res.json();
    if (res.status === 200 && data.success && data.data.order.paymentStatus === 'PAID') {
      console.log('[PASS] POST /api/payments/card (Processed card payment successfully)');
    } else {
      console.log('[FAIL] POST /api/payments/card', data);
    }
  } catch (err: any) {
    console.log('[FAIL] POST /api/payments/card (Fetch failed)', err.message);
  }

  // 9. ORGANIZER DASHBOARD STATS
  try {
    const res = await fetch(`${BASE_URL}/organizer/dashboard`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data: any = await res.json();
    if (res.status === 200 && data.success && data.data.totalRevenue > 0) {
      console.log('[PASS] GET /api/organizer/dashboard (Retrieved stats successfully)');
    } else {
      console.log('[FAIL] GET /api/organizer/dashboard', data);
    }
  } catch (err: any) {
    console.log('[FAIL] GET /api/organizer/dashboard (Fetch failed)', err.message);
  }

  console.log('\nVerification completed.');
  await prisma.$disconnect();
}

runVerification();
