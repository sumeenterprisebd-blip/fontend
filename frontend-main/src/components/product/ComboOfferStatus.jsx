/**
 * ComboOfferStatus Component
 * Shows current combo offer qualification status
 */
export default function ComboOfferStatus({ settings, current, quantityQualifies, likesQualify }) {
    const minQty = Number(settings?.minQuantity || 2);
    const currentQty = Number(current?.quantity || 0);
    const remaining = Math.max(minQty - currentQty, 0);

    return (
        <div className="space-y-3">
            <div className="rounded-xl border border-gray-200 bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="text-sm font-semibold text-gray-900">Quantity requirement</div>
                        <div className="mt-0.5 text-xs sm:text-sm text-gray-700">
                            একই ক্যাটাগরির কম্বো অফারের মোট <span className="font-semibold text-gray-900">{minQty}+ পিস</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-600">Current: {currentQty} pcs</div>
                    </div>

                    <div className="shrink-0">
                        {quantityQualifies ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">
                                Met
                            </span>
                        ) : (
                            <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-900">
                                {remaining} more
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-xs sm:text-sm text-gray-700">
                টিপস: কার্টে থাকা সব পণ্য <span className="font-semibold text-gray-900">একই ক্যাটাগরির</span> হতে হবে এবং
                সব পণ্যে <span className="font-semibold text-gray-900">কম্বো অফার</span> সক্রিয় থাকতে হবে।
            </div>
        </div>
    );
}
