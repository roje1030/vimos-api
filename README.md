# ViMOS API

Backend API for ViMOS (Visual Monitoring of Orders System) — handles orders, line items, ETA tracking, notifications, users, and sync logs for the ViMOS dashboard.

## Tech Stack
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL (hosted on [Neon](https://neon.tech))
- Deployed on [Render](https://render.com)

## Prerequisites
- Node.js 20+
- A PostgreSQL database (this project uses Neon)

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and fill in your database connection string (`DATABASE_URL`)
3. Run database migrations to set up the schema: `npx prisma migrate dev`

## Running Locally

`npm run dev`

## Building for Production

`npm run build`
`npm start`

## Deployment

Deployed on Render as a Node web service.
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Pre-Deploy Command:** `npx prisma migrate deploy`

Environment variables (set in Render's Environment tab):
- `DATABASE_URL` — Neon Postgres connection string

## Project Structure

- `src/auth/` — Authentication logic
- `src/controllers/` — Request handlers
- `src/middleware/` — Express middleware
- `src/modules/` — Feature modules (e.g. users)
- `src/routes/` — Route definitions
- `src/index.ts` — Entry point