# Live Demo Script — GatherLoop Static Site

> **How to use this document:** each section below has three parts — **SAY** (what to speak
> out loud, in your own words, not read verbatim), **DO** (the exact action to perform on
> screen), and **WHY IT'S HERE** (the reason this section exists, so you can explain it if
> asked a follow-up question). Read through the whole script twice before presenting. Total
> target length: 6–7 minutes.

---

## Section 0 — Opening
**Time: ~15 seconds**

**SAY:**
> "This is my personal capstone project — a static site deployment for a fictional client,
> GatherLoop, using Azure Blob Static Website Hosting with a GitHub Actions CI/CD pipeline.
> I'll walk through the design decision, the live system, and a real incident I hit along
> the way."

**DO:** Nothing yet — just introduce, don't share your screen at this exact moment.

**WHY IT'S HERE:** Tells the audience the shape of the next 6 minutes before you start, so
they're not guessing what's coming.

---

## Section 1 — The Design Decision
**Time: ~60–90 seconds**

**SAY:**
> "GatherLoop's traffic is near-zero for weeks, then spikes hard the morning tickets go on
> sale, then drops again. There's no one in-house to run a server. That ruled out a VM before
> I even compared costs — a VM is a fixed cost 24/7 whether anyone visits or not, and someone
> has to patch and babysit it. Blob Static Website Hosting has no server to maintain, and
> Azure's storage layer handles the spike without me sizing anything for peak load in advance."

**DO:** Open `docs/01-design-worksheet.md` and show the comparison table for about 5–10
seconds. Point at the "Cost pattern" and "Ongoing maintenance" rows specifically — don't read
every row aloud.

**WHY IT'S HERE:** The brief grades the reasoning, not just the outcome. This section proves
the architecture was chosen on purpose, not by default.

---

## Section 2 — The Live Site
**Time: ~30 seconds**

**SAY:**
> "Here's the live site — this is being served straight from Azure Blob storage, not a server
> I'm running."

**DO:** Open `https://gatherloopsite18025.z1.web.core.windows.net/` in a browser. Let it sit on
screen for a few seconds — don't over-narrate a static page.

**WHY IT'S HERE:** Proof the system actually works, before explaining how it was built.

---

## Section 3 — How It Was Provisioned
**Time: ~45 seconds**

**SAY:**
> "Everything was provisioned via the Azure CLI, not the Portal, so it's scripted and
> repeatable."

**DO:** Open `scripts/provision-static-site.sh`. Scroll through it slowly, pointing at the
three key commands in order: create resource group → create storage account → enable static
website hosting.

**WHY IT'S HERE:** The brief specifically requires CLI-only provisioning ("no manual portal
clicking for anything repeatable") — this section is your evidence of that requirement.

---

## Section 4 — The CI/CD Pipeline, Triggered Live
**Time: ~90 seconds — this is the centerpiece of the demo, don't rush it**

**SAY (before triggering):**
> "Now I'll show the actual pipeline working. I'm going to make a small content change, push
> it, and we'll watch it deploy automatically — no manual upload step."

**DO, in this exact order:**
1. Make a small, visible edit in `site/index.html` (e.g. change one word in the hero text).
2. Run:
   ```bash
   git add . && git commit -m "demo: live trigger" && git push origin main
   ```
3. Switch to the GitHub **Actions** tab, refresh, and show the run starting.

**SAY (while it's running, ~30 seconds of dead time):**
> "This step logs into Azure using a service principal scoped only to this project's resource
> group — not my whole subscription — so if that credential ever leaked, the blast radius is
> limited."

**DO (once it finishes):** Reload the live site, and show the change is there.

**SAY (closing this section):**
> "That's the full loop — push to GitHub, live in under a minute, no manual deploy step."

**WHY IT'S HERE:** This is the single most convincing piece of evidence in the whole demo —
anyone can screenshot a working site, but watching automation happen live proves it's real.

---

## Section 5 — The Incident
**Time: ~60–90 seconds — don't skip this, it's your strongest material**

**SAY:**
> "During the build I hit a real failure, not a staged one. I rotated the Azure credential as
> routine housekeeping, and the very next deploy failed."

**DO:** Open `docs/02-incident-report.md` briefly. Show the screenshot of the failing Actions
run.

**SAY:**
> "The error said required credential keys were missing. Turns out Azure's two commands for
> generating this credential return different key names — one matches what the login action
> expects, the rotation command doesn't. I compared the two JSON shapes, remapped the keys,
> updated the secret, and re-ran it — it passed."

**DO:** Show the successful re-run screenshot.

**SAY:**
> "The lesson: my original secrets plan said where the secret lives, but not the exact
> procedure for rotating it safely. I've since documented the correct JSON shape directly next
> to the rotation instructions, so this doesn't cost time again next time."
>
> "One thing worth calling out: this is exactly why fast detection mattered as much as the fix
> itself. The very next deploy caught this — not a visitor noticing the site was broken.
> That's the actual measure of a good pipeline: not just 'does it work,' but 'how fast do we
> know when it doesn't.'"

**WHY IT'S HERE:** A real, self-diagnosed failure is more impressive than a flawless run —
it proves you understand the system deeply enough to fix it under pressure, not just follow
steps that happened to work.

---

## Section 6 — Closing
**Time: ~15–20 seconds**

**SAY:**
> "So: Blob hosting was chosen deliberately against GatherLoop's actual traffic pattern and
> ops constraints, not by default. The pipeline is automated and tested end-to-end, including
> recovering from a real failure. Everything — code, scripts, worksheet, incident report, and
> the full documented report — is in the GitHub repo. Happy to answer questions."

**DO:** Nothing — just stop talking and look at the audience/panel.

**WHY IT'S HERE:** Ends on the two things graders actually care about most: was the decision
justified, and does the system genuinely work.

---

## Anticipated Questions (prepare these answers now, don't improvise)

| Question | Your answer |
|---|---|
| Why not the VM, if it gives more control? | Control requires someone to exercise it. GatherLoop has no one to. Control without capacity to use it is a liability, not a benefit. |
| What if traffic outgrows Blob hosting? | Azure CDN / Front Door can sit in front of the same storage account later — additive, not a rebuild. |
| Why did rotation break things, but the original setup worked fine? | Two different Azure CLI commands (`create-for-rbac --sdk-auth` vs. `credential reset`) return different JSON key names; only the first matches what the login action expects. |
| Could this have been caught before it broke? | Yes — documenting the exact expected JSON shape next to the rotation steps (now done) would catch it immediately next time. |

---

## If You're Running Long — Cut in This Order
1. **First cut:** Section 3 (provisioning script walkthrough) — shorten to one sentence.
2. **Never cut:** Section 4 (live pipeline trigger) or Section 5 (the incident) — these are
   what separate this demo from "I deployed a webpage."

---

## Before You Present — Rehearsal Checklist
- [ ] Read through this whole script twice, out loud, at least once
- [ ] Actually trigger the pipeline once beforehand so you know how long it takes on your
      connection (this avoids awkward surprise dead air during Section 4)
- [ ] Have `docs/01-design-worksheet.md` and `docs/02-incident-report.md` already open in
      browser tabs, so you're not searching for files live
- [ ] Know the live site URL by heart, don't read it off a screenshot