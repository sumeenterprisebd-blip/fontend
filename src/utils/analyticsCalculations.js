/**
 * Analytics Calculation Utilities
 * Responsibility: Data calculations only
 * Max Lines: 20-80 ✅
 */

/**
 * Calculate percentage change between current and previous values
 */
export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Calculate analytics statistics from orders
 */
export const calculateOrderStats = (orders, previousOrders = []) => {
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.totalPrice || 0),
    0
  );
  const totalOrders = orders.length;

  const statusCounts = orders.reduce((acc, order) => {
    const status = order.orderStatus?.toLowerCase() || "pending";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calculate previous period stats
  const prevRevenue = previousOrders.reduce(
    (sum, order) => sum + (order.totalPrice || 0),
    0
  );
  const prevOrders = previousOrders.length;
  const prevAvgOrderValue = prevOrders > 0 ? prevRevenue / prevOrders : 0;

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    pendingOrders: (statusCounts.pending || 0) + (statusCounts.confirmed || 0) + (statusCounts.hold || 0),
    processingOrders: (statusCounts.processing || 0) + (statusCounts.shipped || 0),
    completedOrders: statusCounts.completed || statusCounts.delivered || 0,
    cancelledOrders: (statusCounts.cancelled || 0) + (statusCounts.paid_return || 0),
    revenueChange: calculatePercentageChange(totalRevenue, prevRevenue),
    ordersChange: calculatePercentageChange(totalOrders, prevOrders),
    avgOrderValueChange: calculatePercentageChange(
      averageOrderValue,
      prevAvgOrderValue
    ),
  };
};

/**
 * Calculate user statistics
 */
export const calculateUserStats = (users, previousUsers = []) => {
  const totalUsers = users.length;
  const prevUsers = previousUsers.length;

  return {
    totalUsers,
    usersChange: calculatePercentageChange(totalUsers, prevUsers),
  };
};
