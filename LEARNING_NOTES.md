# CaseFlow — Learning Notes

## Current position
**Week 1, Step 1 (Setup), sub-step 1.7 — first Git commit**

Next thing to do: from the `CaseFlow/` folder run `git add .`, check `git status` (no `.env`, no `node_modules`),
then `git commit -m "Step 1: project setup with Express, TypeScript and health route"`.

Step 1 plan (sub-steps):
- 1.1 Project folder + root `.gitignore`
- 1.2 Start Git (`git init`)
- 1.3 Create `api/` folder and `package.json` (`npm init`)
- 1.4 Install TypeScript and write `tsconfig.json`
- 1.5 Install Express and make a `/health` route
- 1.6 Create `.env` (secrets file) and make sure Git ignores it
- 1.7 First Git commit

---

## Done so far
- [x] 1.1 Project folder `CaseFlow/` with `CLAUDE.md` and a `.gitignore` (ignores `Notes/` so far)
- [x] 1.2 Started Git with `git init` — `git status` shows `Notes/` is ignored
- [x] 1.3 Created `api/` folder and `package.json` with `npm init -y`
- [x] 1.4 Installed TypeScript tools and wrote `tsconfig.json` (checked with `npx tsc --showConfig`)
- [x] 1.5 Express installed, `app.ts` + `server.ts` written, `npm run dev` works, `/health` returns `{"status":"ok"}`
- [x] 1.6 `.env` + `.env.example` with `PORT=3000`, loaded by `dotenv`; `.gitignore` now ignores `node_modules/`, `dist/`, `.env` (tested with PORT=4000)
- [ ] 1.7 First commit

> Note: the project folder was moved and the old chat was lost. This file was rebuilt on
> 2026-10-18 by looking at which files exist. Only `CLAUDE.md`, `.gitignore` and `Notes/` existed.
> Git was not started yet and there was no `api/` folder.

---

## Files created or changed
| File | What it does |
|------|--------------|
| `CLAUDE.md` | The project plan and the rules for how Claude teaches me. |
| `.gitignore` | A list of files/folders Git must ignore (never save): `Notes/`, `node_modules/`, `dist/`, `.env`. |
| `api/package.json` | The "ID card" of the backend: name, version, scripts, and list of installed packages. |
| `api/package-lock.json` | Auto-made by npm: the exact versions installed. Don't edit by hand. |
| `api/tsconfig.json` | Settings for the TypeScript translator: where my code is (`src`), where output goes (`dist`), how strict to be. |
| `api/src/app.ts` | Builds the Express app: reads JSON, has the `/health` route. Does NOT start it. |
| `api/src/server.ts` | Loads `.env` first, then starts the app on `process.env.PORT` (the "on switch"). |
| `api/.env` | My private settings/secrets (now just `PORT=3000`). Never committed. |
| `api/.env.example` | Same keys with fake values — committed so others know which settings to create. |
| `BUG_DIARY.md` | My list of mistakes: problem → cause → fix. |
| `LEARNING_NOTES.md` | This file — where I am, what I learned, interview practice. |

---

## Concepts learned
- **Git**: a tool that saves "snapshots" (commits) of my project, so I can see history and go back if I break something.
- **.gitignore**: a text file where I list things Git should never save — e.g. my private notes, `node_modules/`, and `.env` (secrets).
- **Repository (repo)**: a project folder that Git is watching. `git init` creates it by adding a hidden `.git` folder, where all the history is stored.
- **Untracked file**: a file Git can see but is not saving yet. `git add <file>` tells Git to include it in the next commit.
- **.gitignore is read every time**: Git checks `.gitignore` each time you run a command, so it doesn't matter if you wrote it before or after `git init`. What matters is that the file is listed there *before its first commit* — once a file is committed, adding it to `.gitignore` later does not remove it from history.
- **If a secret gets committed by mistake**: (1) `.gitignore` alone won't help — Git keeps tracking a file it already tracks; you need `git rm --cached .env` to stop tracking it. (2) Deleting the file doesn't remove it from old commits, so anyone can still find it in history. (3) The real fix: **change the secret** (new password / new key), so the leaked one is useless.
- **npm (Node Package Manager)**: the tool that installs packages (code other people wrote) for Node.js.
- **package.json fields**: `name` = project name · `version` = project version (1.0.0) · `main` = the starting file if someone imports this project · `scripts` = nicknames for terminal commands, run with `npm run <name>` · `license` = rules for how others may use the code · `type` = which import style Node uses (`commonjs` = the classic one).

