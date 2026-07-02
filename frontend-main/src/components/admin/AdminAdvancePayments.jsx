import { useMemo } from 'react';
import useAdminAdvancePayments from '@/hooks/admin/useAdminAdvancePayments';
import { useToast } from '@/contexts/ToastContext';

function formatDate(dateValue) {
    if (!dateValue) return '—';
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString('en-GB', { hour12: true });
}

export default function AdminAdvancePayments() {
    const {
        payments,
        filteredPayments,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        status,
        setStatus,
        approvingId,
        rejectingId,
        refreshPayments,
        handleApprove,
        handleReject,
        handleEdit,
    } = useAdminAdvancePayments();
    const { showToast } = useToast();

    const statusCounts = useMemo(() => {
        const counts = { Pending: 0, Approved: 0, Rejected: 0 };
        payments.forEach((payment) => {
            const key = String(payment.status || 'Pending');
            if (counts[key] !== undefined) {
                counts[key] += 1;
            }
        });
        return counts;
    }, [payments]);

    const handleRejectClick = async (payment) => {
        const reason = window.prompt('Enter rejection reason', payment.rejectedReason || '');
        if (reason === null) return;
        if (!reason.trim()) {
            showToast('Rejection reason is required', 'error');
            return;
        }

        try {
            const result = await handleReject(payment._id, reason.trim());
            if (result?.success) {
                showToast('Advance payment rejected', 'success');
            } else {
                showToast(result?.message || 'Failed to reject advance payment', 'error');
            }
        } catch (error) {
            showToast(error?.response?.data?.message || error?.message || 'Failed to reject advance payment', 'error');
        }
    };

    const handleEditClick = async (payment) => {
        const newAmountStr = window.prompt('Enter new paid amount', payment.amount);
        if (newAmountStr === null) return;
        const newAmount = Number(newAmountStr);
        if (!Number.isFinite(newAmount) || newAmount < 0) {
            showToast('Valid amount is required', 'error');
            return;
        }

        try {
            const result = await handleEdit({ id: payment._id, paidAmount: newAmount });
            if (result?.success) {
                showToast('Advance payment updated', 'success');
            } else {
                showToast(result?.message || 'Failed to update advance payment', 'error');
            }
        } catch (error) {
            showToast(error?.response?.data?.message || error?.message || 'Failed to update advance payment', 'error');
        }
    };

    const handleApproveClick = async (payment) => {
        try {
            const result = await handleApprove(payment._id);
            if (result?.success) {
                showToast('Advance payment approved', 'success');
            } else {
                showToast(result?.message || 'Failed to approve advance payment', 'error');
            }
        } catch (error) {
            showToast(error?.response?.data?.message || error?.message || 'Failed to approve advance payment', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Advance Payment Requests</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Review pending advance payment submissions and approve or reject them from the admin dashboard.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">Total Requests</p>
                    <p className="mt-3 text-3xl font-semibold text-gray-900">{payments.length}</p>
                </div>
                <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">Pending</p>
                    <p className="mt-3 text-3xl font-semibold text-yellow-600">{statusCounts.Pending}</p>
                </div>
                <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">Approved</p>
                    <p className="mt-3 text-3xl font-semibold text-green-600">{statusCounts.Approved}</p>
                </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search by phone, transaction, sender, method"
                            className="min-w-[220px] rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                        />
                        <select
                            value={status}
                            onChange={(event) => setStatus(event.target.value)}
                            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
                        >
                            {['All', 'Pending', 'Approved', 'Rejected'].map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="button"
                        onClick={() => refreshPayments()}
                        className="inline-flex items-center justify-center rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition"
                    >
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">
                        Loading advance payments...
                    </div>
                ) : error ? (
                    <div className="p-6 text-sm text-red-700 bg-red-50">{error}</div>
                ) : filteredPayments.length === 0 ? (
                    <div className="p-8 text-center text-gray-600">No advance payments match the current filters.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Customer</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Payment</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Method</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Submitted</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Updated</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {filteredPayments.map((payment) => (
                                    <tr key={payment._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="font-medium">{payment.customerPhone || '—'}</div>
                                            <div className="text-gray-500">{payment.senderNumber || '—'}</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div>৳{Number(payment.amount || 0).toFixed(2)}</div>
                                            <div className="text-gray-500 text-xs">Delivery charge: ৳{Number(payment.deliveryCharge || 0).toFixed(2)}</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{payment.paymentMethod || '—'}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${payment.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : payment.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {payment.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(payment.createdAt)}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {payment.status === 'Approved' ? formatDate(payment.approvedAt) : payment.status === 'Rejected' ? formatDate(payment.rejectedAt) : '—'}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            {payment.status === 'Pending' ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleApproveClick(payment)}
                                                        disabled={approvingId === payment._id}
                                                        className="inline-flex items-center justify-center rounded-2xl bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                                                    >
                                                        {approvingId === payment._id ? 'Approving…' : 'Approve'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRejectClick(payment)}
                                                        disabled={rejectingId === payment._id}
                                                        className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                                                    >
                                                        {rejectingId === payment._id ? 'Rejecting…' : 'Reject'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditClick(payment)}
                                                        className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                                                    >
                                                        Edit
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-sm text-gray-500">No actions</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
