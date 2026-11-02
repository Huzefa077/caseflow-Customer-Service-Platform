// WHAT: creates ONE shared Prisma Client (the database connection) and exports it.
// WHY:  every file that needs the database imports `prisma` from here, so the app uses
//       one connection pool instead of opening new connections everywhere.

import {PrismaClient} from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({adapter})
















// ─── STEPS (what this file does, in plain words) ───
//   1. make the adapter (translator) with the database address from DATABASE_URL
//   2. make ONE Prisma Client that uses that adapter
//   3. export it, so every other file borrows this same one
