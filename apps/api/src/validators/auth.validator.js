const { z } = require("zod");
const registerSchema = z.object({ username: z.string().trim().min(2).max(40), email: z.string().trim().email().max(120), password: z.string().min(8).max(128) });
const loginSchema = z.object({ email: z.string().trim().email(), password: z.string().min(1) });
module.exports = { registerSchema, loginSchema };
