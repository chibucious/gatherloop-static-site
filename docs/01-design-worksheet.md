# Phase 0 — Design Worksheet: GatherLoop Static Site

> **What is this document, in one sentence?**
> Before we build anything, we have to decide *how* to host the website, and write down
> *why* — this document is that decision, explained in full.

---

## Part 1 — Understanding the two options (read this first)

The brief gives us two valid ways to put GatherLoop's webpage on the internet. If either of
these terms is new to you, that's exactly why this section exists — read it slowly once, it
only needs to make sense one time.

### Option A: Azure Blob Static Website Hosting

**Analogy first:** imagine a printing shop that automatically photocopies your poster and
hands a copy to anyone who walks up and asks for it — instantly, no matter how many people show
up at once, and you never have to run the copier yourself.

**What it actually is:** Azure (Microsoft's cloud platform) has a storage service called "Blob
Storage" — think of it as a giant, reliable filing cabinet in the cloud where you can store
files. One special feature of this filing cabinet is that it can be switched into **"static
website mode."** When you do that, Azure will:
1. Take your website files (`index.html`, `style.css`, etc.) that you upload into it.
2. Give you a public web address.
3. Automatically serve those files to any visitor who opens that address — instantly, and to
   as many visitors at once as show up.

**The key word is "static."** A static website means the page is just plain files — no
server-side code running, no database being queried live, nothing that needs a computer
"thinking" in real time. It's literally just handing out files. GatherLoop's ticket page (some
text, images, maybe a countdown) is exactly this kind of simple page.

**What you *don't* have to do:** you never install anything, never patch an operating system,
never worry about a process crashing at 2am. There is no "server" in the traditional sense —
just files, and Azure's infrastructure handing them out.

---

### Option B: A Linux Virtual Machine (VM) running Nginx

**Analogy first:** imagine renting an entire empty apartment, then furnishing it yourself,
installing a doorbell system yourself, and being the one who has to fix the doorbell if it
breaks — versus the photocopy shop above, where none of that upkeep is your problem.

**What it actually is:**
- A **Virtual Machine (VM)** is a full, general-purpose computer that Azure rents to you — except
  it's virtual (software-emulated) rather than a physical box sitting somewhere. You get to
  install anything you want on it, exactly like a real computer.
- **Linux** is the operating system running on that virtual computer (the same family of
  operating system that runs most of the internet's servers).
- **Nginx** (pronounced "engine-x") is a piece of software you install on that VM whose job is
  to listen for visitors and serve your website's files to them.

**What you *do* have to do:** because it's a full computer, *you* are responsible for
everything about it — installing security updates to the operating system, keeping Nginx
configured correctly, restarting it if it ever crashes, and making sure it's not overwhelmed if
too many visitors show up at once. Nobody else is doing this maintenance for you.

---

### So what's the actual decision being asked of us?

Both options can absolutely display GatherLoop's webpage. The question is not "which one
works" — both do. The question is: **given GatherLoop's specific situation (huge traffic spike
on one morning, then quiet; nobody available to maintain a server; wants auto-updates from
GitHub), which one fits better, and why?**

That's what the rest of this document works out, criterion by criterion.

---

## Part 2 — A few more terms used below, explained simply

| Term | What it means, simply |
|---|---|
| **Traffic spike** | A sudden, short burst of many people visiting the site at once — here, the morning tickets go on sale. |
| **Ops budget** ("no ops budget") | No time, money, or staff available to operate/maintain infrastructure day-to-day. |
| **Provisioning** | The act of creating/setting up a cloud resource (e.g. "provisioning a VM" = creating that virtual computer). |
| **CLI** | Command Line Interface — typing commands into a terminal to control Azure, instead of clicking around the Azure website (the "portal"). The brief requires CLI so the process is scripted and repeatable, not a one-off series of clicks nobody can reproduce. |
| **GitHub Actions** | An automation tool built into GitHub that can run steps (like "upload the website files to Azure") automatically whenever you push new code. |

---

## Part 3 — The Comparison (Section 2.1 of the brief)

GatherLoop's situation, restated simply:
- Almost no visitors for weeks → then a **huge spike** the morning tickets go on sale → then
  almost no visitors again.
- **Nobody in-house** to babysit a server if something goes wrong, especially at 7am on sale day.
- Content changes (new speakers, schedule updates) should **go live automatically** when pushed
  to GitHub — no manual redeploy step each time.
- The founder has heard "a real server gives you more control" and worries that storage hosting
  isn't a "real" website.

The brief is clear that **the comparison itself is the graded part** — not just the final
answer — so both columns below are filled in honestly, including the option not chosen.

| Criterion | Blob Static Website Hosting | Linux VM + Nginx |
|---|---|---|
| **Handles the sale-morning spike?** | Yes. Azure's storage infrastructure spreads the load across many physical machines behind the scenes — there's no single machine that can get "full." | Only if the VM was already sized (and paid for) big enough to handle peak load *before* the spike happens. One VM has a ceiling on CPU, memory, and simultaneous connections. |
| **Ongoing maintenance burden?** | Basically none — no operating system to patch, no server software to configure, nothing that can crash and need a restart. | Real and continuous — someone must apply security updates, keep Nginx configured, and notice + fix it if it ever goes down. |
| **Cost pattern (idle vs. spike)?** | Very cheap during quiet weeks (you pay only for the small amount of storage/bandwidth actually used); rises only a little on the spike day, then drops back down. | A fixed price runs 24/7 whether anyone visits or not — you pay the same amount for the quiet weeks as you would if it were busy every day. |
| **What breaks first under load?** | Realistically nothing, at this traffic scale — Azure's storage layer is built for much higher load than one ticket-sale spike. | The VM itself — CPU maxes out, or it runs out of connections it can serve, and visitors start seeing errors or slow loading. |
| **What would I tell the nervous founder?** | "This is still a fully real, production website — it's served by the same infrastructure that powers much bigger companies' sites. It just doesn't need a computer sitting there for you to maintain, which is exactly what makes it a better fit here." | "A VM gives more low-level control, but that control comes with responsibility — someone has to actively watch and maintain it. Since no one is available to do that here, that control becomes a risk, not a benefit." |

---

## Part 4 — Decision (Section 2.2 of the brief)

**Decision: Azure Blob Static Website Hosting.**

**Justification, in one sentence:** it directly solves GatherLoop's two hardest constraints at
once — it automatically handles the sale-morning spike without anyone managing server capacity,
and it needs no ongoing maintenance, which matters because there is no one available to provide
that maintenance.

---

## Part 5 — Note to the Founder (plain English, goes in the README)

> "We're hosting your site using Microsoft's cloud storage system instead of a traditional
> server. In practice, that means on the morning tickets go live, your site isn't limited by
> one machine's capacity — it's backed by the same infrastructure that handles much bigger
> sites. During the quiet weeks before and after, you're not paying to keep a server running and
> secured for traffic that isn't there. Updates go live automatically the moment we push a
> change — no manual step for either of us. It's still a real, production website; it's simply
> not one either of us has to babysit."

---

## Part 6 — Why this had to be written before any building happened
Writing this comparison first — instead of building something and justifying it afterward —
means the decision was actually driven by GatherLoop's requirements, not by convenience or
familiarity. That is exactly the difference the brief is testing for: *"A system that happens
to work is not the same as a system that was designed."*