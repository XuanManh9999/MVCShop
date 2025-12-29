# MÔ TẢ CHI TIẾT CÁC SƠ ĐỒ LUỒNG HỆ THỐNG E-COMMERCE MVC SHOP

## 1. SƠ ĐỒ TỔNG QUAN HỆ THỐNG

### Mô tả:
Sơ đồ này mô tả kiến trúc tổng thể của hệ thống E-Commerce được xây dựng theo mô hình MVC (Model-View-Controller). Hệ thống được chia thành các lớp chính:

- **Client Layer**: Lớp trình duyệt web, nơi người dùng tương tác với hệ thống
- **Presentation Layer**: Lớp hiển thị bao gồm các template EJS và file tĩnh (CSS, JavaScript, hình ảnh)
- **Application Layer**: Lớp ứng dụng chứa các Controller xử lý logic nghiệp vụ, Router định tuyến, và Middleware xử lý các tác vụ trung gian
- **Business Logic Layer**: Lớp logic nghiệp vụ chứa các service như JWT, Email, OAuth, Price Formatter
- **Data Layer**: Lớp dữ liệu bao gồm các Model (Mongoose) và cơ sở dữ liệu MongoDB
- **External Services**: Các dịch vụ bên ngoài như MoMo Payment API, Email Server, Google/Facebook OAuth

### Luồng hoạt động:
1. Người dùng gửi HTTP Request qua trình duyệt
2. Request được định tuyến bởi Router đến Controller tương ứng
3. Controller xử lý logic, tương tác với Model để truy vấn dữ liệu
4. Model thực hiện các thao tác CRUD với MongoDB
5. Controller render View và trả về HTML cho trình duyệt
6. Các dịch vụ bên ngoài (Payment, Email, OAuth) được tích hợp thông qua Controller

---

## 2. LUỒNG KHÁCH HÀNG MUA HÀNG

### Mô tả:
Sơ đồ này mô tả toàn bộ quy trình từ khi khách hàng truy cập website đến khi hoàn tất đơn hàng và thanh toán.

### Các bước chính:

#### Bước 1: Đăng nhập/Đăng ký
- Khách hàng chưa đăng nhập sẽ được yêu cầu đăng ký hoặc đăng nhập
- Thông tin đăng ký được validate và mã hóa password bằng bcrypt trước khi lưu vào database
- Sau khi đăng nhập thành công, thông tin được lưu vào session

#### Bước 2: Duyệt và tìm kiếm sản phẩm
- Khách hàng có thể xem sản phẩm theo danh mục hoặc tìm kiếm
- Mỗi sản phẩm hiển thị đầy đủ thông tin: giá, mô tả, bảo hành, phụ kiện, đánh giá

#### Bước 3: Quản lý giỏ hàng
- Khách hàng thêm sản phẩm vào giỏ hàng (lưu trong session)
- Có thể cập nhật số lượng hoặc xóa sản phẩm khỏi giỏ hàng
- Giỏ hàng được lưu tạm thời trong session của người dùng

#### Bước 4: Đặt hàng và thanh toán
- Khách hàng nhập thông tin giao hàng (tên, email, SĐT, địa chỉ)
- Chọn phương thức thanh toán: MoMo hoặc Tiền mặt

**Nếu thanh toán MoMo:**
- Hệ thống tạo đơn hàng tạm với trạng thái "pending"
- Gọi API MoMo để tạo yêu cầu thanh toán
- Chuyển hướng khách hàng đến trang thanh toán MoMo
- Sau khi thanh toán, MoMo gửi callback về server
- Nếu thành công: cập nhật đơn hàng, trừ tồn kho, tạo bảo hành, gửi email xác nhận
- Nếu thất bại: xóa đơn hàng tạm

**Nếu thanh toán tiền mặt:**
- Tạo đơn hàng với trạng thái "Đang xử lí"
- Trừ tồn kho, tạo bảo hành, gửi email xác nhận ngay lập tức

#### Bước 5: Xem lịch sử đơn hàng
- Khách hàng có thể xem tất cả đơn hàng đã đặt
- Có thể hủy đơn hàng (cập nhật trạng thái thành "Đã hủy")

---

