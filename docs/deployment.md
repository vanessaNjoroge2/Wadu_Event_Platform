# Deployment & Setup Guide — WADU Event Platform

This document describes how to setup WADU locally and deploy the services to production.

---

## 1. Local Development Setup

### Prerequisites
* **Node.js**: v18 or later
* **PostgreSQL**: A running instance (local or hosted)

### Step 1: Install Dependencies
Install dependencies separately in both backend and frontend directories:
```bash
cd backend
npm install
cd ../frontend
npm install
```

### Step 2: Configure Environment Variables
1. Create a `.env` file in the `backend/` directory:
```bash
cp backend/.env.example backend/.env
```
2. Open `backend/.env` and update the `DATABASE_URL` with your PostgreSQL connection string:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/wadu_db
```
3. Set your `JWT_SECRET` and SMTP credentials.

### Step 3: Run Database Migrations
Prisma uses the connection string to create the necessary tables:
```bash
cd backend
npx prisma migrate dev
```

### Step 4: Seed the Database
Populate the database with default users and test events:
```bash
cd backend
npx prisma db seed
```

### Step 5: Start Development Servers
Run the applications from their respective directories:
```bash
# In one terminal
cd backend
npm run dev

# In another terminal
cd frontend
npm run dev
```
* **Frontend SPA:** opens at `http://localhost:5000`
* **Backend API:** starts at `http://localhost:3001`


---

## 2. Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel.
2. Select the `frontend` folder as the root directory of your project.
3. Configure the build settings:
   * **Framework Preset:** Vite
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
4. Set the following environment variable:
   * `VITE_API_URL`: Directs calls to your hosted backend (e.g. `https://wadu-api.onrender.com`)
5. Click **Deploy**.

---

## 3. Backend Deployment (Render / Heroku)

### Database Service
Create a managed PostgreSQL database (e.g., Supabase, Neon, or Render PostgreSQL). Keep the connection URL.

### Web Service Deployment
1. Create a new **Web Service** on Render pointing to your repository.
2. Set the **Root Directory** to `backend`.
3. Set the build and start commands:
   * **Build Command:** `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
   * **Start Command:** `npm run start`
4. Configure the environment variables:
   * `DATABASE_URL`: Your production database URL.
   * `JWT_SECRET`: A long, random string.
   * `PORT`: `3001`
   * `FRONTEND_URL`: Your deployed frontend URL (e.g. `https://wadu-tickets.vercel.app`).
   * SMTP settings (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`).
5. Click **Deploy**.
