# URL Shortener

A full-stack URL shortener built with React Router 7, deployed as a Cloudflare Worker, and backed by Cloudflare KV with Cloudflare Rate Limiting.

## What It Does

- Creates short codes for submitted URLs.
- Redirects short URLs to their original destination.
- Validates redirect destinations as http(s) before issuing a redirect.
- Applies rate limiting to URL creation.
- Renders a server-side React app on Cloudflare Workers.

## Tech Stack

- React 19 + React Router 7 (SSR)
- Cloudflare Workers runtime
- Cloudflare KV
- Cloudflare Rate Limiting binding
- Tailwind CSS v4
- Vite+ toolchain

## Routes

- /: Home page with URL creation form and one-time short URL display
- /:code: Redirect endpoint that looks up the code and redirects

Route config lives in app/routes.ts.

## Data Model

The app stores URL mappings in Cloudflare KV:

- key: u:<shortCode>
- value: original URL (string)

Short codes are generated as fixed-length random alphanumeric values (10 characters).

Cloudflare KV is eventually consistent. A newly-created short URL can return 404 briefly, especially when read from a different region immediately after creation.

Cloudflare KV also does not support atomic conditional writes. This app reduces collision risk with longer random codes, retry logic, and collision/overwrite logging, but at very high concurrency a write race can still overwrite a mapping.

Created links are intentionally not listed publicly. Users must save generated short URLs when created.

## Project Structure

- app/routes/index.tsx: Form, create URL action, one-time result display
- app/routes/redirect.tsx: Code lookup and redirect
- workers/app.ts: Cloudflare Worker fetch handler and React Router request handling
- wrangler.jsonc: Worker config, KV, and rate limiter bindings

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

- Cloudflare KV is bound as URLS in wrangler.jsonc.
- wrangler.jsonc includes preview_id for URLS and currently points to the same namespace as id. Replace preview_id with a dedicated non-production KV namespace ID before using wrangler dev --remote or preview deployments.
- Cloudflare Rate Limiting is bound as CREATE_RATE_LIMITER in wrangler.jsonc.
- Set a unique ratelimit namespace_id for your Cloudflare account before deployment.
- The app runs in SSR mode via React Router config in react-router.config.ts.
