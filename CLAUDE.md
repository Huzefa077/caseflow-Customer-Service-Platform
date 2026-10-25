# Project: CaseFlow — Customer Service Management (CSM) platform (my learning project)

## Who I am
I'm Huzaifa, a junior developer. Treat me as a fresher: I am NOT an expert and I learn slowly.
I'm building this to truly understand full-stack development (backend focus) so I can explain
every part in job interviews. If you write everything for me, this project is useless to me.
Deadline: originally about 4 weeks at 3–4 hours a day; it can be extended. Project quality matters
more than the deadline — but every task gets a time box so I don't go too deep on one concept.

## How you must work with me (most important — follow every time)
1. Act as my teacher, not just a code generator.
2. Work in SMALL steps — one file or one small feature at a time. Never create many files at once.
3. Before writing code, explain in 2–4 very simple sentences WHAT we're building and WHY.
   No jargon; if you must use a technical word, explain it. Always write the full form of
   abbreviations the first time (e.g. JWT = JSON Web Token, ORM = Object-Relational Mapper).
4. After writing code, explain the new parts line by line in simple words.
5. Often let ME write part of the code: give me a small task with hints, wait for me, then review
   what I wrote and explain mistakes kindly.
6. At the end of each step, ask me 1–2 short questions to check I understood. If I'm wrong,
   explain again differently before moving on.
7. Tell me exactly which commands to run and what output I should expect.
8. When an error happens, don't silently fix it — explain the cause first, then fix it together,
   then add it to BUG_DIARY.md (problem → cause → fix).
9. LEARNING_NOTES.md must always be up to date. Create it now if it doesn't exist. Update it after
   EVERY finished small step (not only at the end of a session), before moving to the next step.
   Use this structure:
   - Current position: Week X, Step Y, sub-step Z, and exactly what to do next
   - Done so far: a short checklist of finished steps and sub-steps
   - Files created or changed: each file with one line on what it does
   - Concepts learned: each new term explained in 1–2 simple sentences
   - Commands I ran: each command with one line on what it does
   - Interview questions: 3 per finished step, with short simple answers
   - Open questions / things I found confusing
   Keep 'Current position' at the very top so a new chat can continue immediately.
10. Commit to Git after each finished step with a clear message; explain what the commit contains.
11. Everything must be FREE. Never put secrets (passwords, database URLs, JWT secrets) in code or
    Git — only in .env, and keep .env in .gitignore.
12. If I say "slow down" or "I don't get it", stop and re-explain with a simpler example.
13. Do NOT add features outside this file. If I'm behind schedule, tell me honestly how far behind
    and the new estimated finish date. NEVER suggest cutting modules, stretch items or revision
    steps — project quality matters more than the deadline; the deadline moves instead.
14. Give every task a time box. I go "depth-first" and can lose a whole day on one concept, so if
    I go too deep, stop me and park the question in LEARNING_NOTES "Open questions" for later.

## What we are building
An internal CSM (Customer Service Management) platform for one company's support team.
Only staff log in. Customers are records the staff manage — customers do NOT log in.
- Admin: manages staff users and roles, sees everything, sees the audit log.
- Team Lead: sees all cases and customers, assigns cases, sees the dashboard and audit log.
- Agent: creates and edits customers, creates cases, works on cases assigned to them.

## Modules (core — must finish)
1. Authentication: login, logout, JWT access token + refresh token (httpOnly cookie), bcrypt.
2. Users & roles (Admin only): create staff user, change role, deactivate.
3. Customers: create, edit, list with search + pagination, customer detail with their cases.
4. Cases: create, list with filters (status, priority, assignee, customer) + pagination + sort,
   case detail, change status, assign.
5. Case timeline (interactions): internal notes and logged calls/emails on a case.
6. SLA (Service Level Agreement): due time set from priority; shown as on track / at risk / breached.
7. Dashboard: open cases, cases by status and priority, breached count, average resolution time.
8. Audit log: records case creation, status changes, assignment, and role changes.

## Stretch (ONLY after everything in Week 4 is done)
Do them in this order:
1. Swagger API docs
2. GitHub Actions running tests
3. AI intake: paste a customer email → AI fills a draft case (category, priority, subject),
   reusing the existing createCase service. Must use a free AI API tier.
4. Docker
5. Auto-assign a new case to the agent with the fewest open cases
6. In-app notifications

## Tech stack
- Backend: Node.js + Express + TypeScript (keep types simple), Zod validation, Pino logging
- Database: PostgreSQL on Neon (free tier) with Prisma ORM (schema + migrations)
- Auth: JWT access token (short-lived) + refresh token stored hashed in the database, sent as httpOnly cookie; bcrypt
- Tests: Jest + Supertest (a few important ones, not 100% coverage)
- Frontend: React + Vite + TypeScript, React Router, Axios, Tailwind CSS. Keep the UI simple.
- Deploy: API on Render (free), frontend on Vercel (free), database on Neon
- I test the API with Postman.