## 3. LUỒNG QUẢN TRỊ CỦA ADMIN

### Mô tả:
Sơ đồ này mô tả các chức năng quản trị của admin trong hệ thống.

### Các module chính:

#### Module 1: Xác thực Admin
- Admin đăng nhập bằng email/password hoặc OAuth (Google/Facebook)
- Password được mã hóa bằng bcrypt và so sánh với database
- Sau khi đăng nhập thành công, session được lưu để xác thực các request tiếp theo

#### Module 2: Quản lý Sản phẩm
- **Xem danh sách**: Hiển thị tất cả sản phẩm với khả năng lọc theo danh mục, trạng thái tồn kho
- **Thêm mới**: Nhập thông tin sản phẩm, upload ảnh, tự động tạo slug từ tên
- **Sửa**: Cập nhật thông tin sản phẩm, có thể thay đổi ảnh
- **Xóa**: Soft delete (đánh dấu is_delete = true) hoặc xóa vĩnh viễn
- **Nhập hàng**: Cập nhật số lượng tồn kho và trạng thái is_stock

#### Module 3: Quản lý Đơn hàng
- Xem danh sách đơn hàng với phân trang
- Xem chi tiết từng đơn hàng (thông tin khách hàng, sản phẩm, tổng tiền)
- Cập nhật trạng thái đơn hàng (Đang xử lí, Đã giao, Đã hủy, v.v.)

#### Module 4: Thống kê Báo cáo
- Xem thống kê tổng quan: tổng đơn hàng, tổng doanh thu, đơn đã/chưa thanh toán
- Lọc theo khoảng thời gian: hôm nay, tuần, tháng, năm, hoặc tùy chọn ngày
- Xem top 10 sản phẩm bán chạy và top 10 khách hàng VIP
- Xem biểu đồ doanh thu theo ngày và biểu đồ phương thức thanh toán

#### Module 5: Quản lý Khách hàng
- Xem danh sách khách hàng
- Xem thông tin chi tiết khách hàng
- Xóa khách hàng nếu cần

#### Module 6: Quản lý Bình luận
- Xem danh sách bình luận của khách hàng
- Duyệt hoặc ẩn bình luận
- Xóa bình luận spam hoặc không phù hợp

#### Module 7: Quản lý Danh mục
- Thêm, sửa, xóa danh mục sản phẩm
- Quản lý danh mục con

---

## 4. LUỒNG XỬ LÝ THANH TOÁN MOMO

### Mô tả:
Sơ đồ này mô tả chi tiết quy trình tích hợp thanh toán MoMo vào hệ thống.

### Các bước xử lý:

#### Bước 1: Tạo yêu cầu thanh toán
- Khách hàng chọn thanh toán MoMo và submit form
- Payment Controller lấy thông tin giỏ hàng từ session
- Tính tổng tiền của đơn hàng
- Tạo đơn hàng tạm trong database với:
  - status: "Đang xử lí"
  - is_payment: false
  - Lưu tất cả thông tin sản phẩm và khách hàng

#### Bước 2: Tạo chữ ký và gọi API MoMo
- Tạo signature bằng HMAC-SHA256 với các thông tin:
  - accessKey, secretKey
  - orderId (ID đơn hàng vừa tạo)
  - amount (tổng tiền)
  - orderInfo, redirectUrl, ipnUrl
- Gửi POST request đến MoMo API endpoint
- MoMo trả về payUrl (đường dẫn thanh toán)

#### Bước 3: Chuyển hướng và thanh toán
- Server redirect khách hàng đến payUrl
- Khách hàng thực hiện thanh toán trên trang MoMo
- MoMo xử lý thanh toán

#### Bước 4: Xử lý Callback
- Sau khi thanh toán, MoMo redirect về /callback với:
  - resultCode: mã kết quả (0 = thành công)
  - orderId: ID đơn hàng

**Nếu thanh toán thành công (resultCode = 0):**
- Kiểm tra đơn hàng đã được xử lý chưa (tránh xử lý trùng)
- Cập nhật is_payment = true
- Cập nhật trạng thái đơn hàng
- Trừ tồn kho cho từng sản phẩm
- Tạo warranty records (bảo hành) cho mỗi sản phẩm
- Gửi email xác nhận đơn hàng cho khách hàng
- Redirect đến trang thành công

