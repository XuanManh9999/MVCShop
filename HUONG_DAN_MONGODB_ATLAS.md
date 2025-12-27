# 📚 Hướng dẫn sử dụng MongoDB Atlas (Cloud) thay cho MongoDB Local

## 🎯 Tại sao dùng MongoDB Atlas?
- **Miễn phí**: 512MB storage miễn phí (đủ cho dự án nhỏ)
- **Không cần cài đặt**: Chạy trên cloud, không tốn dung lượng máy
- **Truy cập mọi lúc mọi nơi**: Kết nối từ bất kỳ đâu có internet
- **Tự động backup**: Atlas tự động backup dữ liệu

---

## 📋 Bước 1: Tạo tài khoản MongoDB Atlas

1. Truy cập: https://www.mongodb.com/cloud/atlas/register
2. Đăng ký tài khoản miễn phí (có thể dùng Google/GitHub)
3. Xác thực email nếu được yêu cầu

---

## 📋 Bước 2: Tạo Cluster (Database Server)

1. Sau khi đăng nhập, chọn **"Build a Database"**
2. Chọn **FREE (M0)** - Miễn phí
3. Chọn **Cloud Provider & Region**: 
   - Chọn gần nhất (ví dụ: AWS - Singapore nếu ở Việt Nam)
4. Đặt tên cluster (ví dụ: `Cluster0`) → Click **"Create"**
5. Đợi 3-5 phút để cluster được tạo

---

## 📋 Bước 3: Tạo Database User

1. Trong màn hình **"Security Quickstart"**, chọn **"Username and Password"**
2. Tạo username và password (⚠️ **LƯU LẠI MẬT KHẨU**)
   - Ví dụ: 
     - Username: `admin`
     - Password: `MySecurePassword123!`
3. Click **"Create Database User"**

---

## 📋 Bước 4: Cấu hình Network Access (Cho phép kết nối)

1. Trong phần **"Network Access"**, click **"Add IP Address"**
2. Chọn **"Allow Access from Anywhere"** (0.0.0.0/0) - cho phép kết nối từ mọi nơi
   - ⚠️ Lưu ý: Với production nên giới hạn IP, nhưng với development thì OK
3. Click **"Confirm"**

---

## 📋 Bước 5: Lấy Connection String

1. Click **"Database"** ở sidebar trái
2. Click **"Connect"** trên cluster vừa tạo
3. Chọn **"Connect your application"**
4. Chọn **Driver**: `Node.js` và **Version**: `5.5 or later`
5. Copy connection string, ví dụ:
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Thay thế** `<password>` bằng mật khẩu bạn đã tạo ở Bước 3
7. **Thêm tên database** vào cuối, ví dụ:
   ```
   mongodb+srv://admin:MySecurePassword123!@cluster0.xxxxx.mongodb.net/vp_shop_project2?retryWrites=true&w=majority
   ```

---

## 📋 Bước 6: Cấu hình Project

### 6.1. Tạo file `.env` trong thư mục gốc của project:

```env
MONGODB_URI=mongodb+srv://admin:MySecurePassword123!@cluster0.xxxxx.mongodb.net/vp_shop_project2?retryWrites=true&w=majority
```

⚠️ **Lưu ý**: 
- Thay `admin` và `MySecurePassword123!` bằng username/password của bạn
- Thay `cluster0.xxxxx.mongodb.net` bằng cluster URL của bạn
- Thay `vp_shop_project2` bằng tên database bạn muốn (hoặc giữ nguyên)

### 6.2. File `.env` đã được cấu hình tự động!

Project đã được cập nhật để đọc `MONGODB_URI` từ file `.env`.

---

## 📋 Bước 7: Chạy Project

1. Đảm bảo file `.env` đã có `MONGODB_URI`
2. Chạy lệnh:
   ```bash
   npm start
   ```
3. Nếu thấy dòng `✅ Connected to MongoDB!` → Thành công! 🎉

---

## 🔍 Kiểm tra kết nối

Sau khi chạy project, vào MongoDB Atlas:
1. Click **"Database"** → **"Browse Collections"**
2. Nếu thấy các collections (products, categories, users, etc.) → Database đã hoạt động!

---

## ❓ Troubleshooting

### Lỗi: "MongoServerError: bad auth"
- ✅ Kiểm tra lại username/password trong connection string
- ✅ Đảm bảo đã thay `<password>` bằng mật khẩu thật

### Lỗi: "MongoServerError: IP not whitelisted"
- ✅ Vào **Network Access** → Thêm IP hiện tại hoặc chọn "Allow from anywhere"

### Lỗi: "MongooseServerSelectionError"
- ✅ Kiểm tra internet connection
- ✅ Kiểm tra connection string có đúng format không

### Không thấy dữ liệu
- ✅ Kiểm tra tên database trong connection string
- ✅ Đảm bảo đã tạo collections và insert dữ liệu

---

## 📝 Tóm tắt nhanh

1. ✅ Đăng ký MongoDB Atlas
2. ✅ Tạo Free Cluster
3. ✅ Tạo Database User
4. ✅ Allow Network Access (0.0.0.0/0)
5. ✅ Copy Connection String
6. ✅ Tạo file `.env` với `MONGODB_URI`
7. ✅ Chạy `npm start`

---

## 🎉 Hoàn thành!

Bây giờ bạn có thể sử dụng MongoDB mà không cần cài đặt gì trên máy tính!

