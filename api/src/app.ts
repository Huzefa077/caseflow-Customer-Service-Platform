// WHAT: builds the Express app — reads JSON request bodies and registers the routes.
// WHY:  kept separate from server.ts so tests can use the app without starting a real server.

import express from "express";
import authRoutes from "./modules/auth/routes";

const app = express();
app.use(express.json());


app.get("/health", (req, res) => {
    res.json({ status: "ok"});
});

app.use("/auth", authRoutes);
export default app;
















// ─── STEPS (what this file does, in plain words) ───
//   1. create the Express app
//   2. let it read JSON request bodies
//   3. GET /health → answer { status: "ok" } (is the server alive?)
//   4. export the app (server.ts starts it)
