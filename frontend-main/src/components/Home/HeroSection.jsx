
import { useMemo } from 'react';
import Link from 'next/link';
import HeroSlide from './HeroSlide';
import { HERO_HEIGHT_CLASSES, NAV_WIDTH_CLASSES } from './heroLayoutConfig';

/**
 * HeroSection (SSR/SSG only):
 * Receives hero data as initialData prop (from getServerSideProps/getStaticProps).
 * No client-side fetching or hydration delays.
 */
export default function HeroSection({ initialData = [] }) {
    const { primary, fallback } = useMemo(() => {
        const images = (Array.isArray(initialData) ? initialData : [])
            .reduce((acc, hero) => {
                const heroImages = Array.isArray(hero?.images) ? hero.images : [];
                for (const img of heroImages) acc.push(img);
                return acc;
            }, [])
            .filter((src) => typeof src === 'string' && src.trim().length > 0);

        return {
            primary: images[0] || null,
            fallback: images[1] || null,
        };
    }, [initialData]);

    // Return fallback placeholder if no images available
    if (!primary) {
        return (
            <div className="mx-auto w-full max-w-[1280px]">
                <div className={`relative w-full flex items-center justify-center ${HERO_HEIGHT_CLASSES}`}>
                    <div className={`${NAV_WIDTH_CLASSES} w-full`}>
                        <div className="w-full h-full bg-gray-100 rounded-3xl animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white">
            <div className="mx-auto w-full max-w-[1280px]">
                <div className="relative">
                    <HeroSlide image={primary} fallbackImage={fallback} isFirst={true} />

                    <div className="absolute inset-0 flex items-end">
                        <div className="w-full bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                            <div className={`${NAV_WIDTH_CLASSES} pb-10 sm:pb-12 sm:hidden`}
                            >
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center justify-center bg-white text-black px-6 sm:px-8 py-3 rounded-full font-semibold text-sm sm:text-base shadow-lg hover:bg-gray-100 transition-colors"
                                >
                                    Shop Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}