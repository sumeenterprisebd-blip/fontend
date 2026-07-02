import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { brandsAPI } from '@/services/api';
import BrandSlider from './BrandSlider';
import useBrandsAnimation from './useBrandsAnimation';

export default function CollaboratingBrands() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [visibleItems, setVisibleItems] = useState(4);
    const sectionRef = useRef(null);

    // Fetch brands from API
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
        if (!isVisible) return undefined;
        const fetchBrands = async () => {
            try {
                setLoading(true);
                const response = await brandsAPI.getBrands();
                const fetchedBrands = response.data.brands || [];

                // Remove duplicates and filter out invalid brands
                const validBrands = fetchedBrands
                    .filter((brand) => brand && brand.name && brand.logo && brand._id)
                    .filter((brand, index, self) =>
                        index === self.findIndex((b) => b._id === brand._id)
                    );

                setBrands(validBrands);
            } catch (error) {
                setBrands([]);
            } finally {
                setLoading(false);
            }
        };
        fetchBrands();
    }, [isVisible]);

    // Calculate visible items based on screen size
    const getVisibleItems = useCallback(() => {
        if (typeof window === 'undefined') return 4;
        if (window.innerWidth < 640) return 2;
        if (window.innerWidth < 1024) return 3;
        return 4;
    }, []);

    // Update visible items on window resize
    useEffect(() => {
        if (typeof window === 'undefined') return undefined;
        let resizeTimeout;
        const updateVisibleItems = () => {
            setVisibleItems(getVisibleItems());
        };
        updateVisibleItems();
        const debouncedResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateVisibleItems, 100);
        };
        window.addEventListener('resize', debouncedResize);
        return () => {
            window.removeEventListener('resize', debouncedResize);
            clearTimeout(resizeTimeout);
        };
    }, [getVisibleItems]);

    // Track container width without forcing layout
    useEffect(() => {
        if (!containerRef.current || typeof ResizeObserver === 'undefined') return undefined;
        let rafId;
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (!entry) return;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const nextWidth = Math.round(entry.contentRect.width || 0);
                setContainerWidth((prev) => (prev !== nextWidth ? nextWidth : prev));
            });
        });
        observer.observe(containerRef.current);
        return () => {
            observer.disconnect();
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    const itemWidth = useMemo(() => {
        if (!containerWidth) return 0;
        return containerWidth / visibleItems;
    }, [containerWidth, visibleItems]);

    const sliderRef = useBrandsAnimation(brands, isPaused, itemWidth, { isActive: isVisible });

    // Don't render if no brands or still loading
    if (!isVisible) {
        return (
            <section ref={sectionRef} className="w-full bg-white py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 lg:mb-12">
                        <div className="h-8 w-64 bg-gray-100 rounded-full mx-auto animate-pulse" />
                        <div className="h-4 w-2/3 bg-gray-100 rounded-full mx-auto mt-4 animate-pulse" />
                    </div>
                    <div className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
                </div>
            </section>
        );
    }

    if (loading || !brands || brands.length === 0) {
        return (
            <section ref={sectionRef} className="w-full bg-white py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 lg:mb-12">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-3">
                            Collaborating Brands
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                            We work with the world&apos;s leading fashion brands to bring you the latest trends and styles
                        </p>
                    </div>
                    <div className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
                </div>
            </section>
        );
    }

    return (
        <section ref={sectionRef} className="w-full bg-white py-12 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-10 lg:mb-12">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-3">
                        Collaborating Brands
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                        We work with the world&apos;s leading fashion brands to bring you the latest trends and styles
                    </p>
                </div>

                {/* Slider Container */}
                <div
                    ref={containerRef}
                    className="relative overflow-hidden"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <BrandSlider
                        brands={brands}
                        itemWidth={itemWidth}
                        sliderRef={sliderRef}
                    />
                </div>
            </div>
        </section>
    );
}
