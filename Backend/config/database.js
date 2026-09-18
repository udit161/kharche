const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  if (!process.env.MONGO_URI) {
    console.warn("MONGO_URI not defined in environment variables");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {});
    isConnected = db.connections[0].readyState;
    console.log("MONGO db IS SUCCESSFULLY CONNECTED");
  } catch (error) {
    console.error("MONGO DB CONNECTION FAILED", error.message);
  }
};

module.exports = connectDB;

