export default function ProductFormComboOffer({ formData, onChange }) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Combo Offer</h3>

            {/* Enable Combo Offer Toggle */}
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <input
                    type="checkbox"
                    id="isComboOffer"
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    checked={formData.isComboOffer}
                    onChange={(e) => onChange('isComboOffer', e.target.checked)}
                />
                <label htmlFor="isComboOffer" className="flex-1">
                    <span className="block font-medium text-gray-900">Enable Combo Offer</span>
                    <span className="text-sm text-gray-600">Activate special combo pricing for this product</span>
                </label>
            </div>

            {/* Combo Offer Fields - Only show when enabled */}
            {formData.isComboOffer && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Combo Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Combo Price
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-500">৳</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0.00"
                                    value={formData.comboPrice}
                                    onChange={(e) => onChange('comboPrice', e.target.value)}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Special combo offer price</p>
                        </div>

                        {/* Combo Discount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Combo Discount (%)
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0"
                                    value={formData.comboDiscount}
                                    onChange={(e) => onChange('comboDiscount', e.target.value)}
                                />
                                <span className="absolute right-3 top-2 text-gray-500">%</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Additional discount for combo</p>
                        </div>
                    </div>

                    {/* Free Delivery Toggle */}
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        <input
                            type="checkbox"
                            id="freeDelivery"
                            className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                            checked={formData.freeDelivery}
                            onChange={(e) => onChange('freeDelivery', e.target.checked)}
                        />
                        <label htmlFor="freeDelivery" className="flex-1">
                            <span className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">Free Delivery</span>
                                <span className="px-2 py-0.5 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                                    Special
                                </span>
                            </span>
                            <span className="text-sm text-gray-600">Offer free delivery when cart quantity reaches a minimum</span>
                        </label>
                    </div>

                    {formData.freeDelivery && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Free Delivery Minimum Quantity
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    value={formData.freeDeliveryMinQty}
                                    onChange={(e) => onChange('freeDeliveryMinQty', e.target.value)}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Free delivery applies when this product quantity in cart is
                                    <span className="font-semibold"> {formData.freeDeliveryMinQty || '2'}+</span>.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex gap-2">
                            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="text-sm text-blue-800">
                                <p className="font-medium mb-1">Combo Offer Information</p>
                                <ul className="list-disc list-inside space-y-0.5 text-blue-700">
                                    <li>You can set either combo price or combo discount (or both)</li>
                                    <li>Free delivery uses the minimum quantity you set above</li>
                                    <li>Combo offers can be enabled/disabled at any time</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
