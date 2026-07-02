import { useEffect, useMemo, useState } from 'react';
import { HiX } from 'react-icons/hi';

const toNumber = (value, fallback = 0) => {
    const num = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(num) ? num : fallback;
};

const roundCurrency = (value) => Math.round(toNumber(value, 0) * 100) / 100;

export default function OrderPricingModal({ order, isOpen, onClose, onSave }) {
    const [subtotal, setSubtotal] = useState('');
    const [discount, setDiscount] = useState('');
    const [deliveryFee, setDeliveryFee] = useState('');
    const [desiredTotal, setDesiredTotal] = useState('');
    const [reason, setReason] = useState('');
    const [saving, setSaving] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [mode, setMode] = useState('components');

    const fallbackItems = Array.isArray(order?.items) ? order.items : [];
    const orderItemsList = Array.isArray(order?.orderItems) ? order.orderItems : fallbackItems;

    const itemsSubtotal = useMemo(() => {
        return orderItemsList.reduce((sum, item) => {
            const unitPrice = toNumber(item?.price ?? item?.unitPrice ?? 0);
            const qty = toNumber(item?.quantity ?? 0);
            return sum + unitPrice * qty;
        }, 0);
    }, [orderItemsList]);

    useEffect(() => {
        if (!isOpen || !order) return;

        const initialSubtotal = Number.isFinite(toNumber(order?.subtotal)) && toNumber(order?.subtotal) > 0
            ? toNumber(order?.subtotal)
            : (itemsSubtotal > 0 ? itemsSubtotal : toNumber(order?.total ?? order?.totalPrice ?? 0));

        setSubtotal(String(roundCurrency(initialSubtotal)));
        setDiscount(String(roundCurrency(order?.discount ?? 0)));
        setDeliveryFee(String(roundCurrency(order?.deliveryFee ?? order?.shipping ?? order?.shippingCost ?? 0)));
        setDesiredTotal('');
        setReason('');
        setSubmitError('');
        setMode('components');
    }, [isOpen, order, itemsSubtotal]);

    const computed = useMemo(() => {
        const s = roundCurrency(subtotal);
        const fee = roundCurrency(deliveryFee);

        const totalInput = roundCurrency(desiredTotal);
        const hasDesiredTotal = String(desiredTotal || '').trim() !== '';

        let d = roundCurrency(discount);
        if (mode === 'total' && hasDesiredTotal) {
            const derivedDiscount = s + fee - totalInput;
            d = roundCurrency(derivedDiscount);
        }

        const total = roundCurrency(s - d + fee);
        return {
            subtotal: s,
            discount: d,
            deliveryFee: fee,
            desiredTotal: totalInput,
            total,
            hasDesiredTotal,
        };
    }, [subtotal, discount, deliveryFee, desiredTotal, mode]);

    const current = useMemo(() => {
        const currentSubtotal = roundCurrency(order?.subtotal ?? itemsSubtotal ?? 0);
        const currentDiscount = roundCurrency(order?.discount ?? 0);
        const currentDeliveryFee = roundCurrency(order?.deliveryFee ?? order?.shipping ?? order?.shippingCost ?? 0);
        const currentTotal = roundCurrency(order?.total ?? order?.totalPrice ?? (currentSubtotal - currentDiscount + currentDeliveryFee));
        return {
            subtotal: currentSubtotal,
            discount: currentDiscount,
            deliveryFee: currentDeliveryFee,
            total: currentTotal,
        };
    }, [order, itemsSubtotal]);

    const validation = useMemo(() => {
        if (!Number.isFinite(computed.subtotal) || computed.subtotal < 0) {
            return { ok: false, message: 'Subtotal must be a non-negative number.' };
        }
        if (!Number.isFinite(computed.discount) || computed.discount < 0) {
            return { ok: false, message: 'Discount must be a non-negative number.' };
        }
        if (computed.discount > computed.subtotal) {
            return { ok: false, message: 'Discount cannot exceed subtotal.' };
        }
        if (mode === 'total') {
            if (!computed.hasDesiredTotal) {
                return { ok: false, message: 'Please enter the desired final total.' };
            }
            if (!Number.isFinite(computed.desiredTotal) || computed.desiredTotal < 0) {
                return { ok: false, message: 'Total must be a non-negative number.' };
            }
        }
        if (!Number.isFinite(computed.deliveryFee) || computed.deliveryFee < 0) {
            return { ok: false, message: 'Delivery fee must be a non-negative number.' };
        }
        if (!String(reason || '').trim() || String(reason || '').trim().length < 3) {
            return { ok: false, message: 'Please provide a short reason (min 3 characters).' };
        }
        return { ok: true, message: '' };
    }, [computed, reason, mode]);

    if (!isOpen || !order) return null;

    const orderLabel = order?.orderNumber || order?._id?.slice(-8) || '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validation.ok) return;

        setSaving(true);
        setSubmitError('');
        try {
            const payload = {
                subtotal: computed.subtotal,
                deliveryFee: computed.deliveryFee,
                reason: String(reason || '').trim(),
            };

            if (mode === 'total' && computed.hasDesiredTotal) {
                payload.total = computed.desiredTotal;
            } else {
                payload.discount = computed.discount;
            }

            await onSave(payload);
        } catch (error) {
            setSubmitError(error?.message || 'Failed to update order pricing');
        } finally {
            setSaving(false);
        }
    };

    const applyReasonTemplate = (text) => {
        const next = String(text || '').trim();
        if (!next) return;
        setReason((prev) => (String(prev || '').trim() ? prev : next));
    };

    const handleClose = () => {
        if (saving) return;
        setSubmitError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleClose} aria-hidden="true"></div>

                <div className="relative inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Update Order Pricing</h3>
                            <p className="text-sm text-gray-500">Order #{orderLabel}</p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Close"
                        >
                            <HiX className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-6 py-5">
                        <div className="space-y-5">
                            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="text-sm text-gray-600">New total (auto-calculated)</div>
                                    <div className="text-lg font-bold text-gray-900">৳{computed.total.toFixed(2)}</div>
                                </div>
                                <div className="mt-2 text-xs text-gray-500">
                                    Total = Subtotal − Discount + Delivery fee
                                </div>

                                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                    <div className="rounded-lg border border-gray-100 bg-white px-3 py-2">
                                        <div className="text-gray-500">Current total</div>
                                        <div className="font-semibold text-gray-900">৳{current.total.toFixed(2)}</div>
                                    </div>
                                    <div className="rounded-lg border border-gray-100 bg-white px-3 py-2">
                                        <div className="text-gray-500">Current shipping</div>
                                        <div className="font-semibold text-gray-900">৳{current.deliveryFee.toFixed(2)}</div>
                                    </div>
                                    <div className="rounded-lg border border-gray-100 bg-white px-3 py-2">
                                        <div className="text-gray-500">New shipping</div>
                                        <div className="font-semibold text-gray-900">৳{computed.deliveryFee.toFixed(2)}</div>
                                    </div>
                                    <div className="rounded-lg border border-gray-100 bg-white px-3 py-2">
                                        <div className="text-gray-500">Change</div>
                                        <div className="font-semibold text-gray-900">৳{(computed.total - current.total).toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-gray-100 bg-white p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900">Edit mode</div>
                                        <div className="text-xs text-gray-500">Choose the simplest way to update pricing.</div>
                                    </div>
                                    <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                                        <button
                                            type="button"
                                            onClick={() => setMode('components')}
                                            disabled={saving}
                                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${mode === 'components'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            Subtotal/Discount
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setMode('total')}
                                            disabled={saving}
                                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${mode === 'total'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            Set final total
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtotal</label>
                                    <input
                                        type="number"
                                        inputMode="decimal"
                                        step="0.01"
                                        min="0"
                                        value={subtotal}
                                        onChange={(e) => setSubtotal(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
                                    <input
                                        type="number"
                                        inputMode="decimal"
                                        step="0.01"
                                        min="0"
                                        value={mode === 'total' && computed.hasDesiredTotal ? String(computed.discount) : discount}
                                        onChange={(e) => {
                                            if (mode === 'total') return;
                                            setDiscount(e.target.value);
                                        }}
                                        disabled={saving || (mode === 'total' && computed.hasDesiredTotal)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                        placeholder="0.00"
                                    />
                                    {mode === 'total' && computed.hasDesiredTotal ? (
                                        <div className="mt-1 text-[11px] text-gray-500">
                                            Discount auto-derived from your desired total.
                                        </div>
                                    ) : null}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery fee</label>
                                    <input
                                        type="number"
                                        inputMode="decimal"
                                        step="0.01"
                                        min="0"
                                        value={deliveryFee}
                                        onChange={(e) => setDeliveryFee(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {mode === 'total' ? (
                                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Desired final total</label>
                                    <input
                                        type="number"
                                        inputMode="decimal"
                                        step="0.01"
                                        min="0"
                                        value={desiredTotal}
                                        onChange={(e) => setDesiredTotal(e.target.value)}
                                        disabled={saving}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder={String(current.total.toFixed(2))}
                                    />
                                    <p className="mt-2 text-xs text-gray-500">
                                        We’ll calculate the required discount so the new total matches this value.
                                    </p>
                                </div>
                            ) : null}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Example: Customer requested discount / Delivery fee adjusted / Pricing correction"
                                />
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {[
                                        'Customer discount applied',
                                        'Delivery fee corrected',
                                        'Manual pricing correction',
                                    ].map((template) => (
                                        <button
                                            key={template}
                                            type="button"
                                            onClick={() => applyReasonTemplate(template)}
                                            disabled={saving}
                                            className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            {template}
                                        </button>
                                    ))}
                                </div>
                                <p className="mt-2 text-xs text-gray-500">
                                    This will be saved to pricing history for auditing.
                                </p>
                            </div>

                            {!validation.ok ? (
                                <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2 text-sm text-yellow-700">
                                    {validation.message}
                                </div>
                            ) : null}

                            {submitError ? (
                                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                                    {submitError}
                                </div>
                            ) : null}

                            <div className="pt-1 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={saving}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving || !validation.ok}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Pricing'
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
