// WHAT: makes ONE shared "logger" — a notebook where the server writes down what happens (errors, info).
// WHY:  when something breaks, the user only sees "Something went wrong", so we need our own
//       private note of the REAL error (what + where) to find and fix it. Other files import this logger.

import pino from "pino";

export const logger = pino({
    transport:
        process.env.NODE_ENV !== "production"
            ? { target: "pino-pretty" }
            : undefined,
});
















// ─── STEPS (what this file does, in plain words) ───
//   1. import pino (the logging library)
//   2. create the logger once and export it, so every file shares the same one
//   3. on my laptop (not "production") → print pretty, readable lines in the terminal
//   4. on the live server ("production") → plain JSON lines, which log tools can read