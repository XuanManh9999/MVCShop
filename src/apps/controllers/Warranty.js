const warrantyModel = require('../models/warranty');
const orderModel = require('../models/order');
const productModel = require('../models/product');
const moment = require('moment');
const QRCode = require('qrcode');
const crypto = require('crypto');
const config = require('config');

// Tạo QR code cho một item trong đơn hàng
const generateQRCode = async (orderId, itemIndex, productId, req = null) => {
    // Tạo serial number unique
    const serialNumber = `SN-${orderId.toString().slice(-6)}-${itemIndex}-${Date.now()}`;
    
    // Lấy base URL từ request hoặc config
    let baseUrl = 'http://localhost:3000';
    if (req) {
        baseUrl = `${req.protocol}://${req.get('host')}`;
    } else if (process.env.BASE_URL) {
        baseUrl = process.env.BASE_URL;
    }
    
    // Tạo QR code data (URL để check bảo hành)
    const qrData = `${baseUrl}/warranty/check/${serialNumber}`;
    
    // Generate QR code image (base64)
    const qrCodeImage = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        width: 300,
        margin: 1
    });
    
    return {
        serialNumber,
        qrCode: qrCodeImage,
        qrData
    };
};

// Tạo warranty records khi đơn hàng thành công
const createWarrantyRecords = async (order, req = null) => {
    const warrantyRecords = [];
    
    for (let i = 0; i < order.items.length; i++) {
        const item = order.items[i];
        
        // Lấy thông tin sản phẩm để lấy warranty_period
        const product = await productModel.findById(item.prd_id);
        const warrantyPeriod = product?.warranty_period || 12; // Mặc định 12 tháng
        
        // Tính ngày kết thúc bảo hành
        const purchaseDate = order.createdAt || new Date();
        const warrantyEndDate = moment(purchaseDate).add(warrantyPeriod, 'months').toDate();
        
        // Tạo QR code - tạo nhiều warranty records nếu qty > 1
        for (let j = 0; j < item.prd_qty; j++) {
            const { serialNumber, qrCode, qrData } = await generateQRCode(order._id, i, item.prd_id, req);
        
            // Tạo warranty record
            const warranty = new warrantyModel({
                order_id: order._id,
                item_index: i,
                prd_id: item.prd_id,
                prd_name: item.prd_name,
                serial_number: serialNumber,
                qr_code: qrCode,
                purchase_date: purchaseDate,
                warranty_period: warrantyPeriod,
                warranty_end_date: warrantyEndDate,
                customer_name: order.name,
                customer_email: order.email,
                customer_phone: order.phone,
                is_active: true
            });
            
            await warranty.save();
            warrantyRecords.push(warranty);
        }
    }
    
    return warrantyRecords;
};

// Check bảo hành qua QR code (serial number)
const checkWarranty = async (req, res) => {
    try {
        const { serialNumber } = req.params;
        
        // Tìm warranty record
        const warranty = await warrantyModel.findOne({ 
            serial_number: serialNumber,
            is_active: true 
        }).populate('prd_id').populate('order_id');
        
        if (!warranty) {
            return res.render('site/warranty/not-found', {
                serialNumber
            });
        }
        
        // Tính thời gian bảo hành còn lại
        const now = new Date();
        const endDate = new Date(warranty.warranty_end_date);
        const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
        const isExpired = daysRemaining < 0;
        const monthsRemaining = Math.ceil(daysRemaining / 30);
        
        // Tính phần trăm bảo hành còn lại
        const totalDays = Math.ceil((endDate - warranty.purchase_date) / (1000 * 60 * 60 * 24));
        const percentageRemaining = isExpired ? 0 : Math.max(0, Math.min(100, (daysRemaining / totalDays) * 100));
        
        res.render('site/warranty/check', {
            warranty,
            daysRemaining: isExpired ? 0 : daysRemaining,
            monthsRemaining: isExpired ? 0 : monthsRemaining,
            isExpired,
            percentageRemaining,
            moment
        });
    } catch (error) {
        console.error('Lỗi check bảo hành:', error);
        res.status(500).render('site/warranty/error', {
            error: 'Đã xảy ra lỗi khi kiểm tra bảo hành'
        });
    }
};

