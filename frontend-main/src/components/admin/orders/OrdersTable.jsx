import { formatDate } from '@/utils/dateFormatter';
import { HiCurrencyDollar, HiEye, HiPencil, HiTrash } from 'react-icons/hi';
import { FaWhatsapp } from '@react-icons/all-files/fa/FaWhatsapp';

/**
 * OrdersTable Component
 * Responsibility: Render orders table UI only
 * Max Lines: 80-120 ✅
 */
export default function OrdersTable({
    orders,
    onStatusUpdate,
    onApproveOrder,
    onRejectOrder,
    onViewOrder,
    onEditOrder,
    onSendWhatsApp,
    onUpdatePricing,
    onDeleteOrder,
    updatingOrderId,
    deletingOrderId,
    approvingOrderId,
    rejectingOrderId,
}) {
    const STATUS_OPTIONS = [
        { value: 'pending', label: 'Pending' },
        { value: 'pending_approval', label: 'Pending Approval' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'processing', label: 'Processing' },
        { value: 'hold', label: 'Hold' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'paid_return', label: 'Paid Return' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    const getStatusSelectClass = (status) => {
        switch (String(status || 'pending')) {
            case 'delivered':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'pending':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case 'hold':
                return 'bg-orange-50 border-orange-200 text-orange-800';
            case 'paid_return':
            case 'cancelled':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'pending_approval':
                return 'bg-orange-50 border-orange-200 text-orange-800';
            case 'processing':
                return 'bg-blue-50 border-blue-200 text-blue-800';
            case 'confirmed':
                return 'bg-purple-50 border-purple-200 text-purple-800';
            case 'shipped':
                return 'bg-indigo-50 border-indigo-200 text-indigo-800';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    if (!orders || orders.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow overflow-hidden p-8 text-center">
                <p className="text-gray-500">No orders found</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order, index) => (
                            (() => {
                                const orderId = order?._id || order?.id || null;
                                const isMissingId = !orderId;

                                return (
                                    <tr key={orderId || order.orderNumber || index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            #{order.orderNumber || (order._id || order.id || '').toString().slice(-8)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="font-semibold text-gray-900">
                                                {`${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim() || '—'}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {order.shippingAddress?.phone || order.guestInfo?.phone || '—'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {order.orderItems?.length || 0} item(s)
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            ৳{Number(order.total || order.totalPrice || 0).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {(() => {
                                                const level = String(order?.riskLevel || '').toLowerCase();

                                                const isHigh = level === 'high' || order?.requiresApproval;
                                                const isSafe = level === 'safe' && !order?.requiresApproval;
                                                const isMedium = !isHigh && !isSafe;

                                                const badge = isHigh
                                                    ? { label: '🔴 High', cls: 'bg-red-100 text-red-800' }
                                                    : isSafe
                                                        ? { label: '🟢 Safe', cls: 'bg-green-100 text-green-800' }
                                                        : { label: '🟡 Medium', cls: 'bg-yellow-100 text-yellow-800' };

                                                return (
                                                    <div className="space-y-1">
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${badge.cls}`}>{badge.label}</span>

                                                        {order?.requiresApproval && order?.approval?.status === 'pending' ? (
                                                            <div className="text-[11px] text-gray-500">Needs approval</div>
                                                        ) : null}

                                                        {typeof order?.riskScore === 'number' ? (
                                                            <div className="text-[11px] text-gray-500">Score: {order.riskScore}</div>
                                                        ) : null}
                                                    </div>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {(() => {
                                                const currentStatus = String(order?.orderStatus || 'pending');
                                                const statusSelectClass = getStatusSelectClass(currentStatus);
                                                return (
                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            value={currentStatus}
                                                            onChange={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                if (isMissingId) return;
                                                                if (updatingOrderId === orderId) return;
                                                                const nextStatus = String(e.target.value || 'pending');
                                                                if (nextStatus === currentStatus) return;
                                                                if (typeof onStatusUpdate === 'function') onStatusUpdate(orderId, nextStatus);
                                                            }}
                                                            disabled={isMissingId || updatingOrderId === orderId}
                                                            className={`block w-[170px] max-w-full rounded-lg border px-3 py-2 text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${statusSelectClass}`}
                                                            title="Change order status"
                                                        >
                                                            {STATUS_OPTIONS.map((opt) => (
                                                                <option key={opt.value} value={opt.value}>
                                                                    {opt.label}
                                                                </option>
                                                            ))}
                                                        </select>

                                                        {updatingOrderId === orderId ? (
                                                            <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-label="Updating">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                        ) : null}
                                                    </div>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" suppressHydrationWarning>
                                            {formatDate(order.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center gap-2">
                                                {order?.approval?.status === 'pending' && order?.requiresApproval && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                if (isMissingId) return;
                                                                if (typeof onApproveOrder === 'function') onApproveOrder(orderId);
                                                            }}
                                                            disabled={isMissingId || approvingOrderId === orderId || rejectingOrderId === orderId}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-white bg-emerald-600 hover:bg-emerald-700 font-medium rounded-md transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            title="Approve order"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                if (isMissingId) return;
                                                                if (typeof onRejectOrder === 'function') onRejectOrder(orderId);
                                                            }}
                                                            disabled={isMissingId || approvingOrderId === orderId || rejectingOrderId === orderId}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-white bg-orange-600 hover:bg-orange-700 font-medium rounded-md transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            title="Reject order (cancel)"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        if (onViewOrder && typeof onViewOrder === 'function') {
                                                            onViewOrder(order);
                                                        }
                                                    }}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-md transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                                                    title="View Order Details"
                                                >
                                                    <HiEye className="w-3.5 h-3.5" />
                                                    View
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        if (onSendWhatsApp && typeof onSendWhatsApp === 'function') {
                                                            onSendWhatsApp(order);
                                                        }
                                                    }}
                                                    disabled={isMissingId}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-white bg-emerald-600 hover:bg-emerald-700 font-medium rounded-md transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Send WhatsApp Message"
                                                >
                                                    <FaWhatsapp className="w-3.5 h-3.5" />
                                                    WhatsApp
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        if (onEditOrder && typeof onEditOrder === 'function') {
                                                            onEditOrder(order);
                                                        }
                                                    }}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-white bg-green-600 hover:bg-green-700 font-medium rounded-md transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                                                    title="Edit Order"
                                                >
                                                    <HiPencil className="w-3.5 h-3.5" />
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        if (onUpdatePricing && typeof onUpdatePricing === 'function') {
                                                            onUpdatePricing(order);
                                                        }
                                                    }}
                                                    disabled={isMissingId}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-md transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                                                    title="Update Order Pricing"
                                                >
                                                    <HiCurrencyDollar className="w-3.5 h-3.5" />
                                                    Price
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        if (onDeleteOrder && typeof onDeleteOrder === 'function') {
                                                            onDeleteOrder(order);
                                                        }
                                                    }}
                                                    disabled={isMissingId || deletingOrderId === orderId}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-white bg-red-600 hover:bg-red-700 font-medium rounded-md transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600"
                                                    title="Delete Order"
                                                >
                                                    <HiTrash className="w-3.5 h-3.5" />
                                                    {deletingOrderId === orderId ? 'Deleting...' : 'Delete'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })()
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
