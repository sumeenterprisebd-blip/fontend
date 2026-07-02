export default function PaymentMethodSection({
    value = 'cash',
    onChange,
    onBlur,
    sslcommerzEnabled = false,
    advanceAmount = 0,
    formData = {},
    errors = {},
    paymentNumber = '01995794410',
    supportedMethods = ['bkash', 'nagad', 'rocket', 'upay'],
}) {
    const selected = String(value || 'cash');
    const formattedAdvanceAmount = `৳${Number(advanceAmount || 0).toFixed(2)}`;
    const advanceMethod = String(formData.advanceBankMethod || 'bkash');
    const advanceSenderNumber = String(formData.advanceSenderNumber || '');
    const advancePaidAmount = String(formData.advancePaidAmount || '');
    const advanceTransactionId = String(formData.advanceTransactionId || '');

    return (
        <section className="rounded-xl border border-gray-100 bg-gray-50 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">Payment Method</h3>
                    <p className="mt-1 text-sm text-gray-600">Choose how you want to pay.</p>
                </div>
                <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    Available
                </span>
            </div>

            <div className="mt-4 space-y-3">
                <label className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={selected === 'cash'}
                        onChange={onChange}
                        className="h-4 w-4"
                    />
                    <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">Cash on Delivery (COD)</div>
                        <div className="text-xs text-gray-500">Pay when you receive your order.</div>
                    </div>
                </label>

                <label className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="advance"
                        checked={selected === 'advance'}
                        onChange={onChange}
                        className="h-4 w-4"
                    />
                    <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">Advance Payment (Full Payment)</div>
                        <div className="text-xs text-gray-500">Pay the full order amount now using mobile banking.</div>
                    </div>
                </label>

                {sslcommerzEnabled && (
                    <label className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="sslcommerz"
                            checked={selected === 'sslcommerz'}
                            onChange={onChange}
                            className="h-4 w-4"
                        />
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-900">SSLCommerz (Online Payment)</div>
                            <div className="text-xs text-gray-500">Pay securely with cards, mobile banking, and more.</div>
                        </div>
                    </label>
                )}
            </div>

            {selected === 'advance' && (
                <div className="mt-4 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="text-sm font-semibold text-gray-900">Total Order Amount</div>
                    <div className="mt-2 text-4xl font-bold text-gray-900">{formattedAdvanceAmount}</div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                        Please send the full amount to the above number using your preferred mobile banking method.
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-gray-50 p-3 text-sm text-gray-700">
                            <div className="font-semibold text-gray-900">Payment number</div>
                            <div className="mt-1 text-base font-bold text-gray-900">{paymentNumber}</div>
                        </div>
                        <div className="rounded-2xl bg-gray-50 p-3 text-sm text-gray-700">
                            <div className="font-semibold text-gray-900">Supported methods</div>
                            <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600">
                                {supportedMethods.map((method) => (
                                    <span key={method} className="rounded-full bg-white px-3 py-1 font-medium text-gray-700 shadow-sm">
                                        {method.toUpperCase()} (Personal)
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-900">Mobile banking method</label>
                            <select
                                name="advanceBankMethod"
                                value={advanceMethod}
                                onChange={onChange}
                                onBlur={onBlur}
                                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-gray-700 focus:outline-none"
                            >
                                {supportedMethods.map((method) => (
                                    <option key={method} value={method}>
                                        {method.charAt(0).toUpperCase() + method.slice(1)}
                                    </option>
                                ))}
                            </select>
                            {errors.advanceBankMethod && (
                                <p className="mt-2 text-xs text-red-600">{errors.advanceBankMethod}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-900">Sender mobile number</label>
                            <input
                                type="text"
                                name="advanceSenderNumber"
                                value={advanceSenderNumber}
                                onChange={onChange}
                                onBlur={onBlur}
                                placeholder="e.g. 017XXXXXXXX"
                                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-gray-700 focus:outline-none"
                            />
                            {errors.advanceSenderNumber && (
                                <p className="mt-2 text-xs text-red-600">{errors.advanceSenderNumber}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-900">Paid amount</label>
                            <input
                                type="number"
                                min="1"
                                step="1"
                                name="advancePaidAmount"
                                value={advancePaidAmount}
                                onChange={onChange}
                                onBlur={onBlur}
                                placeholder="Enter the full order amount"
                                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-gray-700 focus:outline-none"
                            />
                            {errors.advancePaidAmount && (
                                <p className="mt-2 text-xs text-red-600">{errors.advancePaidAmount}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-900">Transaction ID (optional)</label>
                            <input
                                type="text"
                                name="advanceTransactionId"
                                value={advanceTransactionId}
                                onChange={onChange}
                                onBlur={onBlur}
                                placeholder="Enter mobile banking transaction ID"
                                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-gray-700 focus:outline-none"
                            />
                            {errors.advanceTransactionId && (
                                <p className="mt-2 text-xs text-red-600">{errors.advanceTransactionId}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
