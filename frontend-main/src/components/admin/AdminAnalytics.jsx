import { useMemo, useState } from "react";
import { useRouter } from 'next/router';
import { FiAlertTriangle, FiCheckCircle, FiShield, FiXCircle } from "react-icons/fi";
import useAnalytics from '@/hooks/analytics/useAnalytics';
import useTrackingCodes from '@/hooks/analytics/useTrackingCodes';
import useTrackingHealth from "@/hooks/analytics/useTrackingHealth";
import { useAuth } from "@/contexts/AuthContext";
import { ordersAPI } from "@/services/api";
import AnalyticsHeader from './analytics/AnalyticsHeader';
import StatCards from './analytics/StatCards';
import QuickStats from './analytics/QuickStats';
import RevenueChart from './analytics/RevenueChart';
import OrdersChart from './analytics/OrdersChart';
import OrderStatusBreakdown from './analytics/OrderStatusBreakdown';
import TopProducts from './analytics/TopProducts';
import RecentOrdersTable from './analytics/RecentOrdersTable';
import { InfoBanner, HelpSection } from './analytics/InfoSections';
import TrackingCodesConfig from './analytics/TrackingCodesConfig';

/**
 * AdminAnalytics Component
 * Responsibility: Compose analytics dashboard layout and coordinate child components
 */
