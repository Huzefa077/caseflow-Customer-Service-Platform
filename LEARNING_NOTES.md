# CaseFlow — Learning Notes

**Sections in this file:**

1. Current position
2. Progress & schedule
3. How I learn
4. Recipe: Prisma setup
5. Done so far
6. Files created or changed
7. Concepts learned
8. Commands I ran
9. Interview questions
10. Open questions

> Daily to-do list lives in `TO-DO.md` (plain text, High / Medium / Low priority, git-ignored).

<br>

---

## 1. Current position

| | |
|---|---|
| **Week** | 1 |
| **Step** | 4 — authenticate middleware + refresh token + logout |
| **Sub-step** | 4.4 finished (Postman: refresh returns a new accessToken) — next: commit 4.4, then 4.5 `POST /auth/logout` |
| **Git branch** | `step-4-auth` (created; GitHub `step-3-login` deleted) |

**Next thing to do:**

- 4.1 committed + pushed to `step-4-auth` ✅ (PR comes at 4.6)
- Commit 4.4 (from the `CaseFlow/` root)
- **4.5 `POST /auth/logout`:** read the cookie → hash it → set `revokedAt = new Date()` on that row → `res.clearCookie("refreshToken")` → 200. Then prove it: `/auth/refresh` after logout must give 401.
- Then 4.5 logout, 4.6 full Postman test + PR → Step 4 done.
- **When I come back:** read "Why the cookie holds the TOKEN but Neon holds the HASH" in Concepts, then do the Reproduce step: write the login flow + the refresh flow in my own words.

**Step 4 plan (Core / Bonus):**

| Sub-step | Time box | Part | Status |
|---|---|---|---|
| 4.1 `authenticate` middleware + `GET /auth/me` | 1.5 h | 🟢 Core | ⏳ part a ✅ (guard works, 3 Postman tests pass) · part b `req.user` ✅ · part c `/me` replies with `req.user` ✅ → **4.1 done** |
| 4.2 `RefreshToken` model + migration | 1 h | 🟢 Core | ⬜ |
| 4.3 Login creates refresh token (hash → DB → httpOnly cookie) | 1 h | 🔵 Bonus | ⬜ |
| 4.4 `POST /auth/refresh` → new access token | 45 min | 🔵 Bonus | ⬜ |
| 4.5 `POST /auth/logout` → revoke + clear cookie | 30 min | 🔵 Bonus | ⬜ |
| 4.6 Postman full flow → commit → PR → merge | 45 min | 🔵 Bonus | ⬜ |

> Core done = a good day. Bonus = a great day. 15 min break after every block.

**Step 3 status:**

| Sub-step | Time box | Status |
|---|---|---|
| 3.1 Connect app to DB | 30 min | ✅ `db.ts` connects, test counted 0 users · `sslmode=verify-full` fixed |
| 3.2 bcrypt | 20 min | ✅ |
| 3.3 First Admin script | 40 min | ✅ |
| 3.4 `POST /auth/login` | 40 min | ✅ service + controller + routes, wired in `app.ts` under `/auth`, tested in Postman |
| 3.5 JWT | 40 min | ✅ login returns `{ user, accessToken }`, payload checked on jwt.io |
| 3.6 Postman test + commit | 20 min | ✅ PR #1 merged into `main` (`c1f16b0`), local branch deleted |

