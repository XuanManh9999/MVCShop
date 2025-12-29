const mongoose = require("mongoose");
require("dotenv").config();

// Fix Mongoose deprecation warning
mongoose.set('strictQuery', false);

module.exports = () => {
  // Sử dụng MongoDB Atlas (cloud) hoặc local
  const mongoUri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/vp_shop_project2";

  // Cấu hình kết nối với retry logic
  const connectOptions = {
    serverSelectionTimeoutMS: 5000, // Timeout sau 5 giây
    socketTimeoutMS: 45000,
  };

  mongoose
    .connect(mongoUri, connectOptions)
    .then(() => console.log("✅ Connected to MongoDB!"))
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
      console.error("\n💡 Hướng dẫn khắc phục:");
      console.error("   1. Kiểm tra file .env có biến MONGODB_URI chưa");
      console.error("   2. Nếu dùng MongoDB Atlas, kiểm tra IP whitelist:");
      console.error("      https://www.mongodb.com/docs/atlas/security-whitelist/");
      console.error("   3. Nếu dùng MongoDB local, đảm bảo MongoDB đang chạy");
      console.error("\n⚠️  Server vẫn chạy nhưng không có kết nối database.");
      console.error("   Một số tính năng có thể không hoạt động.\n");
      // Không exit để server vẫn chạy được
    });

  // Xử lý lỗi kết nối sau khi đã kết nối
  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected. Đang thử kết nối lại...');
  });

  return mongoose;
};
