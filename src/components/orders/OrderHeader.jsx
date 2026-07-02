import { HiOutlineClock, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineTruck } from 'react-icons/hi';
import { formatDateWithMonth } from '@/utils/dateFormatter';

const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: HiOutlineClock, label: 'Pending', description: 'Your order is being processed' },
    processing: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: HiOutlineClock, label: 'Processing', description: 'We are preparing your order' },
    shipped: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: HiOutlineTruck, label: 'Shipped', description: 'Your order is on the way' },
    delivered: { color: 'bg-green-100 text-green-800 border-green-200', icon: HiOutlineCheckCircle, label: 'Delivered', description: 'Your order has been delivered' },
    cancelled: { color: 'bg-red-100 text-red-800 border-red-200', icon: HiOutlineXCircle, label: 'Cancelled', description: 'This order has been cancelled' }
};

export default function OrderHeader({ order, orderId }) {
    const status = statusConfig[order.orderStatus] || statusConfig.pending;
    const StatusIcon = status.icon;

    return (
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Order #{orderId}</h1>
                    <p className="text-gray-600" suppressHydrationWarning>
                        Placed on {formatDateWithMonth(order.createdAt)}
                    </p>
                </div>
                <div className={`px-4 py-3 rounded-lg border-2 ${status.color} flex items-center gap-2`}>
                    <StatusIcon className="w-6 h-6" />
                    <div>
                        <p className="font-semibold">{status.label}</p>
                        <p className="text-xs">{status.description}</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                    <p className="text-sm text-gray-600 mb-1">Items</p>
                    <p className="text-lg font-semibold text-gray-900">{order.orderItems?.length || 0}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600 mb-1">Subtotal</p>
                    <p className="text-lg font-semibold text-gray-900">৳{order.subtotal?.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600 mb-1">Delivery</p>
                    <p className="text-lg font-semibold text-gray-900">৳{order.deliveryFee?.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600 mb-1">Total</p>
                    <p className="text-lg font-bold text-blue-600">৳{order.total?.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
}
