import Image from 'next/image';
import { HERO_HEIGHT_CLASSES } from './heroLayoutConfig';
import { optimizeCloudinaryUrl } from '@/utils/imageOptimization';
import { useEffect, useMemo, useState } from 'react';

const isCloudinaryUrl = (url) => typeof url === 'string' && url.includes('cloudinary.com') && url.includes('/upload/');

const HERO_SIZES = '100vw';
const HERO_SRCSET_WIDTHS = [640, 750, 828, 1080, 1200, 1280];

const HeroSlide = ({ image, fallbackImage = null, isFirst = false }) => {
    const optimizedSrc = useMemo(() => {
        return isCloudinaryUrl(image)
            ? optimizeCloudinaryUrl(image, {
                // Keep bytes low: match our max rendered width and avoid DPR inflation.
                width: 1080,
                quality: 'auto:good',
                format: 'auto',
                crop: 'limit',
                gravity: 'auto',
                dpr: 1,
            })
            : image;
    }, [image]);

    const [currentSrc, setCurrentSrc] = useState(optimizedSrc);
    const [didTryOriginal, setDidTryOriginal] = useState(false);
    const [didTryFallback, setDidTryFallback] = useState(false);

    const cloudinaryBaseForSrcSet = useMemo(() => {
        if (currentSrc === fallbackImage && isCloudinaryUrl(fallbackImage)) return fallbackImage;
        if (isCloudinaryUrl(image)) return image;
        return isCloudinaryUrl(currentSrc) ? currentSrc : null;
    }, [currentSrc, fallbackImage, image]);

    const heroSrcSet = useMemo(() => {
        if (!cloudinaryBaseForSrcSet) return null;
        return HERO_SRCSET_WIDTHS
            .map((width) => {
                const url = optimizeCloudinaryUrl(cloudinaryBaseForSrcSet, {
                    width,
                    quality: 'auto:good',
                    format: 'auto',
                    crop: 'limit',
                    gravity: 'auto',
                    dpr: 1,
                });
                return `${url} ${width}w`;
            })
            .join(', ');
    }, [cloudinaryBaseForSrcSet]);

    // Keep state in sync if parent image changes
    useEffect(() => {
        setCurrentSrc(optimizedSrc);
        setDidTryOriginal(false);
        setDidTryFallback(false);
    }, [optimizedSrc]);

    return (
        <section className={`relative w-full overflow-hidden bg-[#f3f3f3] ${HERO_HEIGHT_CLASSES}`}>
            <div className="relative h-full w-full">
                {isCloudinaryUrl(currentSrc) && cloudinaryBaseForSrcSet ? (
                    <img
                        src={currentSrc}
                        srcSet={heroSrcSet || undefined}
                        sizes={HERO_SIZES}
                        alt="Hero"
                        className="h-full w-full object-contain object-center"
                        loading={isFirst ? 'eager' : 'lazy'}
                        fetchPriority={isFirst ? 'high' : undefined}
                        decoding="async"
                        onError={() => {
                            // 1) If Cloudinary transformed URL fails, try the original
                            if (!didTryOriginal && isCloudinaryUrl(image) && currentSrc !== image) {
                                setDidTryOriginal(true);
                                setCurrentSrc(image);
                                return;
                            }

                            // 2) If primary fails, swap to fallback (if available)
                            if (!didTryFallback && fallbackImage && fallbackImage !== image) {
                                setDidTryFallback(true);
                                setCurrentSrc(fallbackImage);
                            }
                        }}
                    />
                ) : (
                    <Image
                        src={currentSrc}
                        alt="Hero"
                        fill
                        className="h-full w-full object-contain object-center"
                        priority={isFirst}
                        fetchPriority={isFirst ? 'high' : undefined}
                        loading={isFirst ? 'eager' : 'lazy'}
                        sizes={HERO_SIZES}
                        onError={() => {
                            if (!didTryFallback && fallbackImage && fallbackImage !== image) {
                                setDidTryFallback(true);
                                setCurrentSrc(fallbackImage);
                            }
                        }}
                    />
                )}
            </div>
        </section>
    );
};

export default HeroSlide;