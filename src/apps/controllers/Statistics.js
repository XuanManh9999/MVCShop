const orderModel = require("../models/order");
const productModel = require("../models/product");
const customerModel = require("../models/customer");
const moment = require("moment");

// Hàm tính tổng tiền của đơn hàng
const calculateOrderTotal = (order) => {
  return order.items.reduce((total, item) => {
    return total + item.prd_price * item.prd_qty;
  }, 0);
};

// Thống kê tổng quan
const index = async (req, res) => {
  try {
    const { period = "all", startDate, endDate } = req.query;

    // Xác định khoảng thời gian
    let dateFilter = {};
    let periodLabel = "Tất cả";

    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate + "T23:59:59"),
        },
      };
      periodLabel = `Từ ${moment(startDate).format("DD/MM/YYYY")} đến ${moment(
        endDate
      ).format("DD/MM/YYYY")}`;
    } else {
      const now = new Date();
      switch (period) {
        case "today":
          dateFilter = {
            createdAt: {
              $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
              $lte: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                23,
                59,
                59
              ),
            },
          };
          periodLabel = "Hôm nay";
          break;
        case "week":
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          weekStart.setHours(0, 0, 0, 0);
          dateFilter = {
            createdAt: { $gte: weekStart, $lte: now },
          };
          periodLabel = "Tuần này";
          break;
        case "month":
          dateFilter = {
            createdAt: {
              $gte: new Date(now.getFullYear(), now.getMonth(), 1),
              $lte: now,
            },
          };
          periodLabel = "Tháng này";
          break;
        case "year":
          dateFilter = {
            createdAt: {
              $gte: new Date(now.getFullYear(), 0, 1),
              $lte: now,
            },
          };
          periodLabel = "Năm nay";
          break;
        case "all":
          dateFilter = {};
          periodLabel = "Tất cả";
          break;
      }
    }

    // Lấy tất cả đơn hàng trong khoảng thời gian
    const orders = await orderModel.find(dateFilter).sort({ createdAt: -1 });

    // Tính toán thống kê tổng quan
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + calculateOrderTotal(order),
      0
    );
    const paidOrders = orders.filter((order) => order.is_payment).length;
    const unpaidOrders = totalOrders - paidOrders;
    const paidRevenue = orders
      .filter((order) => order.is_payment)
      .reduce((sum, order) => sum + calculateOrderTotal(order), 0);

    // Thống kê theo trạng thái
    const statusStats = {};
    orders.forEach((order) => {
      const status = order.status || "Chưa xác định";
      if (!statusStats[status]) {
        statusStats[status] = { count: 0, revenue: 0 };
      }
      statusStats[status].count++;
      statusStats[status].revenue += calculateOrderTotal(order);
    });

    // Thống kê theo phương thức thanh toán
    // Logic: is_payment = true => MoMo, is_payment = false => Tiền mặt
    const paymentStats = {
      momo: { count: 0, revenue: 0 },
      cash: { count: 0, revenue: 0 },
    };
    orders.forEach((order) => {
      const orderTotal = calculateOrderTotal(order);
      if (order.is_payment === true) {
        paymentStats.momo.count++;
        paymentStats.momo.revenue += orderTotal;
      } else {
        paymentStats.cash.count++;
        paymentStats.cash.revenue += orderTotal;
      }
    });

    // Thống kê theo ngày (cho biểu đồ)
    const dailyStats = {};
    orders.forEach((order) => {
      if (!order.createdAt) {
        // console.warn('⚠️ Order không có createdAt:', order._id);
        return;
      }
      const dateKey = moment(order.createdAt).format("YYYY-MM-DD");
      if (!dailyStats[dateKey]) {
        dailyStats[dateKey] = { orders: 0, revenue: 0 };
      }
      dailyStats[dateKey].orders++;
      dailyStats[dateKey].revenue += calculateOrderTotal(order);
    });

    // Sắp xếp theo ngày
    const sortedDailyStats = Object.keys(dailyStats)
      .sort()
      .map((date) => ({
        date,
        dateLabel: moment(date).format("DD/MM/YYYY"),
        orders: dailyStats[date].orders,
        revenue: dailyStats[date].revenue,
      }));

    // Debug log (commented out to avoid header errors)
    // console.log('📊 Statistics Controller - Total orders:', orders.length);
    // console.log('📊 Statistics Controller - Daily stats keys:', Object.keys(dailyStats).length);
    // console.log('📊 Statistics Controller - Sorted daily stats:', sortedDailyStats.length);
    // if (sortedDailyStats.length > 0) {
    //   console.log('📊 Statistics Controller - Sample:', sortedDailyStats[0]);
    // }

    // Thống kê sản phẩm bán chạy
    const productStats = {};
    orders.forEach((order) => {
      const orderItems = order.items || [];
      orderItems.forEach((item) => {
        const productId = item.prd_id ? item.prd_id.toString() : (item.prd_id || '');
        if (!productStats[productId]) {
          productStats[productId] = {
            id: productId || '',
            name: item.prd_name || 'Sản phẩm không xác định',
            quantity: 0,
            revenue: 0,
          };
        }
        productStats[productId].quantity += item.prd_qty || 0;
        productStats[productId].revenue += (item.prd_price || 0) * (item.prd_qty || 0);
      });
    });

    const topProducts = Object.values(productStats)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10)
      .map(product => ({
        id: product.id || '',
        name: product.name || '',
        quantity: product.quantity || 0,
        revenue: product.revenue || 0
      }));

    // Thống kê theo tháng (cho biểu đồ năm)
    const monthlyStats = {};
    orders.forEach((order) => {
      const monthKey = moment(order.createdAt).format("YYYY-MM");
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = { orders: 0, revenue: 0 };
      }
      monthlyStats[monthKey].orders++;
      monthlyStats[monthKey].revenue += calculateOrderTotal(order);
    });

    const sortedMonthlyStats = Object.keys(monthlyStats)
      .sort()
      .map((month) => ({
        month,
        monthLabel: moment(month + "-01").format("MM/YYYY"),
        orders: monthlyStats[month].orders,
        revenue: monthlyStats[month].revenue,
      }));

    // Thống kê khách hàng
    const customerStats = {};
    orders.forEach((order) => {
      const email = order.email;
      if (!customerStats[email]) {
        customerStats[email] = {
          email,
          name: order.name,
          orders: 0,
          revenue: 0,
        };
      }
      customerStats[email].orders++;
      customerStats[email].revenue += calculateOrderTotal(order);
    });

    const topCustomers = Object.values(customerStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
      .map(customer => ({
        email: customer.email || '',
        name: customer.name || '',
        orders: customer.orders || 0,
        revenue: customer.revenue || 0
      }));

    // Đơn hàng gần đây - đảm bảo serialize đúng
    const recentOrders = orders.slice(0, 10).map((order) => {
      const orderObj = order.toObject ? order.toObject() : order;
      return {
        _id: orderObj._id ? orderObj._id.toString() : null,
        name: orderObj.name || '',
        email: orderObj.email || '',
        phone: orderObj.phone || '',
        address: orderObj.address || '',
        status: orderObj.status || '',
        is_payment: orderObj.is_payment || false,
        createdAt: orderObj.createdAt ? new Date(orderObj.createdAt).toISOString() : null,
        items: orderObj.items ? orderObj.items.map(item => ({
          prd_id: item.prd_id ? item.prd_id.toString() : null,
          prd_name: item.prd_name || '',
          prd_price: item.prd_price || 0,
          prd_qty: item.prd_qty || 0
        })) : [],
        total: calculateOrderTotal(order),
      };
    });

    // Đảm bảo tất cả dữ liệu đều có thể serialize được
    const safeDailyStats = sortedDailyStats.map(stat => ({
      date: stat.date,
      dateLabel: stat.dateLabel,
      orders: stat.orders,
      revenue: stat.revenue
    }));

    const safeMonthlyStats = sortedMonthlyStats.map(stat => ({
      month: stat.month,
      monthLabel: stat.monthLabel,
      orders: stat.orders,
      revenue: stat.revenue
    }));

    res.render("admin/statistics/index", {
      // Tổng quan
      totalOrders,
      totalRevenue,
      paidOrders,
      unpaidOrders,
      paidRevenue,
      periodLabel,
      period,

      // Thống kê chi tiết
      statusStats,
      paymentStats,
      dailyStats: safeDailyStats,
      monthlyStats: safeMonthlyStats,
      topProducts,
      topCustomers,
      recentOrders,

      // Filter
      startDate: startDate || "",
      endDate: endDate || "",
      moment,
    });
  } catch (error) {
    console.error("Lỗi thống kê:", error);
    // Kiểm tra xem response đã được gửi chưa
    if (!res.headersSent) {
      res.status(500).send("Lỗi khi tải thống kê");
    }
  }
};

