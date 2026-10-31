/// <reference types="node" />

// WHAT: settings for the Prisma command-line tool — where the schema and migrations are,
//       and which database URL to use (DIRECT_URL).
// WHY:  migrations need the direct (non-pooled) connection; the app itself uses DATABASE_URL in db.ts.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DIRECT_URL"],
  },
});
