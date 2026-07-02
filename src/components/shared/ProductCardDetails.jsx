import Link from 'next/link';
import StarRating from './StarRating';

export default function ProductCardDetails({ product }) {
    const productLink = product.slug
        ? `/product/${product.slug}`
        : `/product/${product._id || product.id}`;

    return (
        <div className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col">
            <Link href={productLink}>
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-black mb-1.5 sm:mb-2 group-hover:text-gray-700 transition-colors line-clamp-2">
                    {product.name}
                </h3>
            </Link>

            <div className="mb-2 sm:mb-3">
                <StarRating rating={product.rating || 0} />
            </div>

            {product.dressStyle && (
                <div className="mb-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {product.dressStyle}
                    </span>
                </div>
            )}

            <div className="mt-auto space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900">
                        ৳{product.price?.toFixed(2) || '0.00'}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs sm:text-sm text-gray-500 line-through">
                            ৳{product.originalPrice.toFixed(2)}
                        </span>
                    )}
                </div>

                {product.stock !== undefined && (
                    <div className="flex items-center gap-2 text-xs">
                        {product.stock > 0 && product.stock < 10 ? (
                            <span className="text-orange-600 font-medium">
                                Only {product.stock} left!
                            </span>
                        ) : product.stock === 0 ? (
                            <span className="text-red-600 font-medium">Out of stock</span>
                        ) : null}
                    </div>
                )}

                {product.colors && product.colors.length > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-gray-500">Colors:</span>
                        <div className="flex gap-1">
                            {product.colors.slice(0, 4).map((color, idx) => (
                                <span
                                    key={idx}
                                    className="text-xs px-1.5 py-0.5 bg-gray-100 rounded text-gray-600"
                                >
                                    {color}
                                </span>
                            ))}
                            {product.colors.length > 4 && (
                                <span className="text-xs text-gray-400">+{product.colors.length - 4}</span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
