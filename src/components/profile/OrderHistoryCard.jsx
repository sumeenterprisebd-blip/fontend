import { useState, useEffect } from 'react';
import { ordersAPI } from '@/services/api';
import { HiOutlineShoppingBag, HiOutlineClock, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi';
import Link from 'next/link';
import { formatDateWithMonth } from '@/utils/dateFormatter';

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: HiOutlineClock, label: 'Pending' },
  processing: { color: 'bg-blue-100 text-blue-800', icon: HiOutlineClock, label: 'Processing' },
  shipped: { color: 'bg-purple-100 text-purple-800', icon: HiOutlineShoppingBag, label: 'Shipped' },
  delivered: { color: 'bg-green-100 text-green-800', icon: HiOutlineCheckCircle, label: 'Delivered' },
  cancelled: { color: 'bg-red-100 text-red-800', icon: HiOutlineXCircle, label: 'Cancelled' }
};

export default function OrderHistoryCard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getOrders();
      setOrders(response.data.orders || []);
    } catch (error) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Order History</h3>
        {orders.length > 0 && (
          <Link
            href="/orders"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View All
          </Link>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <HiOutlineShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No orders yet</p>
          <Link
            href="/shop"
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => {
            const status = statusConfig[order.orderStatus] || statusConfig.pending;
            const StatusIcon = status.icon;

            return (
              <div
                key={order._id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                      </h4>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {order.orderItems?.length || 0} item(s) • ৳{order.total?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-xs text-gray-500" suppressHydrationWarning>
                      {formatDateWithMonth(order.createdAt)}
                    </p>
                  </div>
                  <Link
                    href={`/orders/${order._id}`}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

