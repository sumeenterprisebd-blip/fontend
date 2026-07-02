import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail, HiOutlineUser } from 'react-icons/hi';

export default function ShippingAddressCard({ address }) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                <HiOutlineLocationMarker className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
            </div>
            <div className="space-y-2 text-gray-700">
                <div className="flex items-start gap-2">
                    <HiOutlineUser className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p>{address?.firstName} {address?.lastName}</p>
                </div>
                {address?.phone && (
                    <div className="flex items-start gap-2">
                        <HiOutlinePhone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p>{address.phone}</p>
                    </div>
                )}
                {address?.email && (
                    <div className="flex items-start gap-2">
                        <HiOutlineMail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="break-words">{address.email}</p>
                    </div>
                )}
                <div className="flex items-start gap-2">
                    <HiOutlineLocationMarker className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                        <p>{address?.streetAddress}</p>
                        <p>{address?.townCity}{address?.state && `, ${address.state}`}</p>
                        {address?.zipCode && <p>{address.zipCode}</p>}
                        <p>{address?.country || 'Bangladesh'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