> **Step 3 finished ✅ (2026-11-02)** — merged into `main` through my first Pull Request (#1).

**Pending check questions:**

1. ✅ Why the same login error message? → So an attacker can't learn which emails exist ("user enumeration").
2. ✅ PR base vs compare → **base** = where the work goes INTO (`main`), **compare** = where it comes FROM (`step-3-login`).

> Skipped the 3.1 check questions + rewrite-from-memory for now — my choice.

<br>

---

## 2. Progress & schedule

**Overall (2026-10-31):**

- Steps 1–2 done, Step 3 almost done (~2.7 of 25 steps in 13 days)
- Nov 18 is not realistic

**New estimate:**

| Milestone | Target date |
|---|---|
| Step 7 | Nov 7 |
| Step 13 | Nov 15 |
| Step 19 | Nov 24 |
| Core Steps 1–25 | ~Dec 5 |
| Stretch items | ~Dec 15 |

> Needs ~0.8 step/day.
> **Decision:** cut nothing, extend the deadline. Every task gets a time box (CLAUDE.md rule 14).

**Whole project:** 25 steps + 6 stretch items after Step 25.

| Week | Steps |
|---|---|
| 1 | 1–7 |
| 2 | 8–13 |
| 3 | 14–19 |
| 4 | 20–25 |

**How I like to work (for a new chat):**

- Short bullet-point answers, no long paragraphs
- Ask me the real clock time before setting time targets
- I type all code/config myself; Claude keeps these notes + BUG_DIARY updated

**Session log:**

- **2026-10-25:** finished 2.2 (commit `d9e5036`) and 2.3 — first migration `20261025065144_init` created the `users` table in Neon (commit `0df50b3`).
  - Follow-ups at the time: check Neon → Tables (`users` with 7 columns + `_prisma_migrations`), then commit the notes from the `CaseFlow/` root.

<br>

---

## 3. How I learn (from my mentor, 2026-10-26)

**For each concept, 5 steps:**

1. **Understand** — what problem does it solve?
2. **Trace** — input, action, output
3. **Reproduce** — write it without looking
4. **Change** — one small change by myself
5. **Explain** — as if an interviewer asked

**Interview focus:**

| Priority | Topics |
|---|---|
| **P1 (must)** | Request flow Express → DB → back · async/await, promises, try/catch · Prisma CRUD + migrations · tables, primary/foreign keys, basic SQL · HTTP methods, status codes, validation |
| **P2 (enterprise)** | bcrypt · authentication vs authorization · error handling, env vars · relations, transactions, pagination · testing/debugging |
| **P3 (later, only if needed)** | Connection-pool internals, DB optimization, microservices, deep Prisma/TS internals |

> **Correction:** `prisma generate` only makes code from the schema. It does NOT connect to or sync Neon. `migrate dev` changes the real database.

<br>

---

## 4. Recipe: how I set up Prisma (reuse in my next project)

1. **Get 2 database URLs (Neon)**
   - pooled (`-pooler`) → `DATABASE_URL`
   - direct → `DIRECT_URL`
   - both in `.env`, fake copies in `.env.example`

2. **Install** (run `pwd` first — must be inside `api/`)
   - `npm install -D prisma@<stable>`
   - `npm install @prisma/client@<stable>`
   - Check `npm view prisma dist-tags` first — never install an `rc` version

3. **`npx prisma init`**
   - Creates `prisma/schema.prisma`, `prisma.config.ts`, `.gitignore`
   - Check it didn't touch my real URLs in `.env`
   - Delete extra AI "skills" folders if it adds them

4. **`prisma.config.ts`**
   - `url: process.env["DIRECT_URL"]` (CLI/migrations use the direct URL)
   - If `process` is red, add `/// <reference types="node" />` on line 1

5. **`schema.prisma`** — write `enum`s + `model`s (`name  Type  @rules`, `@@map("table")`)

6. **`npx prisma validate`** → "valid 🚀"

7. **`git status`** (no `.env`!) → commit → push

8. **`npx prisma migrate dev --name <name>`** → creates the tables (Step 2.3)

<br>

---

## 5. Done so far

### Step 1 — Setup ✅

- [x] 1.1 Project folder `CaseFlow/` with `CLAUDE.md` and a `.gitignore` (ignores `Notes/` so far)
- [x] 1.2 Started Git with `git init` — `git status` shows `Notes/` is ignored
- [x] 1.3 Created `api/` folder and `package.json` with `npm init -y`
- [x] 1.4 Installed TypeScript tools and wrote `tsconfig.json` (checked with `npx tsc --showConfig`)
- [x] 1.5 Express installed, `app.ts` + `server.ts` written, `npm run dev` works, `/health` returns `{"status":"ok"}`
- [x] 1.6 `.env` + `.env.example` with `PORT=3000`, loaded by `dotenv`; `.gitignore` now ignores `node_modules/`, `dist/`, `.env` (tested with PORT=4000)
- [x] 1.7 First commit `195eafb`

### Step 2 — Prisma + Neon ✅

- [x] 2.1 Neon project `caseflow` created (Singapore, Postgres only); URLs saved in `api/.env`; `.env.example` has placeholders
- [x] 2.2 Prisma installed (7.10.1), `prisma.config.ts` uses `DIRECT_URL`, `User` model + `Role` enum written, `npx prisma validate` passes
- [x] 2.3 First migration `20261025065144_init` → `users` table + `Role` enum created in Neon

### Step 3 — Create-user + login ✅

- [x] 3.1 `npx prisma generate`, installed `@prisma/adapter-pg@7.10.1`, `npm audit fix`, wrote `src/config/db.ts` — test printed `Users in database: 0`
- [x] 3.2 Installed `bcryptjs`; hashed `secret123` twice → 2 different hashes (salt); `bcrypt.compare` → `true` / `false`
- [x] 3.3 `.env` has `ADMIN_EMAIL`/`ADMIN_PASSWORD` (fake ones in `.env.example`); `src/scripts/create-admin.ts` created the first Admin; 2nd run → `P2002` unique email error (expected)
- [x] 3.4 `POST /auth/login`: `service.ts` (find user → `isActive` → `bcrypt.compare`), `controller.ts` (200 / 401), `routes.ts`, `app.use("/auth", authRoutes)` in `app.ts`; tested in Postman (2026-10-31)
- [x] 3.5 Installed `jsonwebtoken` + `@types/jsonwebtoken`; 64-char `JWT_ACCESS_SECRET` in `.env`; `service.ts` signs `{ sub, role }` for `15m`; controller returns `{ user, accessToken }`; decoded on jwt.io (2026-11-01)
- [x] 3.6 Postman re-check, commit `1c7952c`, push, PR #1 `step-3-login` → `main`, merged (`c1f16b0`), `git switch main` + `git pull`, local branch deleted (2026-11-02)

### Step 4 — authenticate + refresh token + logout ⏳

- [ ] 4.1 `authenticate` middleware
  - [x] a) `src/middleware/authenticate.ts`: read `Authorization` header → `Bearer ` check → `split(" ")[1]` → `jwt.verify` → `next()` or 401; `GET /auth/me` test route; Postman: no token 401 · real token 200 · edited token 401 (2026-11-02)
  - [x] b) `req.user = { id: payload.sub, role: payload.role }` + `src/types/express.d.ts` so TypeScript knows `req.user` exists (2026-11-04)
  - [x] c) `meController` in `controller.ts` replies `{ user: req.user }`; route is `router.get("/me", authenticate, meController)`; Postman returns my id + role (2026-11-04)

- [x] 4.2 `RefreshToken` model (+ `@relation` to `User`) in `schema.prisma`; `npx prisma migrate dev --name refresh_token` → `20261104184147_refresh_token` created `refresh_tokens` (5 columns + foreign key to `users`) (2026-11-04)

