# Wadu Event Platform

## Overview
Wadu Event Platform is a global event ticketing and management application. It enables organizers to create events, configure various ticket types (such as General Admission, VIP, VVIP) with prices and limits, and save drafts or publish events. Attendees can discover events, buy tickets, and pay via M-Pesa or Card. The system automatically delivers tickets via email and WhatsApp. It also features a fully-featured Admin Dashboard for managing users, system-wide analytics, and platform activities, along with role-based access control for Admins, Organizers, and Attendees.

## Project Structure
```
Wadu_Event_Platform/
├── backend/                  # Express server API (Node.js + TS + Prisma + Postgres)
│   ├── src/                  # Source files (controllers, routes, services, middleware)
│   ├── prisma/               # Prisma database schema and migrations
│   ├── tsconfig.json         # Backend TypeScript configuration
│   └── package.json          # Standalone backend dependencies & scripts
├── frontend/                 # React SPA (Vite + TypeScript + Tailwind CSS)
│   ├── src/                  # React client components, pages, context, and hooks
│   ├── tsconfig.json         # Frontend TypeScript configuration
│   └── package.json          # Standalone frontend dependencies & scripts
├── docs/                     # Platform architecture and REST API reference
│   ├── api-reference.md      # Detailed endpoints reference
│   ├── architecture.md       # Architecture blueprints and workflow diagrams
│   └── deployment.md         # Manual for Render and Vercel deployments
└── README.md                 # Root level entry documentation
```

## Tech Stack

| Frontend Stack | Backend Stack |
| :--- | :--- |
| **Framework**: React (Vite) | **Runtime**: Node.js |
| **Language**: TypeScript | **Framework**: Express (v5) |
| **Styling**: Tailwind CSS & Vanilla CSS | **ORM**: Prisma Client |
| **State/Query**: TanStack React Query | **Database**: PostgreSQL |
| **Router**: React Router DOM | **Authentication**: Stateless JWT + bcryptjs |
| **Animation**: Framer Motion | **Validation**: Zod |
| **UI Components**: Radix UI & Lucide Icons | **Email**: Nodemailer (SMTP) |

## Prerequisites
- **Node.js**: `v18.x` or later
- **npm**: `v9.x` or later
- **PostgreSQL**: `v14` or later (locally running instance or hosted link)

## Environment Variables

### Backend Configuration (`backend/.env`)

| Variable Name | Description | Example Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL database connection string | `postgresql://postgres:password@localhost:5432/wadu_db` |
| `JWT_SECRET` | Super secret token key for JWT authentication | `my_jwt_super_secret_key_123` |
| `JWT_EXPIRES_IN` | Token expiration duration | `7d` |
| `PORT` | Local server listening port | `3001` |
| `FRONTEND_URL` | Base URL of frontend application | `http://localhost:5000` |
| `SMTP_HOST` | Host of SMTP email server | `smtp.gmail.com` |
| `SMTP_PORT` | Port of SMTP email server | `587` |
| `SMTP_USER` | Email username for Nodemailer | `your@email.com` |
| `SMTP_PASS` | App password/SMTP password | `your_smtp_app_password` |
| `SMTP_FROM` | Default sender header identity | `"WADU Tickets <no-reply@wadu.io>"` |

### Frontend Configuration (`frontend/.env`)

| Variable Name | Description | Example Value |
| :--- | :--- | :--- |
| `PORT` | Frontend dev server port | `5000` |
| `VITE_API_URL` | Base URL of API endpoint proxy | `http://localhost:3001` |

## Local Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/Wadu_Event_Platform.git
cd Wadu_Event_Platform
```

### 2. Backend setup
1. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Copy the environment variables template and configure it:
   ```bash
   cp .env.example .env
   ```
   *(Ensure to update `DATABASE_URL` with your local PostgreSQL credentials in `.env`)*
3. Run Prisma migrations to set up database tables:
   ```bash
   npx prisma migrate dev
   ```
4. Seed the database with default accounts and events:
   ```bash
   npx prisma db seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Frontend setup
1. Open a new terminal session, navigate to the frontend directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Copy the environment variables template:
   ```bash
   cp .env.example .env
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *(Go to `http://localhost:5000` to interact with the application)*

## Deployment

### Frontend (Vercel)
- Deploy directly from the `frontend/` subdirectory.
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- Set `VITE_API_URL` in environment variables to point to your hosted backend URL.

### Backend (Render)
- Deploy a **Web Service** pointing to your repository.
- **Root Directory**: `backend`
- **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
- **Start Command**: `npm run start`
- Set environment variables for production (`DATABASE_URL`, `JWT_SECRET`, `SMTP_USER`, etc.).


## API Reference
Please refer to [api-reference.md](file:///c:/Users/user/OneDrive - Mount Kenya University/Desktop/Projects/Wadu_Event_Platform/Wadu_Event_Platform/docs/api-reference.md) for full endpoint and request/response specifications.

## Contributing
1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit your changes: `git commit -m 'Add amazing feature'`
3. Push to your branch: `git push origin feature/amazing-feature`
4. Open a Pull Request for review.

