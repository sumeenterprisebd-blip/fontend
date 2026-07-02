import { formatDate } from '@/utils/dateFormatter';

export default function OrderStatusSummary({ order, getStatusColor }) {
    const statusValue = typeof order?.orderStatus === 'string' ? order.orderStatus : 'pending';
    const orderItems = Array.isArray(order?.orderItems) ? order.orderItems : [];
    const orderSubtotal = Number(order?.subtotal);
    const itemsSubtotal = orderItems.reduce((sum, item) => {
        const unitPrice = Number(item?.price ?? item?.unitPrice ?? 0);
        const quantity = Number(item?.quantity ?? 0);
        return sum + unitPrice * quantity;
    }, 0);
    const subtotal = Number.isFinite(orderSubtotal) && orderSubtotal > 0 ? orderSubtotal : itemsSubtotal;
    const discount = Number(order?.discount ?? 0);
    // `subtotal` is the original price (before discount)
    const originalSubtotal = subtotal;
    const discountPercent = originalSubtotal > 0
        ? Math.round((discount / originalSubtotal) * 100)
        : 0;
    const deliveryFee = Number(order?.deliveryFee ?? order?.shippingCost ?? order?.shipping ?? 0);
    const total = Number(order?.total ?? order?.totalPrice ?? 0) || (subtotal - discount + deliveryFee);
    const advance = Number(order?.advance ?? 0);
    const totalDueValue = Number(order?.totalDue);
    const totalDue = Number.isFinite(totalDueValue) ? totalDueValue : Math.max(total - advance, 0);
    const hasAdvance = advance > 0 || Number.isFinite(totalDueValue);

    const paymentStatus = String(order?.paymentStatus || 'pending').toLowerCase();
    const paymentStatusLabel = paymentStatus === 'paid' ? 'PAID' : (paymentStatus === 'failed' ? 'FAILED' : 'PENDING');
    const paymentStatusClass = paymentStatus === 'paid'
        ? 'bg-green-100 text-green-800'
        : (paymentStatus === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800');

    const paymentMethodLabel = (() => {
        const pm = String(order?.paymentMethod || '').toLowerCase();
        if (!pm || pm === 'cash') return 'Cash on Delivery';
        if (pm === 'sslcommerz') return 'SSLCommerz';
        return order.paymentMethod;
    })();

    const tranId = order?.paymentDetails?.tranId || '';
    const valId = order?.paymentDetails?.valId || '';
    const bankTranId = order?.paymentDetails?.bankTranId || '';
    const cardType = order?.paymentDetails?.cardType || '';
    const validatedAt = order?.paymentDetails?.validatedAt ? new Date(order.paymentDetails.validatedAt).toLocaleString('en-GB') : '';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Order Status</h4>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className={`text-xs font-semibold rounded-full px-3 py-1 ${getStatusColor(statusValue)}`}>
                            {String(statusValue).toUpperCase()}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Order Date:</span>
                        <span className="text-sm font-medium text-gray-900" suppressHydrationWarning>
                            {formatDate(order.createdAt)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Payment Method:</span>
                        <span className="text-sm font-medium text-gray-900">
                            {paymentMethodLabel}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Payment Status:</span>
                        <span className={`text-xs font-semibold rounded-full px-3 py-1 ${paymentStatusClass}`}>
                            {paymentStatusLabel}
                        </span>
                    </div>

                    {(tranId || valId || bankTranId || cardType || validatedAt) && (
                        <div className="pt-2 space-y-1">
                            {tranId && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Tran ID:</span>
                                    <span className="text-sm font-medium text-gray-900">{tranId}</span>
                                </div>
                            )}
                            {valId && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Val ID:</span>
                                    <span className="text-sm font-medium text-gray-900">{valId}</span>
                                </div>
                            )}
                            {bankTranId && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Bank Tran ID:</span>
                                    <span className="text-sm font-medium text-gray-900">{bankTranId}</span>
                                </div>
                            )}
                            {cardType && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Card Type:</span>
                                    <span className="text-sm font-medium text-gray-900">{cardType}</span>
                                </div>
                            )}
                            {validatedAt && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Validated At:</span>
                                    <span className="text-sm font-medium text-gray-900" suppressHydrationWarning>{validatedAt}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Payment Summary</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Original Price:</span>
                        <span className="font-medium text-gray-900">৳{Number(originalSubtotal || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">ডেলিভারি চার্জ:</span>
                        <span className="font-medium text-gray-900">৳{Number(deliveryFee || 0).toFixed(2)}</span>
                    </div>
                    {Number(discount || 0) > 0 && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Discount ({discountPercent}%):</span>
                            <span className="font-medium text-green-600">-৳{Number(discount || 0).toFixed(2)}</span>
                        </div>
                    )}
                    {hasAdvance ? (
                        <>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Advance Payment:</span>
                                <span className="font-medium text-gray-900">৳{Number(advance || 0).toFixed(2)}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
                                <span className="font-semibold text-gray-900">Balance Due:</span>
                                <span className="font-bold text-lg text-blue-600">৳{Number(totalDue || 0).toFixed(2)}</span>
                            </div>
                        </>
                    ) : (
                        <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
                            <span className="font-semibold text-gray-900">Total Price:</span>
                            <span className="font-bold text-lg text-blue-600">৳{Number(total || 0).toFixed(2)}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
