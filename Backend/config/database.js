const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("MONGO db IS SUCCESSFULLY CONNECTED");
  } catch (error) {
    console.error("MONGO DB CONNECTION FAILED", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
