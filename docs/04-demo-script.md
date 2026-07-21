# Live Demo Script — GatherLoop Static Site
**Target length: ~6–7 minutes. Read through twice before presenting — don't read it live, talk from it.**

---

## 0. Open (15 sec)
> "This is my personal capstone project — a static site deployment for a fictional client,
> GatherLoop, using Azure Blob Static Website Hosting with a GitHub Actions CI/CD pipeline.
> I'll walk through the design decision, the live system, and a real incident I hit along the way."

---

## 1. The design decision (60–90 sec) — do this before touching anything technical
> "GatherLoop's traffic is near-zero for weeks, then spikes hard the morning tickets go on sale,
> then drops again. There's no one in-house to run a server. That ruled out a VM before I even
> compared costs — a VM is a fixed cost 24/7 whether anyone visits or not, and someone has to
> patch and babysit it. Blob Static Website Hosting has no server to maintain, and Azure's
> storage layer handles the spike without me sizing anything for peak load in advance."

**Show:** `docs/01-design-worksheet.md` comparison table on screen for 5–10 seconds — don't read it
aloud line by line, just point at the "Cost pattern" and "Ongoing maintenance" rows.

---

## 2. Show the live site (30 sec)
> "Here's the live site — this is being served straight from Azure Blob storage, not a server
> I'm running."

**Do:** Open `https://gatherloopsite18025.z1.web.core.windows.net/` in the browser. Let it just
sit on screen a moment — don't over-narrate a static page.

---

## 3. Show how it was provisioned (45 sec)
> "Everything was provisioned via the Azure CLI, not the Portal, so it's scripted and repeatable."

**Show:** `scripts/provision-static-site.sh` — scroll through it, point at the three commands:
create resource group → create storage account → enable static website hosting.

---

## 4. The CI/CD pipeline — live trigger (90 sec, this is the centerpiece)
> "Now I'll show the actual pipeline working. I'm going to make a small content change, push it,
> and we'll watch it deploy automatically — no manual upload step."

**Do, in order:**
1. Make a tiny visible edit in `site/index.html` (e.g. change a word in the hero text).
2. `git add . && git commit -m "demo: live trigger" && git push origin main`
3. Switch to the GitHub **Actions** tab, refresh, show the run starting.
4. While it runs (~30 sec): *"This step logs into Azure using a service principal scoped only
   to this project's resource group — not my whole subscription — so if that credential ever
   leaked, the blast radius is limited."*
5. Once green: reload the live site, show the change is there.

> "That's the full loop — push to GitHub, live in under a minute, no manual deploy step."

---

## 5. The incident (60–90 sec) — don't skip this, it's the strongest part of your demo
> "During the build I hit a real failure, not a staged one. I rotated the Azure credential as
> routine housekeeping, and the very next deploy failed."

**Show:** `docs/02-incident-report.md` briefly — Figure showing the failing Actions run.

> "The error said required credential keys were missing. Turns out Azure's two commands for
> generating this credential return different key names — one matches what the login action
> expects, the rotation command doesn't. I compared the two JSON shapes, remapped the keys,
> updated the secret, and re-ran it — it passed."

**Show:** the successful re-run screenshot.

> "The lesson: my original secrets plan said *where* the secret lives, but not *the exact
> procedure* for rotating it safely. I've since documented the correct JSON shape directly next
> to the rotation instructions, so this doesn't cost time again next time."

---

## 6. Close (15–20 sec)
> "So: Blob hosting was chosen deliberately against GatherLoop's actual traffic pattern and
> ops constraints, not by default. The pipeline is automated and tested end-to-end, including
> recovering from a real failure. Everything — code, scripts, worksheet, incident report, and
> the full documented report — is in the GitHub repo. Happy to answer questions."

---

## Anticipate these questions
- **"Why not the VM if it gives more control?"** → Control requires someone to exercise it;
  GatherLoop has no one to. Control without capacity to use it is a liability, not a benefit.
- **"What if traffic outgrows Blob hosting?"** → Azure CDN/Front Door can sit in front of the
  same storage account later without re-architecting; it's an additive step, not a rebuild.
- **"Why did the rotation break things instead of the original setup?"** → Two different Azure
  CLI commands (`create-for-rbac --sdk-auth` vs `credential reset`) return different JSON key
  names; only the first matches what the login action expects.
- **"Could this have been caught before it broke?"** → Yes — documenting the exact expected
  JSON shape next to the rotation steps, which is now done, would have caught it immediately.

---

## Timing checkpoint
If you're running long, cut section 3 (provisioning script walkthrough) short first — it's the
least distinctive part. Never cut section 4 (live pipeline trigger) or section 5 (incident) —
those are what make this demo more than "I deployed a webpage."