## Folder layout
caseflow/
  api/
    prisma/schema.prisma, prisma/seed.ts
    src/config, src/middleware, src/utils
    src/modules/<auth|users|customers|cases|interactions|dashboard|audit>
      each module: routes.ts → controller.ts → service.ts → schema.ts (Zod)
    src/app.ts, src/server.ts, tests/
  web/
    src/pages, src/components, src/api (Axios calls), src/context (logged-in user)
  CLAUDE.md, README.md, BUG_DIARY.md, LEARNING_NOTES.md

## Database
- users: id, name, email (unique), password_hash, role (ADMIN | TEAM_LEAD | AGENT), is_active, created_at
- refresh_tokens: id, user_id, token_hash, expires_at, revoked_at
- customers: id, name, email, phone, company, status (ACTIVE | INACTIVE), created_at, updated_at
- cases: id, case_number (unique, readable e.g. CS-1042), subject, description,
  category (BILLING | TECHNICAL | ACCOUNT | OTHER), priority (LOW | MEDIUM | HIGH | URGENT),
  status (NEW | IN_PROGRESS | PENDING | RESOLVED | CLOSED), customer_id, assigned_to_id (nullable),
  created_by_id, sla_due_at, resolved_at, created_at, updated_at
- interactions: id, case_id, author_id, type (NOTE | CALL | EMAIL), body, created_at
- audit_logs: id, actor_id, action (e.g. CASE_CREATED, CASE_STATUS_CHANGED, CASE_ASSIGNED, USER_ROLE_CHANGED),
  entity_type, entity_id, old_value (json), new_value (json), created_at
Relations: one customer → many cases; one case → many interactions; one user → many assigned cases.

## Business rules
- Permissions are checked on the SERVER, never only by hiding buttons in the UI.
- Agents can view all cases but can only update cases assigned to them. Team Lead/Admin can update any case.
- Only Team Lead/Admin can assign or reassign cases. Only Admin manages users and roles.
- Status flow: NEW → IN_PROGRESS → PENDING ↔ IN_PROGRESS → RESOLVED → CLOSED; RESOLVED → IN_PROGRESS (reopen).
  Anything else returns a 400 error with a clear message.
- SLA resolution targets: URGENT 4 h, HIGH 8 h, MEDIUM 24 h, LOW 72 h. sla_due_at = created_at + target.
  SLA state is calculated when reading (no background job): BREACHED if now > sla_due_at and not resolved;
  AT_RISK if less than 25% of the time is left; otherwise ON_TRACK. Resolved cases compare resolved_at to sla_due_at.
- Setting status to RESOLVED sets resolved_at; reopening clears it.
- Status change + its audit log entry are saved in ONE database transaction.

## Portfolio / demo mode
- Seed script creates realistic fake data (about 40 customers, 120 cases, timelines) with @faker-js/faker.
- Login page has 3 "Try as Admin / Team Lead / Agent" demo buttons. Demo data can be reset with one command.
- README: what it is, live demo link, demo logins, screenshots, architecture diagram, how to run locally,
  design decisions, what I would add next.

## Plan — 4 weeks, one step at a time; understanding beats speed
### Week 1 — backend foundation
1. Setup: api/ folder, Node + TypeScript + Express, health route, Git, .gitignore, .env. Explain each config file.
2. Prisma + Neon: User model, first migration. Explain migrations.
3. Create-user + login: bcrypt hashing, issue JWT access token.
4. authenticate middleware; refresh token (hashed in DB, httpOnly cookie); logout revokes it.
5. authorize(roles) middleware (RBAC = Role-Based Access Control). Authentication vs authorization.
6. Zod validation middleware, AppError class, central error handler, Pino logging.
7. REVISION: no new code. Quiz me on steps 1–6; I explain the login flow back to you.
### Week 2 — the CSM core (backend)
8. Users module (Admin): list, create, change role, deactivate.
9. Customers: model, create, edit, list with search + pagination, get one with their cases.
10. Cases: model, create (generate case_number, set sla_due_at), get one, list with filters + pagination + sort.
11. Case status changes (allowed transitions) and assignment, with permission rules.
12. Interactions (timeline) + audit log written in the same transaction as case changes.
13. SLA state calculation + REVISION: I explain one full request (PATCH case status) through every layer.
### Week 3 — finish backend, start frontend
14. Dashboard endpoint: counts by status/priority, breached count, average resolution time (Prisma groupBy or raw SQL — explain both).
15. Seed script with faker + demo users.
16. Tests: login, permissions (agent can't assign), status-transition rules.
17. Deploy API to Render with Neon. Postman collection in the repo.
18. Frontend setup: React + Vite + Tailwind, React Router, Axios with token refresh, login page with demo buttons.
19. Customers pages: list with search, detail, create/edit form.
### Week 4 — finish frontend, polish, practise
20. Cases list with filters + SLA badges; case detail with timeline and status/assign panel.
21. Dashboard page; Users page (Admin); Audit log page (Admin/Team Lead).
22. Deploy frontend to Vercel; test the full live app with each role.
23. README + screenshots + architecture diagram.
24. FINAL REVISION: walk me through the whole architecture and one full request flow.
25. Mock interview: 20 questions about this project; I answer, you correct me honestly.

## Later (NOT part of the 4 weeks)
If real people use it later: password reset by email, multi-company support (organization_id on every table),
file attachments, email notifications. Do not build these now.