export default function AdminAnalytics() {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";
    const router = useRouter();
    const [timeRange, setTimeRange] = useState('week');
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
        refreshAnalytics,
    } = useAnalytics(timeRange);
    const {
        trackingCodes,
        handleChange: handleTrackingCodeChange,
        handleSave: handleSaveTrackingCodes,
        saving: savingCodes,
        message: codeMessage,
        errors: trackingErrors,
        extractGtmId,
        extractFacebookPixelId,
        extractGaMeasurementId,
        extractClarityProjectId,
        validateTrackingCodes,
    } = useTrackingCodes();

    const trackingHealth = useTrackingHealth(trackingCodes);

    const trackingValidation = useMemo(() => {
        try {
            return validateTrackingCodes(trackingCodes);
        } catch {
            return { isValid: true };
        }
    }, [trackingCodes, validateTrackingCodes]);

    const detectedGtmId = useMemo(() => {
        try {
            return extractGtmId(trackingCodes?.gtmId);
        } catch {
            return "";
        }
    }, [trackingCodes?.gtmId, extractGtmId]);

    const detectedPixelId = useMemo(() => {
        try {
            return extractFacebookPixelId(trackingCodes?.facebookPixelId);
        } catch {
            return "";
        }
    }, [trackingCodes?.facebookPixelId, extractFacebookPixelId]);

    const detectedGaId = useMemo(() => {
        try {
            return extractGaMeasurementId(trackingCodes?.googleAnalyticsMeasurementId);
        } catch {
            return "";
        }
    }, [trackingCodes?.googleAnalyticsMeasurementId, extractGaMeasurementId]);

    const detectedClarityId = useMemo(() => {
        try {
            return extractClarityProjectId(trackingCodes?.microsoftClarityProjectId);
        } catch {
            return "";
        }
    }, [trackingCodes?.microsoftClarityProjectId, extractClarityProjectId]);

    const normalizeOnBlur = (field) => {
        if (!field) return;

        const rawByField = {
            gtmId: String(trackingCodes?.gtmId || "").trim(),
            facebookPixelId: String(trackingCodes?.facebookPixelId || "").trim(),
            googleAnalyticsMeasurementId: String(trackingCodes?.googleAnalyticsMeasurementId || "").trim(),
            microsoftClarityProjectId: String(trackingCodes?.microsoftClarityProjectId || "").trim(),
        };

        const detectedByField = {
            gtmId: detectedGtmId,
            facebookPixelId: detectedPixelId,
            googleAnalyticsMeasurementId: detectedGaId,
            microsoftClarityProjectId: detectedClarityId,
        };

        const raw = rawByField[field] || "";
        const detected = detectedByField[field] || "";
        if (!raw) return;
        if (detected && raw !== detected) {
            handleTrackingCodeChange(field, detected);
        }
    };

    const [actionState, setActionState] = useState({});
    const [actionError, setActionError] = useState("");

    const lastUpdatedLabel = useMemo(() => {
        if (!generatedAt) return "";
        const d = new Date(generatedAt);
        if (Number.isNaN(d.getTime())) return "";
        return d.toLocaleString();
    }, [generatedAt]);

    const formatMoney = (value) => {
        const n = Number(value || 0);
        return `৳${Number.isFinite(n) ? n.toFixed(2) : "0.00"}`;
    };

    const handleApprove = async (orderId) => {
        if (!orderId || !isAdmin) return;
        setActionError("");
        setActionState((s) => ({ ...s, [orderId]: "approve" }));
        try {
            const res = await ordersAPI.approveOrder(orderId);
            if (!res?.data?.success) {
                throw new Error(res?.data?.message || "Failed to approve order");
            }
            await refreshAnalytics({ silent: true });
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
        if (!orderId || !isAdmin) return;
        setActionError("");
        setActionState((s) => ({ ...s, [orderId]: "reject" }));
        try {
            const res = await ordersAPI.rejectOrder(orderId);
            if (!res?.data?.success) {
                throw new Error(res?.data?.message || "Failed to reject order");
            }
            await refreshAnalytics({ silent: true });
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
            <div className="space-y-4">
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                    <div className="flex items-center">
                        <div className="ml-3">
                            <p className="text-sm text-red-700">
                                <span className="font-medium">Error:</span> {error}
                            </p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => router.reload()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
                    <AnalyticsHeader timeRange={timeRange} onTimeRangeChange={setTimeRange} />
                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="text-xs text-gray-500">
                            {lastUpdatedLabel ? `Last updated: ${lastUpdatedLabel}` : ""}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border ${updating ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}>
                                <span className={`h-2 w-2 rounded-full ${updating ? "bg-blue-600" : "bg-gray-400"}`}></span>
                                {updating ? "Updating" : "Live"}
                            </span>
                            <span className="hidden sm:inline">Auto-refresh every 15s</span>
                        </div>
                    </div>
                </div>
                <StatCards stats={stats} timeRange={timeRange} />
                <QuickStats stats={stats} />

                {/* Fraud / Verification Monitoring */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-slate-100">
                                <FiShield className="text-slate-700" size={18} />
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Fraud & Verification Monitoring</h2>
                                <p className="text-xs sm:text-sm text-gray-500">Real-time signals used to reduce fake/duplicate orders.</p>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500">Approval threshold: {security?.approvalThreshold ?? 50}</div>
                    </div>

                    {actionError ? (
                        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
                            {actionError}
                        </div>
                    ) : null}

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                            <p className="text-xs text-rose-700">Approval Queue</p>
                            <p className="text-2xl font-bold text-rose-900 mt-1">{security?.approvalPendingCount || 0}</p>
                            <p className="text-xs text-rose-700 mt-2">High-risk orders awaiting approval</p>
                        </div>
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                            <p className="text-xs text-amber-700">Delivered Sales</p>
                            <p className="text-2xl font-bold text-amber-900 mt-1">{formatMoney(stats?.deliveredRevenue || 0)}</p>
                            <p className="text-xs text-amber-700 mt-2">Revenue from delivered orders</p>
                        </div>
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                            <p className="text-xs text-red-700">Suspicious Users</p>
                            <p className="text-2xl font-bold text-red-900 mt-1">{security?.suspiciousUsers || 0}</p>
                            <p className="text-xs text-red-700 mt-2">Flagged for duplicate / risky behavior</p>
                        </div>
                        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                            <p className="text-xs text-indigo-700">Unverified (Email/Phone)</p>
                            <p className="text-2xl font-bold text-indigo-900 mt-1">{(security?.unverifiedEmailUsers || 0) + (security?.unverifiedPhoneUsers || 0)}</p>
                            <p className="text-xs text-indigo-700 mt-2">Verification gaps increase order risk</p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div className="lg:col-span-2">
                            <h3 className="text-sm font-semibold text-gray-900">Pending Approvals (Top 10)</h3>
                            <p className="text-xs text-gray-500 mt-1">Admins can approve/reject here; moderators have read-only view.</p>

                            {Array.isArray(security?.approvalPendingOrders) && security.approvalPendingOrders.length ? (
                                <div className="mt-3 overflow-x-auto border border-gray-200 rounded-xl">
                                    <table className="min-w-full text-sm">
                                        <thead className="bg-gray-50">
                                            <tr className="text-left text-xs text-gray-600">
                                                <th className="px-4 py-3">Order</th>
                                                <th className="px-4 py-3">Customer</th>
                                                <th className="px-4 py-3">Total</th>
                                                <th className="px-4 py-3">Risk</th>
                                                <th className="px-4 py-3">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {security.approvalPendingOrders.map((o) => {
                                                const busy = actionState[o._id];
                                                const orderLabel = o.orderNumber ? `#${o.orderNumber}` : (o._id || "").toString().slice(-6).toUpperCase();
                                                const name = [o.shippingAddress?.firstName, o.shippingAddress?.lastName].filter(Boolean).join(" ") || "N/A";
                                                const phone = o.shippingAddress?.phone || "";
                                                const flags = Array.isArray(o.riskFlags) ? o.riskFlags : [];

                                                return (
                                                    <tr key={o._id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 font-medium text-gray-900">
                                                            <button
                                                                type="button"
                                                                onClick={() => router.push(`/admin/orders?orderId=${o._id}`)}
                                                                className="text-blue-600 hover:text-blue-800"
                                                            >
                                                                {orderLabel}
                                                            </button>
                                                            <div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="text-gray-900">{name}</div>
                                                            <div className="text-xs text-gray-500">{phone || "—"}</div>
                                                        </td>
                                                        <td className="px-4 py-3 font-semibold text-gray-900">{formatMoney(o.total)}</td>
                                                        <td className="px-4 py-3">
                                                            <div className="inline-flex items-center gap-2">
                                                                <span className="px-2 py-1 rounded-full text-xs bg-rose-50 text-rose-700 border border-rose-200">
                                                                    {o.riskScore || 0}
                                                                </span>
                                                                <span className="text-xs text-gray-500">{flags.slice(0, 2).join(", ")}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {isAdmin ? (
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
                                                            ) : (
                                                                <span className="text-xs text-gray-500">Admin only</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="mt-3 text-sm text-gray-600">No pending approvals for this time range.</div>
                            )}
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Top Risk Flags</h3>
                            <p className="text-xs text-gray-500 mt-1">Most frequent reasons orders are flagged.</p>
                            <div className="mt-3 space-y-2">
                                {Array.isArray(security?.riskFlagBreakdown) && security.riskFlagBreakdown.length ? (
                                    security.riskFlagBreakdown.map((row) => (
                                        <div key={row.flag} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                                            <div className="text-sm text-gray-800">{row.flag}</div>
                                            <div className="text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-full px-2 py-0.5">
                                                {row.count}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-gray-600">No risk flags in this range.</div>
                                )}

                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 mt-4">
                                    <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
                                        <FiAlertTriangle size={16} className="text-amber-600" />
                                        Operational Notes
                                    </div>
                                    <ul className="mt-2 text-xs text-gray-600 space-y-1">
                                        <li>• Require login to place orders (already enforced)</li>
                                        <li>• Optional: require verified accounts via env flag</li>
                                        <li>• High-risk orders may require approval before processing</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <InfoBanner />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <RevenueChart chartData={revenueChartData} />
                    <OrdersChart chartData={ordersChartData} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <OrderStatusBreakdown stats={stats} />
                    <TopProducts products={topProducts} />
                </div>
                <RecentOrdersTable
                    orders={recentOrders}
                    onViewOrder={(orderId) => router.push(`/admin/orders?orderId=${orderId}`)}
                />
                <HelpSection />
                <TrackingCodesConfig
                    trackingCodes={trackingCodes}
                    onCodeChange={handleTrackingCodeChange}
                    onNormalize={normalizeOnBlur}
                    onSave={handleSaveTrackingCodes}
                    saving={savingCodes}
                    message={codeMessage}
                    errors={trackingErrors}
                    detectedGtmId={detectedGtmId}
                    isValid={Boolean(trackingValidation?.isValid)}
                    validation={trackingValidation}
                    health={trackingHealth}
                />
            </div>
        </div>
    );
}
