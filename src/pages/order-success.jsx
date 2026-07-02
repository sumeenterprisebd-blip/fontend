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
      return;
    }

    if (!id) {
      setLoading(false);
      setError('Order ID not found. Please check your order confirmation email.');
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await ordersAPI.trackOrder(String(id));
        const data = response.data?.data || response.data;
        
        if (data && data._id) {
          setOrder(data);
        } else if (data) {
          setOrder(data);
        } else {
          setError('Order data not found. Please try again later.');
        }
      } catch (err) {
        console.error('Order fetch error:', err);
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
    const paymentMethod = order.paymentMethod || 'Cash on Delivery';
    const shipping = order.shippingAddress || {};

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-600">Thank You!</p>
            <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900">Your Order Has Been Placed Successfully.</h1>
            <p className="mt-4 text-gray-600">We are processing your order now. You can track your order status from the order tracking page.</p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-gray-50 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between gap-4">
                  <span>Status</span>
                  <span className="font-semibold text-gray-900">{order.orderStatus ? String(order.orderStatus).replace(/_/g, ' ') : 'Confirmed'}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Order ID</span>
                  <span className="font-semibold text-gray-900">{order.orderNumber || order.orderId || order._id || id}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Order Date</span>
                  <span className="font-semibold text-gray-900">{formatDateWithMonth(order.orderDate || order.createdAt)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Payment Method</span>
                  <span className="font-semibold text-gray-900">{paymentMethod === 'cash' ? 'Cash on Delivery' : paymentMethod}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Estimated Delivery</span>
                  <span className="font-semibold text-gray-900">2 - 5 business days</span>
                </div>
              </div>
            </div>
            <div className="rounded-3xl bg-gray-50 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <p className="text-gray-500">Full Name</p>
                  <p className="font-semibold text-gray-900">{shipping.firstName || ''} {shipping.lastName || ''}</p>
                </div>
                {shipping.phone && (
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-semibold text-gray-900">{shipping.phone}</p>
                  </div>
                )}
                {shipping.email && (
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-semibold text-gray-900">{shipping.email}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-500">Shipping Address</p>
                  <p className="font-semibold text-gray-900">{shipping.address}</p>
                  <p className="text-gray-700">{shipping.city}{shipping.state ? `, ${shipping.state}` : ''}{shipping.postalCode ? `, ${shipping.postalCode}` : ''}</p>
                  <p className="text-gray-700">{shipping.country || 'Bangladesh'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Items</h3>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm">
                      <div className="min-w-[64px] h-16 w-16 overflow-hidden rounded-2xl bg-gray-100">
                        <img src={item.image || item.product?.images?.[0] || '/logo.jpeg'} alt={item.name || item.product?.name || 'Product'} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 truncate">{item.name || item.product?.name || 'Product'}</p>
                        {(item.size || item.color) && (
                          <p className="text-sm text-gray-500">
                            {item.size ? `Size: ${item.size}` : ''}{item.size && item.color ? ' · ' : ''}{item.color ? `Color: ${item.color}` : ''}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">৳{Number(item.price || item.item_price || 0).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">৳{((Number(item.price || item.item_price || 0) || 0) * (Number(item.quantity || 1) || 1)).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>৳{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>৳{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-semibold text-gray-900">
                    <span>Total</span>
                    <span>৳{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
            <Link href="/shop" className="inline-flex w-full justify-center rounded-2xl bg-gray-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-gray-800 sm:w-auto">
              Continue Shopping
            </Link>
            <Link href="/orders/track" className="inline-flex w-full justify-center rounded-2xl border border-gray-900 bg-white px-6 py-4 text-sm font-semibold text-gray-900 transition hover:bg-gray-50 sm:w-auto">
              Track Order
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <SEO title="Order Success - DeshWear" description="Your order was placed successfully. View your order summary and tracking options." />
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
