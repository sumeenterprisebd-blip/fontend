import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Breadcrumb from '@/components/shop/Breadcrumb';
import TrackingTimeline from '@/components/orders/TrackingTimeline';
import TrackOrderForm from '@/components/orders/TrackOrderForm';
import OrderSummaryCard from '@/components/orders/OrderSummaryCard';
import TrackOrderItems from '@/components/orders/TrackOrderItems';
import { TrackPageHeader, HelpSection, NoResultsState, InfoCards } from '@/components/orders/TrackPageComponents';
import { ordersAPI } from '@/services/api';
import { trackPurchase } from '@/utils/analytics';
import { useRef } from 'react';

export default function TrackOrder() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [trackingData, setTrackingData] = useState(null);
    const [trackingOrders, setTrackingOrders] = useState([]);
    const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    // Polling interval for near-real-time status updates (reliable on serverless/CDN setups)
    const POLL_MS = 5000;

    useEffect(() => {
        if (router.query.id) {
            setQuery(String(router.query.id));
        }
    }, [router.query.id]);

    // If user is redirected back after payment, attempt to fire browser Purchase event
    // once with dedup event_id when available. Use a localStorage guard to avoid
    // double-firing in the same browser.
    const purchaseFiredRef = useRef(false);
    useEffect(() => {
        const paymentStatus = String(router.query.payment || "").toLowerCase();
        const eventId = String(router.query.event_id || "").trim();
        const orderIdParam = String(router.query.id || "").trim();

        if (paymentStatus !== 'success' || !eventId || !orderIdParam) return;
        if (!trackingData) return;
        if (purchaseFiredRef.current) return;

        const alreadyKey = `fb_purchase_tracked_${orderIdParam}`;
        try {
            if (localStorage.getItem(alreadyKey)) {
                purchaseFiredRef.current = true;
                return;
            }
        } catch (e) {
            // ignore
        }

        if (trackingData.paymentStatus !== 'paid') return;

        try {
            const transactionId = trackingData.orderId || trackingData._id || orderIdParam;
            const value = Number(trackingData.total || 0) || Number(trackingData.totalAmount || 0) || 0;
            const currency = trackingData?.shippingAddress?.currency || trackingData?.currency || 'BDT';
            const items = Array.isArray(trackingData.orderItems) ? trackingData.orderItems.map((it) => ({
                id: it?.product?._id || it?.product || it?.item_id || it?.id,
                item_id: String(it?.product?._id || it?.product || it?.item_id || it?.id || ''),
                item_name: it?.name || it?.productName || '',
                price: Number(it?.price || it?.item_price || 0) || 0,
                quantity: Number(it?.quantity || 1) || 1,
            })) : [];

            trackPurchase({ transactionId, value, currency, items, eventId });

            try {
                localStorage.setItem(alreadyKey, '1');
            } catch (e) {}
            purchaseFiredRef.current = true;
        } catch (e) {
            // ignore analytics failures
        }
    }, [router.query.event_id, router.query.payment, router.query.id, trackingData]);

    // Auto-refresh the currently selected order so admin status changes show up without re-search.
    useEffect(() => {
        if (!trackingData || !hasSearched) return;

        const orderId = trackingData?.orderId || trackingData?._id?.slice?.(-8)?.toUpperCase?.() || '';
        if (!orderId) return;

        let cancelled = false;
        let timeoutId = null;

        const poll = async () => {
            if (cancelled) return;
            try {
                const fresh = await ordersAPI.trackOrder(orderId);
                if (cancelled || !fresh) return;

                // Update selected order
                setTrackingData(fresh);

                // If list view exists (phone search), keep the selected card in sync too
                setTrackingOrders((prev) => {
                    if (!Array.isArray(prev) || prev.length === 0) return prev;
                    const next = [...prev];
                    if (next[selectedOrderIndex]) {
                        next[selectedOrderIndex] = { ...next[selectedOrderIndex], ...fresh };
                    }
                    return next;
                });
            } catch {
                // Silent fail for background polling; user can still refresh manually
            } finally {
                if (!cancelled) {
                    timeoutId = setTimeout(poll, POLL_MS);
                }
            }
        };

        timeoutId = setTimeout(poll, POLL_MS);

        return () => {
            cancelled = true;
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [trackingData?._id, trackingData?.orderId, selectedOrderIndex, hasSearched]);

    const handleTrackOrder = async (e) => {
        e.preventDefault();

        const trimmed = String(query || '').trim();

        // Basic validation: require a reasonably-sized search term
        if (!trimmed) {
            setError('Please enter an Order ID, Invoice ID, or Phone Number');
            return;
        }

        const digitsOnly = trimmed.replace(/[^\d]/g, '');
        const looksLikePhone = /^01[3-9]\d{8}$/.test(digitsOnly) || (digitsOnly.startsWith('8801') && digitsOnly.length === 13);
        const looksLikeShortId = /^[0-9a-fA-F]{8}$/.test(trimmed);
        const looksLikeObjectId = /^[0-9a-fA-F]{24}$/.test(trimmed);
        const looksLikeInvoiceNumber = /\d{3,}\s*$/.test(trimmed);

        if (!looksLikePhone && !looksLikeShortId && !looksLikeObjectId && !looksLikeInvoiceNumber && trimmed.length < 6) {
            setError('Please enter a valid phone number, invoice/order number, or at least 6 characters of an Order ID.');
            return;
        }

        setLoading(true);
        setError('');
        setHasSearched(true);
        setTrackingData(null);
        setTrackingOrders([]);
        setSelectedOrderIndex(0);

        try {
            const response = await ordersAPI.trackOrderSearch(trimmed);
            if (response && Array.isArray(response.orders)) {
                setTrackingOrders(response.orders);
                setSelectedOrderIndex(0);
                setTrackingData(response.orders[0] || null);
            } else {
                setTrackingOrders([]);
                setTrackingData(response);
            }
            setError('');
        } catch (err) {
            setTrackingData(null);
            setTrackingOrders([]);
            if (err.response?.status === 404) {
                setError(err.response?.data?.message || 'Order not found. Try searching by phone number, invoice/order number, full Order ID, or just the last 8 characters.');
            } else if (err.response?.status === 403) {
                setError('This order could not be verified. Please re-check your details and try again.');
            } else if (err.response?.status === 400) {
                setError(err.response?.data?.message || 'Please enter a valid search value.');
            } else {
                setError(err.response?.data?.message || err.message || 'Unable to fetch tracking information. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setQuery('');
        setTrackingData(null);
        setTrackingOrders([]);
        setSelectedOrderIndex(0);
        setError('');
        setHasSearched(false);
    };

    const handleSelectOrder = (index) => {
        const nextIndex = Number(index);
        if (!Number.isFinite(nextIndex)) return;
        const next = trackingOrders[nextIndex];
        if (!next) return;
        setSelectedOrderIndex(nextIndex);
        setTrackingData(next);
    };

    const getStatusLabel = (status) => {
        const s = String(status || '').toLowerCase();
        if (!s) return 'Placed';
        return s
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());
    };

    const getStatusClasses = (status) => {
        const s = String(status || '').toLowerCase();
        if (s.includes('deliver')) return 'bg-green-100 text-green-800';
        if (s.includes('cancel')) return 'bg-red-100 text-red-800';
        if (s.includes('fail') || s.includes('return')) return 'bg-amber-100 text-amber-800';
        if (s.includes('out for')) return 'bg-purple-100 text-purple-800';
        if (s.includes('transit') || s.includes('picked')) return 'bg-blue-100 text-blue-800';
        if (s.includes('confirm')) return 'bg-indigo-100 text-indigo-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Track Order' }]} />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <TrackPageHeader />
                <TrackOrderForm
                    query={query}
                    setQuery={setQuery}
                    loading={loading}
                    error={error}
                    hasSearched={hasSearched}
                    handleTrackOrder={handleTrackOrder}
                    handleReset={handleReset}
                />

                {trackingData && (
                    <div className="space-y-6 animate-slideUp">
                        {trackingOrders.length > 1 && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Orders for this phone number</h2>
                                        <p className="text-sm text-gray-600">Select an order to view parcel tracking and rider details.</p>
                                    </div>
                                    <div className="text-sm text-gray-700">
                                        <span className="font-semibold">{trackingOrders.length}</span> orders found
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {trackingOrders.map((o, idx) => {
                                        const isActive = idx === selectedOrderIndex;
                                        const orderId = o?.orderId || o?._id?.slice(-8)?.toUpperCase() || '';
                                        const createdAt = o?.createdAt || o?.orderDate;
                                        const status = o?.deliveryStatus || o?.orderStatus || 'placed';

                                        return (
                                            <button
                                                key={o?._id || `${orderId}-${idx}`}
                                                type="button"
                                                onClick={() => handleSelectOrder(idx)}
                                                aria-pressed={isActive}
                                                className={`text-left rounded-2xl border px-5 py-4 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/30 ${isActive ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <div className="font-semibold text-gray-900">Order #{orderId || '—'}</div>
                                                        {createdAt && (
                                                            <div className="text-xs text-gray-600 mt-1">
                                                                {new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(status)}`}>
                                                        {getStatusLabel(status)}
                                                    </span>
                                                </div>

                                                <div className="mt-3 grid grid-cols-1 gap-2">
                                                    <div className="text-xs text-gray-700">
                                                        <span className="text-gray-500">Tracking:</span>{' '}
                                                        {o?.pathaoConsignmentId ? (
                                                            <span className="font-mono font-semibold text-gray-900">{o.pathaoConsignmentId}</span>
                                                        ) : (
                                                            <span className="text-gray-600">Not booked yet</span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-700">
                                                        <span className="text-gray-500">Rider:</span>{' '}
                                                        <span className="text-gray-600">Available in Pathao</span>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        <OrderSummaryCard trackingData={trackingData} />
                        <TrackingTimeline
                            currentStatus={trackingData.deliveryStatus || trackingData.orderStatus || 'placed'}
                            trackingHistory={trackingData.trackingHistory || []}
                            lastUpdated={trackingData.lastStatusUpdate || trackingData.updatedAt}
                        />
                        <TrackOrderItems
                            items={trackingData.orderItems}
                            subtotal={trackingData.subtotal}
                            discount={trackingData.discount}
                            deliveryFee={trackingData.deliveryFee}
                            total={trackingData.total}
                        />
                        <HelpSection />
                    </div>
                )}

                {hasSearched && !trackingData && !loading && !error && <NoResultsState />}
                {!hasSearched && <InfoCards />}
            </div>
        </div>
    );
}
