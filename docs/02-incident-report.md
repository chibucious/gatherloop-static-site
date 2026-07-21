# Incident Report — GatherLoop Static Site

**Date:** _(Tuesday, 21st July 2026)_
**Related step:** Step 5 (GitHub Actions auto-deploy), during the credential-rotation follow-up

---

## Symptom
After rotating the Azure service principal's credentials with:
```bash
az ad sp credential reset --id 3cbdbede-20fe-4be4-b077-4d27738256f4
```
and updating the `AZURE_CREDENTIALS` GitHub secret with the new output, the next GitHub Actions
run **failed at the Azure login step**, with this error in the Actions log:

```
Login failed with Error: Not all parameters are provided in 'creds': Double-check if all keys
are defined in 'creds': 'clientId', 'clientSecret', 'tenantId'. Double check if the 'auth-type'
is correct.
```

This was observed directly in the **Actions tab → failed run → step logs**, not inferred —
the exact error text above is what GitHub Actions reported.

## Investigation trail
1. **First check — was the secret actually saved correctly?** Re-opened
   Settings → Secrets and variables → Actions and confirmed `AZURE_CREDENTIALS` had in fact
   been updated (GitHub doesn't show secret values, but confirmed the "Updated" timestamp was
   recent). This ruled out "the paste didn't save."
2. **Second check — compare the exact JSON keys against what the workflow expects.**
   The workflow's Azure login step reads:
   ```yaml
   - name: Azure login
     uses: azure/login@v2
     with:
       creds: ${{ secrets.AZURE_CREDENTIALS }}
   ```
   `azure/login@v2` expects a JSON object with the specific keys `clientId`, `clientSecret`,
   `subscriptionId`, and `tenantId`. Compared that against the actual output printed by
   `az ad sp credential reset`:
   ```json
   {
     "appId": "3cbdbede-20fe-4be4-b077-4d27738256f4",
     "password": "<REDACTED-FOR-SECURITY>",
     "tenant": "900bc9e0-d893-4f7c-a7f5-1eb83c096cae"
   }
   ```
   This ruled in the actual cause: the key names didn't match, and `subscriptionId` was
   missing entirely from this command's output.
3. **Third check — why did this differ from the original setup?** The original credential was
   created with `az ad sp create-for-rbac --sdk-auth`, where the now-deprecated `--sdk-auth`
   flag reformats the output into the exact shape `azure/login` expects (`clientId`,
   `clientSecret`, etc.). `az ad sp credential reset` has no equivalent flag, so it returns
   Azure's default key names (`appId`, `password`, `tenant`) instead.

## Root cause
Rotating the service principal's credential with `az ad sp credential reset` returns a
different JSON key naming convention (`appId`/`password`/`tenant`) than the original
`--sdk-auth`-formatted credential (`clientId`/`clientSecret`/`tenantId`) that `azure/login@v2`
requires, and it also omits `subscriptionId` — so simply pasting the reset command's raw
output into the `AZURE_CREDENTIALS` secret produced an incomplete/incorrectly-shaped object.

## Fix
Manually remapped the reset command's output into the shape the workflow requires, keeping the
unchanged `subscriptionId` from the original credential:

```json
{
  "clientId": "3cbdbede-20fe-4be4-b077-4d27738256f4",
  "clientSecret": "<REDACTED-FOR-SECURITY>",
  "subscriptionId": "5dc9dae5-9f95-4c7e-b36d-9357102d7548",
  "tenantId": "900bc9e0-d893-4f7c-a7f5-1eb83c096cae"
}
```
Updated the `AZURE_CREDENTIALS` GitHub secret with this corrected JSON, re-ran the failed
workflow from the Actions tab ("Re-run all jobs"), and confirmed it completed successfully —
the Azure login step passed, and the site content synced without error.

**Before/after proof:** failing run's error log (above) vs. the subsequent successful run
completing both steps green. _(Attach both as screenshots in `screenshots/incident-fix-before.png`
and `screenshots/incident-fix-after.png`.)_

## Design reflection
This failure was **more likely, not less**, because of a design gap: the original Phase 0
secrets plan (Step 5 write-up) documented *where* the secret lives, but not *the exact
procedure for rotating it safely* — specifically, that Azure's two credential-generating
commands (`create-for-rbac --sdk-auth` vs `credential reset`) return incompatible shapes. A
rotation is exactly the kind of routine, expected maintenance action a design should anticipate,
not treat as a one-off. What I'd change: document the exact required JSON shape directly
alongside the rotation instructions (not just "rotate the secret"), so future rotations are a
copy-paste against a template rather than a rediscovery of the correct format each time. This
also strengthens the earlier "what version is running" instinct from the group project — a
credential, like a deployed version, should always have one unambiguous source of truth for
what its correct current shape is.

## Clarifying note: Client ID vs. Client Secret
Worth stating explicitly, since it's easy to conflate the two during a rotation like this one:

- **Client ID** (`3cbdbede-20fe-4be4-b077-4d27738256f4`) is the **permanent identity** of the
  service principal `gatherloop-github-actions`. It was assigned once, at creation time, by
  `az ad sp create-for-rbac --name "gatherloop-github-actions" --role contributor --scopes
  .../resourceGroups/gatherloop-rg --sdk-auth`, and it does **not** change afterward — think of
  it as this identity's permanent username.
- **Client Secret** is that identity's **password**, and it's the thing that changes each time
  `az ad sp credential reset` is run. That's exactly why this incident only ever involved a
  secret/key-*shape* mismatch, not a change of identity — the Client ID stayed constant
  throughout.
- A genuinely **new** identity (a different Client ID) would only be created by running
  `create-for-rbac` again with a different `--name`. Rotating a secret and creating a new
  identity are two different operations, and this incident was purely the former.