# Deployment

## What is wired

`.github/workflows/pages.yml` builds the site and deploys it to GitHub Pages on
every push to `main`, and on demand.

Two environment variables make it work:

| Variable | Value | Why |
|---|---|---|
| `SITE_BASE` | `/<repo>/` | A project page is not served from a domain root, so every root-absolute link has to be rebased |
| `SITE_ORIGIN` | `https://<owner>.github.io` | Canonical tags and the sitemap need absolute URLs |

Locally, neither is set, and the build produces a root-relative site suitable for
previewing.

## The one manual step

The GitHub API refuses to enable Pages for this repository's token
(`Resource not accessible by integration`), so it is a two-click change in the
repository settings:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. Push to `main`, or run the **pages** workflow from the Actions tab.

The expected URL is `https://anuj-phulera.github.io/Portfolio/`.

## Verifying a deploy

```bash
curl -sI https://anuj-phulera.github.io/Portfolio/ | head -1
curl -s  https://anuj-phulera.github.io/Portfolio/sitemap.xml | head -5
```

Then load the URL on a phone that has never seen the site, and run
`docs/checklist.md`.

## A custom domain

If one is ever added, set `SITE_ORIGIN` in the workflow to the domain, set
`SITE_BASE` to `/`, and add the `CNAME` file. Nothing else in the build changes,
because the base path is applied in exactly one place.

## Reversing it

Deleting `.github/workflows/pages.yml` stops future deploys. Turning Pages off in
settings removes the published site. The built output is generated, never
committed, so there is nothing to clean up.
