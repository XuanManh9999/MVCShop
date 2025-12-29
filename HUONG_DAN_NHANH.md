# HƯỚNG DẪN NHANH - CHỤP ẢNH SƠ ĐỒ

## CÁC FILE ĐÃ TẠO

1. **SO_DO_LUONG_CHINH.puml** - File PlantUML với 7 sơ đồ chính (ngắn gọn)
2. **MO_TA_NGAN_GON.md** - Mô tả ngắn gọn từng sơ đồ

## CÁCH XEM VÀ CHỤP ẢNH

### Cách 1: Sử dụng VS Code (Khuyến nghị)

1. Cài extension "PlantUML" trong VS Code
2. Mở file `SO_DO_LUONG_CHINH.puml`
3. Click chuột phải → "Preview PlantUML Diagram"
4. Sơ đồ sẽ hiển thị ở bên cạnh
5. Chụp ảnh màn hình từng sơ đồ (Alt + Print Screen)
6. Lưu ảnh với tên rõ ràng: `SoDo1_TongQuan.png`, `SoDo2_KhachHang.png`, ...

### Cách 2: Tách từng sơ đồ ra file riêng

Mỗi sơ đồ trong file được đánh dấu bằng:
```
@startuml TÊN_SƠ_ĐỒ
... nội dung ...
@enduml
```

Bạn có thể:
- Copy từng sơ đồ (từ @startuml đến @enduml)
- Tạo file mới cho mỗi sơ đồ
- Mở từng file để xem riêng lẻ

### Cách 3: Sử dụng Online Editor (Nếu file vẫn quá lớn)

1. Truy cập: http://www.plantuml.com/plantuml/uml/
2. Copy **TỪNG SƠ ĐỒ MỘT** (không copy cả file)
3. Paste vào editor
4. Chụp ảnh màn hình
5. Lặp lại cho các sơ đồ khác

## DANH SÁCH 7 SƠ ĐỒ

1. **SO_DO_TONG_QUAN** - Sơ đồ tổng quan hệ thống
2. **LUONG_KHACH_HANG** - Luồng khách hàng mua hàng
3. **LUONG_ADMIN** - Luồng quản trị admin
4. **LUONG_THANH_TOAN** - Luồng thanh toán MoMo
5. **SO_DO_DATABASE** - Sơ đồ cơ sở dữ liệu
6. **LUONG_XU_LY_DON_HANG** - Luồng xử lý đơn hàng
7. **LUONG_XAC_THUC** - Luồng xác thực người dùng

## CHÈN VÀO WORD

1. Chèn ảnh: Insert → Pictures → Chọn file ảnh
2. Thêm caption: Click chuột phải → Insert Caption
   - Ví dụ: "Hình 1: Sơ đồ tổng quan hệ thống"
3. Thêm mô tả: Copy từ file `MO_TA_NGAN_GON.md` và paste dưới mỗi sơ đồ
4. Format: Căn giữa ảnh, font Arial 11pt

## LƯU Ý

- Mỗi sơ đồ độc lập, có thể xem riêng
- Nếu gặp lỗi "Request header too large", hãy tách từng sơ đồ ra file riêng
- File mới đã được tối ưu, ngắn gọn hơn nhiều so với file cũ

