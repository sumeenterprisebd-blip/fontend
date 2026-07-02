import { FiEye } from 'react-icons/fi';

/**
 * RecentOrdersTable Component
 * Responsibility: Display recent orders in a table
 */
export default function RecentOrdersTable({ orders, onViewOrder }) {
    const getStatusBadgeClass = (status) => {
        const statusClasses = {
            pending: 'bg-yellow-100 text-yellow-700',
            processing: 'bg-blue-100 text-blue-700',
            shipped: 'bg-purple-100 text-purple-700',
            delivered: 'bg-green-100 text-green-700',
            cancelled: 'bg-red-100 text-red-700',
            completed: 'bg-green-100 text-green-700',
        };
        return statusClasses[status?.toLowerCase()] || 'bg-gray-100 text-gray-700';
    };

    if (!orders || orders.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
                <div className="text-center py-8 text-gray-500">
                    <p>No recent orders</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
                <span className="text-sm text-gray-500">Last 10 orders</span>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Order ID
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Total
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                                Risk
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order, index) => (
                            <tr key={order._id || order.orderNumber || index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                    #{order.orderNumber || (order._id || '').toString().slice(-6).toUpperCase()}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="text-sm">
                                        <div className="font-medium text-gray-800">
                                            {order.shippingInfo?.fullName || [order.shippingAddress?.firstName, order.shippingAddress?.lastName].filter(Boolean).join(' ') || 'N/A'}
                                        </div>
                                        <div className="text-gray-500 text-xs">
                                            {order.shippingAddress?.email || order.user?.email || order.guestInfo?.email || 'No email'}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                                    ৳{(order.totalPrice || order.total || 0).toFixed(2)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.orderStatus)}`}>
                                            {order.orderStatus}
                                        </span>
                                        {order.requiresApproval && order.approval?.status === 'pending' ? (
                                            <span className="px-2 py-1 inline-flex text-[11px] leading-4 font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                                                needs approval
                                            </span>
                                        ) : null}
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-700">
                                        {order.riskScore || 0}
                                    </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm">
                                    <button
                                        onClick={() => onViewOrder(order._id)}
                                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                    >
                                        <FiEye size={16} />
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