**Nếu thanh toán thất bại:**
- Xóa đơn hàng tạm khỏi database
- Redirect đến trang thất bại

---

## 5. SƠ ĐỒ CƠ SỞ DỮ LIỆU

### Mô tả:
Sơ đồ này mô tả cấu trúc cơ sở dữ liệu và mối quan hệ giữa các bảng (collections).

### Các Entity chính:

#### Users (Quản trị viên)
- Lưu thông tin admin: email, password (mã hóa), tên, role
- Hỗ trợ OAuth: google_id, facebook_id, tokenLogin

#### Customers (Khách hàng)
- Lưu thông tin khách hàng: email, password (mã hóa), tên, SĐT, địa chỉ

#### Categories (Danh mục)
- Lưu danh mục sản phẩm: title, slug
- Hỗ trợ soft delete: is_delete

#### Products (Sản phẩm)
- Thông tin sản phẩm đầy đủ: tên, giá, mô tả, ảnh, danh mục
- Quản lý tồn kho: stock, is_stock
- Thông tin bảo hành: warranty, warranty_period
- Quan hệ: thuộc một danh mục (cat_id → Categories)

#### Orders (Đơn hàng)
- Thông tin khách hàng: tên, email, SĐT, địa chỉ
- Trạng thái: status, is_payment
- Chứa mảng items (OrderItems) với thông tin chi tiết từng sản phẩm
- Timestamp: createdAt, updatedAt

#### OrderItems (Chi tiết đơn hàng)
- Embedded trong Orders (không phải collection riêng)
- Lưu: prd_id, prd_name, prd_price, prd_qty, prd_thumbnail

#### Comments (Bình luận)
- Lưu bình luận của khách hàng về sản phẩm
- Quan hệ: thuộc một sản phẩm (prd_id → Products)
- Quản lý: is_allowed (duyệt/ẩn bình luận)

#### Warranties (Bảo hành)
- Lưu thông tin bảo hành cho từng sản phẩm trong đơn hàng
- Quan hệ: thuộc một đơn hàng (order_id → Orders) và một sản phẩm (product_id → Products)
- Thông tin: serial_number, warranty_start_date, warranty_end_date, status

#### Banners & Sliders
- Lưu banner và slider quảng cáo: thumbnail, link

#### Configs
- Lưu cấu hình hệ thống: logo_header, logo_footer

### Mối quan hệ:
- Products → Categories: Nhiều sản phẩm thuộc một danh mục
- Orders → OrderItems: Một đơn hàng chứa nhiều sản phẩm
- Comments → Products: Nhiều bình luận cho một sản phẩm
- Warranties → Orders: Nhiều bảo hành thuộc một đơn hàng
- Warranties → Products: Mỗi bảo hành cho một sản phẩm

---

## 6. LUỒNG XỬ LÝ ĐƠN HÀNG TỪNG BƯỚC

### Mô tả:
Sơ đồ này mô tả chi tiết từng bước xử lý một đơn hàng từ khi khách hàng đặt hàng đến khi hoàn tất.

### Các bước xử lý:

#### Bước 1: Tạo đơn hàng
- Lấy thông tin từ form đặt hàng (tên, email, SĐT, địa chỉ)
- Lấy giỏ hàng từ session
- Tạo đối tượng Order với:
  - Thông tin khách hàng
  - Mảng items từ giỏ hàng
  - status: "Đang xử lí"
  - is_payment: false (mặc định)
- Lưu vào Order Model

#### Bước 2: Xử lý thanh toán
- Nếu thanh toán MoMo: chờ callback và cập nhật is_payment
- Nếu thanh toán tiền mặt: giữ nguyên is_payment = false

#### Bước 3: Cập nhật tồn kho
- Duyệt qua từng sản phẩm trong đơn hàng
- Trừ số lượng đã bán khỏi stock: `stock = stock - qty`
- Nếu stock = 0: cập nhật is_stock = false

#### Bước 4: Tạo bảo hành
- Duyệt qua từng sản phẩm trong đơn
- Tạo serial number: `ORDER_ID-PRODUCT_ID-INDEX`
- Tính ngày bảo hành:
  - warranty_start_date = ngày đặt hàng
  - warranty_end_date = warranty_start_date + warranty_period (tháng)
