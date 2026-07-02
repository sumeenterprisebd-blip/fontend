import { formatChartDate } from "@/utils/dateFormatter";

/**
 * Analytics Chart Data Service
 * Responsibility: Generate chart data only
 * Max Lines: 50-150 ✅
 */

/**
 * Generate chart data from orders
 */
export const generateChartData = (orders, timeRange) => {
  if (!orders || orders.length === 0) {
    return {
      labels: [],
      revenueData: [],
      ordersData: [],
    };
  }

  // Group orders by date
  const ordersByDate = orders.reduce((acc, order) => {
    const date = formatChartDate(order.createdAt, timeRange);
    if (!acc[date]) {
      acc[date] = { revenue: 0, count: 0 };
    }
    acc[date].revenue += order.totalPrice || 0;
    acc[date].count += 1;
    return acc;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(ordersByDate).sort((a, b) => {
    return new Date(a) - new Date(b);
  });

  // Generate arrays for chart
  const labels = sortedDates;
  const revenueData = sortedDates.map((date) => ordersByDate[date].revenue);
  const ordersData = sortedDates.map((date) => ordersByDate[date].count);

  return {
    labels: labels.slice(-30), // Last 30 data points
    revenueData: revenueData.slice(-30),
    ordersData: ordersData.slice(-30),
  };
};

/**
 * Calculate top products from orders
 */
export const calculateTopProducts = (orders) => {
  if (!orders || orders.length === 0) return [];

  const productStats = {};

  orders.forEach((order) => {
    if (order.orderItems && Array.isArray(order.orderItems)) {
      order.orderItems.forEach((item) => {
        const productId = item.product?._id || item.product;
        if (!productId) return;

        if (!productStats[productId]) {
          productStats[productId] = {
            _id: productId,
            name: item.product?.name || item.name || "Unknown",
            image: item.product?.images?.[0] || item.image || "",
            totalQuantity: 0,
            totalRevenue: 0,
          };
        }

        productStats[productId].totalQuantity += item.quantity || 0;
        productStats[productId].totalRevenue +=
          (item.price || 0) * (item.quantity || 0);
      });
    }
  });

  // Sort by revenue and return top products
  return Object.values(productStats)
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10);
};