// API trả về thông tin bảo hành (JSON)
const getWarrantyInfo = async (req, res) => {
    try {
        const { serialNumber } = req.params;
        
        const warranty = await warrantyModel.findOne({ 
            serial_number: serialNumber,
            is_active: true 
        }).populate('prd_id');
        
        if (!warranty) {
            return res.status(404).json({ 
                success: false,
                message: 'Không tìm thấy thông tin bảo hành' 
            });
        }
        
        const now = new Date();
        const endDate = new Date(warranty.warranty_end_date);
        const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
        const isExpired = daysRemaining < 0;
        
        res.json({
            success: true,
            data: {
                serialNumber: warranty.serial_number,
                productName: warranty.prd_name,
                purchaseDate: warranty.purchase_date,
                warrantyEndDate: warranty.warranty_end_date,
                warrantyPeriod: warranty.warranty_period,
                daysRemaining: isExpired ? 0 : daysRemaining,
                isExpired,
                customerName: warranty.customer_name,
                customerEmail: warranty.customer_email,
                customerPhone: warranty.customer_phone
            }
        });
    } catch (error) {
        console.error('Lỗi API bảo hành:', error);
        res.status(500).json({ 
            success: false,
            message: 'Đã xảy ra lỗi' 
        });
    }
};

// Trang tra cứu bảo hành (form nhập Order ID)
const lookupWarranty = (req, res) => {
    res.render('site/warranty/lookup', {
        orderId: req.query.orderId || '',
        error: null
    });
};

// Tra cứu bảo hành theo Order ID
const lookupWarrantyByOrderId = async (req, res) => {
    try {
        const { orderId } = req.body;
        
        if (!orderId || orderId.trim() === '') {
            return res.render('site/warranty/lookup', {
                orderId: '',
                error: 'Vui lòng nhập mã đơn hàng'
            });
        }
        
        // Tìm đơn hàng
        const order = await orderModel.findById(orderId);
        
        if (!order) {
            return res.render('site/warranty/lookup', {
                orderId: orderId,
                error: 'Không tìm thấy đơn hàng với mã này'
            });
        }
        
        // Kiểm tra đơn hàng đã giao hàng chưa
        if (order.status !== 'Đã giao hàng') {
            return res.render('site/warranty/lookup', {
                orderId: orderId,
                error: `Đơn hàng chưa được giao hàng. Trạng thái hiện tại: ${order.status}`
            });
        }
        
        // Lấy tất cả warranty records của đơn hàng
        const warranties = await warrantyModel.find({
            order_id: orderId,
            is_active: true
        }).populate('prd_id').sort({ item_index: 1 });
        
        if (!warranties || warranties.length === 0) {
            return res.render('site/warranty/lookup', {
                orderId: orderId,
                error: 'Đơn hàng này chưa có thông tin bảo hành'
            });
        }
        
        // Tính toán thông tin bảo hành cho từng sản phẩm
        const warrantyInfo = warranties.map(warranty => {
            const now = new Date();
            const endDate = new Date(warranty.warranty_end_date);
            const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
            const isExpired = daysRemaining < 0;
            const monthsRemaining = Math.ceil(daysRemaining / 30);
            
            // Tính phần trăm bảo hành còn lại
            const totalDays = Math.ceil((endDate - warranty.purchase_date) / (1000 * 60 * 60 * 24));
            const percentageRemaining = isExpired ? 0 : Math.max(0, Math.min(100, (daysRemaining / totalDays) * 100));
            
            return {
                warranty,
                daysRemaining: isExpired ? 0 : daysRemaining,
                monthsRemaining: isExpired ? 0 : monthsRemaining,
                isExpired,
                percentageRemaining
            };
        });
        
        res.render('site/warranty/lookup-result', {
            order,
            warrantyInfo,
            moment
        });
        
    } catch (error) {
        console.error('Lỗi tra cứu bảo hành:', error);
        res.render('site/warranty/lookup', {
            orderId: req.body.orderId || '',
            error: 'Mã đơn hàng không hợp lệ hoặc đã xảy ra lỗi'
        });
    }
};

module.exports = {
    createWarrantyRecords,
    checkWarranty,
    getWarrantyInfo,
    lookupWarranty,
    lookupWarrantyByOrderId
};

