const { interviewInputSchema } = require("../validators/interview.validator");
const interviewService = require("../services/interview.service");
const { AppError } = require("../utils/errors");

async function generateReport(req, res, next) {
  try {
    if (!req.file) throw new AppError(400, "RESUME_REQUIRED", "Resume PDF is required");
    const { jobDescription, selfDescription } = interviewInputSchema.parse(req.body);
    const resume = await interviewService.extractResume(req.file.buffer);
    const { report, cacheHit, contextCount } = await interviewService.generateReport({ userId: req.user.id, resume, selfDescription, jobDescription });
    res.status(201).json({ success: true, message: "Interview report generated successfully", interviewReport: report, meta: { cacheHit, retrievedDocuments: contextCount, requestId: req.id } });
  } catch (error) { next(error); }
}

async function getReportById(req, res, next) {
  try {
    const report = await interviewService.getReportById({ userId: req.user.id, interviewId: req.params.interviewId });
    if (!report) throw new AppError(404, "REPORT_NOT_FOUND", "Interview report not found");
    res.json({ success: true, interviewReport: report });
  } catch (error) { next(error); }
}

async function getAllReports(req, res, next) {
  try { res.json({ success: true, interviewReports: await interviewService.getReports(req.user.id) }); } catch (error) { next(error); }
}

async function downloadResume(req, res, next) {
  try {
    const pdfBuffer = await interviewService.generateResumePdf({ userId: req.user.id, interviewReportId: req.params.interviewReportId });
    res.set({ "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename=resume_${req.params.interviewReportId}.pdf` });
    res.send(pdfBuffer);
  } catch (error) { next(error); }
}

module.exports = { generateReport, getReportById, getAllReports, downloadResume };
