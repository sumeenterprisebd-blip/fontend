import { FiPackage, FiCalendar, FiMapPin } from 'react-icons/fi';

export default function OrderSummaryCard({ trackingData }) {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                        <FiPackage className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Order ID</p>
                        <p className="font-semibold text-gray-900">
                            #{trackingData.orderId || trackingData._id?.slice(-8).toUpperCase()}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                        <FiCalendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Order Date</p>
                        <p className="font-semibold text-gray-900">
                            {new Date(trackingData.createdAt || trackingData.orderDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 sm:col-span-2">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                        <FiMapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">Delivery Address</p>
                        <p className="font-medium text-gray-900">
                            {trackingData.shippingAddress?.address || 'N/A'}
                        </p>
                        {trackingData.shippingAddress?.city && (
                            <p className="text-sm text-gray-600 mt-1">
                                {trackingData.shippingAddress.city}
                                {trackingData.shippingAddress.postalCode && ` - ${trackingData.shippingAddress.postalCode}`}
                            </p>
                        )}
                    </div>
                </div>

                {trackingData.pathaoConsignmentId && (
                    <div className="flex items-start gap-3 sm:col-span-2">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                            <FiPackage className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Delivery Tracking ID</p>
                            <p className="font-mono text-sm font-semibold text-gray-900">
                                {trackingData.pathaoConsignmentId}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
