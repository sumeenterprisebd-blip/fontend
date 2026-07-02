export default function PaymentInfoCard({ order }) {
    const paymentMethodLabel = (() => {
        const pm = String(order?.paymentMethod || '').toLowerCase();
        if (!pm || pm === 'cash') return 'Cash on Delivery';
        if (pm === 'sslcommerz') return 'SSLCommerz';
        return order.paymentMethod;
    })();

    const tranId = order?.paymentDetails?.tranId || '';
    const valId = order?.paymentDetails?.valId || '';
    return (
        <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Information</h2>
            <div className="space-y-3">
                <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-semibold">{paymentMethodLabel}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status</span>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                    </span>
                </div>

                {(tranId || valId) && (
                    <div className="border-t pt-3 mt-3 space-y-2">
                        {tranId && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Transaction ID</span>
                                <span className="font-semibold">{tranId}</span>
                            </div>
                        )}
                        {valId && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Validation ID</span>
                                <span className="font-semibold">{valId}</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="border-t pt-3 mt-3 space-y-2">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>৳{order.subtotal?.toFixed(2)}</span>
                    </div>
                    {order.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>-৳{order.discount?.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                        <span>Delivery Fee</span>
                        <span>৳{order.deliveryFee?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
                        <span>Total</span>
                        <span>৳{order.total?.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
