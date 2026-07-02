import { HiUser, HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

export default function OrderCustomerInfo({ order }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <HiUser className="w-5 h-5 text-blue-600" />
                    Customer Information
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-start gap-2">
                        <HiUser className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                {order.shippingAddress?.firstName || order.guestInfo?.name || 'Customer'} {order.shippingAddress?.lastName || ''}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <HiMail className="w-4 h-4 text-gray-400 mt-1" />
                        <p className="text-sm text-gray-600">{order.shippingAddress?.email || order.guestInfo?.email}</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <HiPhone className="w-4 h-4 text-gray-400 mt-1" />
                        <p className="text-sm text-gray-600">{order.shippingAddress?.phone || order.guestInfo?.phone}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <HiLocationMarker className="w-5 h-5 text-blue-600" />
                    Shipping Address
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                        {order.shippingAddress?.streetAddress || order.shippingAddress?.address}
                        {order.shippingAddress?.apartment && `, ${order.shippingAddress.apartment}`}
                    </p>
                    <p className="text-sm text-gray-600">
                        {order.shippingAddress?.city}, {order.shippingAddress?.state || order.shippingAddress?.division} {order.shippingAddress?.postalCode || order.shippingAddress?.zipCode}
                    </p>
                    <p className="text-sm text-gray-600">{order.shippingAddress?.country || 'Bangladesh'}</p>
                </div>
            </div>
        </div>
    );
}
