const mongoose = require("mongoose");

async function connectDb() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required");
  await mongoose.connect(process.env.MONGO_URI);
  console.log(JSON.stringify({ event: "mongodb_connected" }));
}

async function disconnectDb() {
  await mongoose.disconnect();
}

module.exports = { connectDb, disconnectDb };
