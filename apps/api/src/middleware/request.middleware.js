const crypto = require("crypto");

function requestId(req, res, next) {
  const id = req.get("x-request-id") || `req_${crypto.randomBytes(8).toString("hex")}`;
  req.id = id;
  res.setHeader("x-request-id", id);
  next();
}

function requestLogger(req, res, next) {
  const startedAt = Date.now();
  res.on("finish", () => {
    console.log(JSON.stringify({
      event: "http_request",
      requestId: req.id,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - startedAt,
    }));
  });
  next();
}

module.exports = { requestId, requestLogger };
