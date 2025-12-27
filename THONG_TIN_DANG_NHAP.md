# 🔐 Thông tin đăng nhập

## 📍 Các đường dẫn đăng nhập:

### 1. **Đăng nhập Khách hàng (Customer)**

- **URL:** `http://localhost:3000/signin`
- **Route:** `/signin`
- **Controller:** `SiteController.postSignIn`
- **Model:** `Customer` (collection: `customers`)

### 2. **Đăng nhập Admin**

- **URL:** `http://localhost:3000/admin/login`
- **Route:** `/admin/login`
- **Controller:** `AuthController.postLogin`
- **Model:** `User` (collection: `users`)

---

## 👤 Tài khoản mẫu (sau khi chạy `npm run seed`):

### Admin User:

- **Email:** `admin@example.com`
- **Password:** `admin123`
- **Role:** `admin`
- **Đăng nhập tại:** `http://localhost:3000/admin/login`

### Customer (chưa có trong seed data):

- Script seed hiện tại **CHƯA TẠO** customer mẫu
- Cần đăng ký mới tại: `http://localhost:3000/signup`

---

## 🔍 Kiểm tra:

1. **Kiểm tra Admin đã được tạo chưa:**

   - Vào MongoDB Atlas
   - Collection `users`
   - Tìm email: `admin@example.com`

2. **Kiểm tra Customer:**
   - Collection `customers`
   - Nếu trống, cần đăng ký mới hoặc cập nhật seed data

---

## ✅ Test đăng nhập:

### Test Admin:

```
URL: http://localhost:3000/admin/login
Email: admin@example.com
Password: admin123
→ Redirect đến: /admin/dashboard
```

### Test Customer:

```
URL: http://localhost:3000/signin
→ Cần đăng ký mới tại /signup
```
