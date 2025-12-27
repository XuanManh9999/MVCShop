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
    const paymentStats = {
      momo: { count: 0, revenue: 0 },
      cash: { count: 0, revenue: 0 },
    };
    orders.forEach((order) => {
      if (order.is_payment) {
        paymentStats.momo.count++;
        paymentStats.momo.revenue += calculateOrderTotal(order);
      } else {
        paymentStats.cash.count++;
        paymentStats.cash.revenue += calculateOrderTotal(order);
      }
    });

    // Thống kê theo ngày (cho biểu đồ)
    const dailyStats = {};
    orders.forEach((order) => {
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

    // Thống kê sản phẩm bán chạy
    const productStats = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const productId = item.prd_id.toString();
        if (!productStats[productId]) {
          productStats[productId] = {
            id: productId,
            name: item.prd_name,
            quantity: 0,
            revenue: 0,
          };
        }
        productStats[productId].quantity += item.prd_qty;
        productStats[productId].revenue += item.prd_price * item.prd_qty;
      });
    });

    const topProducts = Object.values(productStats)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

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
      .slice(0, 10);

    // Đơn hàng gần đây
    const recentOrders = orders.slice(0, 10).map((order) => {
      const orderObj = order.toObject ? order.toObject() : order;
      return {
        ...orderObj,
        total: calculateOrderTotal(order),
      };
    });

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
      dailyStats: sortedDailyStats,
      monthlyStats: sortedMonthlyStats,
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
    res.status(500).send("Lỗi khi tải thống kê");
  }
};

// API trả về dữ liệu cho biểu đồ
const getChartData = async (req, res) => {
  try {
    const { type = "daily", startDate, endDate } = req.query;

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
      dateFilter = {
        createdAt: {
          $gte: new Date(now.getFullYear(), now.getMonth(), 1),
          $lte: now,
        },
      };
    }

    const orders = await orderModel.find(dateFilter);

    let stats = {};

    if (type === "daily") {
      orders.forEach((order) => {
        const dateKey = moment(order.createdAt).format("YYYY-MM-DD");
        if (!stats[dateKey]) {
          stats[dateKey] = { orders: 0, revenue: 0 };
        }
        stats[dateKey].orders++;
        stats[dateKey].revenue += calculateOrderTotal(order);
      });
    } else if (type === "monthly") {
      orders.forEach((order) => {
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
        label:
          type === "daily"
            ? moment(key).format("DD/MM")
            : moment(key + "-01").format("MM/YYYY"),
        orders: stats[key].orders,
        revenue: stats[key].revenue,
      }));

    res.json(sortedStats);
  } catch (error) {
    console.error("Lỗi lấy dữ liệu biểu đồ:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu" });
  }
};

module.exports = {
  index,
  getChartData,
};
