import Image from 'next/image';
import { FiPackage } from 'react-icons/fi';

/**
 * TopProducts Component
 * Responsibility: Display top 5 best-selling products
 */
export default function TopProducts({ products }) {
    if (!products || products.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Products</h3>
                <div className="text-center py-8 text-gray-500">
                    <FiPackage size={48} className="mx-auto mb-2 opacity-20" />
                    <p>No product data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Products</h3>
            <div className="space-y-4">
                {products.slice(0, 5).map((product, index) => (
                    <div
                        key={product._id}
                        className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        <div className="flex-shrink-0 w-12 h-12 relative bg-gray-100 rounded-lg overflow-hidden">
                            {product.image ? (
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <FiPackage className="text-gray-400" size={24} />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                                {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {product.totalQuantity} sold • ৳{product.totalRevenue.toFixed(2)} revenue
                            </p>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                index === 1 ? 'bg-gray-100 text-gray-700' :
                                    index === 2 ? 'bg-orange-100 text-orange-700' :
                                        'bg-gray-50 text-gray-600'
                                }`}>
                                #{index + 1}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
