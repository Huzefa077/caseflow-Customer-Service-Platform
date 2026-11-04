// WHAT: the "door" for auth — says which URL + method goes to which controller function.
// WHY:  keeps all auth URLs in one place; app.ts plugs this whole group in under /auth.

import { authenticate } from "../../middleware/authenticate";
import { Router } from "express";
import { loginController, meController } from "./controller";

const router = Router();
router.post("/login", loginController);

router.get("/me", authenticate, meController);


export default router;



// ─── STEPS (what this file does, in plain words) ───
//   1. make a Router (a mini list of URLs for auth)
//   2. POST /login → run loginController
//   3. export it, so app.ts can plug it in