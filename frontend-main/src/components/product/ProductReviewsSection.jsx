import { useState, useEffect } from 'react';
import { reviewsAPI } from '@/services/api';
import ReviewRatingSummary from './ReviewRatingSummary';
import ReviewCard from './ReviewCard';

export default function ProductReviewsSection({ productId, initialReviews = [] }) {
    const [reviews, setReviews] = useState(initialReviews);
    const [loading, setLoading] = useState(initialReviews.length === 0);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!productId) return;

            try {
                const response = await reviewsAPI.getProductReviews(productId);
                setReviews(response.data.reviews || []);
            } catch (error) {
                setReviews([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [productId]);

    if (loading) {
        return (
            <section className="w-full py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-6 uppercase">
                        Customer Reviews
                    </h2>
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                <div className="h-4 w-40 bg-gray-200 rounded-full animate-pulse" />
                                <div className="mt-3 h-3 w-2/3 bg-gray-200 rounded-full animate-pulse" />
                                <div className="mt-2 h-3 w-full bg-gray-200 rounded-full animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (reviews.length === 0) {
        return (
            <section className="w-full py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-6 uppercase">
                        Customer Reviews
                    </h2>
                    <div className="text-center text-gray-500 py-8">
                        No reviews yet. Be the first to review this product!
                    </div>
                </div>
            </section>
        );
    }

    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    return (
        <section className="w-full py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-6 uppercase">
                    Customer Reviews
                </h2>

                <ReviewRatingSummary averageRating={averageRating} reviews={reviews} />

                <div className="space-y-6">
                    {reviews.map((review) => (
                        <ReviewCard key={review._id} review={review} />
                    ))}
                </div>
            </div>
        </section>
    );
}
