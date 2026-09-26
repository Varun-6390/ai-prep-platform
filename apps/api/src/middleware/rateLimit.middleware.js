const { getRedis } = require("../config/redis");
const { AppError } = require("../utils/errors");
const { incrementRateLimit } = require("../services/cache.service");

async function apiRateLimiter(req, res, next) {
  try {
    const redis = getRedis();
    if (!redis) return next();
    const windowSeconds = Math.max(1, Math.ceil(Number(process.env.RATE_LIMIT_WINDOW_MS || 60000) / 1000));
    const max = Number(process.env.RATE_LIMIT_MAX || 30);
    const key = `ai-prep:rate:${req.ip}`;
    const count = await incrementRateLimit(key, windowSeconds);
    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, max - count));
    if (count > max) throw new AppError(429, "RATE_LIMITED", "Too many requests. Please try again shortly.");
    next();
  } catch (error) { next(error); }
}

module.exports = { apiRateLimiter };
