# MÔ TẢ NGẮN GỌN CÁC SƠ ĐỒ LUỒNG

## SƠ ĐỒ 1: SƠ ĐỒ TỔNG QUAN HỆ THỐNG

**Mô tả:**
Sơ đồ này mô tả kiến trúc tổng thể của hệ thống E-Commerce được xây dựng theo mô hình MVC (Model-View-Controller). Hệ thống được chia thành 4 lớp chính:

- **Lớp Hiển thị**: Views (EJS templates) và các file tĩnh (CSS, JS, Images)
- **Lớp Ứng dụng**: Các Controller xử lý logic nghiệp vụ (Site, Auth, Product, Order, Payment, Statistics)
- **Lớp Dữ liệu**: Các Model (Mongoose) tương tác với MongoDB
- **Dịch vụ bên ngoài**: MoMo Payment API và Email Service

**Luồng hoạt động:**
1. Khách hàng/Admin truy cập website qua trình duyệt
2. Request được xử lý bởi Controller tương ứng
3. Controller tương tác với Model để truy vấn dữ liệu từ MongoDB
4. Controller render View và trả về HTML cho trình duyệt
5. Tích hợp với dịch vụ bên ngoài (Payment, Email) khi cần

---

## SƠ ĐỒ 2: LUỒNG KHÁCH HÀNG MUA HÀNG

**Mô tả:**
Sơ đồ này mô tả toàn bộ quy trình từ khi khách hàng truy cập website đến khi hoàn tất đơn hàng.

**Các bước chính:**

1. **Đăng nhập/Đăng ký**: Khách hàng chưa đăng nhập sẽ được yêu cầu đăng ký hoặc đăng nhập. Thông tin được lưu vào session sau khi xác thực thành công.

2. **Duyệt và mua sắm**: Khách hàng duyệt sản phẩm, xem chi tiết và thêm vào giỏ hàng. Giỏ hàng được lưu tạm thời trong session.

3. **Thanh toán**: 
   - **Thanh toán MoMo**: Tạo đơn hàng tạm, gọi API MoMo, chuyển đến trang thanh toán. Sau khi thanh toán thành công, cập nhật đơn hàng, trừ tồn kho, gửi email xác nhận.
   - **Thanh toán tiền mặt**: Tạo đơn hàng, trừ tồn kho, gửi email ngay lập tức.

4. **Xem lịch sử**: Khách hàng có thể xem tất cả đơn hàng đã đặt.

---

## SƠ ĐỒ 3: LUỒNG QUẢN TRỊ ADMIN

**Mô tả:**
Sơ đồ này mô tả các chức năng quản trị của admin trong hệ thống.

**Các module chính:**

1. **Xác thực**: Admin đăng nhập bằng email/password. Sau khi xác thực thành công, session được lưu để xác thực các request tiếp theo.

2. **Quản lý Sản phẩm**:
   - Xem danh sách sản phẩm (có thể lọc theo danh mục, trạng thái tồn kho)
   - Thêm mới: Nhập thông tin, upload ảnh, tự động tạo slug
   - Sửa: Cập nhật thông tin, có thể thay đổi ảnh
   - Xóa: Soft delete (đánh dấu is_delete = true)
   - Nhập hàng: Cập nhật số lượng tồn kho

3. **Quản lý Đơn hàng**:
   - Xem danh sách đơn hàng với phân trang
   - Xem chi tiết từng đơn hàng
   - Cập nhật trạng thái đơn hàng (Đang xử lí, Đã giao, Đã hủy)

4. **Thống kê Báo cáo**:
   - Xem thống kê tổng quan: tổng đơn hàng, tổng doanh thu
   - Lọc theo khoảng thời gian (hôm nay, tuần, tháng, năm)
   - Xem top 10 sản phẩm bán chạy và top 10 khách hàng VIP
   - Hiển thị biểu đồ doanh thu và phương thức thanh toán

---

## SƠ ĐỒ 4: LUỒNG THANH TOÁN MOMO

**Mô tả:**
Sơ đồ này mô tả chi tiết quy trình tích hợp thanh toán MoMo vào hệ thống.

**Các bước xử lý:**

1. **Tạo yêu cầu thanh toán**: 
   - Khách hàng chọn thanh toán MoMo và submit form
   - Payment Controller tính tổng tiền và tạo đơn hàng tạm trong database (status: "Đang xử lí", is_payment: false)

2. **Gọi API MoMo**:
   - Tạo signature bằng HMAC-SHA256
   - Gửi POST request đến MoMo API với thông tin đơn hàng
   - MoMo trả về payUrl (đường dẫn thanh toán)

