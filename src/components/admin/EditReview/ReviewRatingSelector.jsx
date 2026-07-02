import { FaStar } from 'react-icons/fa';

export default function ReviewRatingSelector({ rating, setRating, hoveredRating, setHoveredRating }) {
    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
            </label>
            <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform hover:scale-110"
                    >
                        <FaStar
                            className={`w-8 h-8 ${star <= (hoveredRating || rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                                }`}
                        />
                    </button>
                ))}
                {rating > 0 && (
                    <span className="ml-2 text-sm text-gray-600">
                        {rating} out of 5
                    </span>
                )}
            </div>
        </div>
    );
}
