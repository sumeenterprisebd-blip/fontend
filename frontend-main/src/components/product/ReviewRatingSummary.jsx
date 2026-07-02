import { FaRegStar, FaStar } from 'react-icons/fa';

export default function ReviewRatingSummary({ averageRating, reviews }) {
    const ratingCounts = [5, 4, 3, 2, 1].map(rating =>
        reviews.filter(review => review.rating === rating).length
    );

    return (
        <div className="bg-white rounded-xl p-6 mb-8 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Average Rating */}
                <div className="flex flex-col items-center justify-center border-r border-gray-200">
                    <div className="text-5xl font-bold text-black mb-2">
                        {averageRating.toFixed(1)}
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                            i < Math.round(averageRating) ? (
                                <FaStar key={i} className="w-6 h-6 text-yellow-400" />
                            ) : (
                                <FaRegStar key={i} className="w-6 h-6 text-gray-200" />
                            )
                        ))}
                    </div>
                    <p className="text-gray-600">Based on {reviews.length} reviews</p>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating, index) => (
                        <div key={rating} className="flex items-center gap-3">
                            <div className="flex items-center gap-1 w-20">
                                <span className="text-sm font-medium">{rating}</span>
                                <FaStar className="w-4 h-4 text-yellow-400" />
                            </div>
                            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-400 transition-all duration-300"
                                    style={{
                                        width: `${reviews.length > 0 ? (ratingCounts[index] / reviews.length) * 100 : 0}%`
                                    }}
                                />
                            </div>
                            <span className="text-sm text-gray-600 w-12 text-right">
                                {ratingCounts[index]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
