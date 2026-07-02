import Image from 'next/image';
import Link from 'next/link';
import { FiEye } from '@react-icons/all-files/fi/FiEye';
import { FiShoppingBag } from '@react-icons/all-files/fi/FiShoppingBag';

export function ProductImage({ product }) {
    const productImage = (product.images && product.images[0])
        ? product.images[0]
        : product.image || '/logo.jpeg';

    const discountPercent = product.originalPrice && product.price < product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : product.discount;

    const isNew = product.isNew || (product.createdAt &&
        new Date() - new Date(product.createdAt) < 30 * 24 * 60 * 60 * 1000);

    const productLink = product.slug
        ? `/product/${product.slug}`
        : `/product/${product._id || product.id}`;

    return (
        <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
            <Link href={productLink} className="block h-full">
                <Image
                    src={productImage}
                    alt={product.name}
                    width={400}
                    height={400}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    quality={85}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = '/logo.jpeg';
                    }}
                />
            </Link>

            {isNew && (
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                    NEW
                </div>
            )}

            {discountPercent > 0 && (
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                    -{discountPercent}%
                </div>
            )}
        </div>
    );
}

export function ProductOverlay({ product, onViewClick, onAddToCartClick }) {
    return (
        <div className="absolute inset-0 flex items-center justify-center gap-3 sm:gap-4 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 bg-black/10 sm:bg-black/20">
            <button
                onClick={onViewClick}
                className="bg-white rounded-full p-2.5 sm:p-3 shadow-lg hover:scale-110 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-black"
                aria-label={`View ${product.name}`}
            >
                <FiEye className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
            </button>
            <button
                onClick={onAddToCartClick}
                className="bg-white rounded-full p-2.5 sm:p-3 shadow-lg hover:scale-110 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-black"
                aria-label={`Add ${product.name} to cart`}
            >
                <FiShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
            </button>
        </div>
    );
}
