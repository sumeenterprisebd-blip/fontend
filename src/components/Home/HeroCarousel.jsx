'use client';
import { Children, useEffect, useState } from 'react';

export default function HeroCarousel({ children }) {
    const slides = Children.toArray(children);
    const totalSlides = slides.length;
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (totalSlides === 0) {
            setCurrentIndex(0);
            return;
        }
        setCurrentIndex((prev) => prev % totalSlides);
    }, [totalSlides]);

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
            <div className="relative w-full">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`w-full transition-all duration-700 ease-out ${index === currentIndex
                            ? 'relative opacity-100'
                            : 'pointer-events-none absolute inset-0 opacity-0'
                            }`}
                        aria-hidden={index !== currentIndex}
                    >
                        {slide}
                    </div>
                ))}
            </div>

            {totalSlides > 1 && (
                <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 sm:bottom-6 sm:gap-2 md:bottom-8">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2 rounded-full transition-all duration-300 touch-manipulation sm:h-3 ${index === currentIndex
                                ? 'w-6 bg-black sm:w-8'
                                : 'w-2 bg-gray-400 hover:bg-gray-600 sm:w-3'
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
