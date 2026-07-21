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

## Step 2 — Provision Azure Blob Static Website Hosting (CLI only)

**What this step is, in plain terms:** creating the actual Azure resources that will host the
site — a resource group (a folder to keep everything organized in one place), a storage
account (the "filing cabinet"), and switching that storage account into static website mode.
All done via the Azure CLI, not by clicking around the Azure Portal, so the process is scripted
and repeatable rather than a one-off series of clicks nobody could reproduce.

**Why this step comes after Step 1 and before content upload:** the hosting method had to be
decided and justified first (Step 1). Now that the decision is Blob Static Website Hosting, this
step creates the actual place for the site to live — before any files are uploaded to it.

**What was actually done in this step:**
1. Ran `scripts/provision-static-site.sh`, which:
   - Created a resource group named `gatherloop-rg` in the `southafricanorth` Azure region.
   - Created a Storage Account named `gatherloopsite18025` (`Standard_LRS` SKU — the cheapest
     redundancy tier, appropriate for a small conference landing page).
   - Enabled static website hosting on that storage account, with `index.html` set as both the
     index document and the 404 fallback document.
2. Confirmed success by checking the command output directly:
   `"staticWebsite": { "enabled": true, "indexDocument": "index.html" }`
3. Recorded the live static website endpoint for later use:
   **`https://gatherloopsite18025.z1.web.core.windows.net/`**

**Resources created (for the record):**
| Resource | Name | Region |
|---|---|---|
| Resource group | `gatherloop-rg` | South Africa North |
| Storage account | `gatherloopsite18025` | South Africa North |
| Static website endpoint | `https://gatherloopsite18025.z1.web.core.windows.net/` | — |

**Note:** at this point in the build, opening the endpoint above returns a blank/404-style page.
That is expected — no site files have been uploaded yet. That happens in Step 3.

**Where the output of this step lives:** `screenshots/step2-provisioning.png` (terminal output
showing successful creation and the static website endpoint).

**Status:** ✅ Complete.

---

## Step 3 — Upload site content

**What this step is, in plain terms:** putting the actual website files (the Tailwind v4 landing
page) into the storage account created in Step 2, so the live endpoint serves a real page
instead of a blank/404 one.

**Why this step comes after Step 2:** the storage account and static website mode had to exist
first — there was nowhere to upload files to until Step 2 was complete.

**What was actually done in this step:**
1. Built the landing page locally (Tailwind v4, compiled to a single static CSS file — no
   runtime build step needed, matching the "static files only" nature of Blob hosting) into the
   repo's `site/` folder.
2. Uploaded the contents of `site/` into the storage account's special `$web` container — the
   exact container Azure serves static website content from — using:
   ```bash
   az storage blob upload-batch \
     --account-name gatherloopsite18025 \
     --destination '$web' \
     --source ./site \
     --overwrite
   ```
3. Verified by opening the live endpoint directly in a browser:
   **`https://gatherloopsite18025.z1.web.core.windows.net/`** — confirmed the real page now
   loads, replacing the earlier blank/404 response from Step 2.

**Design note (per "if your build diverges, add a one-line note"):** Tailwind v4 CSS is compiled
locally into a single static CSS file and uploaded alongside `index.html`, rather than loaded
via CDN at request time — this keeps production serving purely static files with zero runtime
dependency, consistent with why Blob hosting was chosen in Step 1.

**Where the output of this step lives:** `site/` (source), `screenshots/step3-live-site.png`
(proof of the live page loading).

**Status:** ✅ Complete.

---

## Step 4 — *(not started yet)*
_(Will be filled in once we get there: confirming static website configuration is fully correct,
then setting up GitHub Actions so future content changes deploy automatically.)_

---

## Step 3 onward
_(Each future step will be added here in the same format: what the step is in plain terms, why
it comes at this point in the build, what was actually done, where the output lives in the repo,
and its current status.)_