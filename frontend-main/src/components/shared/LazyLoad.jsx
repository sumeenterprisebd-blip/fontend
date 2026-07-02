import { useEffect, useRef, useState } from 'react';

/**
 * Lazy load component with Intersection Observer
 * Improves Speed Index by deferring below-the-fold content
 */
export default function LazyLoad({ children, threshold = 0.1, rootMargin = '50px' }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                threshold,
                rootMargin,
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [threshold, rootMargin]);

    return (
        <div ref={ref}>
            {isVisible ? children : <div style={{ minHeight: '200px' }} />}
        </div>
    );
}
