const { AppError } = require("../utils/errors");
const logger = require("../utils/logger");

function notFound(req, res, next) {
  next(new AppError(404, "ROUTE_NOT_FOUND", `Route ${req.method} ${req.originalUrl} not found`));
}

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  const code = error.code || "INTERNAL_SERVER_ERROR";
  const requestId = req.id;

  logger.error("request_failed", {
    requestId,
    method: req.method,
    path: req.originalUrl,
    statusCode,
    code,
    message: error.message,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message:
  process.env.NODE_ENV !== "production"
    ? error.message
    : statusCode >= 500
      ? "Something went wrong. Please try again."
      : error.message,
      requestId,
      ...(process.env.NODE_ENV !== "production" && error.details ? { details: error.details } : {}),
    },
  });
}

module.exports = { notFound, errorHandler };