- Lưu vào Warranty Model

#### Bước 5: Gửi email xác nhận
- Render template email (EJS) với thông tin đơn hàng
- Gửi email qua Nodemailer đến địa chỉ khách hàng
- Nội dung email: thông tin đơn hàng, danh sách sản phẩm, tổng tiền

#### Bước 6: Xóa giỏ hàng
- Xóa session cart: `req.session.cart = []`
- Lưu session

#### Bước 7: Quản lý đơn hàng (Admin)
- Admin có thể xem danh sách và chi tiết đơn hàng
- Cập nhật trạng thái: Đang xử lí → Đang giao hàng → Đã giao hàng
- Hoặc hủy đơn hàng: status = "Đã hủy"

---

## 7. KIẾN TRÚC HỆ THỐNG CHI TIẾT

### Mô tả:
Sơ đồ này mô tả chi tiết kiến trúc hệ thống theo mô hình MVC với các thành phần cụ thể.

### Các lớp và thành phần:

#### Lớp 1: Client Layer
- **Web Browser**: Trình duyệt web (Chrome, Firefox, Safari)
- Gửi HTTP Request và nhận HTML Response
- Xử lý JavaScript để tương tác động

#### Lớp 2: Presentation Layer
- **Views (EJS Templates)**:
  - Admin Views: Dashboard, Product Management, Order Management, Statistics, User Management
  - Site Views: Home Page, Product Detail, Shopping Cart, Checkout, Customer Account
- **Static Assets**: CSS Files, JavaScript Files, Images

#### Lớp 3: Application Layer
- **Express.js Server**: Xử lý HTTP Request/Response, Session Management, Cookie Parser, Body Parser
- **Routers**: Định tuyến URL đến Controllers
- **Controllers**: Xử lý logic nghiệp vụ cho từng module
- **Middlewares**: Xử lý các tác vụ trung gian (Authentication, Cart Management, File Upload)

#### Lớp 4: Business Logic Layer
- **JWT Service**: Xử lý JSON Web Token
- **Email Service**: Gửi email qua SMTP
- **Passport OAuth**: Xác thực OAuth (Google, Facebook)
- **Price Formatter**: Định dạng giá tiền VNĐ
- **Pagination Helper**: Hỗ trợ phân trang
- **Bad Words Filter**: Lọc từ ngữ không phù hợp trong bình luận

#### Lớp 5: Data Access Layer
- **Models (Mongoose)**: Định nghĩa schema và thao tác với database
- **MongoDB Database**: Lưu trữ dữ liệu trong các collections

#### Lớp 6: External Services
- **MoMo Payment API**: Xử lý thanh toán trực tuyến
- **Email Server (SMTP)**: Gửi email
- **Google OAuth API**: Đăng nhập bằng Google
- **Facebook OAuth API**: Đăng nhập bằng Facebook

---

## 8. LUỒNG XÁC THỰC VÀ PHÂN QUYỀN

### Mô tả:
Sơ đồ này mô tả quy trình xác thực người dùng và phân quyền truy cập.

### Các luồng xác thực:

#### Luồng 1: Đăng ký tài khoản
1. Khách hàng truy cập /signup
2. Điền thông tin: email, password, tên, SĐT, địa chỉ
3. Hệ thống kiểm tra email đã tồn tại chưa
4. Nếu chưa: mã hóa password bằng bcrypt và lưu vào Customer Model
5. Redirect đến trang đăng nhập

#### Luồng 2: Đăng nhập khách hàng
1. Khách hàng nhập email/password
2. Hệ thống tìm user trong Customer Model
3. So sánh password bằng bcrypt.compare
4. Nếu đúng: lưu session (email, password) và redirect về trang chủ
5. Nếu sai: hiển thị lỗi

#### Luồng 3: Đăng nhập Admin
1. Admin nhập email/password
2. Hệ thống tìm trong User Model
3. So sánh password
4. Nếu đúng: lưu session và redirect đến Dashboard
5. Nếu sai: hiển thị lỗi

