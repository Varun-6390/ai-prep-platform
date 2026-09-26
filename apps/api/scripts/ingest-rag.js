require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { connectRedis, disconnectRedis, getRedis } = require("../src/config/redis");
const { embedText } = require("../src/services/llm.service");

async function main() {
  await connectRedis();
  const redis = getRedis();
  if (!redis) throw new Error("REDIS_URL is required for RAG ingestion");
  const docs = JSON.parse(fs.readFileSync(path.join(__dirname, "../src/rag/knowledge/interview-kb.json"), "utf8"));
  for (const doc of docs) {
    const embedding = await embedText(`${doc.topic}: ${doc.text}`);
    if (!embedding) throw new Error(`Could not embed ${doc.id}`);
    await redis.set(`ai-prep:rag:embedding:${doc.id}`, JSON.stringify(embedding), { EX: 60 * 60 * 24 * 30 });
    console.log(`ingested ${doc.id}`);
  }
  await disconnectRedis();
}
main().catch(async (error) => { console.error(error); await disconnectRedis(); process.exit(1); });