// API trả về dữ liệu cho biểu đồ
const getChartData = async (req, res) => {
  try {
    const { type = "daily", startDate, endDate, period = "all" } = req.query;

    // Xác định khoảng thời gian (giống như trong index)
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate + "T23:59:59"),
        },
      };
    } else {
      const now = new Date();
      switch (period) {
        case "today":
          dateFilter = {
            createdAt: {
              $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
              $lte: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                23,
                59,
                59
              ),
            },
          };
          break;
        case "week":
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          weekStart.setHours(0, 0, 0, 0);
          dateFilter = {
            createdAt: { $gte: weekStart, $lte: now },
          };
          break;
        case "month":
          dateFilter = {
            createdAt: {
              $gte: new Date(now.getFullYear(), now.getMonth(), 1),
              $lte: now,
            },
          };
          break;
        case "year":
          dateFilter = {
            createdAt: {
              $gte: new Date(now.getFullYear(), 0, 1),
              $lte: now,
            },
          };
          break;
        case "all":
        default:
          dateFilter = {};
          break;
      }
    }

    const orders = await orderModel.find(dateFilter);

    // Dữ liệu cho biểu đồ doanh thu và đơn hàng
    let stats = {};

    if (type === "daily") {
      orders.forEach((order) => {
        if (!order.createdAt) return;
        const dateKey = moment(order.createdAt).format("YYYY-MM-DD");
        if (!stats[dateKey]) {
          stats[dateKey] = { orders: 0, revenue: 0 };
        }
        stats[dateKey].orders++;
        stats[dateKey].revenue += calculateOrderTotal(order);
      });
    } else if (type === "monthly") {
      orders.forEach((order) => {
        if (!order.createdAt) return;
        const monthKey = moment(order.createdAt).format("YYYY-MM");
        if (!stats[monthKey]) {
          stats[monthKey] = { orders: 0, revenue: 0 };
        }
        stats[monthKey].orders++;
        stats[monthKey].revenue += calculateOrderTotal(order);
      });
    }

    const sortedStats = Object.keys(stats)
      .sort()
      .map((key) => ({
        date: key,
        dateLabel:
          type === "daily"
            ? moment(key).format("DD/MM/YYYY")
            : moment(key + "-01").format("MM/YYYY"),
        orders: stats[key].orders,
        revenue: stats[key].revenue,
      }));

    // Dữ liệu cho biểu đồ phương thức thanh toán
    const paymentStats = {
      momo: { count: 0, revenue: 0 },
      cash: { count: 0, revenue: 0 },
    };
    orders.forEach((order) => {
      const orderTotal = calculateOrderTotal(order);
      if (order.is_payment === true) {
        paymentStats.momo.count++;
        paymentStats.momo.revenue += orderTotal;
      } else {
        paymentStats.cash.count++;
        paymentStats.cash.revenue += orderTotal;
      }
    });

    // Kiểm tra xem response đã được gửi chưa
    if (!res.headersSent) {
      res.json({
        chartData: sortedStats,
        paymentStats: paymentStats,
      });
    }
  } catch (error) {
    console.error("Lỗi lấy dữ liệu biểu đồ:", error);
    // Kiểm tra xem response đã được gửi chưa
    if (!res.headersSent) {
      res.status(500).json({ error: "Lỗi khi lấy dữ liệu" });
    }
  }
};

module.exports = {
  index,
  getChartData,
};
