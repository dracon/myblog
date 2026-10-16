# Docker Setup for Docusaurus

This project includes Docker configuration to run the Docusaurus site in containers.

## Files

- **Dockerfile** – Multi-stage build: Node for compiling, Nginx for serving
- **docker-compose.yaml** – Orchestration config
- **nginx.conf** – Nginx configuration with SPA routing and caching
- **.dockerignore** – Excludes unnecessary files from build context

## Build & Run

### Using Docker Compose (Recommended)

```bash
# Build and run
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f
```

The site will be accessible at `http://localhost`

### Using Docker Directly

```bash
# Build
docker build -t myblog:latest .

# Run
docker run -d -p 80:80 --name myblog myblog:latest

# Stop
docker stop myblog
docker rm myblog
```

## Playwright Tests in Docker

Playwright does not officially support all Linux distributions (e.g. Arch-based
distros like CachyOS), so tests run inside an Ubuntu-based container with the
browsers preinstalled.

- **Dockerfile.playwright** – Official `mcr.microsoft.com/playwright` image + pnpm
- **docker-compose.test.yaml** – Test container: installs dependencies, starts the
  Docusaurus dev server (Playwright `webServer`), and runs the tests

Everything runs in one container, so no config for browser installation is needed.

```bash
# Run all tests (chromium, firefox, webkit)
npm run test:docker

# Run a single spec
docker compose -f docker-compose.test.yaml run --rm playwright pnpm exec playwright test tests/homepage.spec.ts

# Run one browser project
docker compose -f docker-compose.test.yaml run --rm playwright pnpm exec playwright test --project=chromium
```

- The HTML report is written to `playwright-report/` and traces to `test-results/`
- Installed dependencies are cached in the `playwright-node-modules` volume;
  delete it (`docker volume rm myblog_playwright-node-modules`) to reinstall
- Keep the image tag in `Dockerfile.playwright` in sync with `@playwright/test`
  in `package.json`

## Image Size

- **Uncompressed**: ~97.7 MB
- **Compressed**: ~27.2 MB

The small size is achieved using:
- Multi-stage build (only built files in final image)
- Alpine-based Nginx runtime
- .dockerignore to exclude unnecessary files

## Features

✅ Static site serving with Nginx  
✅ SPA routing (URLs like `/docs/intro` work correctly)  
✅ Gzip compression enabled  
✅ Cache headers for assets (1 year for versioned assets)  
✅ Security headers (X-Frame-Options, X-Content-Type-Options, etc.)  
✅ Health checks  
✅ Automatic restart

## Configuration

The Nginx config is optimized for Docusaurus:
- Static assets with content hashes are cached for 1 year
- HTML files are always revalidated
- All routes fall back to `index.html` for client-side routing
- Gzip compression for text/CSS/JS

## Environment

The container runs Node 20 Alpine for build and Nginx Alpine for runtime, keeping the final image lean.
