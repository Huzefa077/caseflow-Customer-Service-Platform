# CaseFlow

A customer service management platform for a support team.

> 🚧 **Under development.** The backend foundation is in place. Most features below are still being built.

## What it is

CaseFlow is an internal tool for a company's support staff. When a customer reports a problem, the team logs it as a **case**, gives it a priority, assigns it to an agent, and tracks it until it's resolved.

Only staff log in. Customers don't have accounts. They are records the team manages.

There are three roles:

- **Admin**: manages staff accounts and roles, and sees everything.
- **Team Lead**: sees all cases, assigns them to agents, and watches the dashboard.
- **Agent**: adds customers, opens cases, and works on the cases assigned to them.

Every case gets a deadline (SLA, Service Level Agreement) based on its priority, so the team can see what's on track, what's at risk, and what's already late.

## Progress

**Done**
- [x] Express + TypeScript API
- [x] PostgreSQL database on Neon, managed with Prisma (schema + migrations)
- [x] Password hashing with bcrypt

**Planned**
- [ ] Login with JWT access tokens and refresh tokens (httpOnly cookie)
- [ ] Role-based permissions (Admin / Team Lead / Agent), checked on the server
- [ ] Customers: create, edit, search, pagination
- [ ] Cases: create, filter, sort, assign, and a status workflow with clear rules
- [ ] Case timeline: notes, calls and emails
- [ ] SLA status: on track / at risk / breached
- [ ] Dashboard with case numbers and average resolution time
- [ ] Audit log of important changes
- [ ] React frontend
- [ ] Live demo with "Try as Admin / Team Lead / Agent" logins

## Tech stack

- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (Neon), Prisma ORM
- **Auth:** bcrypt (JWT coming next)
- **Frontend (planned):** React, Vite, Tailwind CSS
- **Hosting (planned):** Render (API), Vercel (frontend)

## Run it locally

You need Node.js and a free PostgreSQL database (for example, on [Neon](https://neon.tech)).

```bash
cd api
npm install
```

Copy `api/.env.example` to `api/.env` and fill in your own values.

```bash
npx prisma migrate dev      # creates the tables in your database
npx prisma generate         # generates the Prisma Client code
npm run dev                 # starts the API
```

Open http://localhost:3000/health. You should see `{"status":"ok"}`.

To create the first admin user (from the email and password in `.env`):

```bash
npx tsx src/scripts/create-admin.ts
```

## Why I'm building this

I'm building CaseFlow to learn backend development properly: authentication, permissions, database design and transactions, all in a realistic business app.