#### Luồng 4: OAuth đăng nhập
1. Admin chọn đăng nhập Google/Facebook
2. Redirect đến trang xác thực OAuth
3. Người dùng xác nhận
4. OAuth provider trả về token
5. Hệ thống tìm user theo google_id/facebook_id
6. Lưu session và redirect đến Dashboard

#### Luồng 5: Kiểm tra phân quyền
1. User truy cập route yêu cầu quyền admin
2. Auth Middleware kiểm tra session
3. Nếu có session: tìm user trong User Model
4. Kiểm tra role của user
5. Nếu là admin: cho phép truy cập
6. Nếu không: redirect về trang đăng nhập

#### Luồng 6: Đăng xuất
1. User click đăng xuất
2. Hệ thống xóa session (destroy)
3. Redirect về trang chủ

---

## 9. LUỒNG QUẢN LÝ SẢN PHẨM

### Mô tả:
Sơ đồ này mô tả chi tiết các thao tác CRUD (Create, Read, Update, Delete) với sản phẩm.

### Các thao tác:

#### Thêm sản phẩm mới
1. Admin truy cập /admin/products/create
2. Hệ thống lấy danh sách categories
3. Hiển thị form thêm sản phẩm
4. Admin điền thông tin và chọn ảnh
5. Upload Middleware xử lý upload ảnh và lưu vào thư mục uploads
6. Tạo slug từ tên sản phẩm
7. Lưu vào Product Model
8. Redirect về danh sách sản phẩm

#### Xem danh sách sản phẩm
1. Admin truy cập /admin/products
2. Hệ thống lấy query params (page, category, is_stock)
3. Query sản phẩm với filter (is_delete = false)
4. Tính pagination
5. Render view với danh sách sản phẩm

#### Sửa sản phẩm
1. Admin chọn sản phẩm cần sửa
2. Hệ thống load thông tin hiện tại
3. Admin cập nhật thông tin
4. Nếu có ảnh mới: upload và cập nhật thumbnail
5. Tạo slug mới từ tên
6. Cập nhật vào Product Model
7. Redirect về danh sách

#### Xóa sản phẩm (Soft Delete)
1. Admin click "Xóa"
2. Hệ thống cập nhật is_delete = true
3. Sản phẩm không hiển thị trong danh sách chính
4. Có thể khôi phục từ thùng rác

#### Xem thùng rác
1. Admin truy cập /admin/products/trash
2. Hệ thống query sản phẩm với is_delete = true
3. Hiển thị danh sách sản phẩm đã xóa

#### Khôi phục sản phẩm
1. Admin click "Khôi phục" từ thùng rác
2. Hệ thống cập nhật is_delete = false
3. Sản phẩm xuất hiện lại trong danh sách chính

#### Xóa vĩnh viễn
1. Admin click "Xóa vĩnh viễn"
2. Hệ thống xóa file ảnh từ server
3. Xóa sản phẩm khỏi database
4. Không thể khôi phục

#### Nhập hàng
1. Admin truy cập /admin/products/supply/:id
2. Nhập số lượng nhập
3. Hệ thống cập nhật: stock = stock + số lượng nhập
4. Nếu stock > 0: cập nhật is_stock = true

---

## 10. LUỒNG QUẢN LÝ GIỎ HÀNG

### Mô tả:
Sơ đồ này mô tả cách hệ thống quản lý giỏ hàng của khách hàng.

### Các chức năng:

#### Thêm sản phẩm vào giỏ hàng
1. Khách hàng xem chi tiết sản phẩm
2. Chọn số lượng và click "Thêm vào giỏ"
3. Hệ thống lấy giỏ hàng hiện tại từ session
4. Kiểm tra sản phẩm đã có trong giỏ chưa
5. Nếu có: tăng số lượng
6. Nếu chưa: thêm sản phẩm mới với thông tin: _id, name, price, thumbnail, qty
7. Lưu vào session và redirect đến trang giỏ hàng

#### Xem giỏ hàng
1. Khách hàng truy cập /cart
2. Hệ thống lấy giỏ hàng từ session
3. Tính tổng tiền: sum(item.price * item.qty)
4. Hiển thị danh sách sản phẩm và tổng tiền

