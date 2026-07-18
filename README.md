# Housify

Housify is an Indian real-estate website and CRM for managing properties, projects, inquiries, leads, customers, assignments, tasks and role-based access.

The repository contains:

- `frontend/` — React, TypeScript, Vite and Tailwind customer website and CRM dashboard.
- `backend/` — Express API, Prisma ORM and PostgreSQL database integration.

## Requirements

- Node.js 18 or newer (Node.js 20 LTS recommended)
- npm
- PostgreSQL 14 or newer, or a hosted PostgreSQL provider such as Neon

## Security before pushing to GitHub

Never commit `backend/.env`, `frontend/.env`, database URLs, JWT secrets, email credentials or production logs. The root `.gitignore` excludes these files. Only commit the provided `.env.example` files.

If a secret was ever committed, rotate it immediately and remove it from Git history before making the repository public.

## Clone and install

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Housify

cd backend
npm ci

cd ../frontend
npm ci
```

## Backend configuration

```bash
cd backend
copy .env.example .env   # Windows
# cp .env.example .env   # macOS/Linux
```

Set these values in `backend/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
PORT=5000
JWT_SECRET="generate-a-long-random-secret"
JWT_REFRESH_SECRET="generate-another-long-random-secret"
CLIENT_URL="http://localhost:3000"
```

Use different, long random JWT secrets in every environment. Do not reuse the development database or secrets in production.

## Database setup

For a new database, apply all committed migrations:

```bash
cd backend
npx prisma generate
npx prisma migrate deploy
```

For local development only, seed demo data if desired:

```bash
npm run db:seed
```

Do not run `prisma migrate dev` against the production database. Take a database backup before production migrations.

## Run locally

Start the API in one terminal:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
copy .env.example .env   # Windows
npm run dev
```

Open `http://localhost:3000`. The Vite development server proxies `/api` requests to `http://localhost:5000`.

## Production builds

Frontend:

```bash
cd frontend
npm ci
npm run build
npm run preview
```

Backend:

```bash
cd backend
npm ci --omit=dev
npx prisma generate
npx prisma migrate deploy
NODE_ENV=production npm start
```

The backend health check is available at `/health`.

## Deploying the backend

Deploy `backend/` to a Node-compatible service such as Render, Railway, Fly.io, or a VPS.

Set these production environment variables in the hosting provider dashboard:

- `DATABASE_URL`
- `PORT` (use the provider-provided port when required)
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `CLIENT_URL` — the exact deployed frontend URL
- Any future mail/storage provider credentials

Build/start commands:

```text
Build:  npm ci --omit=dev && npx prisma generate && npx prisma migrate deploy
Start:  npm start
```

Do not place production values in `docker-compose.yml`, source files or README files.

## Single-service deployment (frontend and backend together)

The repository also includes `render.yaml` for deploying the React frontend and Express backend as one Render Web Service. In this mode, the frontend is built during deployment and Express serves `frontend/dist` while `/api/*` remains the backend API.

Create the service from the repository blueprint, then add these secret environment variables in Render:

```env
DATABASE_URL=your-neon-postgresql-url
JWT_SECRET=long-random-secret
JWT_REFRESH_SECRET=another-long-random-secret
CLIENT_URL=https://your-service.onrender.com
```

For this layout, leave `VITE_API_URL` empty or unset. The browser uses the same origin for both the website and API. The Render free Web Service may sleep after 15 minutes of inactivity, so the first request after idle can be slow.

## Deploying the frontend

Deploy `frontend/` to Vercel, Netlify, Cloudflare Pages or another static hosting service.

Set:

```env
VITE_API_URL=https://YOUR-BACKEND-DOMAIN.example.com
```

The value must not have a trailing slash. The frontend uses this value for API requests in production. Configure the backend `CLIENT_URL` to the same frontend origin, including `https://`.

Build settings:

```text
Install command: npm ci
Build command:   npm run build
Output folder:   dist
```

Configure the host to rewrite all application routes to `index.html`, otherwise refreshing `/properties`, `/projects` or `/dashboard` may return a 404.

## Main application flows

- Public property and project pages read from the backend database.
- Contact and property inquiry forms create inquiry and lead records.
- Authorized users manage properties, projects, leads, customers, inquiries, tasks and team access from the dashboard.
- Lead conversion creates a customer and carries the assigned property forward.
- Access is enforced by the authenticated user role on backend CRM routes.

## Role overview

- `SUPER_ADMIN` — full system access.
- `ADMIN` — operational management access, including catalog and team administration within the configured rules.
- `SALES_MANAGER` — team and pipeline management for the manager’s assigned team.
- `SALES_EXECUTIVE` / `AGENT` — assigned pipeline, customers and follow-up work; catalog access is limited by permissions.

## Useful checks

```bash
cd frontend
npm run build

cd ../backend
npx prisma validate
npx prisma migrate status
```

Before production release, verify login, role restrictions, public inquiry submission, property/project visibility, lead assignment, lead conversion and customer property assignment using a staging database.
