
import { useMemo } from 'react';
import Link from 'next/link';
import HeroCarousel from './HeroCarousel';
import HeroSlide from './HeroSlide';
import { HERO_HEIGHT_CLASSES, NAV_WIDTH_CLASSES } from './heroLayoutConfig';

/**
 * HeroSection (SSR/SSG only):
 * Receives hero data as initialData prop (from getServerSideProps/getStaticProps).
 * No client-side fetching or hydration delays.
 */
export default function HeroSection({ initialData = [] }) {
    const slides = useMemo(() => {
        const images = (Array.isArray(initialData) ? initialData : [])
            .reduce((acc, hero) => {
                const heroImages = Array.isArray(hero?.images) ? hero.images : [];
                for (const img of heroImages) acc.push(img);
                return acc;
            }, [])
            .filter((src) => typeof src === 'string' && src.trim().length > 0);

        return images.map((image, index) => ({
            image,
            fallbackImage: images[index + 1] || null,
        }));
    }, [initialData]);

    const primary = slides[0]?.image || null;

    // Return fallback placeholder if no images available
    if (!primary) {
        return (
            <section className="w-full bg-gray-100">
                <div className={`relative flex w-full items-center justify-center ${HERO_HEIGHT_CLASSES}`}>
                    <div className={`${NAV_WIDTH_CLASSES} h-full w-full`}>
                        <div className="h-full w-full animate-pulse rounded-none bg-gray-200" />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full bg-white">
            <div className="relative w-full">
                <HeroCarousel>
                    {slides.map((slide, index) => (
                        <div key={`${slide.image}-${index}`} className="w-full">
                            <HeroSlide image={slide.image} fallbackImage={slide.fallbackImage} isFirst={index === 0} />
                        </div>
                    ))}
                </HeroCarousel>

                <div className="pointer-events-none absolute inset-0 flex items-end">
                    <div className="w-full bg-gradient-to-t from-black/65 via-black/25 to-transparent">
                        <div className={`${NAV_WIDTH_CLASSES} pb-10 pt-24 sm:pb-12 sm:pt-28 lg:pb-16 lg:pt-32`}>
                            <Link
                                href="/shop"
                                className="pointer-events-auto inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-lg transition-colors hover:bg-gray-100 sm:px-8 sm:text-base"
                            >
                                Shop Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}