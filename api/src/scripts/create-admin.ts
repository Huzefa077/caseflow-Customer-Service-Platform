// WHAT: a one-time script that creates the first Admin user in the database.
// WHY:  nobody can log in until at least one user exists, and only an Admin can create
//       users later. Email + password come from .env, so no secret is written in code.
// RUN:  npx tsx src/scripts/create-admin.ts   (from the api/ folder)

import "dotenv/config";
import bcrypt from "bcryptjs";
import {prisma} from "../config/db";

async function main(){
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password){
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
        data: {name: "Admin", email: email, passwordHash: passwordHash, role: "ADMIN"}
    });

    console.log("Created admin", admin.email);
}

main()
    .catch((err) => console.error(err))
    .finally(() => prisma.$disconnect());
















// ─── STEPS (what this file does, in plain words) ───
//   1. load .env (admin email + password)
//   2. email or password missing? → stop with an error
//   3. hash the password with bcrypt
//   4. save a new user with role ADMIN in the database
//   5. print "Created admin <email>"
//   6. error? → print it. Always → disconnect from the database
