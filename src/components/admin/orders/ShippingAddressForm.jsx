/**
 * ShippingAddressForm Component
 * Handles shipping address fields in order editing
 */
export default function ShippingAddressForm({ formData, handleChange }) {
    return (
        <div>
            <h4 className="font-semibold text-gray-900 mb-4">Shipping Address</h4>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="streetAddress"
                        value={formData.shippingAddress.streetAddress}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apartment, suite, etc. (optional)
                    </label>
                    <input
                        type="text"
                        name="apartment"
                        value={formData.shippingAddress.apartment}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            City <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={formData.shippingAddress.city}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            State / Division <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="state"
                            value={formData.shippingAddress.state}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Postal Code <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="postalCode"
                            value={formData.shippingAddress.postalCode}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="country"
                        value={formData.shippingAddress.country}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>
        </div>
    );
}
