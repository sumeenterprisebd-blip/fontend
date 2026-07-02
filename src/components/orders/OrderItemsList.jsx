import Image from 'next/image';

export default function OrderItemsList({ items }) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
                {items.map((item, index) => {
                    const itemImage = item.image || item.product?.images?.[0] || '/logo.jpeg';
                    const itemName = item.name || item.product?.name || 'Product';
                    const itemPrice = item.price || 0;
                    const itemQuantity = item.quantity || 1;

                    return (
                        <div key={index} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                            <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                <Image src={itemImage} alt={itemName} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 mb-1 truncate">{itemName}</h3>
                                {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                                {item.color && <p className="text-sm text-gray-600">Color: {item.color}</p>}
                                <p className="text-sm text-gray-600">Quantity: {itemQuantity}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="font-semibold text-gray-900">৳{itemPrice.toFixed(2)}</p>
                                <p className="text-xs text-gray-500">৳{(itemPrice * itemQuantity).toFixed(2)} total</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
