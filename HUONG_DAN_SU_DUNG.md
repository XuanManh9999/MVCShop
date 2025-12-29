# HƯỚNG DẪN SỬ DỤNG SƠ ĐỒ LUỒNG

## TỔNG QUAN

Tôi đã tạo cho bạn 2 file chính:

1. **SO_DO_LUONG_DU_AN.puml** - File PlantUML chứa tất cả các sơ đồ
2. **MO_TA_SO_DO_LUONG.md** - Tài liệu mô tả chi tiết từng sơ đồ bằng tiếng Việt

## CÁC SƠ ĐỒ ĐÃ TẠO

File PlantUML chứa **11 sơ đồ** khác nhau:

1. **Sơ đồ tổng quan hệ thống** - Kiến trúc tổng thể
2. **Luồng khách hàng mua hàng** - Quy trình từ duyệt sản phẩm đến thanh toán
3. **Luồng quản trị của Admin** - Các chức năng quản lý
4. **Luồng xử lý thanh toán MoMo** - Tích hợp payment gateway
5. **Sơ đồ cơ sở dữ liệu** - ERD và quan hệ giữa các bảng
6. **Luồng xử lý đơn hàng từng bước** - Chi tiết quy trình xử lý đơn
7. **Kiến trúc hệ thống chi tiết** - Phân tích từng lớp
8. **Luồng xác thực và phân quyền** - Authentication & Authorization
9. **Luồng quản lý sản phẩm** - CRUD operations
10. **Luồng quản lý giỏ hàng** - Shopping cart flow
11. **Luồng thống kê và báo cáo** - Statistics & Reporting

## CÁCH SỬ DỤNG

### Cách 1: Xem và chỉnh sửa sơ đồ PlantUML

1. **Cài đặt công cụ hỗ trợ PlantUML:**
   - **VS Code**: Cài extension "PlantUML"
   - **IntelliJ IDEA**: Cài plugin "PlantUML integration"
   - **Online**: Truy cập http://www.plantuml.com/plantuml/uml/

2. **Mở file SO_DO_LUONG_DU_AN.puml** trong editor hỗ trợ PlantUML

3. **Xem từng sơ đồ:**
   - Mỗi sơ đồ được đánh dấu bằng `@startuml TÊN_SƠ_ĐỒ` và `@enduml`
   - Bạn có thể xem từng sơ đồ riêng lẻ hoặc tất cả cùng lúc

4. **Export sang hình ảnh:**
   - Click chuột phải → "Export Diagram" → Chọn format (PNG, SVG, PDF)
   - Hoặc sử dụng command line: `java -jar plantuml.jar SO_DO_LUONG_DU_AN.puml`

### Cách 2: Chèn vào Word

1. **Export sơ đồ sang PNG hoặc SVG:**
   - Sử dụng công cụ PlantUML để export từng sơ đồ
   - Lưu với tên rõ ràng (ví dụ: `SoDoTongQuan.png`)

2. **Chèn vào Word:**
   - Mở Microsoft Word
   - Insert → Pictures → Chọn file hình ảnh
   - Thêm caption cho mỗi sơ đồ

3. **Thêm mô tả:**
   - Copy nội dung từ file `MO_TA_SO_DO_LUONG.md`
   - Paste vào Word dưới mỗi sơ đồ
   - Format lại theo style của bạn

### Cách 3: Sử dụng Online Editor

1. Truy cập: http://www.plantuml.com/plantuml/uml/
2. Copy nội dung của một sơ đồ (từ `@startuml` đến `@enduml`)
3. Paste vào editor
4. Sơ đồ sẽ tự động render
5. Click "Download" để tải về PNG hoặc SVG

## CẤU TRÚC FILE PLANTUML

File PlantUML được chia thành các phần:

```
@startuml TÊN_SƠ_ĐỒ_1
... nội dung sơ đồ 1 ...
@enduml

@startuml TÊN_SƠ_ĐỒ_2
... nội dung sơ đồ 2 ...
@enduml
```

Mỗi sơ đồ độc lập, bạn có thể:
- Tách từng sơ đồ ra file riêng
- Chỉnh sửa màu sắc, font chữ
- Thêm/bớt thành phần

## TÙY CHỈNH SƠ ĐỒ

### Thay đổi màu sắc:
```plantuml
skinparam backgroundColor #FFFFFF
skinparam defaultFontName "Arial"
skinparam defaultFontSize 10
```

### Thay đổi theme:
```plantuml
!theme plain
!theme aws-orange
!theme bootstrap
```

## LƯU Ý KHI TRÌNH BÀY TRONG WORD

1. **Sắp xếp thứ tự:**
   - Bắt đầu với sơ đồ tổng quan
   - Tiếp theo là các luồng chính (khách hàng, admin)
   - Cuối cùng là các luồng chi tiết

2. **Thêm số thứ tự:**
   - Hình 1: Sơ đồ tổng quan hệ thống
   - Hình 2: Luồng khách hàng mua hàng
   - ...

3. **Thêm mô tả:**
   - Mỗi sơ đồ nên có mô tả ngắn gọn
   - Tham khảo file `MO_TA_SO_DO_LUONG.md` để có mô tả chi tiết

4. **Định dạng:**
   - Sử dụng font dễ đọc (Arial, Times New Roman)
   - Căn giữa các sơ đồ
   - Thêm border nếu cần

## HỖ TRỢ

Nếu bạn gặp vấn đề:
1. Kiểm tra xem đã cài đặt Java chưa (cần cho PlantUML)
2. Kiểm tra extension/plugin đã được kích hoạt chưa
3. Thử sử dụng online editor nếu local không hoạt động

## TÓM TẮT

- **File PlantUML**: `SO_DO_LUONG_DU_AN.puml` - Chứa 11 sơ đồ
- **File mô tả**: `MO_TA_SO_DO_LUONG.md` - Mô tả chi tiết bằng tiếng Việt
- **Công cụ**: VS Code + PlantUML extension hoặc online editor
- **Export**: PNG, SVG, PDF để chèn vào Word

Chúc bạn trình bày tốt!

