# Work Card 07 — GitHub and Vercel Proof

## Goal

Push the project to GitHub and deploy to Vercel so the game is live and shareable. Then run the Proof Ladder on the live URL to confirm the deployed version works identically.

## Inputs

- `project-brief.md` — Proof Target
- `build-blueprint.md` — Proof Ladder
- `work-cards/06-review-and-fix.md` — passed review state

## Files likely touched

- `.gitignore` — create or verify it excludes `node_modules`, `dist`, `.env`, `.DS_Store`
- No source files should be changed

## Instructions for the coding agent

1. **Git setup** (if not already initialized):
   - `git init`
   - Create `.gitignore` with standard Vite React ignores: `node_modules`, `dist`, `.env`, `.DS_Store`, `*.local`
   - `git add .`
   - `git commit -m "Initial commit: Elemental Lab V1"`

2. **GitHub**:
   - Ask the learner for their GitHub repo URL, or guide them to create a new repo at github.com/new named `elemental-lab` (or their preferred name).
   - Do NOT push without the learner providing the remote URL.
   - Once the remote URL is provided:
     - `git remote add origin <url>`
     - `git branch -M main`
     - `git push -u origin main`

3. **Vercel**:
   - Guide the learner to vercel.com and import the GitHub repo.
   - Vercel auto-detects Vite — default settings should work.
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
   - Deploy.

4. **Post-deploy proof**:
   - Open the live Vercel URL.
   - Run the full Proof Ladder on the live URL:
     1. `npm run dev` not applicable — use live URL
     2. 4 starting elements visible
     3. Drag Water into workspace
     4. Both elements movable
     5. Water + Earth → Plant with toast
     6. Refresh page — Plant persists
     7. Invalid combination — silent
     8. Reset works
     9. Mobile layout stacks correctly
     10. Keyboard navigation works

5. If the deployed version differs from localhost, fix the issue and redeploy.

## What not to do

- Do not change any source code unless a deployment-specific bug is found.
- Do not add a custom domain or HTTPS redirect configuration.
- Do not set up CI/CD pipelines or GitHub Actions.
- Do not add environment variables or secrets.
- Do not configure Vercel Analytics or other Vercel features.

## Done when

- The repo is on GitHub with the initial commit.
- The game is live on Vercel.
- All Proof Ladder steps pass on the live URL.
- The live URL is shared with the learner.

## Verification steps

- [ ] GitHub repo exists with all source files pushed
- [ ] Vercel deployment succeeded (green checkmark)
- [ ] Live URL loads the game
- [ ] Proof Ladder step 2: 4 starters visible on live URL
- [ ] Proof Ladder step 5: Water + Earth → Plant works on live URL
- [ ] Proof Ladder step 6: refresh persistence works on live URL
- [ ] Proof Ladder step 8: reset works on live URL
- [ ] Proof Ladder step 9: mobile layout works on live URL
- [ ] No console errors on live URL
- [ ] Design check: all visual design rules apply on live URL (warm cream, deep brown, rust accent)

## Localhost test before continuing

After this card, the learner should test:

Note: this card requires the learner to create a GitHub repo and deploy to Vercel. The learner will need to provide their GitHub repo URL when prompted.

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

If GitHub push fails, check remote URL and authentication. If Vercel deployment fails, check build logs. If it cannot be resolved in 15 minutes, offer fallback proof (localhost screen recording or zip file).

## Status

In progress
