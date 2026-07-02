export default function TrackOrderItems({ items, total, subtotal, discount, deliveryFee }) {
    const safeItems = Array.isArray(items) ? items : [];

    const toMoneyNumber = (value) => {
        if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
        if (value == null) return 0;
        const cleaned = String(value).replace(/[^0-9.-]/g, '');
        const parsed = Number(cleaned);
        return Number.isFinite(parsed) ? parsed : 0;
    };

    const safeTotal = toMoneyNumber(total);
    const safeSubtotal = toMoneyNumber(subtotal);
    const safeDiscount = toMoneyNumber(discount);
    const safeDeliveryFee = toMoneyNumber(deliveryFee);

    const itemsTotal = safeItems.reduce((sum, item) => {
        const quantity = toMoneyNumber(item?.quantity);
        const unitPrice = toMoneyNumber(item?.price);
        return sum + unitPrice * quantity;
    }, 0);

    // Maintain consistency with Checkout:
    // Checkout's final bill is effectively: (sum of item line totals using effective item prices) + delivery.
    // Order items already contain the effective price used at checkout time.
    let orderTotal = itemsTotal + safeDeliveryFee;

    // Fallbacks: if items are missing, rely on server totals.
    if (safeItems.length === 0) {
        const computedFromOrderFields = (safeSubtotal - safeDiscount + safeDeliveryFee);
        orderTotal = safeTotal > 0 ? safeTotal : (computedFromOrderFields > 0 ? computedFromOrderFields : safeDeliveryFee);
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 sm:px-8 py-6">
                <div className="flex items-baseline justify-between gap-4 mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Order Items</h2>
                    <span className="text-sm text-gray-500">{safeItems.length} {safeItems.length === 1 ? 'item' : 'items'}</span>
                </div>

                <div className="divide-y divide-gray-100">
                    {safeItems.length === 0 && (
                        <div className="py-10 text-center">
                            <p className="text-sm text-gray-600">No order items found for this order.</p>
                        </div>
                    )}

                    {safeItems.map((item, index) => {
                        const name = item.product?.name || item.name || 'Product';
                        const imageUrl = item.product?.images?.[0];
                        const quantity = toMoneyNumber(item?.quantity);
                        const unitPrice = toMoneyNumber(item?.price);
                        const lineTotal = unitPrice * quantity;

                        return (
                            <div key={index} className="py-5 first:pt-0 last:pb-0">
                                <div className="grid grid-cols-[64px_1fr] sm:grid-cols-[80px_1fr_auto] gap-4 items-start">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={name}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        ) : (
                                            <div className="w-full h-full" />
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-base font-semibold text-gray-900 leading-snug truncate">
                                            {name}
                                        </p>

                                        <p className="text-sm text-gray-600 mt-1">
                                            Qty: <span className="font-medium text-gray-900">{quantity}</span>
                                            <span className="mx-2 text-gray-300">•</span>
                                            Unit: <span className="font-medium text-gray-900">৳{unitPrice.toFixed(2)}</span>
                                        </p>

                                        {item.size && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {item.size && (
                                                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                                                        Size: <span className="ml-1 uppercase">{item.size}</span>
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="hidden sm:block text-right">
                                        <p className="text-sm text-gray-500">Line total</p>
                                        <p className="text-lg font-bold text-gray-900">৳{lineTotal.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="sm:hidden mt-3 flex items-center justify-between">
                                    <p className="text-sm text-gray-500">Line total</p>
                                    <p className="text-base font-bold text-gray-900">৳{lineTotal.toFixed(2)}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="px-6 sm:px-8 py-5 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                    <p className="text-base sm:text-lg font-semibold text-gray-900">Total Amount</p>
                    <div className="text-right">
                        <p className="text-xl sm:text-2xl font-extrabold text-gray-900">৳{orderTotal.toFixed(2)}</p>
                        {safeDeliveryFee > 0 && (
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Includes delivery: ৳{safeDeliveryFee.toFixed(2)}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
