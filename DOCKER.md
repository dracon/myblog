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
