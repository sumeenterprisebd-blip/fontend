import { FiX, FiShoppingBag, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { formatDate } from '@/utils/dateFormatter';

export default function UserOrdersModal({
    user,
    isOpen,
    onClose,
    orders,
    loading,
    pagination,
    onPageChange,
}) {
    if (!isOpen || !user) return null;

    const total = pagination?.total ?? 0;
    const page = pagination?.page ?? 1;
    const totalPages = pagination?.totalPages ?? 1;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-9999 p-4 animate-fadeIn"
            onClick={(e) => {
                if (e.target === e.currentTarget && !loading) onClose?.();
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="orders-modal-title"
        >
            <div
                className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="min-w-0">
                            <h2 id="orders-modal-title" className="text-xl sm:text-2xl font-bold text-gray-900">
                                Order History
                            </h2>
                            <p className="text-sm text-gray-600 mt-1 truncate">
                                {user.firstName} {user.lastName} · {total} order{total === 1 ? '' : 's'}
                            </p>
                        </div>
                        {!loading && (
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-all duration-200 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                aria-label="Close modal"
                            >
                                <FiX size={20} />
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="py-14 flex flex-col items-center justify-center">
                            <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-transparent rounded-full" />
                            <p className="text-sm text-gray-600 mt-4">Loading orders…</p>
                        </div>
                    ) : (orders?.length || 0) === 0 ? (
                        <div className="py-16 flex flex-col items-center justify-center text-center">
                            <div className="p-4 bg-gray-100 rounded-full">
                                <FiShoppingBag className="text-gray-400" size={32} />
                            </div>
                            <p className="text-gray-700 font-semibold mt-4">No orders found</p>
                            <p className="text-sm text-gray-500 mt-1">This user has no recorded orders.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Order #</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Payment</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Total</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Created</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                {order.orderNumber || '—'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{order.orderStatus || '—'}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{order.paymentStatus || '—'}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                                                {typeof order.total === 'number' ? order.total.toFixed(2) : order.total || '—'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600" suppressHydrationWarning>
                                                {order.createdAt ? formatDate(order.createdAt) : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Page <span className="font-semibold text-gray-900">{page}</span> of{' '}
                            <span className="font-semibold text-gray-900">{totalPages}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => onPageChange?.(Math.max(1, page - 1))}
                                disabled={loading || page <= 1}
                                className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FiChevronLeft /> Prev
                            </button>
                            <button
                                type="button"
                                onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
                                disabled={loading || page >= totalPages}
                                className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next <FiChevronRight />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
