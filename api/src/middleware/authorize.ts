// WHAT: authorize(...roles) builds a middleware that only lets the listed roles through.
// WHY:  authenticate answers "who are you?"; authorize answers "are you allowed here?".
//       Must run AFTER authenticate, because it reads req.user that authenticate sets.

import { Request, Response, NextFunction } from "express";

export function authorize(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: "Not logged in" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "You are not allowed to do this" });
        }

        next();
    };
} 