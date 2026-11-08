import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authenticate(req: Request, res: Response, next: NextFunction) {

    const header = req.headers.authorization; //e.g. " Bearer eyJhbGci..."
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Not logged in" });
    }

    const token = header.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { sub: string; role: string }; 
        // 'as sub' which is the user id part was added to make payload.sub and 
        // payload.role accessible in the very next line below. 
        // Its helping typeScript to understand what we are 
        // dealing with here

        //we are trying to find the true user id and role of the user 
        // because we cannot trust what the front end or post man is 
        // claiming about its role and user id, we we assign 
        // user data to its request from the token it was given 
        // by the server when user tried to login the first 
        // time where server provided jwt token to the frontend/user
        req.user = { id: payload.sub, role: payload.role };
        next();
    } catch {
        return res.status(401).json({ message: "Not logged in" });
    }

}





// Purpose: is the person logged in?
// - No "Bearer <token>" header → 401.
// - jwt.verify checks the token's SIGNATURE using JWT_ACCESS_SECRET
//   (nothing is looked up in the DB). If someone edits the payload,
//   e.g. role AGENT → ADMIN, the signature no longer matches → 401.
// - Expired token (older than 15 min) → 401.
// - Valid → save { id, role } on req.user, then next().
// - also we add user details in req so that other url know what is user id and role everytime we travel to new url
