// WHAT: the "on switch" — loads .env, then starts the app on PORT.
// WHY:  `npm run dev` runs this file; starting the server lives here, the app itself lives in app.ts.

import "dotenv/config";
import app from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
















// ─── STEPS (what this file does, in plain words) ───
//   1. load .env first (so PORT and other settings exist)
//   2. import the app from app.ts
//   3. pick the port: PORT from .env, or 3000
//   4. start listening and print the address
