import { useState, useCallback } from "react";

/**
 * useAnalyticsData Hook
 * Responsibility: Manage analytics state only
 * Max Lines: 50-120 ✅
 */
export default function useAnalyticsData() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [generatedAt, setGeneratedAt] = useState(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    deliveredRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    activeCustomers: 0,
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

  const [security, setSecurity] = useState({
    approvalThreshold: 50,
    approvalPendingCount: 0,
    approvalPendingOrders: [],
    riskyOrdersCount: 0,
    riskFlagBreakdown: [],
    suspiciousUsers: 0,
    unverifiedEmailUsers: 0,
    unverifiedPhoneUsers: 0,
    blockedUsers: 0,
    suspendedUsers: 0,
    lowStockProducts: 0,
    lowStockThreshold: 10,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [revenueChartData, setRevenueChartData] = useState({
    labels: [],
    revenueData: [],
  });
  const [ordersChartData, setOrdersChartData] = useState({
    labels: [],
    ordersData: [],
  });

  const updateStats = useCallback((newStats) => {
    setStats(newStats);
  }, []);

  const updateOrders = useCallback((orders) => {
    setRecentOrders(orders);
  }, []);

  const updateProducts = useCallback((products) => {
    setTopProducts(products);
  }, []);

  const updateChartData = useCallback((revenueData, ordersData) => {
    setRevenueChartData(revenueData);
    setOrdersChartData(ordersData);
  }, []);

  const setLoadingState = useCallback((isLoading) => {
    setLoading(isLoading);
  }, []);

  const setUpdatingState = useCallback((isUpdating) => {
    setUpdating(isUpdating);
  }, []);

  const setErrorState = useCallback((err) => {
    setError(err);
  }, []);

  const setMeta = useCallback((meta) => {
    setGeneratedAt(meta?.generatedAt || null);
  }, []);

  const updateSecurity = useCallback((sec) => {
    setSecurity(sec);
  }, []);

  return {
    loading,
    updating,
    error,
    generatedAt,
    stats,
    security,
    recentOrders,
    topProducts,
    revenueChartData,
    ordersChartData,
    updateStats,
    updateSecurity,
    updateOrders,
    updateProducts,
    updateChartData,
    setLoadingState,
    setUpdatingState,
    setErrorState,
    setMeta,
  };
}
