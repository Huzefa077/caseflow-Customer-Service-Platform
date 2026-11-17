// WHAT: adds "user" to Express's Request type.
// WHY:  authenticate.ts puts the logged-in user on req.user.

declare global {
    namespace Express {
        interface Request {
            user?: { id: string; role: string };
        }
    }
}

export {};
