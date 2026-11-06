<<<<<<< HEAD
# PT Panca Pilar Tangguh

Full-stack application built with Next.js, TypeScript, Prisma, and PostgreSQL.

## Requirements

- Node.js 20 or newer
- PostgreSQL 14 or newer

## Run locally

1. Copy `.env.example` to `.env` with `Copy-Item .env.example .env`. Set a local PostgreSQL password, a random `SESSION_PASSWORD` of at least 32 characters, and four different seed passwords (each at least 12 characters).
2. Start the included PostgreSQL 16 service (or use your existing PostgreSQL server):

   ```powershell
   docker compose up -d db
   ```

3. Install dependencies and set up the database:

   ```powershell
   npm install
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

4. Start the application:

   ```powershell
   npm run dev
   ```

The app is available at `http://localhost:3000`.

The seed creates these demo accounts. Their passwords are the matching role
passwords from `.env`; use unique credentials and do not reuse these seed
accounts in production:

| Role | Email |
| --- | --- |
| Super admin | `admin@pancapilartangguh.co.id` |
| IT staff | `itsupport.mdn@pancapilartangguh.co.id` |
| Branch manager | `bm.medan@pancapilartangguh.co.id` |
| Employee | `agus.sales@pancapilartangguh.co.id` |

Dashboard access is role-based: super admins see all branches and partnership
leads; IT staff manage tickets and view assets; branch managers see their
branch's tickets and assets; employees see and submit their own tickets.

## API

All API responses use JSON. Successful responses contain a `data` property;
validation and server errors contain an `error` message.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/branches` | List active branches |
| `GET` | `/api/products` | List active products |
| `GET` | `/api/dashboard/stats` | Get statistics scoped to the signed-in user's role |
| `GET` | `/api/b2b-requests` | List B2B partnership requests (super admin) |
| `POST` | `/api/b2b-requests` | Create a B2B request |
| `POST` | `/api/auth/login` | Sign in with email and password |
| `POST` | `/api/auth/logout` | Sign out |
| `GET` | `/api/tickets` | List tickets visible to the signed-in user |
| `POST` | `/api/tickets` | Create a helpdesk ticket |
| `PATCH` | `/api/tickets/:id` | Update ticket status (IT staff / super admin) |
| `GET` | `/api/assets` | List assets visible to the signed-in user |
| `POST` | `/api/assets` | Add an IT asset (IT staff / super admin) |
| `PATCH` | `/api/assets/:id` | Update asset condition or status (IT staff / super admin) |

Run `npm run build` to check the production build.
=======
# Panca-Pilar-Tangguh
Internal IT Management &amp; Helpdesk System for PT Panca Pilar Tangguh. Built with Next.js, TypeScript, &amp; Prisma to manage IT assets, ticketing, and B2B requests.
>>>>>>> 70a3bc492888ce099c8ef55d2ec2ab65fef95749
