---
description: Initialize context for the myblog Docusaurus project
---

# /init — myblog Project Initialization

Use this workflow to get oriented when starting a new session on the **myblog** Docusaurus project.

## Project Overview

- **Type**: [Docusaurus](https://docusaurus.io/) v3.9.2 blog/docs site
- **Author**: Wolfgang Born (`wolfgang` slug in `blog/authors.yml`)
- **Stack**: TypeScript · React 19 · Docusaurus Classic Preset · pnpm
- **Root**: `/home/wolfgang/projects/myblog`

## Key Files & Directories

| Path | Purpose |
|------|---------|
| `docusaurus.config.ts` | Main site config (title, URL, navbar, footer, presets) |
| `sidebars.ts` | Docs sidebar structure |
| `blog/` | Blog posts — MDX/MD files or dated folders |
| `blog/authors.yml` | Author metadata (yangshun, slorber, **wolfgang**) |
| `blog/tags.yml` | Reusable tag definitions |
| `docs/` | Documentation pages |
| `src/css/custom.css` | Global CSS overrides |
| `src/pages/` | Standalone React/MDX pages |
| `src/components/` | Shared React components |
| `static/` | Static assets (images, favicon, etc.) |
| `package.json` | npm scripts & dependency versions |

## NPM Scripts (run with `pnpm`)

| Command | Description |
|---------|-------------|
| `pnpm start` | Start local dev server (hot reload) |
| `pnpm build` | Production build |
| `pnpm serve` | Serve production build locally |
| `pnpm clear` | Clear Docusaurus cache |
| `pnpm typecheck` | TypeScript type checking |

## Blog Post Conventions

- Dated folder format: `blog/YYYY-MM-DD-slug/YYYY-MM-DD-slug.mdx` (or `.md`)
- Simple posts: `blog/YYYY-MM-DD-post-title.md`
- Frontmatter required fields: `slug`, `title`, `authors`, `tags`
- Use `<!--truncate-->` to mark the fold for the blog list view

## Current Config Defaults (things to customise)

The config still has Docusaurus template defaults that should be updated:
- `title`: `'My Site'` → update to Wolfgang's actual site name
- `url`: `'https://your-docusaurus-site.example.com'` → update to real URL
- `organizationName` / `projectName`: still set to Facebook/Docusaurus defaults
- `editUrl` in blog & docs presets: still points to Docusaurus repo
- Footer copyright / community links: still template placeholders
- Navbar GitHub link: still points to Docusaurus repo

## Steps

1. Review the project overview and key files above.
2. Check `docusaurus.config.ts` for any pending configuration updates.
3. Check `blog/authors.yml` to confirm author details are up to date.
4. Run the dev server if needed:
// turbo
```
pnpm --dir /home/wolfgang/projects/myblog start
```
5. You are now ready to assist with blog posts, docs, configuration, or styling.
