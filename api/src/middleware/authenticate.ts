import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Purpose: Check whether the user is logged in before allowing access to a protected API.

export function authenticate(req: Request, res: Response, next: NextFunction) {

    // 1. Get the JWT token from the request header.
    // Expected format: "Bearer <token>"
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Not logged in" });
    }

    const token = header.split(" ")[1];

    try {
        // 2. Verify the token using our secret key.
        // This checks whether the token is genuine and has not expired.
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { sub: string; role: string };

        // 3. Get the user's ID and role from the verified token.
        // We don't trust the frontend to tell us who the user is or what their role is.
        req.user = { id: payload.sub, role: payload.role };

        // 4. Allow the request to continue to the next middleware/route.
        next();

    } catch {
        // Missing, invalid or expired token → reject the request.
        return res.status(401).json({ message: "Not logged in" });
    }
}

// By this we avoided the Postman direct URL access gap. 
// Postman can send request to server by bypassing frontend blockers,
// but if we write authenticate.ts in each URL, we can stop postman
// from doing that.

//authenticate.ts fills req.user on every new URL visit,
// so that authorize reads it.