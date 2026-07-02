import { useState, useEffect, useCallback } from "react";
import { productsAPI, ordersAPI, usersAPI } from "@/services/api";
import { formatChartDate } from "@/utils/dateFormatter";

export function useAdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    newUsers: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    processingOrders: 0,
    revenueChange: 0,
    ordersChange: 0,
    usersChange: 0,
    avgOrderValueChange: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [timeRange, setTimeRange] = useState("all");
  const [previousStats, setPreviousStats] = useState(null);
  const [orderStatusBreakdown, setOrderStatusBreakdown] = useState({});
  const [revenueChartData, setRevenueChartData] = useState([]);
  const [ordersChartData, setOrdersChartData] = useState([]);

  const getDateRange = (range) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (range) {
      case "today":
        return { start: today, end: now };
      case "week":
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - 7);
        return { start: weekStart, end: now };
      case "month":
        const monthStart = new Date(today);
        monthStart.setMonth(today.getMonth() - 1);
        return { start: monthStart, end: now };
      default:
        return { start: null, end: null };
    }
  };

  const filterByDateRange = useCallback(
    (data, dateField = "createdAt") => {
      if (timeRange === "all") return data;
      const { start, end } = getDateRange(timeRange);
      return data.filter((item) => {
        const itemDate = new Date(item[dateField]);
        return itemDate >= start && itemDate <= end;
      });
    },
    [timeRange]
  );

  const getPreviousPeriodData = (currentRange) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (currentRange) {
      case "today":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return { start: yesterday, end: today };
      case "week":
        const prevWeekStart = new Date(today);
        prevWeekStart.setDate(today.getDate() - 14);
        const prevWeekEnd = new Date(today);
        prevWeekEnd.setDate(today.getDate() - 7);
        return { start: prevWeekStart, end: prevWeekEnd };
      case "month":
        const prevMonthStart = new Date(today);
        prevMonthStart.setMonth(today.getMonth() - 2);
        const prevMonthEnd = new Date(today);
        prevMonthEnd.setMonth(today.getMonth() - 1);
        return { start: prevMonthStart, end: prevMonthEnd };
      default:
        return { start: null, end: null };
    }
  };

  const calculatePercentageChange = (current, previous) => {
    if (!previous || previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        productsAPI.getProducts({ limit: 1000 }),
        ordersAPI.getOrders(),
        usersAPI.getAllUsers().catch(() => ({ data: { users: [] } })),
      ]);

      const allProducts = productsRes.data.products || [];
      const allOrders = ordersRes.data.orders || [];
      const allUsers = usersRes.data.users || [];

      const filteredOrders = filterByDateRange(allOrders);
      const prevRange = getPreviousPeriodData(timeRange);
      const previousOrders =
        prevRange.start && prevRange.end
          ? allOrders.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= prevRange.start && orderDate <= prevRange.end;
          })
          : [];

      const revenue = filteredOrders.reduce(
        (sum, order) => sum + (order.total || 0),
        0
      );
      const previousRevenue = previousOrders.reduce(
        (sum, order) => sum + (order.total || 0),
        0
      );

      const statusBreakdown = filteredOrders.reduce((acc, order) => {
        const status = order.orderStatus || "unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});
      setOrderStatusBreakdown(statusBreakdown);

      const completedOrders = filteredOrders.filter(
        (o) => o.orderStatus === "delivered"
      ).length;
      const pendingOrders = filteredOrders.filter(
        (o) =>
          o.orderStatus === "pending" ||
          o.orderStatus === "confirmed" ||
          o.orderStatus === "hold"
      ).length;
      const cancelledOrders = filteredOrders.filter(
        (o) => o.orderStatus === "cancelled" || o.orderStatus === "paid_return"
      ).length;
      const processingOrders = filteredOrders.filter(
        (o) => o.orderStatus === "processing" || o.orderStatus === "shipped"
      ).length;

      const averageOrderValue =
        filteredOrders.length > 0 ? revenue / filteredOrders.length : 0;
      const previousAvgOrderValue =
        previousOrders.length > 0
          ? previousOrders.reduce((sum, order) => sum + (order.total || 0), 0) /
          previousOrders.length
          : 0;

      const filteredUsers = filterByDateRange(allUsers);
      const previousUsers =
        prevRange.start && prevRange.end
          ? allUsers.filter((user) => {
            const userDate = new Date(user.createdAt);
            return userDate >= prevRange.start && userDate <= prevRange.end;
          })
          : [];

      const productOrderCount = {};
      filteredOrders.forEach((order) => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item) => {
            const productId = item.product?._id || item.productId;
            if (productId) {
              productOrderCount[productId] =
                (productOrderCount[productId] || 0) + (item.quantity || 1);
            }
          });
        }
      });

      const topProductsBySales = allProducts
        .map((product) => ({
          ...product,
          salesCount: productOrderCount[product._id] || 0,
        }))
        .sort((a, b) => b.salesCount - a.salesCount)
        .slice(0, 5);

      const topProducts = topProductsBySales.some((p) => p.salesCount > 0)
        ? topProductsBySales
        : allProducts
          .filter((p) => p.isActive !== false)
          .sort((a, b) => (b.stock || 0) - (a.stock || 0))
          .slice(0, 5);

      const sortedOrders = [...filteredOrders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);

      const chartDays =
        timeRange === "today"
          ? 1
          : timeRange === "week"
            ? 7
            : timeRange === "month"
              ? 30
              : 7;
      const chartData = [];
      const now = new Date();

      for (let i = chartDays - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayStart = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        );
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);

        const dayOrders = filteredOrders.filter((order) => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= dayStart && orderDate < dayEnd;
        });

        const dayRevenue = dayOrders.reduce(
          (sum, order) => sum + (order.total || 0),
          0
        );

        chartData.push({
          date: formatChartDate(dayStart),
          revenue: dayRevenue,
          orders: dayOrders.length,
        });
      }

      setRevenueChartData(chartData);
      setOrdersChartData(chartData);

      const revenueChange = calculatePercentageChange(revenue, previousRevenue);
      const ordersChange = calculatePercentageChange(
        filteredOrders.length,
        previousOrders.length
      );
      const usersChange = calculatePercentageChange(
        filteredUsers.length,
        previousUsers.length
      );
      const avgOrderValueChange = calculatePercentageChange(
        averageOrderValue,
        previousAvgOrderValue
      );

      setStats({
        totalRevenue: revenue,
        totalOrders: filteredOrders.length,
        totalProducts: allProducts.filter((p) => p.isActive !== false).length,
        totalUsers: allUsers.length,
        newUsers: filteredUsers.length,
        averageOrderValue,
        conversionRate: 0,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        processingOrders,
        revenueChange,
        ordersChange,
        usersChange,
        avgOrderValueChange,
      });

      setPreviousStats({
        revenue: previousRevenue,
        orders: previousOrders.length,
        users: previousUsers.length,
        avgOrderValue: previousAvgOrderValue,
      });

      setTopProducts(topProducts);
      setRecentOrders(sortedOrders);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [timeRange, filterByDateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    loading,
    stats,
    recentOrders,
    topProducts,
    timeRange,
    setTimeRange,
    orderStatusBreakdown,
    revenueChartData,
    ordersChartData,
  };
}
