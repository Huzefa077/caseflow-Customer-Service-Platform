# CaseFlow — Bug Diary

Each entry: **Problem → Cause → Fix → Lesson**

<br>

## Index

| # | Bug | Date | Step |
|---|---|---|---|
| 1 | Express installed in the wrong folder | 2026-10-21 | 1.5 |
| 2 | `.env` was NOT ignored by Git | 2026-10-21 | 1.6 |
| 3 | `.env` values written with `:` instead of `=` | 2026-10-21 | 1.6 |
| 4 | Database password leaked into the AI chat | 2026-10-21 | 2.1 |
| 5 | Red error "Cannot find name 'process'" in `prisma.config.ts` | 2026-10-24 | 2.2 |
| 6 | `npx prisma` wanted to download `prisma@8.0.0-rc.27` | 2026-10-25 | 2.3 |
| 7 | Correct password gave `401` in Postman | 2026-11-01 | 3.4 |

<br>

---

## 1. Express installed in the wrong folder

*2026-10-21 · Step 1.5*

**Problem**

After `npm install express`, a new `package.json`, `package-lock.json` and `node_modules/` appeared in the `CaseFlow/` root folder, not in `api/`.

**Cause**

I ran the command in `CaseFlow/` instead of `CaseFlow/api/`. npm always installs into the folder the terminal is currently in. If there's no `package.json` there, it makes a new one.

**Fix**

Deleted those 3 items from the root folder, then ran `npm install express` again inside `api/`.

**Lesson**

Before any `npm install`, run `pwd` and check the path ends in `/api`.

<br>

---

## 2. `.env` was NOT ignored by Git

*2026-10-21 · Step 1.6*

**Problem**

`git status` still listed `api/.env`, even though `.gitignore` had a line for it.

**Cause**

I wrote `.env/`. A `/` at the end means "only a **folder** with this name", but `.env` is a **file**.

**Fix**

Changed the line to `.env` (no slash). Caught by checking `git status` **before** the first commit, so the secret file never entered Git history.

**Lesson**

Folders end with `/`, files don't. Always run `git status` before committing.

<br>

---

## 3. `.env` values written with `:` instead of `=`

*2026-10-21 · Step 1.6*

**Problem**

`.env` and `.env.example` said `PORT:3000`.

**Cause**

The `.env` format is `KEY=value`. dotenv quietly skips lines it can't read, so `PORT` was never loaded. The server still worked only because of the fallback `|| 3000` in `server.ts`, which hid the bug.

**Fix**

Changed both files to `PORT=3000`.

**Lesson**

`.env` uses `=`, no spaces, no quotes needed. A "default" value can hide a broken setting, so test with a different value (e.g. 4000) to prove it's really being read.

<br>

---

## 4. Database password leaked into the AI chat

*2026-10-21 · Step 2.1*

**Problem**

The full Neon connection strings (with password) were sent to the AI assistant.

**Cause**

I selected lines in `api/.env` in VS Code. The IDE automatically shares selected text with the assistant as context.

**Fix**

- Reset the `neondb_owner` password in Neon (Branches → production → Roles)
- Replaced the password part (between `neondb_owner:` and `@`) in both URLs in `.env`
- Deleted the `env.txt` file Neon downloaded. That file was NOT covered by `.gitignore` (it only blocks `.env`), so it could have been committed by mistake.

**Lesson**

Never select/highlight lines in `.env` while an AI assistant is open. Close the `.env` tab after editing. A leaked secret gets changed, not hidden.

<br>

---

## 5. Red error "Cannot find name 'process'" in `prisma.config.ts`

*2026-10-24 · Step 2.2*

**Problem**

VS Code underlined `process` in `api/prisma.config.ts`.

**Cause**

`tsconfig.json` has `"include": ["src"]`. Files outside `src/` get TypeScript's default settings, which don't load Node's type labels (`@types/node`). Only the *checker* was confused — Node and Prisma run the file fine.

**Fix**

Added `/// <reference types="node" />` on line 1 of `prisma.config.ts` ("load Node's type labels for this file").

**Lesson**

Red lines come from TypeScript (the checker), not Node (the runner). Keep the editor at zero red lines so real errors never hide among "harmless" ones.

<br>

---

## 6. `npx prisma` wanted to download `prisma@8.0.0-rc.27`

*2026-10-25 · Step 2.3*

