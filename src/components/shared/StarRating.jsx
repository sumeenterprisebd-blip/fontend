import { FaRegStar } from '@react-icons/all-files/fa/FaRegStar';
import { FaStar } from '@react-icons/all-files/fa/FaStar';
import { FaStarHalfAlt } from '@react-icons/all-files/fa/FaStarHalfAlt';

export default function StarRating({ rating = 0 }) {
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
      {rating > 0 && (
        <span className="text-xs sm:text-sm text-gray-600 ml-1">{rating.toFixed(1)}/5</span>
      )}
    </div>
  );
}

