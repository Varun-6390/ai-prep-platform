const { z } = require("zod");
const interviewInputSchema = z.object({ jobDescription: z.string().trim().min(30).max(30000), selfDescription: z.string().trim().max(10000).optional().default("") });
module.exports = { interviewInputSchema };