- [x] 4.3 Login creates a refresh token (commit `382ad10`, pushed)
  - [x] a) tested `crypto.randomBytes(32)` + SHA-256 hash in the terminal (random each time) (2026-11-05)
  - [x] b) `createRefreshToken(userId)` in `service.ts`: random token → SHA-256 hash → 7-day `expiresAt` → saves a row → returns the REAL token; ran `npx prisma generate` so `prisma.refreshToken` exists (BUG_DIARY #10)
  - [x] c) `login()` calls `createRefreshToken(user.id)` and returns it; `loginController` destructures it from the service result (NOT `req.body`) and sends `res.cookie("refreshToken", ..., { httpOnly: true, maxAge: 7 days })`; Postman Cookies tab shows it: HttpOnly true, expires in 7 days (2026-11-05)

> **Note:** the project folder was moved and the old chat was lost. This file was rebuilt on 2026-10-18 by looking at which files exist. Only `CLAUDE.md`, `.gitignore` and `Notes/` existed. Git was not started yet and there was no `api/` folder.

<br>

---

## 6. Files created or changed

### Project root (`CaseFlow/`)

| File | What it does |
|---|---|
| `CLAUDE.md` | The project plan and the rules for how Claude teaches me. |
| `README.md` | The project's front page on GitHub: what CaseFlow is, progress (done / planned), tech stack, how to run it. Update the checklist as features get built. |
| `BUG_DIARY.md` | My list of mistakes: problem → cause → fix. |
| `LEARNING_NOTES.md` | This file — where I am, what I learned, interview practice. |
| `.gitignore` | Files/folders Git must ignore (never save): `Notes/`, `node_modules/`, `dist/`, `.env`. |

### Backend settings (`api/`, outside `src/`)

| File | What it does |
|---|---|
| `api/package.json` | The "ID card" of the backend: name, version, scripts, and list of installed packages. |
| `api/package-lock.json` | Auto-made by npm: the exact versions installed. Don't edit by hand. |
| `api/tsconfig.json` | Settings for the TypeScript translator: where my code is (`src`), where output goes (`dist`), how strict to be. |
| `api/.env` | My private settings/secrets: `PORT`, `DATABASE_URL` (pooled), `DIRECT_URL` (direct). Never committed. |
| `api/.env.example` | Same keys with fake values — committed so others know which settings to create. |
| `api/.gitignore` | Made by `prisma init`: ignores `node_modules`, `.env`, and the generated Prisma code. |
| `api/prisma.config.ts` | Prisma's settings card: where the schema and migrations are, and which URL the CLI uses (`DIRECT_URL`). |

### Database (`api/prisma/`)

| File | What it does |
|---|---|
| `api/prisma/schema.prisma` | The database blueprint: `generator` (makes TS code), `datasource` (PostgreSQL), `enum Role`, `model User` → `users` table. |
| `api/prisma/migrations/20261025065144_init/migration.sql` | The SQL Prisma wrote: `CREATE TYPE "Role"`, `CREATE TABLE "users"`, unique index on email. Never edit after it ran. |
| `api/prisma/migrations/migration_lock.toml` | Says "these migrations are for PostgreSQL". Don't edit. |

### App code (`api/src/`)

| File | What it does |
|---|---|
| `api/src/app.ts` | Builds the Express app: reads JSON, has the `/health` route, plugs in `/auth`. Does NOT start it. |
| `api/src/server.ts` | Loads `.env` first, then starts the app on `process.env.PORT` (the "on switch"). |
| `api/src/config/db.ts` | Builds ONE shared `prisma` object (PrismaClient + `PrismaPg` adapter using `DATABASE_URL`). Other files import it. "The one phone everyone borrows." |
| `api/src/generated/prisma/` | Code made by `npx prisma generate` from the schema (`client.ts`, `enums.ts`, `models/User.ts`). Git-ignored, never edit. |
| `api/src/scripts/create-admin.ts` | One-time script: reads admin email/password from `.env`, hashes the password, saves an ADMIN user. |
| `api/src/modules/auth/routes.ts` | `POST /login` → `loginController`; `GET /me` → `authenticate` first, then reply "You are in!". |
| `api/src/modules/auth/service.ts` (4.3) | `createRefreshToken(userId)`: random token → hash → save row → return the real token. |
| `api/src/types/express.d.ts` | Types-only file: tells TypeScript that `Request` may have a `user` field. Copy-and-know-the-purpose file, no need to memorise. |
| `api/src/middleware/authenticate.ts` | The "guard at the door": checks the token in the `Authorization` header; real → `next()`, missing/fake/expired → 401. |
| `api/src/modules/auth/controller.ts` | Reads `req.body`, calls the service, sends 200 or 401. `meController` replies with `req.user`. |
| `api/src/modules/auth/service.ts` | Login logic: find user → check `isActive` → `bcrypt.compare`. |

<br>

---

## 7. Concepts learned

### Git & GitHub

- **Git** — a tool that saves "snapshots" (commits) of my project, so I can see history and go back if I break something.
- **Repository (repo)** — a project folder that Git is watching. `git init` creates it by adding a hidden `.git` folder, where all the history is stored.
- **Untracked file** — a file Git can see but is not saving yet. `git add <file>` tells Git to include it in the next commit.
- **Commit** — one saved snapshot of the project with a message. `git add` puts files in the box (staging area); `git commit` seals and labels it.
- **Commit hash** (e.g. `195eafb`) — the snapshot's unique ID, short version. Used to look at or go back to that snapshot.
- **HEAD -> master** — "you are here": HEAD points to the latest commit on the current branch.
- **Commit source, not output** — don't commit what a tool can re-create (`node_modules/`, `dist/`). Do commit the recipe (`package.json`, `package-lock.json`, `src/`).
- **`git add .` = this folder and below only** — run from `api/`, it misses root files like `LEARNING_NOTES.md`. Run it from the repo root (or use `git add -A`).
- **Commit habit** — at the end of each step, go to the root (`CaseFlow/`) and commit code + notes together in ONE commit (one step = one commit), then push.
- **Git branch + PR** — `main` = safe version; each step on its own branch (`git switch -c step-3-login`); at the end push → Pull Request on GitHub → merge → `git switch main` + `git pull`.
- **LF vs CRLF warning** — Windows and Mac/Linux mark line endings differently; Git converts them automatically. Harmless.

