import Image from 'next/image';
import Link from 'next/link';
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';

function StarRating({ rating }) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center gap-0.5 sm:gap-1">
            {[...Array(fullStars)].map((_, i) => (
                <FaStar key={`full-${i}`} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
            ))}
            {hasHalfStar && <FaStarHalfAlt className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />}
            {[...Array(emptyStars)].map((_, i) => (
                <FaRegStar key={`empty-${i}`} className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
            ))}
            {rating && <span className="text-xs sm:text-sm text-gray-600 ml-1">{rating.toFixed(1)}/5</span>}
        </div>
    );
}

export default function SearchProductCard({ product }) {
    const productLink = product.link || `/product/${product._id || product.id}`;

    return (
        <div className="group relative bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-gray-300 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
            <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
                <Link href={product.link} className="block h-full">
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={400}
                        height={400}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        quality={85}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                </Link>
                {product.discount > 0 && (
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                        -{product.discount}%
                    </div>
                )}
                {product.isNew && (
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                        NEW
                    </div>
                )}
            </div>
            <div className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col">
                <Link href={product.link}>
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-black mb-1.5 sm:mb-2 group-hover:text-gray-700 transition-colors line-clamp-2">
                        {product.name}
                    </h3>
                </Link>
                {product.rating && (
                    <div className="mb-2 sm:mb-3">
                        <StarRating rating={product.rating} />
                    </div>
                )}
                <div className="mt-auto">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg sm:text-xl lg:text-2xl font-black text-red-600">৳{product.price}</span>
                        {product.originalPrice && (
                            <span className="text-xs sm:text-sm text-gray-500 line-through">৳{product.originalPrice}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