#### Cập nhật số lượng
1. Khách hàng thay đổi số lượng trong form
2. Submit form cập nhật
3. Hệ thống cập nhật số lượng cho từng sản phẩm
4. Lưu vào session và redirect

#### Xóa sản phẩm
1. Khách hàng click "Xóa"
2. Hệ thống lọc bỏ sản phẩm có _id tương ứng
3. Lưu giỏ hàng mới vào session
4. Redirect về trang giỏ hàng

#### Kiểm tra tồn kho khi đặt hàng
1. Khi khách hàng click "Thanh toán"
2. Hệ thống kiểm tra tồn kho cho từng sản phẩm
3. Nếu hết hàng: hiển thị thông báo
4. Nếu còn hàng: tiếp tục xử lý đặt hàng

#### Xóa giỏ hàng sau khi đặt hàng
1. Sau khi đặt hàng thành công
2. Hệ thống xóa giỏ hàng: req.session.cart = []
3. Lưu session
4. Redirect đến trang thành công

---

## 11. LUỒNG THỐNG KÊ VÀ BÁO CÁO

### Mô tả:
Sơ đồ này mô tả cách hệ thống tính toán và hiển thị các thống kê, báo cáo doanh thu.

### Quy trình xử lý:

#### Bước 1: Xử lý bộ lọc thời gian
- Admin chọn khoảng thời gian: hôm nay, tuần, tháng, năm, hoặc tùy chọn ngày
- Hệ thống tạo dateFilter tương ứng
- Nếu có startDate và endDate: tạo filter từ ngày bắt đầu đến ngày kết thúc

#### Bước 2: Tính toán thống kê tổng quan
- Query đơn hàng với dateFilter
- Tính tổng đơn hàng: `totalOrders = orders.length`
- Tính tổng doanh thu: `sum(order.items.reduce(price * qty))`
- Đếm đơn đã thanh toán: `orders.filter(is_payment = true).length`
- Đếm đơn chưa thanh toán: `totalOrders - paidOrders`

#### Bước 3: Thống kê theo trạng thái
- Duyệt qua từng đơn hàng
- Nhóm theo status và tính số lượng, doanh thu cho mỗi trạng thái

#### Bước 4: Thống kê theo phương thức thanh toán
- Phân loại: is_payment = true → MoMo, false → Tiền mặt
- Tính số lượng và doanh thu cho mỗi phương thức

#### Bước 5: Thống kê theo ngày (cho biểu đồ)
- Nhóm đơn hàng theo ngày
- Tính số đơn và doanh thu cho mỗi ngày
- Sắp xếp theo ngày và format label

#### Bước 6: Thống kê sản phẩm bán chạy
- Duyệt qua tất cả đơn hàng và items
- Nhóm theo product_id
- Tính tổng số lượng bán và doanh thu
- Sắp xếp theo số lượng bán và lấy top 10

#### Bước 7: Thống kê khách hàng VIP
- Nhóm đơn hàng theo email khách hàng
- Tính tổng số đơn và doanh thu
- Sắp xếp theo doanh thu và lấy top 10

#### Bước 8: Lấy đơn hàng gần đây
- Query 10 đơn hàng mới nhất
- Format dữ liệu cho view

#### Bước 9: Hiển thị kết quả
- Render view với tất cả dữ liệu thống kê
- Sử dụng Chart.js để vẽ biểu đồ:
  - Biểu đồ đường: doanh thu và số đơn hàng theo ngày
  - Biểu đồ tròn: phân bổ phương thức thanh toán

---

## KẾT LUẬN

Hệ thống E-Commerce MVC Shop được xây dựng với kiến trúc rõ ràng, phân tầng hợp lý, đảm bảo tính mở rộng và bảo trì. Các sơ đồ trên mô tả đầy đủ các luồng xử lý chính của hệ thống, từ quản lý người dùng, sản phẩm, đơn hàng đến thanh toán và thống kê. Hệ thống sử dụng các công nghệ hiện đại như Express.js, MongoDB, EJS, và tích hợp các dịch vụ bên ngoài như MoMo Payment, Email, OAuth để cung cấp trải nghiệm tốt nhất cho cả khách hàng và quản trị viên.

