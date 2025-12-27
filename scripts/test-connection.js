/**
 * Script kiểm tra kết nối MongoDB Atlas và tự động tạo collections
 * Chạy: node scripts/test-connection.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Import các models để đảm bảo schemas được đăng ký
require('../src/apps/models/product');
require('../src/apps/models/category');
require('../src/apps/models/user');
require('../src/apps/models/customer');
require('../src/apps/models/order');
require('../src/apps/models/comment');
require('../src/apps/models/banner');
require('../src/apps/models/slider');
require('../src/apps/models/config');

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vp_shop_project2';

async function testConnection() {
    try {
        console.log('🔄 Đang kết nối đến MongoDB Atlas...');
        console.log('📍 Connection string:', mongoUri.replace(/:[^:@]+@/, ':****@')); // Ẩn password
        
        await mongoose.connect(mongoUri);
        console.log('✅ Kết nối MongoDB thành công!');
        
        // Lấy danh sách collections hiện có
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        
        console.log('\n📊 Collections hiện có trong database:');
        if (collections.length === 0) {
            console.log('   (Chưa có collections nào - sẽ được tạo tự động khi có dữ liệu)');
        } else {
            collections.forEach((col, index) => {
                console.log(`   ${index + 1}. ${col.name}`);
            });
        }
        
        // Liệt kê các models sẽ được tạo
        console.log('\n📦 Các models sẽ được tạo tự động khi có dữ liệu:');
        const models = [
            'products',
            'categories', 
            'users',
            'customers',
            'orders',
            'comments',
            'banners',
            'sliders',
            'configs'
        ];
        models.forEach((model, index) => {
            const exists = collections.some(col => col.name === model);
            console.log(`   ${index + 1}. ${model} ${exists ? '✅ (đã tồn tại)' : '⏳ (chưa có)'}`);
        });
        
        console.log('\n✨ Kết nối thành công! Bạn có thể chạy "npm start" để khởi động server.');
        
        // Đóng kết nối
        await mongoose.connection.close();
        console.log('🔌 Đã đóng kết nối.');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Lỗi kết nối MongoDB:', error.message);
        console.error('\n💡 Kiểm tra lại:');
        console.error('   1. File .env có MONGODB_URI chưa?');
        console.error('   2. Connection string có đúng format không?');
        console.error('   3. IP address đã được whitelist trong MongoDB Atlas chưa?');
        console.error('   4. Username/password có đúng không?');
        process.exit(1);
    }
}

testConnection();

