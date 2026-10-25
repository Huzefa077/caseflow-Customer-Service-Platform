# CaseFlow — Bug Diary

Each entry: **Problem → Cause → Fix** (and the lesson).

---

## 1. Express installed in the wrong folder (2026-10-21, Step 1.5)
- **Problem:** After `npm install express`, a new `package.json`, `package-lock.json` and
  `node_modules/` appeared in the `CaseFlow/` root folder, not in `api/`.
- **Cause:** I ran the command in `CaseFlow/` instead of `CaseFlow/api/`. npm always installs
  into the folder the terminal is currently in. If there's no `package.json` there, it makes a new one.
- **Fix:** Deleted those 3 items from the root folder, then ran `npm install express` again inside `api/`.
- **Lesson:** Before any `npm install`, run `pwd` and check the path ends in `/api`.

---

## 2. `.env` was NOT ignored by Git (2026-10-21, Step 1.6)
- **Problem:** `git status` still listed `api/.env`, even though `.gitignore` had a line for it.
- **Cause:** I wrote `.env/`. A `/` at the end means "only a **folder** with this name", but `.env` is a **file**.
- **Fix:** Changed the line to `.env` (no slash). Caught by checking `git status` **before** the first commit, so the secret file never entered Git history.
- **Lesson:** Folders end with `/`, files don't. Always run `git status` before committing.

---

## 3. `.env` values written with `:` instead of `=` (2026-10-21, Step 1.6)
- **Problem:** `.env` and `.env.example` said `PORT:3000`.
- **Cause:** The `.env` format is `KEY=value`. dotenv quietly skips lines it can't read, so `PORT` was never loaded. The server still worked only because of the fallback `|| 3000` in `server.ts`, which hid the bug.
- **Fix:** Changed both files to `PORT=3000`.
- **Lesson:** `.env` uses `=`, no spaces, no quotes needed. A "default" value can hide a broken setting, so test with a different value (e.g. 4000) to prove it's really being read.

---

## 4. Database password leaked into the AI chat (2026-10-21, Step 2.1)
- **Problem:** The full Neon connection strings (with password) were sent to the AI assistant.
- **Cause:** I selected lines in `api/.env` in VS Code. The IDE automatically shares selected text with the assistant as context.
- **Fix:** Reset the `neondb_owner` password in Neon (Branches → production → Roles), replaced the password part (between `neondb_owner:` and `@`) in both URLs in `.env`, and deleted the `env.txt` file Neon downloaded. That file was NOT covered by `.gitignore` (it only blocks `.env`), so it could have been committed by mistake.
- **Lesson:** Never select/highlight lines in `.env` while an AI assistant is open. Close the `.env` tab after editing. A leaked secret gets changed, not hidden.

---

## 5. Red error "Cannot find name 'process'" in `prisma.config.ts` (2026-10-24, Step 2.2)
- **Problem:** VS Code underlined `process` in `api/prisma.config.ts`.
- **Cause:** `tsconfig.json` has `"include": ["src"]`. Files outside `src/` get TypeScript's default settings, which don't load Node's type labels (`@types/node`). Only the *checker* was confused — Node and Prisma run the file fine.
- **Fix:** Added `/// <reference types="node" />` on line 1 of `prisma.config.ts` ("load Node's type labels for this file").
- **Lesson:** Red lines come from TypeScript (the checker), not Node (the runner). Keep the editor at zero red lines so real errors never hide among "harmless" ones.

---

## 6. `npx prisma` wanted to download `prisma@8.0.0-rc.27` (2026-10-25, Step 2.3)
- **Problem:** `npx prisma migrate dev ...` asked "Need to install prisma@8.0.0-rc.27. Ok to proceed?"
- **Cause:** The terminal was in `CaseFlow/` (root), not `CaseFlow/api/` — I did `cd ..` for `git status` and stayed there. `npx` first looks for the tool in the current folder's `node_modules`; not found → it offers to download the newest version (an unfinished RC). Also typed `--name.init` instead of `--name init`.
- **Fix:** Ctrl+C to stop, `cd api`, `pwd`, then ran `npx prisma migrate dev --name init` again. Nothing was created in the root folder.
- **Lesson:** If `npx` says "Need to install", STOP — it means I'm in the wrong folder. Run `pwd` before every `npx`/`npm` command.
