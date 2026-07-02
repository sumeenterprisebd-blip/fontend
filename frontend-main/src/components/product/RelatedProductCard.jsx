import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { FiEye, FiShoppingBag } from 'react-icons/fi';

function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }, (_, i) => (
        <FaStar key={`full-${i}`} className="w-3 h-3 text-yellow-400" />
      ))}
      {hasHalfStar && <FaStarHalfAlt className="w-3 h-3 text-yellow-400" />}
      {Array.from({ length: emptyStars }, (_, i) => (
        <FaRegStar key={`empty-${i}`} className="w-3 h-3 text-gray-300" />
      ))}
    </div>
  );
}

export default function RelatedProductCard({ product, onAddToCart }) {
  const router = useRouter();

  const handleViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(product.link);
  };

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to product page for color/size selection
    router.push(product.link);
  };

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 h-full flex flex-col hover:border-gray-300 hover:shadow-lg">
      <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
        <Link href={product.link}>
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            quality={85}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        {product.discount > 0 && (
          <div className="absolute top-3 right-3 bg-black text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10">
          <button
            onClick={handleViewClick}
            className="bg-white rounded-full p-2.5 shadow-lg hover:scale-110 transition-all"
            aria-label={`View ${product.name}`}
          >
            <FiEye className="w-4 h-4 text-black" />
          </button>
          <button
            onClick={handleAddToCartClick}
            className="bg-white rounded-full p-2.5 shadow-lg hover:scale-110 transition-all"
            aria-label={`Add ${product.name} to cart`}
          >
            <FiShoppingBag className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <Link href={product.link}>
          <h3 className="text-sm font-semibold text-black mb-2 group-hover:text-gray-700 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="mb-2">
          <StarRating rating={product.rating} />
        </div>
        <div className="mt-auto">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg font-black text-black">৳{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through">
                ৳{product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

