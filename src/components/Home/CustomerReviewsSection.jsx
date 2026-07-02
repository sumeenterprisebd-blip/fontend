import { useState, useEffect, useMemo, useRef } from 'react';
import ReviewCard from './ReviewCard';
import { useSlider } from '@/hooks/useSlider';
import { reviewsAPI } from '@/services/api';

const fallbackReviews = [
    {
        id: 'static-1',
        name: 'Farzana S.',
        rating: 5,
        comment: 'Great quality and fast delivery. The fabric feels premium and fits perfectly.',
    },
    {
        id: 'static-2',
        name: 'Hasan M.',
        rating: 4.8,
        comment: 'Loved the style and packaging. Will definitely shop again.',
    },
    {
        id: 'static-3',
        name: 'Nusrat A.',
        rating: 5,
        comment: 'Excellent customer service and the sizing guide was spot on.',
    },
    {
        id: 'static-4',
        name: 'Rafi K.',
        rating: 4.9,
        comment: 'Clean stitching and premium feel. Worth the price.',
    },
];

export default function CustomerReviewsSection({ initialReviews = [] }) {
    const [reviews, setReviews] = useState(initialReviews);
    const [loading, setLoading] = useState(initialReviews.length === 0);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    const mergedReviews = useMemo(() => {
        if (reviews.length > 0) return reviews;
        return fallbackReviews;
    }, [reviews]);

    useEffect(() => {
        const node = sectionRef.current;
        if (!node || typeof window === 'undefined') return undefined;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry && entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px 0px' }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible || initialReviews.length > 0) return undefined;
        let idleId;
        let idleFallbackId;

        const fetchReviews = async () => {
            try {
                const response = await reviewsAPI.getPublicReviews(20);
                const reviewsData = response.data.reviews || [];
                setReviews(reviewsData);
            } catch (error) {
                setReviews([]);
            } finally {
                setLoading(false);
            }
        };

        const onIdle = () => {
            fetchReviews();
        };

        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
            idleId = window.requestIdleCallback(onIdle, { timeout: 1500 });
        } else {
            idleFallbackId = setTimeout(onIdle, 300);
        }

        return () => {
            if (idleId && typeof window !== 'undefined') {
                window.cancelIdleCallback(idleId);
            }
            if (idleFallbackId) clearTimeout(idleFallbackId);
        };
    }, [isVisible, initialReviews.length]);

    const {
        sliderRef,
        containerRef,
        itemWidth,
        visibleItems,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        setIsPaused
    } = useSlider(mergedReviews.length, { isActive: isVisible });

    // Duplicate reviews for seamless loop
    const duplicatedReviews = mergedReviews.length > 0 ? [
        ...mergedReviews,
        ...mergedReviews,
    ] : [];

    if (!isVisible || loading) {
        return (
            <section ref={sectionRef} className="w-full py-8 sm:py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-6 sm:mb-8 lg:mb-12">
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2 sm:mb-3 uppercase">
                            What Our Customers Say
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                                <div className="h-4 w-32 bg-gray-200 rounded-full animate-pulse" />
                                <div className="mt-3 h-3 w-24 bg-gray-200 rounded-full animate-pulse" />
                                <div className="mt-4 h-3 w-full bg-gray-200 rounded-full animate-pulse" />
                                <div className="mt-2 h-3 w-5/6 bg-gray-200 rounded-full animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (mergedReviews.length === 0) {
        return null;
    }

    return (
        <section ref={sectionRef} className="w-full py-8 sm:py-12 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-6 sm:mb-8 lg:mb-12">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2 sm:mb-3 uppercase">
                        What Our Customers Say
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                        Real reviews from satisfied customers
                    </p>
                </div>

                {/* Slider Container */}
                <div
                    ref={containerRef}
                    className="relative overflow-hidden"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        ref={sliderRef}
                        className="flex will-change-transform transition-transform duration-300 ease-out gap-6 sm:gap-8"
                    >
                        {duplicatedReviews.map((review, index) => (
                            <div
                                key={`${review.id || review._id || review.name}-${index}`}
                                className="shrink-0"
                                style={itemWidth > 0 ? { width: `${itemWidth}px` } : {}}
                            >
                                <ReviewCard review={review} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
