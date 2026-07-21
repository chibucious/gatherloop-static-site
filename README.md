# GatherLoop Static Site

Static site deployment for the GatherLoop conference launch page — built as the personal
capstone project for **Group 3: Static Site Deployment.**

**Live site:** https://gatherloopsite18025.z1.web.core.windows.net/
**Cloud provider:** Microsoft Azure (Free Tier account)
**Author:** Chibucious — Reg. No. CLC/2026/TC-7/0110

---

## The scenario, in one paragraph

GatherLoop is launching a single-page site for a ticketed conference. Traffic is near-zero for
weeks, then spikes hugely the morning tickets go on sale, then drops back to near-zero — and
there's no one in-house to operate a server. The brief's challenge was to choose, and justify,
between two valid hosting architectures rather than defaulting to whichever is more familiar.

## The decision

**Azure Blob Static Website Hosting** was chosen over a Linux VM + Nginx, because it directly
answers GatherLoop's two hardest constraints at once: it automatically absorbs the sale-morning
spike without anyone managing server capacity, and it needs no ongoing maintenance — which
matters because there's no one available to provide that maintenance. The full reasoning,
including the honest comparison against the VM option, is in
[`docs/01-design-worksheet.md`](docs/01-design-worksheet.md).

## Architecture

```
GitHub push to main (site/**)
        │
        ▼
GitHub Actions  ── authenticates via a scoped Azure service principal
        │           (limited to the gatherloop-rg resource group only)
        ▼
az storage blob upload-batch → Azure Storage Account "$web" container
        │
        ▼
Static website endpoint (HTTPS, no port configuration required)
```

## Repository structure

```
gatherloop-static-site/
├── README.md                          ← you are here
├── BUILD-LOG.md                       ← running journal of how this was built, step by step
├── site/                              ← the actual HTML/CSS/JS (Tailwind CSS v4)
├── scripts/
│   └── provision-static-site.sh       ← CLI-only provisioning (no manual Portal clicks)
├── screenshots/                       ← proof-of-work for every step
├── .github/workflows/
│   └── deploy-static-site.yml         ← auto-deploy on push to main
└── docs/
    ├── 01-design-worksheet.md         ← two-architecture comparison + decision
    ├── 02-incident-report.md          ← a real production incident, diagnosed and fixed
    ├── 03-GatherLoop-Static-Site-Capstone-Personal-Documented-Report.docx
    │                                  ← the formal Documented Report
    ├── 04-demo-script.md              ← live demo walkthrough script
    └── 05-GatherLoop-Demo-Deck.pptx   ← supporting presentation deck
```

## How to run this locally

```bash
git clone https://github.com/chibucious/gatherloop-static-site.git
cd gatherloop-static-site

# open site/index.html directly in a browser to preview,
# or serve it locally with any static file server, e.g.:
npx serve site/
```

## How it deploys

1. `scripts/provision-static-site.sh` — one-time CLI provisioning of the Azure resource group,
   storage account, and static website hosting configuration.
2. Any push to `main` touching `site/**` triggers `.github/workflows/deploy-static-site.yml`,
   which authenticates to Azure and syncs `site/` into the storage account's `$web` container.
3. The live endpoint reflects the change within seconds — no manual upload step, ever.

## A note to the (fictional) founder

> "We're hosting your site using Microsoft's cloud storage system instead of a traditional
> server. On the morning tickets go live, your site isn't limited by one machine's capacity —
> it's backed by the same infrastructure that handles much bigger sites. During the quiet weeks
> before and after, you're not paying to keep a server running and secured for traffic that
> isn't there. Updates go live automatically the moment we push a change — no manual step for
> either of us. It's still a real, production website; it's simply not one either of us has to
> babysit."

## What actually happened during the build

This project hit a real, unplanned production incident — a credential-rotation key mismatch
that broke the deployment pipeline — which was diagnosed, fixed, and fully documented in
[`docs/02-incident-report.md`](docs/02-incident-report.md). The full step-by-step build process,
including that incident, is logged in [`BUILD-LOG.md`](BUILD-LOG.md).

## Deliverables checklist

| Deliverable | Status |
|---|---|
| Site code (Tailwind CSS v4) | ✅ |
| CLI provisioning script | ✅ |
| GitHub Actions CI/CD (tested, incident-proven) | ✅ |
| Two-architecture comparison worksheet | ✅ |
| Screenshots (live site, Actions runs, incident before/after) | ✅ |
| Incident report | ✅ |
| Documented Report (docx) | ✅ |
| Demo script + presentation deck | ✅ |
| Publicly accessible, HTTPS, no non-standard port | ✅ |

## Security note

A service principal secret referenced during troubleshooting in this project's history was
rotated after exposure in non-version-controlled contexts, as a precaution. See
[`docs/02-incident-report.md`](docs/02-incident-report.md) for full detail.