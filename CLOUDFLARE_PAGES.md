# Cloudflare Pages Setup

This site is plain static HTML/CSS/JS. No framework build is required.

## Project folder

Use this folder as the site root:

- `Programming Projects/zacscottproductions.com`

## Recommended GitHub repo shape

The cleanest setup is to make this folder its own GitHub repository.

Files that should be in the repo root:

- `index.html`
- `assets/`
- `movies/`
- `README.md`
- `CLOUDFLARE_PAGES.md`

## Cloudflare Pages settings

When you create the Pages project:

- Framework preset: `None`
- Production branch: `main`
- Build command: `exit 0`
- Build output directory: `.`
- Root directory: leave blank if this folder is the repo root

If you instead place this site inside a larger repository, set:

- Root directory: `Programming Projects/zacscottproductions.com`
- Build output directory: `.`

## Publish flow

1. Create a GitHub repository for this site.
2. Push this folder to the `main` branch.
3. In Cloudflare, go to `Workers & Pages`.
4. Choose `Create application`.
5. Choose `Pages`.
6. Choose `Import an existing Git repository`.
7. Select the GitHub repo.
8. Apply the settings above.
9. Click `Save and Deploy`.

## Domain setup

For `zacscottproductions.com` as the main domain:

1. Add the domain to Cloudflare as a zone.
2. Cloudflare will give you nameservers.
3. In GoDaddy, replace the current nameservers with the Cloudflare nameservers.
4. In the Pages project, open `Custom domains`.
5. Add:
   - `zacscottproductions.com`
   - `www.zacscottproductions.com`

For the apex domain, Cloudflare Pages expects the domain to be on Cloudflare DNS.

## Current site structure

- Homepage: `index.html`
- Movie list: `movies/index.html`
- Individual film pages: `movies/*.html`

## Good next step

Before publishing, replace the placeholder descriptions on the film detail pages with your real blurbs.
