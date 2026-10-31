// WHAT: the login logic — find the user by email and check the password.
// WHY:  kept apart from HTTP code (controller) so it's simple to test and reuse.

import bcrypt from "bcryptjs";
import { prisma } from "../../config/db";

export async function login (email: string, password: string){
    const user = await prisma.user.findUnique({ where : { email } });

    if(!user || !user.isActive) {
        throw new Error("Invalid email or password");
    }
    const ok = await bcrypt.compare(password, user.passwordHash ) 
    if(!ok){
        throw new Error("Invalid email or password");
    }

    return {id: user.id, name: user.name, email: user.email, role: user.role};
}
















// ─── STEPS (what this file does, in plain words) ───
// login(email, password)
//   1. find the user by email
//   2. no user, or deactivated? → stop with an error
//   3. does the password match the saved hash?
//   4. yes → return the user (without the hash)
