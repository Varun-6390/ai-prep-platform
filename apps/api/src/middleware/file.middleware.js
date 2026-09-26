const multer = require("multer");
const { AppError } = require("../utils/errors");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new AppError(400, "INVALID_FILE_TYPE", "Only PDF resumes are supported"));
    }
    cb(null, true);
  },
});

module.exports = upload;