### .gitignore & secrets

- **.gitignore** — a text file listing things Git should never save, e.g. private notes, `node_modules/`, `.env`.
- **.gitignore is read every time** — order vs `git init` doesn't matter. What matters: the file is listed *before its first commit*. Once committed, adding it later does not remove it from history.
- **Folder vs file in .gitignore** — `name/` matches only a folder; `name` matches a file (or folder).
- **If a secret gets committed by mistake:**
  1. `.gitignore` alone won't help — use `git rm --cached .env` to stop tracking it.
  2. Deleting the file doesn't remove it from old commits.
  3. The real fix: **change the secret** (new password / new key).
- **IDE selection is sent to the AI** — highlighting lines in VS Code shares them with the assistant. Never select lines in `.env`.

### npm & packages

- **npm (Node Package Manager)** — installs packages (code other people wrote) for Node.js. Don't upgrade major versions mid-step. nvm = Node Version Manager, not needed now.
- **package.json fields** — `name` · `version` · `main` (starting file if imported) · `scripts` (nicknames for commands, `npm run <name>`) · `license` · `type` (`commonjs` = classic import style).
- **Normal vs dev dependency** — normal = the running app needs it (cement, e.g. Express). Dev (`-D`) = only while writing code (scaffolding, e.g. TypeScript).
- **node_modules/** — where npm puts installed packages. Huge, re-creatable with `npm install`, so Git ignores it.
- **Version pinning** — `npm install prisma@7.10.1` installs that exact version instead of "latest".
- **`npx` "Need to install …"** — the tool isn't in this folder's `node_modules` → wrong folder. Say no, check `pwd`.
- **`npm audit` / `npm audit fix`** — checks packages for known security bugs / installs safe patches (never `--force` blindly).

### TypeScript & Node

- **TypeScript** — JavaScript + types (labels like "this is a number"). Catches mistakes before the code runs; translated into normal JavaScript.
- **TypeScript (checker) vs Node (runner)** — red lines come from TypeScript; Node just runs it. TypeScript knows `process` only when `@types/node` is loaded for that file.
- **`tsx` vs `tsc`** — tsx converts TS→JS in memory and runs it (dev, no type check); tsc saves JS to `dist/` (production).
- **dist/** — where TypeScript puts translated `.js` files on build. Generated, never committed.
- **Exact spelling in config files** — `compileOptions` instead of `compilerOptions` is silently ignored.
- **Node.js vs browser** — `api/` runs in Node (terminal, `process.env`, prisma). Browser code (`web/`) never touches the DB or secrets — it calls the API over HTTP.
- **Entry file + imports** — Node starts at one file (`server.ts`) and follows its `import` lines like a tree.
- **`import { X } from "path"`** — `{ }` around the NAME, quotes around the PATH. `./` = same folder, `../` = one up, no dot = package in `node_modules`.
- **`require(...)`** — the older way to write `import`.
- **`.then(...)`** — "when the answer comes back, do this".
- **`async` / `await`** — `await` = "wait here until the answer comes", same as `.then` but reads top-to-bottom. Only inside an `async` function.
- **Variable vs text** — `password` (no quotes) = the value inside; `"password"` = the literal word.
- **Reading a big error** — find 3 lines: WHERE (`→ 19 ...` in my file), WHAT (the message), CODE. Skip the `at ...` lines.

### Express & app structure

- **Express** — a library that lets the app receive requests (like `GET /health`) and send replies.
- **Route** — one address the app answers, e.g. `GET /health`. Like one phone extension.
- **req / res** — request = what the user sent; response = what we send back.
- **Request = letter in an envelope** — method + URL = the address · `req.headers` = stickers on the envelope (extra info) · `req.body` = the letter inside. Node makes header NAMES lowercase (`authorization`).
- **Parameter name vs type** — in `(req: Request)`, `req` (left of `:`) is the real thing I use; `Request` (right) is only a label for TypeScript, gone when the code runs.
- **Scope** — a variable only exists inside the `{ }` where it was made. `req` only exists inside the handler function (BUG_DIARY #8).
- **`express.d.ts` (declaration merging)** — TypeScript's `Request` has no `user`, so I add it to its list. Only for TypeScript's checker; vanishes at runtime. One-line purpose: "tell TypeScript about the name badge." Even seniors copy this file.
- **Access token = stateless, refresh token = stateful** — stateless = server keeps no notes between requests; all proof arrives with the request. So an access token can't be ended early (nothing saved to change). The refresh token IS saved (as a hash) in `refresh_tokens`, so logout can set `revokedAt` and the server refuses it later ("revoke" = mark as no longer allowed).
- **Foreign key** — a column whose value must match an `id` in another table (`refresh_tokens.user_id` → `users.id`). The DB refuses a token for a user that doesn't exist.
- **One-to-many** — one user, many refresh tokens (laptop + phone). `RefreshToken[]` (the `[]`) marks the "one" side.
- **Prisma relation lines** — `user User @relation(fields: [userId], references: [id])`: the TYPE `User` says which model to link; `fields` = column here, `references` = column there. A model name as a type = link, NOT a column. Only `userId` is a real column; `user` and `refreshTokens` are code shortcuts. Proof: the migration SQL has 5 columns. (Neon's table view shows an extra "user" link column with no type — a viewer feature, not stored data.)
- **Migration name** — `--name` is only a label for the folder; the table name comes from `@@map`.
- **`prisma generate` vs `migrate dev`** — `migrate dev` changes the real database; `generate` rebuilds the Prisma Client (TypeScript code) from `schema.prisma`. Schema changed → run both. One client, one property per model (`model RefreshToken` → `prisma.refreshToken`). Reads `prisma.config.ts` (schema path) + the `generator` block's `output`. Interview line: *"Migrate updates the database, generate updates my code; the schema is the single source of truth."*
- **SHA-256 vs bcrypt** — bcrypt is slow on purpose, for short guessable passwords. A refresh token is 64 random characters nobody can guess, so fast SHA-256 is enough. Same input → same hash, which lets us look the token up later.
- **`crypto` (built into Node)** — `randomBytes(32).toString("hex")` makes the random token; `createHash("sha256").update(t).digest("hex")` makes the hash.
- **Login request flow (in my own words, 2026-11-05)** — request hits `app.ts` → `app.use("/auth", authRoutes)` sends it to `routes.ts` → `routes.ts` picks `loginController` → controller reads `req.body` and calls `login()` in `service.ts` → service returns the result to the controller → the controller sends the answer with `res` and the flow ENDS there (the response never goes back through routes). `routes.ts` only decides where a request goes.
- **Why the cookie holds the TOKEN but Neon holds the HASH (my most confusing topic, 2026-11-05)**
  - The server creates a token only at LOGIN. Later it creates nothing: it just hashes what the browser sends and compares.
  - **At login (once):**
    ```
    server makes:  token = "AAA"
    server saves:  hash("AAA") = "X9"   -> Neon
    server sends:  "AAA"                -> cookie
    ```
  - **Later, the real user comes back:**
    ```
    browser sends:        "AAA"  (from the cookie)
    server hashes it:     hash("AAA") = "X9"
    server looks in Neon: "X9" exists -> allowed
    ```
  - **A thief who stole the Neon table** only has "X9". If they send "X9" as the token, the server hashes it: `hash("X9") = "Q4"` -> not in Neon -> refused. To get "X9" out of the server's hashing they would need "AAA", and a hash can't be reversed.
  - Same idea as passwords: Neon keeps the hash, never the secret itself.
  - **Interview line:** *"I store only a hash of the refresh token. On refresh I hash the token from the cookie and look that hash up, so a leaked database can't be used to get new access tokens."*
- **Cookie** — a small named value the server asks the browser to store (`Set-Cookie` header from `res.cookie(...)`). The browser then sends it back automatically on every later request to that site, with no JavaScript needed. `httpOnly: true` = page JavaScript cannot read it (blocks token theft through injected scripts); `maxAge` = how long the browser keeps it; `secure: true` (production, HTTPS only) = only sent over HTTPS.
- **Reading cookies needs `cookie-parser` (my words, checked 2026-11-05)**
  - Express can SET a cookie with `res.cookie(...)`, but it does not READ cookies by default: `req.cookies` (with an s) doesn't exist.
  - The browser still sends the cookie in the `Cookie` header on every request; Express just doesn't unpack it.
  - The middleware `cookie-parser` unpacks that header into `req.cookies`. Install: `npm install cookie-parser` and `npm install -D @types/cookie-parser` (type labels, dev-only). In `app.ts`: `import cookieParser from "cookie-parser"` and `app.use(cookieParser())` under `express.json()`.
  - Why we need it: the frontend sends the refresh token cookie, the backend reads `req.cookies.refreshToken`, hashes it, and compares with the hash saved in Neon.
- **Where each token lives** — access token: JSON response → kept in memory by the frontend → sent in the `Authorization` header. Refresh token: cookie only → never in the JSON, never readable by JavaScript.
- **Controller question** — for each variable ask: did the client send it (`req.body`) or did the service give it (result of `login()`)?
- **`tsc --noEmit` vs `tsx`** — `tsc --noEmit` only CHECKS types (no files written); `tsx` RUNS TypeScript directly without type-checking. `npm run dev` = `tsx watch`.
- **Why `req.user` is set by the backend (2026-11-08)** — the frontend knows its own role, but the server can't believe the client: anyone can type `"role": "ADMIN"` into Postman. The token payload was written by the server and signed with the secret; if the payload is edited, `jwt.verify` fails. So after verify passes, the payload is the only trusted info about the user. `req.user = { id: payload.sub, role: payload.role }` copies that verified data so later code (`authorize`, cases, audit log) reads it. It is NOT sent by the frontend. **Rule: never trust what the client says about itself; trust only the verified token or the database.** Interview line: *"The server derives identity and role from the signed JWT, never from the request body."*
- **`refresh(token)` in `service.ts` (2026-11-09)** — hash the cookie token → `findFirst({ where: { tokenHash }, include: { user: true } })` → refuse if no row, `revokedAt` set, `expiresAt` passed, or user deactivated → `jwt.sign({ sub: row.user.id, role: row.user.role }, secret, { expiresIn: "15m" })`. `include: { user: true }` attaches the connected user (the relation) to the row, so the id/role are `row.user.id` / `row.user.role` (there is no variable called `user` in this function).
- **JWT payload names** — the payload is an object of `name: value` pairs; names are how `authenticate.ts` finds values (`payload.sub`, `payload.role`). `sub` ("subject") is the standard name for "who the token is about"; both ends must use the same name. Keep the payload small: it is readable by anyone, so only what's needed on every request and rarely changes (id, role).
- **`as { sub: string; role: string }`** — only a TypeScript label (erased at runtime). `jwt.verify` returns a vague type, so without it `payload.role` is red and `tsc` fails. It doesn't check the token.
- **`payload` is local, `req` is shared** — `payload` disappears when `authenticate` ends; `req` is passed along the chain, so we copy the data to `req.user`.
- **TypeScript narrowing** — `const secret = process.env.X` is `string | undefined`; after `if (!secret) throw ...` TypeScript knows it is a string.
- **jwt.io** — free website where you paste a JWT to read its header/payload; shows the payload isn't secret.
- **Why `/auth/refresh` has NO `authenticate` guard** — it is called because the access token has EXPIRED; a guard would refuse it. Its proof is the refresh token cookie, checked against Neon by `refresh()`. Request chain: `app.ts` → `routes.ts` → `refreshController` → `refresh()`.
- **Who calls refresh automatically?** — the browser/frontend (an Axios interceptor in `web/src/api`, Step 18), not the backend: the backend only answers requests. For now I call it by hand in Postman.
- **`await` + `try/catch` in a controller** — `refresh()` is async (returns a promise = "result is coming"), so `await` it; it throws on a bad token, so `try/catch` turns that into a clean 401.
- **Postman: Body = none for no-body requests** — an empty/commented raw JSON body still sends `Content-Type: application/json`, and `express.json()` fails with `Unexpected end of JSON input` (BUG_DIARY #11).
- **Middleware** — a function `(req, res, next)` that runs BEFORE the route. Calls `next()` = "go on", or sends a reply = "stop here". "Guard at the door."
- **Route with middleware** — `router.get("/me", authenticate, handler)` runs left to right: guard first, reply only if the guard lets you in.
- **Port** — a numbered "door" the server listens at (ours: 3000).
- **Why `app.ts` and `server.ts` are split** — app.ts builds the app, server.ts starts it. Tests can import the app without starting a real server.
- **Folder rule — feature first, then job** — `modules/cases/` holds routes (which URL), controller (read request/reply), service (business rules), schema (valid input). Files that change together live together.
- **Folder rule — "who reads this file?"** — root of `api/` = settings tools read · `src/` = code the app runs · tool folders = owned by a tool (`prisma/`, `node_modules/`, `dist/`).
- **Monorepo** — one Git repo holding both `api/` and `web/`. Render and Vercel each deploy one sub-folder.
- **Why React + Vite, not Next.js** — a separate Express API keeps the backend clear and lets any client use it.
- **File header comments** — every file starts with `WHAT:` / `WHY:` (+ `RUN:` for scripts).
- **STEPS block** — 15 empty lines below the code, every file ends with `// ─── STEPS ───`: the file's job in numbered plain-English steps. Hints for "write it from memory".
- **How to learn a structure without AI** — the tool's `init` command and "Getting started" docs create the standard layout. Copy the convention, then ask "who reads this file?"

### .env & settings

- **.env** — a private file of `KEY=value` lines for secrets and settings. Secrets never live in code or Git.
- **process.env** — Node's box of settings (environment variables). `dotenv` fills it from `.env`.
- **.env.example** — a safe copy with fake values, committed so others know what to set up.
- **Same keys in `.env` and `.env.example`** — code asks for values by name; only the values differ.
- **Fallbacks can hide bugs** — `process.env.PORT || 3000` kept working even when `.env` was broken. Test with a different value.

### Neon & database connection

- **Neon** — a free online PostgreSQL database. My laptop and (later) Render can both connect.
- **Connection string** — one line with user, password, host, database name. It's a secret.
- **Parts of a connection string** — `postgresql://USER:PASSWORD@HOST/DATABASE?options`.
- **Direct vs pooled URL** — direct = talks to the database itself; pooled (`-pooler`) = a middleman shares a few connections (taxi stand). App uses pooled; migrations use direct.
- **Database role password vs account password** — account password = *me* into the Neon website; role password (`neondb_owner`) = *my app* into the database.
- **SSL / `sslmode=verify-full`** — SSL encrypts the app ↔ Neon connection; `verify-full` also checks Neon's certificate is real.

### Prisma

- **`prisma.config.ts`** — Prisma's settings card: schema location, migrations folder, which URL the CLI uses (`DIRECT_URL`).
- **Why `prisma/` is outside `src/`** — it's the database blueprint + migration history, read by the Prisma CLI, not app code.
- **`schema.prisma`** — the blueprint of the database. `.prisma` = Prisma's own little language.
- **Prisma model** — blueprint of one table; each line = one column: `name  Type  @rules`.
- **enum** — a fixed list of allowed values (a dropdown), e.g. `Role` = ADMIN / TEAM_LEAD / AGENT.
- **Attributes** — `@id` = row's ID · `@default(x)` = auto-fill if empty · `@unique` = no duplicates · `@map("x")` = column name in DB · `@@map("users")` = table name (`@@` = whole table).
- **camelCase vs snake_case** — TypeScript `passwordHash`, database `password_hash`; `@map` connects them.
- **Migration** — a saved SQL file that changes the database structure, in order (Git commits for the database).
- **Migration ≠ backup** — saves *structure*, not *data*. Fix mistakes with a NEW migration.
- **Schema → SQL** — `String` → `TEXT`, `Boolean` → `BOOLEAN`, `@id` → `PRIMARY KEY`, `@unique` → `UNIQUE INDEX`, `@default(now())` → `DEFAULT CURRENT_TIMESTAMP`. No `?` → `NOT NULL`.
- **`_prisma_migrations` table** — Prisma's diary of which migrations already ran.
- **Prisma generate** — reads `schema.prisma` and writes TypeScript code (`PrismaClient`, types). Re-run after EVERY schema change.
- **Driver adapter (`@prisma/adapter-pg`)** — Prisma 7's "translator" between Prisma and PostgreSQL, given the `connectionString`.
- **Shared client (`db.ts`)** — create `prisma` once and export it, so the app uses one connection pool.
- **`prisma.user.create({ data })`** — Prisma builds an SQL `INSERT` in memory, sends it to Neon; the DB fills defaults and returns the new row.
- **`$disconnect()`** — closes the DB connection so the program can finish. In bash written `\$disconnect`.
- **`P2002` / `Unique constraint failed on users_email_key`** — that email already exists (from `@unique`). Later (Step 6) → friendly `409 Conflict`.

### Security & auth

- **bcrypt — how password hashing works:**
  - **Stored string:** `$2b$10$<salt: 22 chars><hash: 31 chars>`
    - `2b` = version
    - `10` = cost (2^10 = 1,024 rounds, slow on purpose)
    - salt = random text stored openly (not secret)
    - hash = result of salt + password
  - **Sign up** `bcrypt.hash(pw, 10)` — make random salt → hash salt + password → store version + cost + salt + hash as one string.
  - **Login** `bcrypt.compare(typed, user.passwordHash)` — read cost + salt from stored string → hash salt + typed password the same way → compare. Match ✅ / no match ❌.
  - Never decrypts (one-way) — re-hashes and compares. Same password + different salt → different hash.
  - Salt stops pre-made lookup tables; cost stops fast guessing.
  - **Interview:** *"bcrypt adds a random salt and hashes slowly with a cost factor, storing version, cost, salt and hash in one string. On login, compare re-hashes the typed password with the stored salt and checks for a match."*
- **JWT (JSON Web Token)** — `header.payload.signature`.
  - **Header:** algorithm (`HS256`) + type (`JWT`). `jwt.sign` makes it automatically.
  - **Payload:** `sub` (subject = user id), `role`, `iat` (issued at), `exp` (expires). Readable by ANYONE (encoded, not encrypted) → never put secrets in it.
  - **Signature:** header + payload stamped with the server's secret. Edit the payload (e.g. AGENT → ADMIN) → signature no longer matches → rejected.
  - **`jwt.sign(payload, secret, { expiresIn: "15m" })`:** options are NOT part of the token — the library turns `expiresIn` into `exp` in the payload and builds the header itself. `exp − iat = 900` s = 15 min.
  - **Access token = visitor pass:** short-lived so a stolen one is useful only briefly. Refresh token (Step 4) keeps you logged in.
  - **Interview:** *"After login I sign a JWT with the user id and role, valid 15 minutes. The client sends it with each request; the server checks the signature with its secret."*
- **Authorization header** — the client shows its token on every request as `Authorization: Bearer <token>`. "Bearer" = "whoever carries this pass"; capital B, exact text.
- **`jwt.verify(token, secret)`** — `jwt` = the library (toolbox), not the token. Checks the whole token's stamp + expiry; real → returns only the payload; fake/expired → throws (so use try/catch).
- **Server keeps the SECRET, not the token** — on each request it re-stamps the token's header + payload with the secret and checks the stamp matches. 1 letter changed → different stamp → 401. "Teacher knows their own signature, doesn't keep photos of every paper."
- **Stateless (why not store access tokens)** — no database lookup on every click = fast; any server with the secret can check. The secret never leaves the server and is used on EVERY check. Downside: can't cancel an access token early → keep it short (15 min). The long-lived refresh token IS stored (Step 4.2), so logout can cancel it.
- **Never log passwords** — logs get stored and read by others. My test `console.log(req.body)` showed the password → removed.
- **User enumeration** — "email not found" vs "wrong password" tells an attacker which emails exist. Fix: same message + same 401 for both.
- **DoS (Denial of Service)** — an attack that slows down or crashes a server so real users can't use it.

<br>

---

## 8. Commands I ran

### Terminal basics

| Command | What it does |
|---|---|
| `pwd` | Prints which folder the terminal is in. Check it before `npm install`! |
| `mkdir api` | Makes a new folder called `api`. |
| `cd api` | Moves the terminal into the `api` folder. |

### Git

| Command | What it does |
|---|---|
| `git init` | Turns the current folder into a Git repository. |
| `git status` | Shows which files are new, changed, or ready to commit. |
| `git add .` | Puts all changed files (except ignored ones) into the staging area. |
| `git commit -m "message"` | Saves a snapshot of the staged files with a message. |
| `git log --oneline` | Shows the commit history, one line each. |
| `git push` | Uploads my commits to GitHub. |
| `git switch -c step-3-login` | Creates a new branch and moves onto it (uncommitted changes come along). |
| `git push -u origin step-4-auth` | First push of a new branch; `-u` links it to GitHub so later a plain `git push` works. |
| `git switch main` | Moves back onto the `main` branch. |
| `git pull` | Downloads new commits from GitHub (e.g. a merged PR) into my local branch. |
| `git branch -a` | Lists all branches — local ones and GitHub's (`remotes/origin/...`). |
| `git branch -d step-3-login` | Deletes a finished local branch (its work is safe in `main`). |
| `git push origin --delete step-3-login` | Deletes the branch on GitHub. |
| `git fetch --prune` | Updates my list of GitHub branches and removes ones deleted there. |
| `rm git merge-` | Deleted 2 empty stray files created by a mistyped command. |

### npm

| Command | What it does |
|---|---|
| `npm init -y` | Creates `package.json` with default answers. |
| `npm install -D typescript tsx @types/node` | TypeScript, a `.ts` runner, and Node's type labels (dev). |
| `npm install express` | Express (the web server). |
| `npm install -D @types/express` | Express's type labels (dev). |
| `npm install dotenv` | Loads `.env` into `process.env`. |
| `npm install -D prisma@7.10.1` | The Prisma command tool (dev), pinned version. |
| `npm install @prisma/client@7.10.1` | The code the app uses to talk to the database. |
| `npm install @prisma/adapter-pg@7.10.1` | Prisma ↔ PostgreSQL translator (same version as Prisma). |
| `npm install bcryptjs` | bcrypt in pure JavaScript (no build step on Windows). |
| `npm install jsonwebtoken` + `npm install -D @types/jsonwebtoken` | JWT library + its type labels (dev). |
| `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` | Makes a 64-character random secret. |
| `npm audit` / `npm audit fix` | Lists / fixes known security problems. |
| `npm run dev` | Runs `tsx watch src/server.ts` (starts server, restarts on save). |

### Prisma

| Command | What it does |
|---|---|
| `npx prisma init` | Creates `prisma/schema.prisma`, `prisma.config.ts`, `.gitignore`. |
| `npx prisma validate` | Checks schema + config for mistakes without touching the database. |
| `npx prisma migrate dev --name init` | Compares schema with DB, writes a migration SQL file, runs it on Neon. |
| `npx prisma generate` | Builds the Prisma Client code into `src/generated/prisma`. |

### Running & testing

| Command | What it does |
|---|---|
| `npx tsc --showConfig` | Prints the TypeScript settings it actually understood. |
| `npx tsx src/scripts/create-admin.ts` | Runs the admin script (from `api/`). |
| `npx tsx -e "..."` | Runs a short piece of TypeScript from the terminal (used to test `db.ts`). |

<br>

---

## 9. Interview questions

### Step 1 — Setup

**1. Why split `app.ts` and `server.ts`?**

app.ts builds the app; server.ts starts it on a port. Tests can import the app and send fake requests without starting a real server.

**2. How do you keep secrets out of your code?**

Put them in a `.env` file, load them with dotenv into `process.env`, add `.env` to `.gitignore`, and commit only a `.env.example` with fake values. If a secret is ever committed, change (rotate) it.

**3. What's the difference between `dependencies` and `devDependencies`?**

dependencies are needed while the app runs (Express, dotenv). devDependencies are only needed while coding (TypeScript, tsx, @types).

### Step 2 — Prisma + Neon

**1. What is an ORM and why use Prisma?**

ORM = Object-Relational Mapper: I write TypeScript (`prisma.user.create(...)`) and it writes the SQL. Prisma also gives typed results and manages migrations.

**2. What is a migration and why commit it?**

A saved SQL file that changes the database structure. Committed to Git so every database (local, test, production) is built the same way, in order, and changes can be reviewed.

**3. Why two database URLs?**

The app uses the pooled URL (a middleman shares connections, good for many requests). Migrations use the direct URL, because schema changes need one real, stable connection.

### Step 3 — Create-user + login

**1. How do you store passwords?**

Never the real password. bcrypt adds a random salt and hashes slowly (cost 10), and I store only that hash. At login, `bcrypt.compare` re-hashes the typed password with the stored salt and checks for a match.

**2. Walk me through your login request.**

`POST /auth/login` → `routes.ts` sends it to `loginController` → it reads email + password from `req.body` → `service.ts` finds the user, checks `isActive`, compares the password → signs a JWT with `{ sub, role }` valid 15 min → controller replies `200 { user, accessToken }`, or `401` with the same message for wrong email or wrong password (prevents user enumeration).

**3. What is inside your JWT, and why can't a user change their role in it?**

Header (algorithm), payload (`sub` = user id, `role`, `iat`, `exp`), signature. The payload is readable by anyone, so no secrets in it. The signature is made with the server's secret — if someone edits the payload, the signature no longer matches and the server rejects it (checked by the `authenticate` middleware in Step 4).

<br>

---

## 10. Open questions / things I found confusing

### 🅿️ Parked (come back later)

- **Controller's role (2026-11-01)**
  - I don't yet fully see how `controller.ts` works as a "middleman" or what it really adds (and how it helps stop the app crashing).
  - What I know so far: Express calls `loginController(req, res)` for me (no `()` in routes = "call it later"); the controller pulls email/password out of `req.body`, calls the service, and turns the result into a 200 or 401 response.
  - Revisit at Steps 8–9 (building users/customers modules) and Step 16 (tests calling services directly).

- **npm "allow-scripts" warning (2026-10-26)**
  - npm warned about install scripts for `@prisma/engines`, `esbuild`, `prisma`.
  - `package.json` now has an `allowScripts` list approving these 3. Later: understand what `npm approve-scripts` does.

### 📌 Ongoing

- **Behind schedule (2026-10-25):** ~5 steps behind. DECISION: cut nothing — keep all modules, stretch items and revision steps; the deadline moves instead. Project quality > deadline.
- **Writing code on my own (2026-10-31):** I can't yet. Plan: one "write it from memory" exercise per sub-step + 20–30 min/day syntax practice on Exercism (JavaScript track).

### ✅ Answered

- **Why `Notes/` didn't appear in `git status`** — not because I added it before `git init`; it's because `Notes/` is in `.gitignore`. Order doesn't matter.
- **Is this project "impressive"?** — interviewers judge how well I explain decisions (auth, transactions, permissions, SLA) and that it's deployed and tested. AI intake is now stretch item 3.
- **Dev vs normal dependency** — see the cement/scaffolding example in Concepts.
- **The one-line test command (`npx tsx -e ...`)** — explained piece by piece on 2026-10-26.
- **`import` syntax (Step 3.1)** — `{ }` goes around the *name*, the path goes in quotes, `./` vs `../` vs package name.
- **Why imports are repeated in every file / why `async` / why `export`** — answered in chat during 3.4.
