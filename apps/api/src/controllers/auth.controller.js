const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const blacklistTokenModel = require("../models/blacklist.model");
const { registerSchema, loginSchema } = require("../validators/auth.validator");
const { AppError } = require("../utils/errors");

function cookieOptions() {
  const production = process.env.NODE_ENV === "production";
  return { httpOnly: true, secure: production, sameSite: production ? "none" : "lax", maxAge: 24 * 60 * 60 * 1000, path: "/" };
}
function issueToken(user) { return jwt.sign({ id: user._id.toString(), username: user.username }, process.env.JWT_SECRET, { expiresIn: "1d" }); }
function publicUser(user) { return { id: user._id, username: user.username, email: user.email }; }

async function register(req, res, next) {
  try {
    const data = registerSchema.parse(req.body);
    if (!process.env.JWT_SECRET) throw new AppError(500, "AUTH_NOT_CONFIGURED", "Authentication is not configured");
    if (await userModel.findOne({ $or: [{ username: data.username }, { email: data.email.toLowerCase() }] })) throw new AppError(409, "ACCOUNT_EXISTS", "Account already exists");
    const user = await userModel.create({ username: data.username, email: data.email.toLowerCase(), password: await bcrypt.hash(data.password, 12) });
    const token = issueToken(user);
    res.cookie("token", token, cookieOptions());
    res.status(201).json({ success: true, message: "User registered successfully", user: publicUser(user) });
  } catch (error) { next(error); }
}

async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);
    const user = await userModel.findOne({ email: data.email.toLowerCase() }).select("+password");
    if (!user || !(await bcrypt.compare(data.password, user.password))) throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    const token = issueToken(user);
    res.cookie("token", token, cookieOptions());
    res.status(200).json({ success: true, message: "Logged in successfully", user: publicUser(user) });
  } catch (error) { next(error); }
}

async function logout(req, res, next) {
  try {
    const token = req.cookies.token || req.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (token) await blacklistTokenModel.updateOne({ token }, { $set: { token } }, { upsert: true });
    res.clearCookie("token", cookieOptions());
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) { next(error); }
}

async function getMe(req, res, next) {
  try {
    const user = await userModel.findById(req.user.id).select("username email");
    if (!user) throw new AppError(404, "USER_NOT_FOUND", "User not found");
    res.json({ success: true, user: publicUser(user) });
  } catch (error) { next(error); }
}

module.exports = { register, login, logout, getMe };
