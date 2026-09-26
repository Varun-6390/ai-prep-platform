const mongoose = require("mongoose");
const questionSchema = new mongoose.Schema({ question: { type: String, required: true }, intention: { type: String, required: true }, answer: { type: String, required: true } }, { _id: false });
const interviewReportSchema = new mongoose.Schema({
  jobDescription: { type: String, required: true },
  resume: { type: String },
  selfDescription: { type: String },
  matchScore: { type: Number, min: 0, max: 100 },
  technicalQuestions: [questionSchema],
  behavioralQuestions: [questionSchema],
  skillGaps: [{ _id: false, skill: { type: String, required: true }, severity: { type: String, enum: ["low", "medium", "high"], required: true } }],
  preparationPlan: [{ day: { type: Number, required: true }, focus: { type: String, required: true }, tasks: [{ type: String }] }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true },
}, { timestamps: true });
interviewReportSchema.index({ user: 1, createdAt: -1 });
module.exports = mongoose.model("InterviewReport", interviewReportSchema);
