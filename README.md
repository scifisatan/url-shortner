# URL Shortener

A full-stack URL shortener built with React Router 7, deployed as a Cloudflare Worker, and backed by Cloudflare D1 via Drizzle ORM.

## What It Does

- Creates short codes for submitted URLs.
- Redirects short URLs to their original destination.
- Tracks click counts per short URL.
- Renders a server-side React app on Cloudflare Workers.

## Tech Stack

- React 19 + React Router 7 (SSR)
- Cloudflare Workers runtime
- Cloudflare D1 (SQLite)
- Drizzle ORM + Drizzle Kit
- Tailwind CSS v4
- Vite+ toolchain

## Routes

- /: Home page with URL creation form and list of saved short URLs
- /:code: Redirect endpoint that looks up the code, increments clicks, and redirects

Route config lives in app/routes.ts.

## Database Schema

The urls table includes:

- id (auto-increment primary key)
- short_code (unique)
- original_url
- created_at
- clicks (default 0)

Schema definition: app/db/schema.ts
Drizzle config: drizzle.config.ts
Migrations output: migrations/

## Project Structure

- app/routes/home.tsx: Form, list view, create URL action, load all URLs
- app/routes/redirect.tsx: Code lookup, click increment, redirect
- app/db/: Database schema and Drizzle client factory
- workers/app.ts: Cloudflare Worker fetch handler and React Router request handling
- wrangler.jsonc: Worker config and D1 binding

## Prerequisites

- Node.js (compatible with the toolchain)
- vp CLI available globally
- Cloudflare account and Wrangler authentication for deploys

## Setup

Install dependencies:

```bash
vp install
```

Generate Cloudflare worker types:

```bash
vp run cf-typegen
```

## Development

Start the development server:

```bash
vp run dev
```

Default app URL is usually http://localhost:5173.

## Quality Checks

Run lint, formatting, and type checks:

```bash
vp check
```

Run project typecheck script explicitly:

```bash
vp run typecheck
```

## Build and Preview

Build for production:

```bash
vp run build
```

Preview the production build:

```bash
vp preview
```

## Deployment

Deploy using the existing deploy script:

```bash
vp run deploy
```

Manual Wrangler version workflow:

```bash
vp exec wrangler versions upload
vp exec wrangler versions deploy
```

## Notes

- Cloudflare D1 is bound as DB in wrangler.jsonc.
- Existing migration files are under migrations/.
- The app runs in SSR mode via React Router config in react-router.config.ts.
