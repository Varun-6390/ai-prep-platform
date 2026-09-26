const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { AppError } = require("../utils/errors");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

/*
 * --------------------------------------------------------------------------
 * Interview report schema
 * --------------------------------------------------------------------------
 */

const questionSchema = z.object({
  question: z.string().min(1),
  intention: z.string().min(1),
  answer: z.string().min(1),
});

const interviewReportSchema = z.object({
  matchScore: z.number().min(0).max(100),

  technicalQuestions: z
    .array(questionSchema)
    .min(1),

  behavioralQuestions: z
    .array(questionSchema)
    .min(1),

  skillGaps: z.array(
    z.object({
      skill: z.string().min(1),
      severity: z.enum(["low", "medium", "high"]),
    })
  ),

  preparationPlan: z.array(
    z.object({
      day: z.number().int().positive(),
      focus: z.string().min(1),
      tasks: z.array(z.string().min(1)).min(1),
    })
  ),

  title: z.string().min(1),
});


/*
 * --------------------------------------------------------------------------
 * Gemini JSON schema
 *
 * This is intentionally explicit.
 * Gemini receives the same contract that our application validates.
 * --------------------------------------------------------------------------
 */

const interviewReportResponseSchema = {
  type: "object",

  properties: {
    matchScore: {
      type: "number",
      description:
        "Candidate's estimated match percentage for the target job, from 0 to 100.",
    },

    technicalQuestions: {
      type: "array",
      description:
        "Technical interview questions tailored to the candidate and target role.",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
          },
          intention: {
            type: "string",
            description:
              "What the interviewer is trying to evaluate.",
          },
          answer: {
            type: "string",
            description:
              "Concise guidance for how the candidate should answer.",
          },
        },
        required: [
          "question",
          "intention",
          "answer",
        ],
      },
    },

    behavioralQuestions: {
      type: "array",
      description:
        "Behavioral interview questions relevant to the candidate and role.",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
          },
          intention: {
            type: "string",
          },
          answer: {
            type: "string",
          },
        },
        required: [
          "question",
          "intention",
          "answer",
        ],
      },
    },

    skillGaps: {
      type: "array",
      description:
        "Important skills the candidate should improve for the target role.",
      items: {
        type: "object",
        properties: {
          skill: {
            type: "string",
          },
          severity: {
            type: "string",
            enum: [
              "low",
              "medium",
              "high",
            ],
          },
        },
        required: [
          "skill",
          "severity",
        ],
      },
    },

    preparationPlan: {
      type: "array",
      description:
        "A practical preparation plan for the candidate.",
      items: {
        type: "object",
        properties: {
          day: {
            type: "integer",
          },
          focus: {
            type: "string",
          },
          tasks: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        required: [
          "day",
          "focus",
          "tasks",
        ],
      },
    },

    title: {
      type: "string",
      description:
        "Short title describing the candidate's interview preparation report.",
    },
  },

  required: [
    "matchScore",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "preparationPlan",
    "title",
  ],
};


/*
 * --------------------------------------------------------------------------
 * Helpers
 * --------------------------------------------------------------------------
 */

function extractText(response) {
  if (typeof response?.text === "string") {
    return response.text;
  }

  return (
    response?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("") || ""
  );
}


function parseJson(text) {
  try {
    return JSON.parse(
      text
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim()
    );
  } catch (error) {
    console.error("LLM JSON parsing failed:", {
      message: error?.message,
      rawResponse: text?.slice(0, 2000),
    });

    throw new AppError(
      502,
      "LLM_INVALID_JSON",
      "AI provider returned invalid JSON"
    );
  }
}


