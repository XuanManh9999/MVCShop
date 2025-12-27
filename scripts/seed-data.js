/**
 * Script tạo dữ liệu mẫu cho database
 * Chạy: node scripts/seed-data.js
 *
 * Lưu ý: Script này sẽ tạo dữ liệu mẫu nếu database trống
 */

require("dotenv").config();
const mongoose = require("mongoose");

// Import các models
const categoryModel = require("../src/apps/models/category");
const productModel = require("../src/apps/models/product");
const userModel = require("../src/apps/models/user");
const customerModel = require("../src/apps/models/customer");
const orderModel = require("../src/apps/models/order");
const configModel = require("../src/apps/models/config");
const bannerModel = require("../src/apps/models/banner");
const sliderModel = require("../src/apps/models/slider");
const bcrypt = require("bcrypt");

const mongoUri =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/vp_shop_project2";

async function seedData() {
  try {
    console.log("🔄 Đang kết nối đến MongoDB Atlas...");
    await mongoose.connect(mongoUri);
    console.log("✅ Kết nối thành công!\n");

    // Kiểm tra xem đã có dữ liệu chưa
    const existingCategories = await categoryModel.countDocuments();
    const existingProducts = await productModel.countDocuments();
    const existingUsers = await userModel.countDocuments();

    if (existingCategories > 0 || existingProducts > 0) {
      console.log("⚠️  Database đã có dữ liệu. Bỏ qua seed data.");
      console.log(`   - Categories: ${existingCategories}`);
      console.log(`   - Products: ${existingProducts}`);
      console.log(`   - Users: ${existingUsers}`);
      await mongoose.connection.close();
      return;
    }

    console.log("📦 Bắt đầu tạo dữ liệu mẫu...\n");

    // 1. Tạo Admin User
    console.log("1️⃣  Tạo Admin User...");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = await userModel.create({
      email: "admin@example.com",
      password: hashedPassword,
      full_name: "Administrator",
      role: "admin",
    });
    console.log(`   ✅ Đã tạo admin: ${admin.email}`);

    // 2. Tạo Categories
    console.log("\n2️⃣  Tạo Categories...");
    const categories = await categoryModel.insertMany([
      {
        title: "Điện thoại",
        slug: "dien-thoai",
        description:
          "Các loại điện thoại thông minh từ Apple, Samsung, Xiaomi, Oppo...",
        is_root: true,
      },
      {
        title: "Laptop",
        slug: "laptop",
        description: "Máy tính xách tay hiệu năng cao, phù hợp mọi nhu cầu",
        is_root: true,
      },
      {
        title: "Tablet",
        slug: "tablet",
        description: "Máy tính bảng đa năng, màn hình lớn",
        is_root: true,
      },
      {
        title: "Tai nghe",
        slug: "tai-nghe",
        description: "Tai nghe không dây, có dây, gaming",
        is_root: true,
      },
      {
        title: "Đồng hồ thông minh",
        slug: "dong-ho-thong-minh",
        description: "Smartwatch, đồng hồ thông minh theo dõi sức khỏe",
        is_root: true,
      },
      {
        title: "Phụ kiện",
        slug: "phu-kien",
        description: "Ốp lưng, sạc dự phòng, cáp sạc, giá đỡ...",
        is_root: true,
      },
    ]);
    console.log(`   ✅ Đã tạo ${categories.length} categories`);

    // 3. Tạo Products
    console.log("\n3️⃣  Tạo Products...");
    const products = await productModel.insertMany([
      // Điện thoại
      {
        name: "iPhone 15 Pro Max",
        slug: "iphone-15-pro-max",
        price: 29990000,
        description:
          "Điện thoại iPhone 15 Pro Max 256GB, chip A17 Pro, camera 48MP, pin 4422mAh",
        cat_id: categories[0]._id,
        thumbnail: "products/iphone-15-pro-max.png",
        is_stock: true,
        stock: 50,
        featured: true,
        status: "Còn hàng",
        promotion: "Giảm 2 triệu",
        warranty: "12 tháng",
        accessories: "Sạc, tai nghe, ốp lưng",
      },
      {
        name: "Samsung Galaxy S24 Ultra",
        slug: "samsung-galaxy-s24-ultra",
        price: 24990000,
        description:
          "Điện thoại Samsung Galaxy S24 Ultra 512GB, S Pen, camera 200MP",
        cat_id: categories[0]._id,
        thumbnail: "products/samsung-s24-ultra.png",
        is_stock: true,
        stock: 30,
        featured: true,
        status: "Còn hàng",
        promotion: "Tặng ốp lưng",
        warranty: "12 tháng",
        accessories: "Sạc, cáp, ốp lưng",
      },
      {
        name: "Xiaomi 14 Pro",
        slug: "xiaomi-14-pro",
        price: 18990000,
        description:
          "Điện thoại Xiaomi 14 Pro 256GB, Snapdragon 8 Gen 3, camera Leica",
        cat_id: categories[0]._id,
        thumbnail: "products/xiaomi-14-pro.png",
        is_stock: true,
        stock: 40,
        featured: true,
        status: "Còn hàng",
        warranty: "12 tháng",
      },
      {
        name: "OPPO Find X7 Ultra",
        slug: "oppo-find-x7-ultra",
        price: 21990000,
        description: "OPPO Find X7 Ultra 512GB, camera 50MP, sạc nhanh 100W",
        cat_id: categories[0]._id,
        thumbnail: "products/oppo-find-x7.png",
        is_stock: true,
        stock: 25,
        featured: false,
        status: "Còn hàng",
        warranty: "12 tháng",
      },
      {
        name: "iPhone 14",
        slug: "iphone-14",
        price: 19990000,
        description: "iPhone 14 128GB, chip A15 Bionic, camera kép 12MP",
        cat_id: categories[0]._id,
        thumbnail: "products/iphone-14.png",
        is_stock: true,
        stock: 60,
        featured: false,
        status: "Còn hàng",
        promotion: "Giảm 1.5 triệu",
        warranty: "12 tháng",
      },
      // Laptop
      {
        name: "MacBook Pro M3",
        slug: "macbook-pro-m3",
        price: 49990000,
        description: "Laptop Apple MacBook Pro 14 inch M3, 16GB RAM, 512GB SSD",
        cat_id: categories[1]._id,
        thumbnail: "products/macbook-pro-m3.png",
        is_stock: true,
        stock: 20,
        featured: true,
        status: "Còn hàng",
        warranty: "12 tháng",
        accessories: "Adapter, chuột",
      },
      {
        name: "Dell XPS 15",
        slug: "dell-xps-15",
        price: 38990000,
        description:
          "Laptop Dell XPS 15, Intel i7, 16GB RAM, RTX 4060, 1TB SSD",
        cat_id: categories[1]._id,
        thumbnail: "products/dell-xps-15.png",
        is_stock: true,
        stock: 15,
        featured: true,
        status: "Còn hàng",
        warranty: "24 tháng",
      },
      {
        name: "ASUS ROG Zephyrus G14",
        slug: "asus-rog-zephyrus-g14",
        price: 32990000,
        description:
          "Laptop Gaming ASUS ROG Zephyrus G14, AMD Ryzen 9, RTX 4070",
        cat_id: categories[1]._id,
        thumbnail: "products/asus-rog-g14.png",
        is_stock: true,
        stock: 12,
        featured: false,
        status: "Còn hàng",
        warranty: "24 tháng",
      },
      {
        name: "HP Spectre x360",
        slug: "hp-spectre-x360",
        price: 27990000,
        description:
          "Laptop HP Spectre x360 2-in-1, Intel i7, 16GB RAM, 512GB SSD",
        cat_id: categories[1]._id,
        thumbnail: "products/hp-spectre.png",
        is_stock: true,
        stock: 18,
        featured: false,
        status: "Còn hàng",
        warranty: "12 tháng",
      },
      // Tablet
      {
        name: "iPad Pro 12.9 inch",
        slug: "ipad-pro-12-9-inch",
        price: 29990000,
        description:
          "Tablet Apple iPad Pro 12.9 inch M2, 256GB, hỗ trợ Apple Pencil",
        cat_id: categories[2]._id,
        thumbnail: "products/ipad-pro.png",
        is_stock: true,
        stock: 25,
        featured: true,
        status: "Còn hàng",
        warranty: "12 tháng",
      },
      {
        name: "Samsung Galaxy Tab S9 Ultra",
        slug: "samsung-tab-s9-ultra",
        price: 24990000,
        description:
          "Tablet Samsung Galaxy Tab S9 Ultra 14.6 inch, S Pen, 256GB",
        cat_id: categories[2]._id,
        thumbnail: "products/samsung-tab-s9.png",
        is_stock: true,
        stock: 20,
        featured: false,
        status: "Còn hàng",
        warranty: "12 tháng",
      },
      // Tai nghe
      {
        name: "AirPods Pro 2",
        slug: "airpods-pro-2",
        price: 5990000,
        description: "Tai nghe Apple AirPods Pro 2, chống ồn chủ động, MagSafe",
        cat_id: categories[3]._id,
        thumbnail: "products/airpods-pro-2.png",
        is_stock: true,
        stock: 100,
        featured: true,
        status: "Còn hàng",
        warranty: "12 tháng",
      },
      {
        name: "Sony WH-1000XM5",
        slug: "sony-wh-1000xm5",
        price: 8990000,
        description: "Tai nghe Sony WH-1000XM5, chống ồn tốt nhất, pin 30 giờ",
        cat_id: categories[3]._id,
        thumbnail: "products/sony-wh1000xm5.png",
        is_stock: true,
        stock: 50,
        featured: true,
        status: "Còn hàng",
        warranty: "12 tháng",
      },
      {
        name: "Samsung Galaxy Buds2 Pro",
        slug: "samsung-buds2-pro",
        price: 3990000,
        description:
          "Tai nghe Samsung Galaxy Buds2 Pro, chống ồn, chống nước IPX7",
        cat_id: categories[3]._id,
        thumbnail: "products/samsung-buds2.png",
        is_stock: true,
        stock: 80,
        featured: false,
        status: "Còn hàng",
        warranty: "12 tháng",
      },
      // Đồng hồ thông minh
      {
        name: "Apple Watch Series 9",
        slug: "apple-watch-series-9",
        price: 10990000,
        description:
          "Đồng hồ Apple Watch Series 9 45mm, GPS, theo dõi sức khỏe",
        cat_id: categories[4]._id,
        thumbnail: "products/apple-watch-9.png",
        is_stock: true,
        stock: 60,
        featured: true,
        status: "Còn hàng",
        warranty: "12 tháng",
      },
      {
        name: "Samsung Galaxy Watch6",
        slug: "samsung-galaxy-watch6",
        price: 7990000,
        description: "Đồng hồ Samsung Galaxy Watch6 44mm, đo huyết áp, ECG",
        cat_id: categories[4]._id,
        thumbnail: "products/samsung-watch6.png",
        is_stock: true,
        stock: 45,
        featured: false,
        status: "Còn hàng",
        warranty: "12 tháng",
      },
      // Phụ kiện
      {
        name: "Sạc dự phòng Anker 20000mAh",
        slug: "sac-du-phong-anker-20000",
        price: 899000,
        description: "Sạc dự phòng Anker PowerCore 20000mAh, sạc nhanh 20W",
        cat_id: categories[5]._id,
        thumbnail: "products/anker-powerbank.png",
        is_stock: true,
        stock: 200,
        featured: false,
        status: "Còn hàng",
        warranty: "12 tháng",
      },
      {
        name: "Ốp lưng iPhone 15 Pro Max",
        slug: "op-lung-iphone-15-pro-max",
        price: 299000,
        description: "Ốp lưng trong suốt iPhone 15 Pro Max, bảo vệ camera",
        cat_id: categories[5]._id,
        thumbnail: "products/op-lung-iphone.png",
        is_stock: true,
        stock: 300,
        featured: false,
        status: "Còn hàng",
        warranty: "6 tháng",
      },
      {
        name: "Cáp sạc nhanh USB-C 100W",
        slug: "cap-sac-nhanh-usb-c",
        price: 199000,
        description: "Cáp sạc nhanh USB-C to USB-C, hỗ trợ 100W, dài 2m",
        cat_id: categories[5]._id,
        thumbnail: "products/cap-usb-c.png",
        is_stock: true,
        stock: 500,
        featured: false,
        status: "Còn hàng",
        warranty: "12 tháng",
      },
    ]);
    console.log(`   ✅ Đã tạo ${products.length} products`);

    // 4. Tạo Customers
    console.log("\n4️⃣  Tạo Customers...");
    const customerPassword = await bcrypt.hash("customer123", 10);
    const customers = await customerModel.insertMany([
      {
        email: "customer1@example.com",
        password: customerPassword,
        full_name: "Nguyễn Văn An",
        phone: "0901234567",
        address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
      },
      {
        email: "customer2@example.com",
        password: customerPassword,
        full_name: "Trần Thị Bình",
        phone: "0902345678",
        address: "456 Đường Nguyễn Huệ, Quận 3, TP.HCM",
      },
      {
        email: "customer3@example.com",
        password: customerPassword,
        full_name: "Lê Văn Cường",
        phone: "0903456789",
        address: "789 Đường Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
      },
      {
        email: "customer4@example.com",
        password: customerPassword,
        full_name: "Phạm Thị Dung",
        phone: "0904567890",
        address: "321 Đường Cách Mạng Tháng 8, Quận 10, TP.HCM",
      },
      {
        email: "customer5@example.com",
        password: customerPassword,
        full_name: "Hoàng Văn Em",
        phone: "0905678901",
        address: "654 Đường Võ Văn Tần, Quận 3, TP.HCM",
      },
    ]);
    console.log(`   ✅ Đã tạo ${customers.length} customers`);

    // 5. Tạo Orders mẫu
    console.log("\n5️⃣  Tạo Orders mẫu...");
    const orders = await orderModel.insertMany([
      {
        name: customers[0].full_name,
        phone: customers[0].phone,
        email: customers[0].email,
        address: customers[0].address,
        status: "Đang xử lí",
        is_payment: false,
        items: [
          {
            prd_id: products[0]._id,
            prd_qty: 1,
            prd_name: products[0].name,
            prd_thumbnail: products[0].thumbnail,
            prd_price: products[0].price,
          },
          {
            prd_id: products[11]._id,
            prd_qty: 1,
            prd_name: products[11].name,
            prd_thumbnail: products[11].thumbnail,
            prd_price: products[11].price,
          },
        ],
      },
      {
        name: customers[1].full_name,
        phone: customers[1].phone,
        email: customers[1].email,
        address: customers[1].address,
        status: "Đã xác nhận",
        is_payment: true,
        items: [
          {
            prd_id: products[5]._id,
            prd_qty: 1,
            prd_name: products[5].name,
            prd_thumbnail: products[5].thumbnail,
            prd_price: products[5].price,
          },
        ],
      },
      {
        name: customers[2].full_name,
        phone: customers[2].phone,
        email: customers[2].email,
        address: customers[2].address,
        status: "Đang giao hàng",
        is_payment: true,
        items: [
          {
            prd_id: products[1]._id,
            prd_qty: 1,
            prd_name: products[1].name,
            prd_thumbnail: products[1].thumbnail,
            prd_price: products[1].price,
          },
          {
            prd_id: products[12]._id,
            prd_qty: 1,
            prd_name: products[12].name,
            prd_thumbnail: products[12].thumbnail,
            prd_price: products[12].price,
          },
        ],
      },
      {
        name: customers[3].full_name,
        phone: customers[3].phone,
        email: customers[3].email,
        address: customers[3].address,
        status: "Đã giao hàng",
        is_payment: true,
        items: [
          {
            prd_id: products[9]._id,
            prd_qty: 1,
            prd_name: products[9].name,
            prd_thumbnail: products[9].thumbnail,
            prd_price: products[9].price,
          },
        ],
      },
    ]);
    console.log(`   ✅ Đã tạo ${orders.length} orders`);

    // 6. Tạo Banners
    console.log("\n6️⃣  Tạo Banners...");
    const banners = await bannerModel.insertMany([
      {
        name: "Banner Khuyến mãi iPhone",
        thumbnails: "banners/banner-iphone.png",
      },
      {
        name: "Banner Laptop Gaming",
        thumbnails: "banners/banner-laptop.png",
      },
      {
        name: "Banner Phụ kiện",
        thumbnails: "banners/banner-phu-kien.png",
      },
    ]);
    console.log(`   ✅ Đã tạo ${banners.length} banners`);

    // 7. Tạo Sliders
    console.log("\n7️⃣  Tạo Sliders...");
    const sliders = await sliderModel.insertMany([
      {
        name: "Slider 1 - Sản phẩm mới",
        thumbnails: "sliders/slider-1.png",
      },
      {
        name: "Slider 2 - Khuyến mãi lớn",
        thumbnails: "sliders/slider-2.png",
      },
      {
        name: "Slider 3 - Flash Sale",
        thumbnails: "sliders/slider-3.png",
      },
      {
        name: "Slider 4 - Mùa hè",
        thumbnails: "sliders/slider-4.png",
      },
    ]);
    console.log(`   ✅ Đã tạo ${sliders.length} sliders`);

    // 8. Tạo Config
    console.log("\n8️⃣  Tạo Config...");
    const config = await configModel.create({
      logo_header: "logo-header.png",
      logo_footer: "logo-footer.png",
      intro:
        "Chào mừng đến với MINH TRẦN SHOP - Cửa hàng công nghệ uy tín hàng đầu Việt Nam",
      address: "123 Đường Nguyễn Huệ, Quận 1, TP.HCM",
      service:
        "Dịch vụ chăm sóc khách hàng 24/7, giao hàng toàn quốc, bảo hành chính hãng",
      hotline_phone: 19001234,
      hotline_email: "support@minhtranshop.com",
      footer:
        "© 2024 MINH TRẦN SHOP. All rights reserved. | Hotline: 1900-1234",
      allow: true,
    });
    console.log(`   ✅ Đã tạo config`);

    console.log("\n✨ Hoàn thành! Dữ liệu mẫu đã được tạo thành công!");
    console.log("\n📊 Tóm tắt:");
    console.log(`   - Admin: 1 user (admin@example.com / admin123)`);
    console.log(
      `   - Customers: ${customers.length} users (customer1@example.com / customer123)`
    );
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Orders: ${orders.length}`);
    console.log(`   - Banners: ${banners.length}`);
    console.log(`   - Sliders: ${sliders.length}`);
    console.log(`   - Config: 1`);
    console.log("\n🔐 Thông tin đăng nhập:");
    console.log(`   Admin: http://localhost:3000/admin/login`);
    console.log(`   - Email: admin@example.com`);
    console.log(`   - Password: admin123`);
    console.log(`\n   Customer: http://localhost:3000/signin`);
    console.log(`   - Email: customer1@example.com (hoặc customer2-5)`);
    console.log(`   - Password: customer123`);
    console.log('\n🚀 Bạn có thể chạy "npm start" để khởi động server!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi seed data:", error.message);
    console.error(error);
    process.exit(1);
  }
}

seedData();
