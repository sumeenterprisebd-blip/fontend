'use client';
import { Children, useEffect, useState } from 'react';

export default function HeroCarousel({ children }) {
    const slides = Children.toArray(children);
    const totalSlides = slides.length;
    const [currentIndex, setCurrentIndex] = useState(0);

    // Keep the index in range when the slide count changes
    useEffect(() => {
        if (totalSlides === 0) {
            setCurrentIndex(0);
            return;
        }
        setCurrentIndex((prev) => prev % totalSlides);
    }, [totalSlides]);

    // Auto-play functionality
    useEffect(() => {
        if (totalSlides <= 1) return undefined;

        const intervalId = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % totalSlides);
        }, 5000);

        return () => clearInterval(intervalId);
    }, [totalSlides]);

    const goToSlide = (index) => {
        if (index === currentIndex || index < 0 || index >= totalSlides) return;
        setCurrentIndex(index);
    };

    return (
        <div className="relative w-full overflow-hidden bg-white">
            <div className="w-full">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`w-full transition-opacity duration-500 ease-in-out ${index === currentIndex ? 'opacity-100' : 'hidden opacity-0'
                            }`}
                    >
                        {slide}
                    </div>
                ))}
            </div>

            {totalSlides > 1 && (
                <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 sm:gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2 sm:h-3 rounded-full transition-all duration-300 touch-manipulation ${index === currentIndex
                                ? 'bg-black w-6 sm:w-8'
                                : 'bg-gray-400 hover:bg-gray-600 w-2 sm:w-3'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function HeroSlide({ children }) {
    return <div className="w-full">{children}</div>;
}
