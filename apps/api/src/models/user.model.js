const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true, minlength: 2, maxlength: 40 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true, select: false },
}, { timestamps: true });
userSchema.index({ username: 1 }, { unique: true });
module.exports = mongoose.model("User", userSchema);