**Problem**

`npx prisma migrate dev ...` asked "Need to install prisma@8.0.0-rc.27. Ok to proceed?"

**Cause**

- The terminal was in `CaseFlow/` (root), not `CaseFlow/api/` — I did `cd ..` for `git status` and stayed there.
- `npx` first looks for the tool in the current folder's `node_modules`; not found → it offers to download the newest version (an unfinished RC).
- Also typed `--name.init` instead of `--name init`.

**Fix**

Ctrl+C to stop, `cd api`, `pwd`, then ran `npx prisma migrate dev --name init` again. Nothing was created in the root folder.

**Lesson**

If `npx` says "Need to install", STOP — it means I'm in the wrong folder. Run `pwd` before every `npx`/`npm` command.

<br>

---

## 7. Correct password gave `401 Invalid email or password` in Postman

*2026-11-01 · Step 3.4*

**Problem**

`POST /auth/login` with the admin email + the password from `.env` returned 401.

**Cause**

- The admin row was created on 2026-10-29.
- `ADMIN_PASSWORD` in `.env` was changed after that.
- The script only reads `.env` at the moment it runs, so the hash in the database still belonged to the OLD password.
- The login code was correct — wrong password → 401 is exactly what it should do.

**Fix**

Deleted the admin row in Neon (Tables → users), re-ran `npx tsx src/scripts/create-admin.ts`, logged in again → 200.

**Lesson**

- The database keeps the hash from the moment the user was created; changing config later changes nothing.
- A real app needs a "reset password" action that re-hashes.
- My `catch` hides the real reason — later (Step 6) errors get logged.

<br>

---

## 8. `npm run dev` crashed: "Cannot find name 'req'" in `controller.ts`

*2026-11-02 · Step 4.1*

**Problem**

Added `console.log("headers:", req.headers)` to see a real request → the server would not start.

**Cause**

- The 2 `console.log` lines were put at the **top of the file**, outside `loginController`.
- `req` only exists **inside** the function — Express creates it fresh for each request and passes it in.
- Top-of-file code runs once when the server starts, when there is no request yet → `req` is not defined.

**Fix**

Moved the 2 lines inside `loginController`, as its first lines.

**Lesson**

- A variable only exists inside the `{ }` where it was created ("scope").
- `req` and `res` = one specific request/response, so they only live inside the handler function.
- Red squiggles in a file that nothing imports yet (like `authenticate.ts`) don't stop the server — only files the app actually loads can crash it.

<br>

---

## 9. `npx tsx` said "Need to install tsx" (wrong folder again)

*2026-11-05 · Step 4.3*

**Problem**

Ran `npx tsx -e "..."` and npx asked "Need to install the following packages: tsx. Ok to proceed?"

**Cause**

- The terminal was in the project root (`CaseFlow/`), not inside `api/`.
- `tsx` is installed only in `api/node_modules`, so npx from the root can't find it and offers to download a temporary copy.

**Fix**

`Ctrl + C`, `cd api`, `pwd` (must end in `\api`), ran the same command again → printed `token:` and `hash :` with no question.

**Lesson**

- "Need to install..." from npx = STOP, I'm in the wrong folder.
- `pwd` before every `npx` / `npm` command.
- Answering `y` only downloaded a temporary copy to npx's cache; nothing was added to the project.

<br>

---

## 10. `prisma.refreshToken` "does not exist" after the migration

*2026-11-05 · Step 4.3*

**Problem**

After `migrate dev` created `refresh_tokens` in Neon, `prisma.refreshToken.create(...)` was red: "Property 'refreshToken' does not exist".

**Cause**

- `migrate dev` changed the real database, but did NOT rebuild the Prisma Client (the generated TypeScript code).
- `src/generated/prisma/models/` still had only `User.ts`, so the client didn't know about the new model.
- (I had wrongly said `migrate dev` might run `generate` by itself.)

**Fix**

`npx prisma generate` from `api/` → `models/RefreshToken.ts` appeared → `npx tsc --noEmit` printed nothing.

**Lesson**

- Schema changed → run BOTH: `migrate dev` (updates the database) and `generate` (updates my code).
- `prisma.refreshToken` is not written anywhere by me: Prisma makes it from the model name `RefreshToken` (first letter lowercased). `@@map` only names the table in Neon.
- There is ONE client; `generate` adds one property per model.
