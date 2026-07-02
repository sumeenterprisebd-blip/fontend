/**
 * Analytics Date Utilities
 * Responsibility: Date range calculations only
 * Max Lines: 20-80 ✅
 */

/**
 * Get date range based on time period
 */
export const getDateRange = (range) => {
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
      return { start: null, end: null }; // All time
  }
};

/**
 * Get previous period date range for comparison
 */
export const getPreviousPeriodRange = (currentRange) => {
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

/**
 * Filter data by date range
 */
export const filterByDateRange = (data, timeRange, dateField = "createdAt") => {
  if (timeRange === "all" || !data) return data;

  const { start, end } = getDateRange(timeRange);
  return data.filter((item) => {
    const itemDate = new Date(item[dateField]);
    return itemDate >= start && itemDate <= end;
  });
};
