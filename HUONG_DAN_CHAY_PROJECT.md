# 🚀 Hướng dẫn chạy Project với MongoDB Atlas

## ✅ Đã hoàn thành:
- ✅ File `.env` đã được tạo với connection string MongoDB Atlas
- ✅ Code đã được cập nhật để đọc connection string từ `.env`
- ✅ Database sẽ tự động kết nối khi khởi động server

---

## 📋 Các bước tiếp theo:

### Bước 1: Kiểm tra kết nối Database
Chạy lệnh để test kết nối MongoDB Atlas:
```bash
npm run test-db
```

**Kết quả mong đợi:**
- ✅ Kết nối MongoDB thành công!
- 📊 Hiển thị danh sách collections (nếu có)
- 📦 Liệt kê các models sẽ được tạo

**Nếu có lỗi:**
- Kiểm tra lại file `.env` có đúng connection string không
- Kiểm tra IP đã được whitelist trong MongoDB Atlas chưa
- Kiểm tra username/password có đúng không

---

### Bước 2: Tạo dữ liệu mẫu (Tùy chọn)
Nếu database trống, bạn có thể tạo dữ liệu mẫu:
```bash
npm run seed
```

**Script này sẽ tạo:**
- 1 Admin user: `admin@example.com` / `admin123`
- 3 Categories: Điện thoại, Laptop, Tablet
- 4 Products mẫu
- 1 Config mẫu

**Lưu ý:** Script chỉ chạy nếu database trống, không ghi đè dữ liệu hiện có.

---

### Bước 3: Khởi động Server
```bash
npm start
```

**Kết quả mong đợi:**
```
✅ Connected to MongoDB!
🚀 Server running on port 3000
```

---

### Bước 4: Truy cập Website
- **Frontend:** http://localhost:3000
- **Admin Login:** http://localhost:3000/admin/login
  - Nếu đã seed data: `admin@example.com` / `admin123`

---

## 🔍 Kiểm tra Database trên MongoDB Atlas

1. Đăng nhập vào MongoDB Atlas: https://cloud.mongodb.com
2. Vào **Database** → **Browse Collections**
3. Bạn sẽ thấy các collections được tạo tự động:
   - `products`
   - `categories`
   - `users`
   - `customers`
   - `orders`
   - `comments`
   - `banners`
   - `sliders`
   - `configs`

**Lưu ý:** Collections chỉ được tạo khi có dữ liệu được insert vào. Nếu chưa thấy, chạy `npm run seed` hoặc thêm dữ liệu qua admin panel.

---

## 📝 Các lệnh hữu ích

| Lệnh | Mô tả |
|------|-------|
| `npm start` | Khởi động server (development mode với nodemon) |
| `npm run test-db` | Test kết nối MongoDB Atlas |
| `npm run seed` | Tạo dữ liệu mẫu (chỉ chạy nếu database trống) |

---

## ❓ Troubleshooting

### Lỗi: "MongoServerError: bad auth"
- ✅ Kiểm tra lại username/password trong file `.env`
- ✅ Đảm bảo đã thay `<password>` bằng mật khẩu thật

### Lỗi: "MongoServerSelectionError"
- ✅ Kiểm tra internet connection
- ✅ Kiểm tra IP đã được whitelist trong MongoDB Atlas (Network Access)
- ✅ Thử chọn "Allow Access from Anywhere" (0.0.0.0/0)

### Lỗi: "Cannot find module 'dotenv'"
- ✅ Chạy: `npm install`

### Server không kết nối được database
- ✅ Kiểm tra file `.env` có tồn tại không
- ✅ Kiểm tra `MONGODB_URI` trong file `.env`
- ✅ Chạy `npm run test-db` để kiểm tra kết nối

---

## 🎉 Hoàn thành!

Bây giờ project của bạn đã sẵn sàng chạy với MongoDB Atlas (cloud) mà không cần cài MongoDB trên máy!

