import { useCallback, useEffect, useRef } from "react";
import { adminAnalyticsAPI } from "@/services/api";
import useAnalyticsData from "./useAnalyticsData";

/**
 * useAnalytics Hook
 * Responsibility: Coordinate data fetching only
 * Max Lines: 50-120 ✅
 */
export default function useAnalytics(timeRange) {
  const {
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
  } = useAnalyticsData();

  const inFlightRef = useRef(false);

  const fetchAnalytics = useCallback(async (options = {}) => {
    const { silent = false } = options;
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    try {
      if (!silent) {
        setLoadingState(true);
      } else {
        setUpdatingState(true);
      }

      setErrorState(null);

      const res = await adminAnalyticsAPI.getAnalytics({ timeRange });
      const payload = res?.data || {};

      updateStats(payload.stats || {});
      updateSecurity(payload.security || {});
      setMeta({ generatedAt: payload.generatedAt || null });
      updateOrders(Array.isArray(payload.recentOrders) ? payload.recentOrders : []);
      updateProducts(Array.isArray(payload.topProducts) ? payload.topProducts : []);
      updateChartData(
        payload.revenueChartData || { labels: [], revenueData: [] },
        payload.ordersChartData || { labels: [], ordersData: [] }
      );
    } catch (err) {
      setErrorState(err?.response?.data?.message || err?.message || "Failed to load analytics");
    } finally {
      inFlightRef.current = false;
      setLoadingState(false);
      setUpdatingState(false);
    }
  }, [setErrorState, setLoadingState, setMeta, setUpdatingState, timeRange, updateChartData, updateOrders, updateProducts, updateSecurity, updateStats]);

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  useEffect(() => {
    const refreshIntervalMs = 15000;
    const timer = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
      fetchAnalytics({ silent: true });
    }, refreshIntervalMs);

    return () => clearInterval(timer);
  }, [fetchAnalytics]);

  // Optionally, return analytics state if needed
  // return { loading, error, stats, recentOrders, topProducts, revenueChartData, ordersChartData };

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
    refreshAnalytics: fetchAnalytics,
  };
}
