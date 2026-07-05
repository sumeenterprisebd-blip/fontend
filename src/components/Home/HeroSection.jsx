
import { useMemo } from 'react';
import HeroCarousel from './HeroCarousel';
import HeroSlide from './HeroSlide';
import { HERO_HEIGHT_CLASSES } from './heroLayoutConfig';

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
            <section className="relative left-1/2 w-screen -ml-[50vw] overflow-hidden bg-gray-100">
                <div className={`relative w-full ${HERO_HEIGHT_CLASSES}`}>
                    <div className="h-full w-full animate-pulse rounded-none bg-gray-200" />
                </div>
            </section>
        );
    }

    return (
        <section className="relative left-1/2 w-screen -ml-[50vw] overflow-hidden bg-white">
            <div className="relative w-full">
                <HeroCarousel>
                    {slides.map((slide, index) => (
                        <div key={`${slide.image}-${index}`} className="w-full">
                            <HeroSlide image={slide.image} fallbackImage={slide.fallbackImage} isFirst={index === 0} />
                        </div>
                    ))}
                </HeroCarousel>
            </div>
        </section>
    );
}