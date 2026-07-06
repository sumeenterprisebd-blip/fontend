import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Breadcrumb from '@/components/shop/Breadcrumb';
import SEO from '@/components/shared/SEO';
import { ordersAPI } from '@/services/api';
import { formatDateWithMonth } from '@/utils/dateFormatter';
import { trackPurchase } from '@/utils/analytics';
import Link from 'next/link';

/**
 * Order Success Page - Public page that doesn't require authentication
 * Uses public order tracking API to display order confirmation
 */
export default function OrderSuccessPage() {
  const router = useRouter();
  const { id, event_id } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchaseTracked, setPurchaseTracked] = useState(false);

  useEffect(() => {
    // Wait for router to be ready before attempting to fetch
    if (!router.isReady) {
      console.log('[ORDER_SUCCESS_ROUTER_NOT_READY]', { timestamp: new Date().toISOString() });
      return;
    }

    if (!id) {
      console.log('[ORDER_SUCCESS_NO_ID]', { 
        timestamp: new Date().toISOString(),
        routerQuery: router.query 
      });
      setLoading(false);
      setError('Order ID not found. Please check your order confirmation email.');
      return;
    }

    const fetchOrder = async () => {
      console.log('[ORDER_SUCCESS_FETCH_START]', {
        timestamp: new Date().toISOString(),
        orderId: String(id),
        eventId: String(event_id || ''),
      });

      setLoading(true);
      setError('');

      try {
        const orderIdStr = String(id);
        console.log('[ORDER_SUCCESS_CALLING_API]', {
          timestamp: new Date().toISOString(),
          orderId: orderIdStr,
          endpoint: `/orders/track/${orderIdStr}`,
        });

        const response = await ordersAPI.trackOrder(orderIdStr);

        const data = response?.data?.data || response?.data || response;
        console.log('[ORDER_SUCCESS_API_RESPONSE]', {
          timestamp: new Date().toISOString(),
          orderId: orderIdStr,
          rawResponse: response,
          dataKeys: data ? Object.keys(data) : [],
        });

        if (data && (data._id || data.orderId || data.orderNumber)) {
          console.log('[ORDER_SUCCESS_ORDER_FOUND]', {
            timestamp: new Date().toISOString(),
            orderId: orderIdStr,
            foundOrderId: data._id || data.orderId || data.orderNumber,
            orderNumber: data.orderNumber,
          });
          setOrder(data);
        } else if (data) {
          console.log('[ORDER_SUCCESS_ORDER_PARTIAL]', {
            timestamp: new Date().toISOString(),
            orderId: orderIdStr,
            dataKeys: Object.keys(data || {}),
          });
          setOrder(data);
        } else {
          console.log('[ORDER_SUCCESS_NO_DATA]', {
            timestamp: new Date().toISOString(),
            orderId: orderIdStr,
            response,
          });
          setError('Order data not found. Please try again later.');
        }
      } catch (err) {
        console.error('[ORDER_SUCCESS_FETCH_ERROR]', {
          timestamp: new Date().toISOString(),
          orderId: String(id),
          errorMessage: err?.message,
          errorStatus: err?.response?.status,
          errorData: err?.response?.data,
          stack: err?.stack?.split('\n')[0],
        });
        
        setError(
          err.response?.data?.message ||
            err.message ||
            'Unable to load order details. Please check your order ID.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [router.isReady, id]);

  useEffect(() => {
    if (!router.isReady) return;
    if (!order || purchaseTracked) return;
    if (!id) return;

    const eventId = String(event_id || '').trim();
    const transactionId = order.orderNumber || order.orderId || order._id || id;
    const value = Number(order.total || 0);
    const currency = order.currency || 'BDT';
    const items = Array.isArray(order.orderItems)
      ? order.orderItems.map((item) => ({
          id: item.product?._id || item.product || item.id || item.item_id,
          item_id: String(item.product?._id || item.product || item.id || item.item_id || ''),
          item_name: item.name || item.product?.name || '',
          price: Number(item.price || item.item_price || 0) || 0,
          item_price: Number(item.price || item.item_price || 0) || 0,
          quantity: Number(item.quantity || 1) || 1,
        }))
      : [];

    try {
      trackPurchase({ transactionId, value, currency, items, eventId });
      setPurchaseTracked(true);
    } catch (err) {
      console.error('Purchase tracking error:', err);
      // ignore analytics errors
    }
  }, [router.isReady, order, purchaseTracked, event_id, id]);

  const renderOrderSummary = () => {
    if (!order) return null;

    const items = Array.isArray(order.orderItems) ? order.orderItems : [];
    const subtotal = Number(order.subtotal || 0);
    const deliveryFee = Number(order.deliveryFee || 0);
    const total = Number(order.total || subtotal + deliveryFee);
    const paymentMethod = order.paymentMethod || 'cash';
    const shipping = order.shippingAddress || {};
    const orderIdLabel = order.orderNumber || order.orderId || order._id || id;
    const statusLabel = String(order.orderStatus || 'pending').replace(/_/g, ' ');
    const paymentLabel = paymentMethod === 'cash' ? 'Cash on Delivery' : paymentMethod;

    return (
      <div className="space-y-8">
        <div className="rounded-[32px] bg-gradient-to-br from-white via-slate-50 to-slate-100 p-8 shadow-[0_60px_120px_-60px_rgba(15,23,42,0.25)]">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m7 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-green-600">Order Confirmed</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">Thanks for your purchase!</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Your order is confirmed and will be processed shortly. We’ve sent the details to your phone/email and you can track the delivery anytime.
            </p>
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Order ID</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">#{orderIdLabel}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Order status</p>
                  <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                    {statusLabel.charAt(0).toUpperCase() + statusLabel.slice(1)}
                  </span>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Payment method</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{paymentLabel}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Estimated delivery</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">2 - 5 business days</p>
                </div>
              </div>

              <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-base font-semibold text-slate-900">Customer details</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-slate-500">Name</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{shipping.firstName} {shipping.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{shipping.phone}</p>
                  </div>
                  {shipping.email ? (
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{shipping.email}</p>
                    </div>
                  ) : null}
                  <div className="sm:col-span-2">
                    <p className="text-sm text-slate-500">Address</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {shipping.streetAddress}, {shipping.townCity}{shipping.state ? `, ${shipping.state}` : ''}{shipping.postalCode ? `, ${shipping.postalCode}` : ''}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{shipping.country || 'Bangladesh'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Subtotal</span>
                    <span>৳{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Delivery fee</span>
                    <span>৳{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-4 text-base font-semibold text-slate-900 flex items-center justify-between">
                    <span>Total</span>
                    <span>৳{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Order items</p>
                    <p className="text-sm text-slate-500">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
                  </div>
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                    Detailed view
                  </span>
                </div>
                <div className="mt-4 space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="grid gap-3 rounded-3xl bg-slate-50 p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                      <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100">
                        <img src={item.image || item.product?.images?.[0] || '/logo.jpeg'} alt={item.name || item.product?.name || 'Product'} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{item.name || item.product?.name || 'Product'}</p>
                        <p className="text-xs text-slate-500">Qty {item.quantity || 1} · {item.size || 'N/A'} · {item.color || 'N/A'}</p>
                      </div>
                      <p className="text-right text-sm font-semibold text-slate-900">৳{((Number(item.price || item.item_price || 0) || 0) * (Number(item.quantity || 1) || 1)).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/shop" className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-800">
              Continue Shopping
            </Link>
            <Link href="/orders/track" className="inline-flex items-center justify-center rounded-3xl border border-slate-900 bg-white px-6 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
              Track Your Order
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center rounded-3xl bg-slate-100 px-6 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-200">
              Need help? Contact us
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <SEO title="Order Success - Sume Traders" description="Your order was placed successfully. View your order summary and tracking options." />
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Order Success' }]} />
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {!router.isReady ? (
            <div className="rounded-3xl bg-white p-12 text-center shadow-lg">
              <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-gray-700">Initializing order confirmation...</p>
            </div>
          ) : loading ? (
            <div className="rounded-3xl bg-white p-12 text-center shadow-lg">
              <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-gray-700">Loading order details...</p>
            </div>
          ) : error ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
              <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-semibold text-red-600">{error}</p>
              <p className="mt-4 text-gray-600">Please verify your order ID or contact support.</p>
              <div className="mt-6">
                <Link href="/orders/track" className="inline-block text-blue-600 hover:text-blue-700 font-semibold">
                  → Go to Order Tracking
                </Link>
              </div>
            </div>
          ) : order ? (
            renderOrderSummary()
          ) : (
            <div className="rounded-3xl bg-white p-12 text-center shadow-lg">
              <p className="text-gray-700 font-semibold">No order data available</p>
              <p className="mt-2 text-gray-600">Please check your order ID and try again.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
