const puppeteer = require("puppeteer");
const interviewReportModel = require("../models/interviewReport.model");

const {
  generateInterviewReport,
  generateResumeHtml,
} = require("./llm.service");

const {
  makeInterviewKey,
  getJson,
  setJson,
} = require("./cache.service");

const { retrieveContext } = require("../rag/rag.service");
const { AppError } = require("../utils/errors");

/**
 * Extract readable text from a PDF resume.
 *
 * Uses unpdf instead of pdf-parse because the latter
 * has compatibility issues in our Windows + Node 24 setup.
 */
async function extractResume(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new AppError(
      400,
      "INVALID_RESUME",
      "The uploaded resume file is empty or invalid"
    );
  }

  // Prevent unnecessarily large files from entering the parser.
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  if (buffer.length > MAX_FILE_SIZE) {
    throw new AppError(
      413,
      "RESUME_TOO_LARGE",
      "Resume file must be smaller than 5 MB"
    );
  }

  try {
    /*
     * unpdf is an ESM package.
     * Since our Express backend uses CommonJS,
     * use dynamic import().
     */
    const {
      getDocumentProxy,
      extractText,
    } = await import("unpdf");

    /*
     * Convert Node.js Buffer → Uint8Array.
     */
    const data = new Uint8Array(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength
    );

    /*
     * Create PDF document.
     */
    const pdf = await getDocumentProxy(data);

    /*
     * Extract text from all pages.
     *
     * mergePages: true gives us one combined string
     * which is easier to pass to the RAG pipeline.
     */
    const result = await extractText(pdf, {
      mergePages: true,
    });

    const text = (result?.text || "").trim();

    if (!text) {
      throw new AppError(
        422,
        "EMPTY_RESUME",
        "The uploaded PDF does not contain readable text"
      );
    }

    /*
     * Prevent enormous extracted documents from
     * reaching the embedding/LLM pipeline.
     */
    return text.slice(0, 40_000);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    console.error("Resume PDF extraction failed:", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    });

    throw new AppError(
      422,
      "RESUME_PARSE_FAILED",
      "Unable to read the uploaded resume PDF. Please upload a valid text-based PDF."
    );
  }
}


/**
 * Generate AI interview report.
 */
async function generateReport({
  userId,
  resume,
  selfDescription,
  jobDescription,
}) {
  console.log("[INTERVIEW] Step 1: Starting report generation");

  const cacheKey = makeInterviewKey({
    userId,
    resume,
    selfDescription,
    jobDescription,
  });

  console.log("[INTERVIEW] Step 2: Checking cache");

  const cached = await getJson(cacheKey);

  if (cached) {
    console.log("[INTERVIEW] Cache HIT");

    return {
      report: cached,
      cacheHit: true,
      contextCount: 0,
    };
  }

  console.log("[INTERVIEW] Step 3: Retrieving RAG context");

  const context = await retrieveContext({
    resume,
    selfDescription,
    jobDescription,
    topK: 4,
  });

  console.log(
    "[INTERVIEW] Step 4: RAG completed",
    {
      contextCount: context?.length,
    }
  );

  console.log("[INTERVIEW] Step 5: Calling Gemini");

  const report = await generateInterviewReport({
    resume,
    selfDescription,
    jobDescription,
    context: context.join("\n\n"),
  });

  console.log("[INTERVIEW] Step 6: Gemini completed");

  console.log("[INTERVIEW] Step 7: Saving report to MongoDB");

  const persisted = await interviewReportModel.create({
    user: userId,
    resume,
    selfDescription,
    jobDescription,
    ...report,
  });

  console.log("[INTERVIEW] Step 8: MongoDB save completed");

  const result = persisted.toObject();

  console.log("[INTERVIEW] Step 9: Caching result");

  await setJson(cacheKey, result, 3600);

  console.log("[INTERVIEW] Step 10: Complete");

  return {
    report: result,
    cacheHit: false,
    contextCount: context.length,
  };
}


/**
 * Get a single interview report.
 */
async function getReportById({
  userId,
  interviewId,
}) {
  return interviewReportModel.findOne({
    _id: interviewId,
    user: userId,
  });
}


/**
 * Get all reports belonging to a user.
 */
async function getReports(userId) {
  return interviewReportModel
    .find({ user: userId })
    .sort({ createdAt: -1 })
    .select(
      "-resume " +
      "-selfDescription " +
      "-jobDescription " +
      "-__v " +
      "-technicalQuestions " +
      "-behavioralQuestions " +
      "-skillGaps " +
      "-preparationPlan"
    );
}


/**
 * Generate a PDF version of the resume.
 */
async function generateResumePdf({
  userId,
  interviewReportId,
}) {
  const report = await interviewReportModel.findOne({
    _id: interviewReportId,
    user: userId,
  });

  if (!report) {
    throw new AppError(
      404,
      "REPORT_NOT_FOUND",
      "Interview report not found"
    );
  }

  if (!report.resume?.trim()) {
    throw new AppError(
      400,
      "RESUME_DATA_MISSING",
      "This report does not contain resume data"
    );
  }

  const html = await generateResumeHtml({
    resume: report.resume,
    jobDescription: report.jobDescription,
    selfDescription: report.selfDescription,
  });

  const browser = await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
  });

  try {
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    return await page.pdf({
      format: "A4",
      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "15mm",
        right: "15mm",
      },
      printBackground: true,
    });
  } finally {
    await browser.close();
  }
}


module.exports = {
  extractResume,
  generateReport,
  getReportById,
  getReports,
  generateResumePdf,
};