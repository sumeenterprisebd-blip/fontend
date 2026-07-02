import { HiShoppingBag } from 'react-icons/hi';

export default function OrderItemsTable({
    orderItems,
    editable = false,
    disabled = false,
    onOrderItemsChange,
    showTotals = false,
    deliveryFee = 0,
}) {
    const items = Array.isArray(orderItems) ? orderItems : [];

    const updateItem = (index, patch) => {
        if (!editable || disabled) return;
        if (typeof onOrderItemsChange !== 'function') return;
        const next = items.map((item, idx) => (idx === index ? { ...item, ...patch } : item));
        onOrderItemsChange(next);
    };

    const itemsSubtotal = items.reduce((sum, item) => {
        const price = Number(item?.price ?? 0);
        const qty = Number(item?.quantity ?? 0);
        return sum + price * qty;
    }, 0);

    const computedTotal = itemsSubtotal + Number(deliveryFee || 0);

    return (
        <div className="mt-6 space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <HiShoppingBag className="w-5 h-5 text-blue-600" />
                Order Items ({items.length || 0})
            </h4>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        {item.image && (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                        )}
                                        <div>
                                            {editable ? (
                                                <input
                                                    type="text"
                                                    value={String(item?.name ?? '')}
                                                    onChange={(e) => updateItem(index, { name: e.target.value })}
                                                    disabled={disabled}
                                                    className="w-full max-w-[280px] px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Product name"
                                                />
                                            ) : (
                                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                            )}

                                            {(() => {
                                                const category = String(item?.category ?? item?.product?.category ?? '').trim();
                                                if (!category) return null;
                                                return <p className="text-xs text-gray-500">Category: {category}</p>;
                                            })()}

                                            {item.color && (
                                                <p className="text-xs text-gray-500">Color: {item.color}</p>
                                            )}
                                            {item.size && (
                                                <p className="text-xs text-gray-500">Size: {item.size}</p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                    {editable ? (
                                        <input
                                            type="number"
                                            inputMode="decimal"
                                            value={String(item?.price ?? '')}
                                            onChange={(e) => updateItem(index, { price: e.target.value })}
                                            disabled={disabled}
                                            className="w-28 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min="0"
                                            step="0.01"
                                        />
                                    ) : (
                                        <>৳{Number(item.price || 0).toFixed(2)}</>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                    {editable ? (
                                        <input
                                            type="number"
                                            inputMode="numeric"
                                            value={String(item?.quantity ?? '')}
                                            onChange={(e) => updateItem(index, { quantity: e.target.value })}
                                            disabled={disabled}
                                            className="w-20 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min="1"
                                            step="1"
                                        />
                                    ) : (
                                        <>×{Number(item.quantity || 0)}</>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                                    ৳{(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showTotals ? (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 text-sm">
                    <div className="text-gray-700">
                        Items Subtotal: <span className="font-semibold text-gray-900">৳{Number(itemsSubtotal || 0).toFixed(2)}</span>
                    </div>
                    <div className="text-gray-700">
                        Delivery Fee: <span className="font-semibold text-gray-900">৳{Number(deliveryFee || 0).toFixed(2)}</span>
                    </div>
                    <div className="text-gray-900">
                        Total: <span className="font-bold">৳{Number(computedTotal || 0).toFixed(2)}</span>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
