const mongoose = require("mongoose");
require("dotenv").config();

module.exports = () => {
  // Sử dụng MongoDB Atlas (cloud) hoặc local
  const mongoUri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/vp_shop_project2";

  mongoose
    .connect(mongoUri)
    .then(() => console.log("✅ Connected to MongoDB!"))
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
      process.exit(1);
    });
  return mongoose;
};
