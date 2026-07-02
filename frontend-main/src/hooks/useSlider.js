import { useState, useEffect, useRef, useCallback } from 'react';

export function useSlider(itemCount, options = {}) {
    const { isActive = true } = options;
    const [isPaused, setIsPaused] = useState(false);
    const sliderRef = useRef(null);
    const containerRef = useRef(null);
    const animationRef = useRef(null);
    const positionRef = useRef(0);
    const lastFrameTimeRef = useRef(0);
    const [itemWidth, setItemWidth] = useState(0);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setPrefersReducedMotion(!!media.matches);
        update();

        if (typeof media.addEventListener === 'function') {
            media.addEventListener('change', update);
            return () => media.removeEventListener('change', update);
        }

        media.addListener(update);
        return () => media.removeListener(update);
    }, []);

    const getVisibleItems = useCallback(() => {
        if (typeof window === 'undefined') return 1; // Default to 1 for SSR
        if (window.innerWidth < 768) return 1; // Mobile: single card
        if (window.innerWidth < 1024) return 2; // Tablet: 2 cards
        return 4; // Desktop: 4 cards
    }, []);

    // Initialize with correct value for mobile-first approach
    const [visibleItems, setVisibleItems] = useState(() => {
        if (typeof window !== 'undefined') {
            return getVisibleItems();
        }
        return 1; // Default to 1 for SSR
    });

    useEffect(() => {
        let resizeTimeout;
        let rafId;
        const updateSizes = () => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const newVisibleItems = getVisibleItems();
                setVisibleItems(newVisibleItems);
                if (containerRef.current) {
                    const containerWidth = containerRef.current.offsetWidth;
                    // No gap on mobile for single card, gap for multiple cards
                    const gap = newVisibleItems === 1 ? 0 : 24;
                    const calculatedWidth = newVisibleItems === 1
                        ? containerWidth
                        : (containerWidth - (gap * (newVisibleItems - 1))) / newVisibleItems;
                    setItemWidth(calculatedWidth);
                }
                positionRef.current = 0;
            });
        };
        // Initial update
        updateSizes();
        // Handle resize with debounce for performance
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateSizes, 100);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimeout);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [getVisibleItems]);

    useEffect(() => {
        let raf = null;
        if (containerRef.current && itemWidth === 0) {
            raf = requestAnimationFrame(() => {
                const containerWidth = containerRef.current.offsetWidth;
                const gap = visibleItems === 1 ? 0 : 24;
                const calculatedWidth = visibleItems === 1
                    ? containerWidth
                    : (containerWidth - (gap * (visibleItems - 1))) / visibleItems;
                setItemWidth(calculatedWidth);
            });
        }
        return () => {
            if (raf) cancelAnimationFrame(raf);
        };
    }, [visibleItems, itemWidth]);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        setIsPaused(true);
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!sliderRef.current || itemWidth === 0) return;

        const swipeDistance = touchStartX.current - touchEndX.current;
        const minSwipeDistance = 50;

        if (Math.abs(swipeDistance) > minSwipeDistance) {
            const singleSetWidth = itemWidth * itemCount;
            if (swipeDistance > 0) {
                positionRef.current += itemWidth;
            } else {
                positionRef.current -= itemWidth;
            }

            if (positionRef.current >= singleSetWidth) {
                positionRef.current = 0;
            } else if (positionRef.current < 0) {
                positionRef.current = singleSetWidth - itemWidth;
            }

            sliderRef.current.style.transform = `translateX(-${positionRef.current}px)`;
        }

        setIsPaused(false);
    };

    useEffect(() => {
        if (!isActive) return undefined;
        if (prefersReducedMotion) return undefined;
        if (isPaused) return undefined;
        if (itemWidth === 0) return undefined;
        if (!sliderRef.current) return undefined;

        // Throttle transform updates to ~30fps to reduce main-thread work,
        // while keeping perceived motion smooth.
        const minFrameMs = 33;

        const animate = (now) => {
            if (!sliderRef.current) return;

            const last = lastFrameTimeRef.current || 0;
            const delta = now - last;
            if (delta >= minFrameMs) {
                lastFrameTimeRef.current = now;

                const baseSpeedPerFrame = visibleItems === 1 ? 0.5 : 0.3;
                const normalized = delta / 16.67;
                const speed = baseSpeedPerFrame * normalized;
                positionRef.current += speed;

                const singleSetWidth = itemWidth * itemCount;
                if (singleSetWidth > 0 && positionRef.current >= singleSetWidth) {
                    positionRef.current = 0;
                }

                sliderRef.current.style.transform = `translateX(-${positionRef.current}px)`;
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        };
    }, [isActive, prefersReducedMotion, isPaused, itemWidth, visibleItems, itemCount]);

    return {
        sliderRef,
        containerRef,
        itemWidth,
        visibleItems,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        setIsPaused
    };
}

