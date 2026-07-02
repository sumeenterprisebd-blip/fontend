import { useEffect, useMemo, useState } from 'react';
import { FaWhatsapp } from '@react-icons/all-files/fa/FaWhatsapp';
import { buildOrderWhatsAppMessage } from '@/utils/whatsappOrderMessage';

const getOrderLabel = (order) => {
    if (!order) return '';
    if (order.orderNumber) return `#${order.orderNumber}`;
    if (order.shortId) return `#${order.shortId}`;
    const id = String(order._id || order.id || '');
    return id ? `#${id.slice(-8)}` : '';
};

export default function WhatsAppMessageModal({ order, isOpen, onClose, onSend, sending }) {
    const [message, setMessage] = useState('');

    const orderLabel = useMemo(() => getOrderLabel(order), [order]);
    const phone = useMemo(() => order?.shippingAddress?.phone || order?.guestInfo?.phone || '', [order]);
    const lastSentAt = order?.whatsappLastSentAt || null;

    useEffect(() => {
        if (!isOpen || !order) return;

        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const next = buildOrderWhatsAppMessage(order, { origin });
        setMessage(next);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, order?._id, order?.orderStatus, order?.total]);

    if (!isOpen || !order) return null;

    const hasPhone = Boolean(String(phone || '').trim());

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen px-4 py-8">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} aria-hidden="true" />

                <div className="relative inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-xl shadow-2xl">
                    <div className="px-6 py-5 border-b border-gray-100">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Send WhatsApp Message</h3>
                                <div className="mt-1 text-sm text-gray-600">
                                    Order <span className="font-semibold text-gray-900">{orderLabel}</span>
                                    {phone ? (
                                        <>
                                            {' '}· <span className="font-semibold text-gray-900">{phone}</span>
                                        </>
                                    ) : null}
                                </div>
                                {lastSentAt ? (
                                    <div className="mt-1 text-xs text-gray-500" suppressHydrationWarning>
                                        Last sent: {new Date(lastSentAt).toLocaleString()}
                                    </div>
                                ) : null}
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-3 py-1.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>

                    <div className="px-6 py-5">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={10}
                            className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Write your WhatsApp message…"
                        />
                        {!hasPhone ? (
                            <div className="mt-2 text-xs text-red-600">Customer phone number is missing for this order.</div>
                        ) : null}
                    </div>

                    <div className="px-6 py-5 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={sending}
                            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                if (!hasPhone) return;
                                if (typeof onSend === 'function') onSend(message);
                            }}
                            disabled={sending || !hasPhone}
                            className="px-4 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                            title="Open WhatsApp with this message"
                        >
                            {sending ? (
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-label="Sending">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <FaWhatsapp className="w-4 h-4" />
                            )}
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