/*
 * --------------------------------------------------------------------------
 * Generate interview report
 * --------------------------------------------------------------------------
 */

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
  context,
}) {
  if (!process.env.GOOGLE_API_KEY) {
    throw new AppError(
      503,
      "AI_NOT_CONFIGURED",
      "AI service is not configured"
    );
  }

  const prompt = `
You are an interview intelligence engine.

Generate a grounded and personalized interview preparation report.

IMPORTANT:
- Use ONLY information supported by the candidate resume,
  self description, job description and retrieved context.
- Never invent companies, projects, technologies, education,
  internships or achievements.
- Do not claim the candidate has experience that is not present.
- Technical questions must be relevant to the target role.
- Behavioral questions should be based on the candidate's actual background.
- Give practical and concise answer guidance.
- matchScore must be between 0 and 100.
- Generate at least 5 technical questions.
- Generate at least 5 behavioral questions.
- Generate useful skill gaps.
- Generate a realistic preparation plan.

CANDIDATE RESUME:
${resume}

SELF DESCRIPTION:
${selfDescription || "Not provided"}

TARGET JOB DESCRIPTION:
${jobDescription}

RETRIEVED KNOWLEDGE CONTEXT:
${context || "No additional context available."}
`;

  try {
    console.log("[LLM] Generating structured interview report");

    const response = await ai.models.generateContent({
      model:
        process.env.GEMINI_MODEL ||
        "gemini-3-flash-preview",

      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],

      config: {
        responseMimeType: "application/json",

        /*
         * THIS IS THE IMPORTANT CHANGE.
         *
         * Gemini is now explicitly constrained to our
         * application's output contract.
         */
        responseSchema: interviewReportResponseSchema,

        temperature: 0.2,
      },
    });

    const rawText = extractText(response);

    if (!rawText) {
      throw new AppError(
        502,
        "LLM_EMPTY_RESPONSE",
        "AI provider returned an empty response"
      );
    }

    console.log(
      "[LLM] Response received:",
      rawText.slice(0, 500)
    );

    const parsed = parseJson(rawText);

    /*
     * Application-level validation.
     *
     * Even though Gemini received the schema,
     * we STILL validate it before storing anything.
     */
    const validated =
      interviewReportSchema.safeParse(parsed);

    if (!validated.success) {
      console.error(
        "[LLM] Schema validation failed:",
        JSON.stringify(
          validated.error.issues,
          null,
          2
        )
      );

      throw new AppError(
        502,
        "LLM_SCHEMA_ERROR",
        "AI provider returned data that did not match the application schema"
      );
    }

    console.log(
      "[LLM] Structured report validated successfully"
    );

    return validated.data;

  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    console.error("[LLM] Provider error:", {
      name: error?.name,
      message: error?.message,
    });

    throw new AppError(
      503,
      "AI_PROVIDER_ERROR",
      "AI provider is temporarily unavailable"
    );
  }
}


/*
 * --------------------------------------------------------------------------
 * Embeddings
 * --------------------------------------------------------------------------
 */

async function embedText(text) {
  if (!process.env.GOOGLE_API_KEY) {
    return null;
  }

  try {
    const response = await ai.models.embedContent({
      model:
        process.env.RAG_EMBEDDING_MODEL ||
        "gemini-embedding-001",

      contents: text,

      config: {
        outputDimensionality: 768,
      },
    });

    return response.embeddings?.[0]?.values || null;

  } catch (error) {
    console.error("[RAG] Embedding generation failed:", {
      name: error?.name,
      message: error?.message,
    });

    return null;
  }
}


/*
 * --------------------------------------------------------------------------
 * Resume HTML generation
 * --------------------------------------------------------------------------
 */

async function generateResumeHtml({
  resume,
  selfDescription,
  jobDescription,
}) {
  if (!process.env.GOOGLE_API_KEY) {
    throw new AppError(
      503,
      "AI_NOT_CONFIGURED",
      "AI service is not configured"
    );
  }

  const prompt = `
Generate a single-page ATS-optimized resume as a complete HTML document.

RULES:
- Use ONLY candidate information provided below.
- Do not invent facts.
- Do not add fake companies, projects, skills or achievements.
- Optimize wording for the target job.
- Return ONLY HTML.
- Do not return Markdown.

RESUME SOURCE:
${resume}

SELF DESCRIPTION:
${selfDescription || "Not provided"}

TARGET JOB:
${jobDescription}
`;

  try {
    const response =
      await ai.models.generateContent({
        model:
          process.env.GEMINI_MODEL ||
          "gemini-3-flash-preview",

        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],

        config: {
          responseMimeType: "text/plain",
        },
      });

    const html = extractText(response)
      .replace(/^```html\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    if (
      !html.includes("<html") ||
      !html.includes("</html>")
    ) {
      throw new AppError(
        502,
        "LLM_INVALID_HTML",
        "AI provider returned invalid resume HTML"
      );
    }

    return html;

  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    console.error("[LLM] Resume HTML generation failed:", {
      name: error?.name,
      message: error?.message,
    });

    throw new AppError(
      503,
      "AI_PROVIDER_ERROR",
      "AI provider is temporarily unavailable"
    );
  }
}


module.exports = {
  generateInterviewReport,
  generateResumeHtml,
  embedText,
};