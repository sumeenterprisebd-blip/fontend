import { useState, useEffect } from "react";
import { advanceAPI } from "@/services/api";

const DEFAULT_METHODS = ["bkash", "nagad", "rocket", "upay"];

export default function AdvancePaymentModal({
    isOpen,
    onClose,
    order,
    paymentNumber = "01995794410",
    supportedMethods = DEFAULT_METHODS,
    onSuccess,
}) {
    const [paymentMethod, setPaymentMethod] = useState(supportedMethods[0] || "bkash");
    const [senderNumber, setSenderNumber] = useState("");
    const [paidAmount, setPaidAmount] = useState(order?.deliveryFee || 0);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setPaidAmount(order?.deliveryFee || 0);
    }, [order?.deliveryFee]);

    useEffect(() => {
        if (!isOpen) return;

        const originalOverflow = document.body.style.overflow;
        const originalPaddingRight = document.body.style.paddingRight;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        document.body.style.overflow = 'hidden';
        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }

        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.paddingRight = originalPaddingRight;
        };
    }, [isOpen]);

    if (!isOpen || !order) return null;

    const minAmount = Number(order?.deliveryFee || 0);

    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        const normalizedSender = String(senderNumber || "").replace(/[^0-9]/g, "");
        if (!/^01[3-9]\d{8}$/.test(normalizedSender)) {
            setError("Enter a valid Bangladesh sender mobile number (01XXXXXXXXX).");
            return;
        }



        const paid = Number(paidAmount);
        if (!Number.isFinite(paid) || paid < minAmount) {
            setError(`Paid amount must be at least ৳${minAmount}.`);
            return;
        }

        setLoading(true);
        try {
            const payload = {
                orderId: order._id || order.orderId || null,
                customerPhone: order.customerPhone || order.shippingAddress?.phone || "",
                townCity: order.townCity || order.shippingAddress?.townCity || "",
                paymentMethod,
                senderNumber: normalizedSender,
                paidAmount: paid,
            };
            const response = await advanceAPI.submitAdvance(payload);
            if (!response.data?.success) {
                throw new Error(response.data?.message || "Failed to submit advance payment.");
            }
            if (typeof onSuccess === "function") {
                onSuccess(response.data.order || response.data.advancePayment || {});
            }
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to submit advance payment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 animate-fadeIn"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="advance-payment-title"
        >
            <div className="w-full max-w-lg rounded-[2rem] bg-white shadow-2xl ring-1 ring-black/10 border border-gray-100 overflow-hidden transform transition-all duration-300 animate-slideUp max-h-[calc(100vh-3rem)] overflow-y-auto">
                <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-5 sm:px-6 sm:py-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Advance Payment Required</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Your order requires advance delivery payment because a prior order was cancelled. Please pay the delivery charge now to confirm this order.
                        </p>
                        {order?.orderNumber ? (
                            <p className="mt-2 text-sm text-gray-500">Order ID: #{order.orderNumber}</p>
                        ) : null}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex min-h-[44px] h-12 items-center justify-center rounded-full border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/10"
                    >
                        Close
                    </button>
                </div>

                <div className="px-5 py-5 sm:px-6 sm:py-6 space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                            <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Payment Number</div>
                            <div className="mt-2 text-lg font-semibold text-gray-900">{paymentNumber}</div>
                        </div>
                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                            <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Delivery Charge</div>
                            <div className="mt-2 text-lg font-semibold text-gray-900">৳{minAmount}</div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-4">
                        <label className="block text-sm font-medium text-gray-800">Payment Method</label>
                        <select
                            value={paymentMethod}
                            onChange={(event) => setPaymentMethod(event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
                        >
                            {supportedMethods.map((method) => (
                                <option key={method} value={method}>
                                    {method.charAt(0).toUpperCase() + method.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-1">
                        <label className="block text-sm text-gray-700">
                            Sender Mobile Number
                            <input
                                type="text"
                                value={senderNumber}
                                onChange={(event) => setSenderNumber(event.target.value.replace(/[^0-9]/g, ""))}
                                placeholder="01XXXXXXXXX"
                                className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-4 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
                            />
                        </label>
                    </div>

                    <label className="block text-sm text-gray-700">
                        Paid Amount
                        <input
                            type="number"
                            min={minAmount}
                            step="0.01"
                            value={paidAmount}
                            onChange={(event) => setPaidAmount(event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-4 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
                        />
                    </label>

                    {error ? (
                        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    ) : null}

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-gray-600 max-w-xl">
                            The paid amount must be at least the delivery charge and will be deducted from your final order balance.
                        </div>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="inline-flex min-h-[44px] h-12 w-full items-center justify-center rounded-2xl bg-black px-6 text-base font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                        >
                            {loading ? "Submitting..." : "Submit Advance Payment"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
