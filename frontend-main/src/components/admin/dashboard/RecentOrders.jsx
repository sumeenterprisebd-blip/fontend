import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiArrowRight } from 'react-icons/fi';

export default function RecentOrders({ orders, router }) {
  const getStatusClass = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getCustomerName = (order) => {
    if (order.user?.firstName && order.user?.lastName) {
      return `${order.user.firstName} ${order.user.lastName}`;
    }
    if (order.shippingAddress?.firstName && order.shippingAddress?.lastName) {
      return `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`;
    }
    return order.user?.email || 'Customer';
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Orders</h2>
        <Link
          href="/admin/orders"
          className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          <span className="hidden sm:inline">View All</span>
          <span className="sm:hidden">All</span>
          <FiArrowRight className="ml-1" size={14} />
        </Link>
      </div>
      <div className="overflow-x-auto">
        {orders.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {orders.map((order, index) => (
              <div
                key={order._id || order.orderNumber || index}
                className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => router.push(`/admin/orders`)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                      Order #{order.orderNumber || order._id?.slice(-8) || 'N/A'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                      {getCustomerName(order)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap">
                      ৳{Number(order.total || 0).toFixed(2)}
                    </p>
                    <span
                      className={`inline-flex px-2 py-0.5 sm:py-1 text-xs font-semibold rounded-full ${getStatusClass(order.orderStatus)}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 sm:px-6 py-6 sm:py-8 text-center text-gray-500 text-sm">
            No orders yet
          </div>
        )}
      </div>
    </div>
  );
}

