import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  FiAlertTriangle,
  FiBarChart2,
  FiCalendar,
  FiCheckCircle,
  FiDollarSign,
  FiHome,
  FiPackage,
  FiRefreshCw,
  FiShoppingCart,
  FiUser,
  FiUsers,
  FiXCircle,
} from "react-icons/fi";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { ordersAPI } from "@/services/api";
import AdminNotificationsPanel from "@/components/admin/AdminNotificationsPanel";

export default function AdminDashboard() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState("week");
  const {
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
  } = useAdminDashboard(timeRange);

  const [actionState, setActionState] = useState({});
  const [actionError, setActionError] = useState("");

  const timeRangeOptions = useMemo(
    () => [
      { value: "today", label: "Today" },
      { value: "week", label: "7 Days" },
      { value: "month", label: "30 Days" },
      { value: "all", label: "All" },
    ],
    []
  );

  const formatMoney = (value) => {
    const n = Number(value || 0);
    return `৳${Number.isFinite(n) ? n.toFixed(2) : "0.00"}`;
  };

  const formatCompactDateLabel = (label) => {
    const s = String(label || "");
    // Expecting YYYY-MM-DD from API. Display MM-DD for compactness.
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s.slice(5);
    return s;
  };

  const getOrderStatusPill = (order) => {
    if (order?.requiresApproval && order?.approval?.status === "pending") {
      return {
        label: "needs approval",
        className: "bg-rose-50 text-rose-700 border border-rose-200",
      };
    }

    const status = String(order?.orderStatus || "").toLowerCase();
    if (status === "delivered") {
      return { label: "delivered", className: "bg-emerald-50 text-emerald-700 border border-emerald-200" };
    }
    if (status === "processing" || status === "shipped") {
      return { label: status || "processing", className: "bg-blue-50 text-blue-700 border border-blue-200" };
    }
    if (status === "confirmed" || status === "hold") {
      return { label: status || "pending", className: "bg-amber-50 text-amber-700 border border-amber-200" };
    }
    if (status === "cancelled" || status === "paid_return") {
      return { label: status, className: "bg-red-50 text-red-700 border border-red-200" };
    }
    return { label: status || "pending", className: "bg-slate-100 text-slate-700 border border-slate-200" };
  };

  const TrendChart = ({
    title,
    labels,
    values,
    valueFormatter,
    barClassName,
    metaRight,
  }) => {
    const safeLabels = Array.isArray(labels) ? labels : [];
    const safeValues = Array.isArray(values) ? values.map((v) => Number(v || 0)) : [];

    const maxPoints = timeRange === "all" ? 30 : 31;
    const slicedLabels = safeLabels.slice(-maxPoints);
    const slicedValues = safeValues.slice(-maxPoints);

    const total = slicedValues.reduce((sum, v) => sum + (Number(v) || 0), 0);
    const peak = slicedValues.reduce((m, v) => (v > m ? v : m), 0);
    const avg = slicedValues.length ? total / slicedValues.length : 0;
    const max = Math.max(peak, 1);

    const tickEvery = slicedLabels.length <= 10 ? 1 : Math.ceil(slicedLabels.length / 6);
    const rangeLabel =
      timeRange === "today"
        ? "Today"
        : timeRange === "week"
          ? "Last 7 days"
          : timeRange === "month"
            ? "Last 30 days"
            : "All time";

    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">{title}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
              <span>
                <span className="font-semibold text-slate-900">Total:</span>{" "}
                {valueFormatter ? valueFormatter(total) : total}
              </span>
              <span>
                <span className="font-semibold text-slate-900">Avg:</span>{" "}
                {valueFormatter ? valueFormatter(avg) : avg.toFixed(2)}
              </span>
              <span>
                <span className="font-semibold text-slate-900">Peak:</span>{" "}
                {valueFormatter ? valueFormatter(peak) : peak}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {metaRight ? (
              <div className="hidden sm:block text-xs text-slate-500">{metaRight}</div>
            ) : null}
            <Link href="/admin/analytics" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Full analytics
            </Link>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <div className="h-44 sm:h-52 flex items-end gap-2 pr-2">
            {slicedLabels.map((label, idx) => {
              const v = slicedValues[idx] ?? 0;
              const heightPct = max > 0 ? Math.max(3, Math.round((v / max) * 100)) : 3;
              const showTick = idx % tickEvery === 0 || idx === slicedLabels.length - 1;
              const tooltipValue = valueFormatter ? valueFormatter(v) : String(v);

              return (
                <div key={`${label}-${idx}`} className="flex flex-col items-center">
                  <div className="group relative h-40 sm:h-48 flex items-end">
                    <div className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 shadow-sm whitespace-nowrap">
                        <div className="text-[11px] text-slate-500">{String(label)}</div>
                        <div className="text-xs font-semibold text-slate-900">{tooltipValue}</div>
                      </div>
                    </div>
                    <div
                      className={`w-3 sm:w-4 rounded-md ${barClassName || "bg-slate-700"} transition-opacity group-hover:opacity-90`}
                      style={{ height: `${heightPct}%` }}
                      aria-label={`${label}: ${tooltipValue}`}
                      role="img"
                    />
                  </div>

                  <div className="mt-2 h-4 text-[10px] text-slate-500">
                    {showTick ? formatCompactDateLabel(label) : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>
            {safeLabels.length
              ? timeRange === "all"
                ? `Showing last ${Math.min(maxPoints, safeLabels.length)} points`
                : `Showing ${Math.min(maxPoints, safeLabels.length)} points`
              : "No chart data"}
          </span>
          <span>{rangeLabel}</span>
        </div>
      </div>
    );
  };

  const handleApprove = async (orderId) => {
    if (!orderId) return;
    setActionError("");
    setActionState((s) => ({ ...s, [orderId]: "approve" }));
    try {
      const res = await ordersAPI.approveOrder(orderId);
      if (!res?.data?.success) {
        throw new Error(res?.data?.message || "Failed to approve order");
      }
      await fetchDashboardData({ silent: true });
    } catch (e) {
      setActionError(e?.response?.data?.message || e?.message || "Failed to approve order");
    } finally {
      setActionState((s) => {
        const next = { ...s };
        delete next[orderId];
        return next;
      });
    }
  };

  const handleReject = async (orderId) => {
    if (!orderId) return;
    setActionError("");
    setActionState((s) => ({ ...s, [orderId]: "reject" }));
    try {
      const res = await ordersAPI.rejectOrder(orderId);
      if (!res?.data?.success) {
        throw new Error(res?.data?.message || "Failed to reject order");
      }
      await fetchDashboardData({ silent: true });
    } catch (e) {
      setActionError(e?.response?.data?.message || e?.message || "Failed to reject order");
    } finally {
      setActionState((s) => {
        const next = { ...s };
        delete next[orderId];
        return next;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex items-center">
            <div className="shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <span className="font-medium">Error:</span> {error}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const overviewCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: FiShoppingCart,
      className: "bg-blue-50 border-blue-200",
      onClick: () => router.push("/admin/orders"),
    },
    {
      title: "Completed Orders",
      value: stats.completedOrders,
      icon: FiCheckCircle,
      className: "bg-emerald-50 border-emerald-200",
      onClick: () => router.push("/admin/orders"),
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: FiBarChart2,
      className: "bg-amber-50 border-amber-200",
      onClick: () => router.push("/admin/orders"),
    },
    {
      title: "Cancelled Orders",
      value: stats.cancelledOrders,
      icon: FiXCircle,
      className: "bg-red-50 border-red-200",
      onClick: () => router.push("/admin/orders"),
    },
    {
      title: "New Customers",
      value: stats.newUsers,
      icon: FiUsers,
      className: "bg-emerald-50 border-emerald-200",
      onClick: () => router.push("/admin/users"),
    },
    {
      title: "Total Sales",
      value: formatMoney(stats.deliveredRevenue),
      subtitle: `Cancelled/Return: ${formatMoney(stats.cancelledRevenue)} • Net Revenue: ${formatMoney(stats.totalRevenue)}`,
      icon: FiDollarSign,
      className: "bg-slate-50 border-slate-200",
      onClick: () => router.push("/admin/analytics"),
    },
    {
      title: "Today’s Sales",
      value: formatMoney(stats.salesToday),
      icon: FiCalendar,
      className: "bg-indigo-50 border-indigo-200",
      onClick: () => setTimeRange("today"),
    },
    {
      title: "This Week’s Sales",
      value: formatMoney(stats.salesWeek),
      icon: FiCalendar,
      className: "bg-purple-50 border-purple-200",
      onClick: () => setTimeRange("week"),
    },
    {
      title: "This Month’s Sales",
      value: formatMoney(stats.salesMonth),
      icon: FiCalendar,
      className: "bg-rose-50 border-rose-200",
      onClick: () => setTimeRange("month"),
    },
  ];

  const operationalCards = [
    {
      title: "Approval Queue",
      value: security.approvalPendingCount,
      icon: FiAlertTriangle,
      className: "bg-rose-50 border-rose-200",
      onClick: () => router.push("/admin/orders"),
    },
    {
      title: "Users",
      value: stats.totalUsers,
      icon: FiUsers,
      className: "bg-slate-50 border-slate-200",
      onClick: () => router.push("/admin/users"),
    },
    {
      title: "Suspicious",
      value: security.suspiciousUsers,
      icon: FiUser,
      className: "bg-red-50 border-red-200",
      onClick: () => router.push("/admin/users?filterSuspicious=yes"),
    },
    {
      title: `Low Stock (<${security.lowStockThreshold})`,
      value: security.lowStockProducts,
      icon: FiPackage,
      className: "bg-emerald-50 border-emerald-200",
      onClick: () => router.push("/admin/products"),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-2xl p-5 sm:p-6 lg:p-8 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Dashboard Overview</h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-200">
              Sales, orders, and operational signals at a glance.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Link
              href="/"
              className="px-3 sm:px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center text-sm"
              title="Go to Homepage"
            >
              <FiHome className="mr-2" size={16} />
              Homepage
            </Link>
            <Link
              href="/admin/orders"
              className="px-3 sm:px-4 py-2 bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-colors flex items-center text-sm font-semibold"
            >
              <FiShoppingCart className="mr-2" size={16} />
              View Orders
            </Link>
            <Link
              href="/admin/products?new=1"
              className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center text-sm font-semibold"
            >
              <FiPackage className="mr-2" size={16} />
              Add Product
            </Link>
            <Link
              href="/admin/users"
              className="px-3 sm:px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center text-sm font-semibold"
            >
              <FiUsers className="mr-2" size={16} />
              Manage Users
            </Link>
            <button
              onClick={() => fetchDashboardData()}
              className="px-3 sm:px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center text-sm"
              title="Refresh"
              type="button"
            >
              <FiRefreshCw className={`mr-2 ${updating ? "animate-spin" : ""}`} size={16} />
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-200">Time range:</span>
            <div className="bg-white/10 rounded-lg p-1 flex gap-1">
              {timeRangeOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTimeRange(opt.value)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${timeRange === opt.value
                    ? "bg-white text-slate-900"
                    : "text-white hover:bg-white/20"
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <Link
              href="/admin/analytics"
              className="text-xs text-slate-200 hover:text-white underline underline-offset-4"
            >
              Full analytics
            </Link>
          </div>
          <div className="text-xs text-slate-200">
            {lastUpdatedAt ? `Last updated: ${lastUpdatedAt.toLocaleString()}` : ""}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {overviewCards.map((card) => (
          <button
            key={card.title}
            type="button"
            onClick={card.onClick}
            className={`text-left rounded-2xl border p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow ${card.className}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-slate-600">{card.title}</p>
                <p className="mt-1 text-xl font-bold text-slate-900">{card.value}</p>
                {card.subtitle ? (
                  <p className="mt-2 text-xs text-slate-600">{card.subtitle}</p>
                ) : null}
              </div>
              <div className="shrink-0 rounded-xl bg-white p-2 border border-slate-200">
                <card.icon className="text-slate-700" size={18} />
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <AdminNotificationsPanel />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <TrendChart
          title="Sales Revenue (Net)"
          labels={revenueChartData?.labels || []}
          values={revenueChartData?.revenueData || []}
          valueFormatter={(v) => formatMoney(v)}
          barClassName="bg-slate-900"
          metaRight="Hover bars for details"
        />
        <TrendChart
          title="Total Orders"
          labels={ordersChartData?.labels || []}
          values={ordersChartData?.ordersData || []}
          valueFormatter={(v) => String(Math.round(Number(v || 0)))}
          barClassName="bg-blue-600"
          metaRight="Hover bars for details"
        />
        <TrendChart
          title="New Customers"
          labels={newUsersChartData?.labels || []}
          values={newUsersChartData?.usersData || []}
          valueFormatter={(v) => String(Math.round(Number(v || 0)))}
          barClassName="bg-emerald-600"
          metaRight="Hover bars for details"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {operationalCards.map((card) => (
          <button
            key={card.title}
            type="button"
            onClick={card.onClick}
            className={`text-left rounded-2xl border p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow ${card.className}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-slate-600">{card.title}</p>
                <p className="mt-1 text-xl font-bold text-slate-900">{card.value}</p>
              </div>
              <div className="shrink-0 rounded-xl bg-white p-2 border border-slate-200">
                <card.icon className="text-slate-700" size={18} />
              </div>
            </div>
          </button>
        ))}
      </div>

      {actionError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {actionError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Pending Approvals</h2>
              <p className="text-xs text-slate-600 mt-1">
                Orders flagged by the anti-fake-order system (threshold: {security.approvalThreshold}).
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Manage
            </Link>
          </div>

          {Array.isArray(security.approvalPendingOrders) && security.approvalPendingOrders.length ? (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-500 border-b">
                    <th className="py-2 pr-4">Order</th>
                    <th className="py-2 pr-4">Customer</th>
                    <th className="py-2 pr-4">Total</th>
                    <th className="py-2 pr-4">Risk</th>
                    <th className="py-2 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {security.approvalPendingOrders.map((o) => {
                    const busy = actionState[o._id];
                    const orderLabel = o.orderNumber ? `#${o.orderNumber}` : String(o._id || "").slice(-8);
                    const name = `${o.shippingAddress?.firstName || ""} ${o.shippingAddress?.lastName || ""}`.trim();
                    const phone = o.shippingAddress?.phone || "";
                    return (
                      <tr key={o._id} className="border-b last:border-b-0">
                        <td className="py-3 pr-4">
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-700 font-medium"
                            onClick={() => router.push(`/admin/orders?orderId=${o._id}`)}
                          >
                            {orderLabel}
                          </button>
                          <div className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleString()}</div>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="text-slate-900">{name || "—"}</div>
                          <div className="text-xs text-slate-500">{phone || "—"}</div>
                        </td>
                        <td className="py-3 pr-4 font-semibold text-slate-900">{formatMoney(o.total)}</td>
                        <td className="py-3 pr-4">
                          <div className="inline-flex items-center gap-2">
                            <span className="px-2 py-1 rounded-full text-xs bg-rose-50 text-rose-700 border border-rose-200">
                              {o.riskScore || 0}
                            </span>
                            <span className="text-xs text-slate-500">
                              {(Array.isArray(o.riskFlags) ? o.riskFlags.slice(0, 2) : []).join(", ")}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleApprove(o._id)}
                              disabled={!!busy}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 inline-flex items-center text-xs font-semibold"
                            >
                              <FiCheckCircle className="mr-1.5" size={14} />
                              {busy === "approve" ? "Approving..." : "Approve"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(o._id)}
                              disabled={!!busy}
                              className="px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 inline-flex items-center text-xs font-semibold"
                            >
                              <FiXCircle className="mr-1.5" size={14} />
                              {busy === "reject" ? "Rejecting..." : "Reject"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-4 text-sm text-slate-600">
              No pending approvals in this time range.
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Risk Signals</h2>
            <Link href="/admin/analytics" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Details
            </Link>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Top risk flags (used to detect fake/duplicate orders).
          </p>

          <div className="mt-4 space-y-2">
            {(Array.isArray(security.riskFlagBreakdown) ? security.riskFlagBreakdown : []).length ? (
              security.riskFlagBreakdown.map((row) => (
                <div key={row.flag} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">{row.flag}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700 border border-slate-200">
                    {row.count}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-600">No risk signals in this range.</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {(Array.isArray(recentOrders) ? recentOrders : []).slice(0, 8).map((o) => {
              const orderLabel = o.orderNumber ? `#${o.orderNumber}` : String(o._id || "").slice(-8);
              const name = `${o.shippingAddress?.firstName || ""} ${o.shippingAddress?.lastName || ""}`.trim();
              const pill = getOrderStatusPill(o);
              return (
                <button
                  key={o._id}
                  type="button"
                  onClick={() => router.push(`/admin/orders?orderId=${o._id}`)}
                  className="w-full text-left rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900">{orderLabel}</div>
                      <div className="text-xs text-slate-600">{name || "—"}</div>
                      <div className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900">{formatMoney(o.total)}</div>
                      <div className={`mt-1 inline-flex items-center text-xs px-2 py-0.5 rounded-full ${pill.className}`}>
                        {pill.label}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Top Selling Products</h2>
              <p className="text-xs text-slate-600 mt-1">Ranked by quantity sold (shows revenue too).</p>
            </div>
            <Link href="/admin/products" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Manage
            </Link>
          </div>

          {(() => {
            const rows = (Array.isArray(topProducts) ? topProducts : []).slice(0, 8);
            const maxQty = rows.reduce((m, r) => {
              const v = Number(r?.totalQuantity || 0);
              return v > m ? v : m;
            }, 0);
            const denom = Math.max(maxQty, 1);

            if (!rows.length) {
              return <div className="mt-4 text-sm text-slate-600">No product data for this range.</div>;
            }

            return (
              <div className="mt-4 space-y-3">
                {rows.map((p) => {
                  const revenue = Number(p?.totalRevenue || 0);
                  const qty = Number(p?.totalQuantity || 0);
                  const widthPct = Math.max(3, Math.round((qty / denom) * 100));

                  return (
                    <div key={p._id} className="rounded-xl border border-slate-200 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 truncate">{p.name || "Unnamed product"}</div>
                          <div className="text-xs text-slate-500 mt-0.5">Qty: {qty}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-semibold text-slate-900">{formatMoney(revenue)}</div>
                          <div className="text-xs text-slate-500">Revenue</div>
                        </div>
                      </div>

                      <div className="mt-3 group relative">
                        <div className="pointer-events-none absolute -top-2 left-2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 shadow-sm whitespace-nowrap">
                            <div className="text-[11px] text-slate-500">{p.name || "Unnamed product"}</div>
                            <div className="text-xs font-semibold text-slate-900">
                              {formatMoney(revenue)} • Qty {qty}
                            </div>
                          </div>
                        </div>

                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${widthPct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </div>

    </div>
  );
}

