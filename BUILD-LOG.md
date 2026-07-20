# Build Log — GatherLoop Static Site (Personal Capstone Project)

> **What is this document?** A plain, running journal of how this project was built, written
> in the order things actually happened. Anyone reading this — a grader, a teammate, or future
> me — should be able to follow the story of the build from here, without needing to guess.

**Project:** Static Site Deployment — Choose Your Architecture (Group 3)
**Client scenario:** GatherLoop — a small events company launching a single-page website to
promote a ticketed conference. Traffic is expected to be near-zero for weeks, spike hugely the
morning tickets go on sale, then go quiet again.
**Cloud provider used:** Microsoft Azure (Free Tier account)
**Repo:** gatherloop-static-site

---

## Step 1 — Phase 0: Design Worksheet (reasoning only — no building yet)

**What this step is, in plain terms:** before creating anything in Azure, the brief asks for a
written comparison of two possible ways to host the website, followed by a decision. This step
involves **no code and no cloud resources** — it's purely working out and writing down the
reasoning first.

**Why this step comes before any building:** the brief says directly — *"Your decision is just
as important as the deployment itself."* Choosing a hosting method without reasoning it out
first is how a project ends up working "by accident" instead of being properly designed.

**What was actually done in this step:**
1. Read the GatherLoop scenario carefully, identifying the two things pulling against each
   other: a traffic pattern that's spiky and unpredictable, versus having no one available to
   operate a server day-to-day.
2. Learned and wrote out, in plain language, what the two hosting options actually are —
   Azure Blob Static Website Hosting, and a Linux Virtual Machine running Nginx — since
   understanding what each option *is* has to come before comparing them.
3. Filled in a comparison table for **both** options honestly, including the one not chosen,
   because the brief grades the comparison itself, not just the final answer.
4. Wrote a one-sentence decision, directly tied to GatherLoop's actual stated problems (the
   spike, and having no ops budget).
5. Wrote a short, plain-English explanation addressed to the (fictional) nervous founder, since
   a non-technical person needs to be able to trust the decision, not just be told a technical term.

**Where the output of this step lives:** `docs/design-worksheet.md`

**Status:** ✅ Complete. No Azure resources exist yet — this step was reasoning and writing only.

---

## Step 2 — *(not started yet)*
_(Will be filled in once we get there: provisioning the chosen hosting method using the Azure
CLI — no manual clicking in the Azure Portal, so the process is scripted and repeatable.)_

---

## Step 3 onward
_(Each future step will be added here in the same format: what the step is in plain terms, why
it comes at this point in the build, what was actually done, where the output lives in the repo,
and its current status.)_