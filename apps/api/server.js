require("dotenv").config();
const app = require("./src/app");
const { connectDb, disconnectDb } = require("./src/config/database");
const { connectRedis, disconnectRedis } = require("./src/config/redis");

const PORT = Number(process.env.PORT || 3000);

async function start() {
  await connectDb();
  await connectRedis();

  const server = app.listen(PORT, () => {
    console.log(JSON.stringify({ event: "server_started", port: PORT, env: process.env.NODE_ENV || "development" }));
  });

  const shutdown = async (signal) => {
    console.log(JSON.stringify({ event: "shutdown_started", signal }));
    server.close(async () => {
      await disconnectRedis();
      await disconnectDb();
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

start().catch((error) => {
  console.error(JSON.stringify({ event: "startup_failed", message: error.message }));
  process.exit(1);
});
