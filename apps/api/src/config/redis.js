const { createClient } = require("redis");

let client = null;
let available = false;

async function connectRedis() {
  const redisUrl = process.env.REDIS_URL?.trim();

  // Redis is optional during local development.
  if (!redisUrl) {
    console.log(
      JSON.stringify({
        event: "redis_disabled",
        reason: "REDIS_URL not configured",
      })
    );
    return;
  }

  client = createClient({
    url: redisUrl,
    socket: {
      // IMPORTANT:
      // Don't continuously reconnect when Redis isn't running.
      reconnectStrategy: false,
      connectTimeout: 3000,
    },
  });

  client.on("error", (error) => {
    available = false;

    // Log once in a useful format.
    console.warn(
      JSON.stringify({
        event: "redis_unavailable",
        message: error?.message || "Redis connection failed",
      })
    );
  });

  try {
    await client.connect();

    available = true;

    console.log(
      JSON.stringify({
        event: "redis_connected",
      })
    );
  } catch (error) {
    available = false;

    console.warn(
      JSON.stringify({
        event: "redis_unavailable",
        message: error?.message || "Redis connection failed",
      })
    );

    // Important: close the failed client so it cannot
    // continue trying to reconnect.
    try {
      if (client?.isOpen) {
        await client.quit();
      }
    } catch (_) {
      // Ignore cleanup errors.
    }

    client = null;
  }
}

async function disconnectRedis() {
  if (client?.isOpen) {
    try {
      await client.quit();
    } catch (_) {
      // Ignore shutdown errors.
    }
  }

  client = null;
  available = false;
}

function getRedis() {
  return available ? client : null;
}

module.exports = {
  connectRedis,
  disconnectRedis,
  getRedis,
};