- **TypeScript**: JavaScript + types (labels like "this is a number"). Catches mistakes before the code runs. It gets translated into normal JavaScript.
- **Normal vs dev dependency**: normal = the running app needs it (like cement in a house, e.g. Express). Dev (`-D`) = only needed while writing code (like scaffolding, e.g. TypeScript).
- **node_modules/**: the folder where npm puts installed packages. Huge, and can be re-created any time with `npm install`, so Git must ignore it.
- **Exact spelling in config files**: `compileOptions` instead of `compilerOptions` is silently ignored. Setting names are case-sensitive.

- **Express**: a library that lets the app receive requests (like GET /health) and send replies.
- **Route**: one address the app answers, e.g. `GET /health`. Like one phone extension.
- **req / res**: request = what the user sent; response = what we send back.
- **Port**: a numbered "door" on the computer the server listens at (ours: 3000).
- **Why app.ts and server.ts are split**: app.ts builds the app, server.ts starts it. Tests can import the app without starting a real server.
- **Entry file + imports**: Node starts at one file (server.ts) and follows its `import` lines like a tree to load the rest.
- **Folder rule — feature first, then job**: `modules/cases/` holds routes (which URL), controller (read request/reply), service (business rules), schema (valid input). Files that change together live together. Create folders only when a file needs them.
- **Monorepo**: one Git repository holding both `api/` and `web/`. Render and Vercel can each deploy just one sub-folder ("Root Directory").
- **Why React + Vite, not Next.js**: a separate Express API keeps the backend clear and lets any client (web, Postman, a future bot) use it.

- **.env**: a private file of `KEY=value` lines for secrets and settings. Code reads them, so secrets never live in code or Git.
- **process.env**: Node's box of settings (environment variables). `dotenv` fills it from `.env`.
- **.env.example**: a safe copy with fake values, committed so others know what to set up.
- **Folder vs file in .gitignore**: `name/` matches only a folder; `name` matches a file (or folder).
- **Fallbacks can hide bugs**: `process.env.PORT || 3000` kept working even when `.env` was broken. Test with a different value to prove a setting is really read.

---

## Commands I ran
- `git init` — turns the current folder into a Git repository (creates the hidden `.git` folder).
- `git status` — shows which files are new, changed, or ready to be committed.
- `mkdir api` — makes a new folder called `api` (make directory).
- `cd api` — moves the terminal into the `api` folder (change directory).
- `npm init -y` — creates `package.json` with default answers (`-y` = yes to all).
- `npm install -D typescript tsx @types/node` — installs TypeScript, a runner for `.ts` files, and Node's type labels as dev dependencies.
- `pwd` — prints which folder the terminal is in (print working directory). Check it before `npm install`!
- `npm install express` — installs Express (the web server) as a normal dependency.
- `npm install -D @types/express` — installs Express's type labels as a dev dependency.
- `npm run dev` — runs the `dev` script from package.json: `tsx watch src/server.ts` (starts the server, restarts on save).
- `npm install dotenv` — installs dotenv, which loads `.env` into `process.env`.
- `npx tsc --showConfig` — prints the TypeScript settings it actually understood (good for catching typos).

---

## Interview questions
### Step 1 — Setup
1. **Why split `app.ts` and `server.ts`?**
   app.ts builds the app; server.ts starts it on a port. Tests can import the app and send fake requests without starting a real server.
2. **How do you keep secrets out of your code?**
   Put them in a `.env` file, load them with dotenv into `process.env`, add `.env` to `.gitignore`, and commit only a `.env.example` with fake values. If a secret is ever committed, change (rotate) it.
3. **What's the difference between `dependencies` and `devDependencies`?**
   dependencies are needed while the app runs (Express, dotenv). devDependencies are only needed while coding (TypeScript, tsx, @types).

---

## Open questions / things I found confusing
- Why `Notes/` didn't appear in `git status` — I thought it was because I added it before `git init`. (Answer: it's because `Notes/` is written inside `.gitignore`; the order doesn't matter.)
- Is this project "impressive"? (Answer: interviewers judge how well I explain decisions — auth, transactions, permissions, SLA — and that it's deployed and tested. AI intake is now stretch item 3.)
- Dev vs normal dependency was confusing at first — see the cement/scaffolding example above.
