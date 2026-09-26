const crypto = require("crypto");
const { getRedis } = require("../config/redis");
function hash(value) { return crypto.createHash("sha256").update(value).digest("hex").slice(0, 32); }
function makeInterviewKey({ userId, resume, selfDescription, jobDescription }) { return `ai-prep:interview:${hash(JSON.stringify({ userId, resume, selfDescription, jobDescription }))}`; }
async function getJson(key) { const redis = getRedis(); if (!redis) return null; const value = await redis.get(key); return value ? JSON.parse(value) : null; }
async function setJson(key, value, ttlSeconds = 3600) { const redis = getRedis(); if (redis) await redis.set(key, JSON.stringify(value), { EX: ttlSeconds }); }
async function incrementRateLimit(key, ttlSeconds = 60) { const redis = getRedis(); if (!redis) return null; const count = await redis.incr(key); if (count === 1) await redis.expire(key, ttlSeconds); return count; }
module.exports = { makeInterviewKey, getJson, setJson, incrementRateLimit };
