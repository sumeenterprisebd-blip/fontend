import { useState, useEffect } from 'react';
import { HiX } from 'react-icons/hi';
import CustomerInfoForm from './CustomerInfoForm';
import ShippingAddressForm from './ShippingAddressForm';
import OrderFormFooter from './OrderFormFooter';

/**
 * OrderEditModal Component
 * Allows editing order shipping address and order notes
 */
export default function OrderEditModal({ order, isOpen, onClose, onSave }) {
    const [formData, setFormData] = useState({
        shippingAddress: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            streetAddress: '',
            apartment: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'Bangladesh',
        },
        notes: '',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (order && isOpen) {
            setFormData({
                shippingAddress: {
                    firstName: order.shippingAddress?.firstName || '',
                    lastName: order.shippingAddress?.lastName || '',
                    email: order.shippingAddress?.email || '',
                    phone: order.shippingAddress?.phone || '',
                    streetAddress: order.shippingAddress?.streetAddress || order.shippingAddress?.address || '',
                    apartment: order.shippingAddress?.apartment || '',
                    city: order.shippingAddress?.city || '',
                    state: order.shippingAddress?.state || order.shippingAddress?.division || '',
                    postalCode: order.shippingAddress?.postalCode || order.shippingAddress?.zipCode || '',
                    country: order.shippingAddress?.country || 'Bangladesh',
                },
                notes: order.notes || '',
            });
        }
    }, [order, isOpen]);

    if (!isOpen || !order) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'notes') {
            setFormData(prev => ({ ...prev, notes: value }));
        } else {
            setFormData(prev => ({
                ...prev,
                shippingAddress: {
                    ...prev.shippingAddress,
                    [name]: value,
                },
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave(formData);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} aria-hidden="true"></div>

                <div className="relative inline-block w-full max-w-3xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Edit Order</h3>
                            <p className="text-sm text-gray-500">Order ID: #{order._id?.slice(-8)}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <HiX className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                        <div className="space-y-6">
                            <CustomerInfoForm formData={formData} handleChange={handleChange} />
                            <ShippingAddressForm formData={formData} handleChange={handleChange} />

                            {/* Order Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Order Notes (optional)
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Add any special instructions or notes about this order..."
                                />
                            </div>
                        </div>
                    </form>

                    {/* Footer */}
                    <OrderFormFooter saving={saving} onClose={onClose} onSubmit={handleSubmit} />
                </div>
            </div>
        </div>
    );
}
