# myblog

Personal website built with [Docusaurus](https://docusaurus.io/) — docs, a blog and standalone pages. Written in TypeScript with React 19.

## Requirements

- Node.js >= 20.0
- [pnpm](https://pnpm.io/) (this repo uses `pnpm-lock.yaml`, not npm or yarn)
- Docker (only for the containerized Playwright setup, see [Testing](#testing))

## Installation

```bash
pnpm install
```

## Local Development

```bash
pnpm start
```

Starts the dev server on http://localhost:3000 with hot reload.

## Build

```bash
pnpm build
```

Generates the static site into `build/`.

## Type Checking

```bash
pnpm typecheck
```

## Testing

End-to-end tests use [Playwright](https://playwright.dev/) and live in `tests/`.
The dev server is started automatically via the `webServer` entry in `playwright.config.ts`.

On officially supported systems (Ubuntu/Debian, macOS, Windows) with browsers installed via `pnpm exec playwright install`:

```bash
pnpm test         # all three browsers (chromium, firefox, webkit), headless
pnpm test:ui      # interactive UI mode
pnpm test:headed  # visible browser windows
pnpm test:debug   # Playwright inspector
```

### Tests on CachyOS / Arch-based Linux

Playwright does not officially support Arch-based distributions like CachyOS: the browser binaries and their system dependencies are only packaged for Ubuntu/Debian, macOS and Windows, so a local `pnpm test` fails. Run the tests in Docker instead:

```bash
pnpm test:docker
```

This runs the whole suite headless in all three browsers inside a container based on the official Playwright image (Ubuntu 24.04 "noble"), which ships the browsers and all system dependencies. The repo is mounted into the container, so the HTML report lands in `playwright-report/` and traces in `test-results/` on the host as usual.

- **When the container is necessary**: on CachyOS/Arch (i.e. this machine), on CI, and for anyone whose distro Playwright doesn't support.
- **When local Playwright is fine**: on a supported OS with `pnpm exec playwright install` done — it is faster and additionally offers the UI/headed/debug modes.
- `test:ui`, `test:headed` and `test:debug` are **not** available in the container (no display) — debug container runs via the HTML report or `pnpm exec playwright show-trace`.

Arguments can be passed to Playwright through the compose service:

```bash
# single spec, one browser
docker compose -f docker-compose.test.yaml run --rm playwright \
  pnpm exec playwright test tests/homepage.spec.ts --project=chromium
```

See `DOCKER.md` for all Docker details and `tests/README.md` for test conventions.

## Docker

- `docker-compose.yaml` – builds the production site and serves it with Nginx on http://localhost (port 80)
- `docker-compose.test.yaml` – runs the Playwright tests (see [Testing](#testing))

## Deployment

Using SSH:

```bash
USE_SSH=true pnpm deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> pnpm deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
