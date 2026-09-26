const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklist.model");
const { AppError } = require("../utils/errors");

async function authUser(req, res, next) {
  try {
    const token = req.cookies.token || req.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (!token) throw new AppError(401, "AUTH_REQUIRED", "Authentication required");

    const blacklisted = await blacklistTokenModel.exists({ token });
    if (blacklisted) throw new AppError(401, "TOKEN_REVOKED", "Session has expired");

    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    if (error instanceof AppError) return next(error);
    next(new AppError(401, "INVALID_TOKEN", "Invalid or expired authentication token"));
  }
}

module.exports = { authUser };
