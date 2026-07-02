import { useCallback, useEffect, useRef, useState } from "react";
import { adminAnalyticsAPI } from "@/services/api";

export function useAdminDashboard(timeRange = "week") {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    netRevenue: 0,
    deliveredRevenue: 0,
    cancelledRevenue: 0,
    grossRevenue: 0,
    totalUsers: 0,
    newUsers: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    averageOrderValue: 0,
    salesToday: 0,
    salesWeek: 0,
    salesMonth: 0,
    salesSummary: {},
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

  const [revenueChartData, setRevenueChartData] = useState({ labels: [], revenueData: [] });
  const [ordersChartData, setOrdersChartData] = useState({ labels: [], ordersData: [] });
  const [newUsersChartData, setNewUsersChartData] = useState({ labels: [], usersData: [] });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  const inFlightRef = useRef(false);

  const fetchDashboardData = useCallback(
    async (options = {}) => {
      const { silent = false } = options;
      if (inFlightRef.current) return;
      inFlightRef.current = true;

      try {
        if (!silent) setLoading(true);
        else setUpdating(true);

        const res = await adminAnalyticsAPI.getAnalytics({ timeRange });
        const payload = res?.data || {};

        setStats(payload.stats || {});
        setSecurity(payload.security || {});
        setRecentOrders(Array.isArray(payload.recentOrders) ? payload.recentOrders : []);
        setTopProducts(Array.isArray(payload.topProducts) ? payload.topProducts : []);

        setRevenueChartData(payload.revenueChartData || { labels: [], revenueData: [] });
        setOrdersChartData(payload.ordersChartData || { labels: [], ordersData: [] });
        setNewUsersChartData(payload.newUsersChartData || { labels: [], usersData: [] });

        const generatedAt = payload.generatedAt ? new Date(payload.generatedAt) : new Date();
        setLastUpdatedAt(Number.isNaN(generatedAt.getTime()) ? new Date() : generatedAt);
        setError(null);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || "Failed to load dashboard data");
      } finally {
        inFlightRef.current = false;
        setLoading(false);
        setUpdating(false);
      }
    },
    [timeRange]
  );

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    const refreshIntervalMs = 15000;
    const timer = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
      fetchDashboardData({ silent: true });
    }, refreshIntervalMs);

    return () => clearInterval(timer);
  }, [fetchDashboardData]);

  return {
    stats,
    security,
    recentOrders,
    topProducts,
    revenueChartData,
    ordersChartData,
    newUsersChartData,
    loading,
    updating,
    error,
    lastUpdatedAt,
    fetchDashboardData,
  };
}