3. **Chuyển hướng và thanh toán**:
   - Server redirect khách hàng đến payUrl
   - Khách hàng thực hiện thanh toán trên trang MoMo

4. **Xử lý Callback**:
   - **Thành công (resultCode = 0)**: Cập nhật is_payment = true, trừ tồn kho, gửi email xác nhận, redirect đến trang thành công
   - **Thất bại**: Xóa đơn hàng tạm, redirect đến trang thất bại

---

## SƠ ĐỒ 5: SƠ ĐỒ CƠ SỞ DỮ LIỆU

**Mô tả:**
Sơ đồ này mô tả cấu trúc cơ sở dữ liệu và mối quan hệ giữa các bảng (collections).

**Các Entity chính:**

- **Users**: Lưu thông tin quản trị viên (email, password mã hóa, tên)
- **Customers**: Lưu thông tin khách hàng (email, password mã hóa, tên, SĐT, địa chỉ)
- **Categories**: Lưu danh mục sản phẩm (title, slug)
- **Products**: Lưu thông tin sản phẩm (tên, giá, tồn kho, ảnh, danh mục). Quan hệ: thuộc một danh mục
- **Orders**: Lưu đơn hàng (thông tin khách hàng, trạng thái, phương thức thanh toán, mảng items chứa sản phẩm)
- **Comments**: Lưu bình luận của khách hàng về sản phẩm. Quan hệ: thuộc một sản phẩm

**Mối quan hệ:**
- Products → Categories: Nhiều sản phẩm thuộc một danh mục
- Orders → Products: Một đơn hàng chứa nhiều sản phẩm
- Comments → Products: Nhiều bình luận cho một sản phẩm

---

## SƠ ĐỒ 6: LUỒNG XỬ LÝ ĐƠN HÀNG

**Mô tả:**
Sơ đồ này mô tả chi tiết từng bước xử lý một đơn hàng từ khi khách hàng đặt hàng đến khi hoàn tất.

**Các bước xử lý:**

1. **Tạo đơn hàng**: Lấy thông tin từ form đặt hàng và giỏ hàng từ session, tạo Order Model và lưu vào database với status: "Đang xử lí"

2. **Thanh toán**: 
   - Nếu MoMo: chờ callback và cập nhật is_payment
   - Nếu tiền mặt: giữ nguyên is_payment = false

3. **Cập nhật tồn kho**: Duyệt qua từng sản phẩm trong đơn hàng và trừ số lượng đã bán khỏi stock (stock = stock - qty)

4. **Gửi email xác nhận**: Render template email với thông tin đơn hàng và gửi qua Nodemailer đến địa chỉ khách hàng

5. **Xóa giỏ hàng**: Xóa session cart sau khi đặt hàng thành công

---

## SƠ ĐỒ 7: LUỒNG XÁC THỰC NGƯỜI DÙNG

**Mô tả:**
Sơ đồ này mô tả quy trình xác thực người dùng và phân quyền truy cập.

**Các luồng xác thực:**

1. **Đăng ký tài khoản**:
   - Khách hàng điền thông tin (email, password, tên, SĐT, địa chỉ)
   - Hệ thống kiểm tra email đã tồn tại chưa
   - Nếu chưa: mã hóa password bằng bcrypt và lưu vào Customer Model
   - Redirect đến trang đăng nhập

2. **Đăng nhập**:
   - Người dùng nhập email/password
   - Hệ thống tìm user trong database
   - So sánh password bằng bcrypt.compare
   - Nếu đúng: lưu session (email, password) và redirect về trang chủ
   - Nếu sai: hiển thị lỗi

3. **Kiểm tra phân quyền**:
   - Khi truy cập route yêu cầu quyền admin
   - Auth Middleware kiểm tra session
   - Nếu có session: tìm user và kiểm tra role
   - Nếu là admin: cho phép truy cập
   - Nếu không: redirect về trang đăng nhập

---

## KẾT LUẬN

Hệ thống E-Commerce MVC Shop được xây dựng với kiến trúc rõ ràng, phân tầng hợp lý. Các sơ đồ trên mô tả đầy đủ các luồng xử lý chính của hệ thống, từ quản lý người dùng, sản phẩm, đơn hàng đến thanh toán. Hệ thống sử dụng các công nghệ hiện đại như Express.js, MongoDB, EJS và tích hợp các dịch vụ bên ngoài như MoMo Payment, Email để cung cấp trải nghiệm tốt nhất cho cả khách hàng và quản trị viên.

