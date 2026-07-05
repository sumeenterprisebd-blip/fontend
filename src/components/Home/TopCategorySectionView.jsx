import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft } from "@react-icons/all-files/fi/FiArrowLeft";
import { FiArrowRight } from "@react-icons/all-files/fi/FiArrowRight";
import { useEffect, useMemo, useRef, useState } from "react";

export default function TopCategorySectionView({ categories = [], loading = false }) {
    const carouselRef = useRef(null);
    const touchStartXRef = useRef(null);
    const touchStartYRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isTouching, setIsTouching] = useState(false);

    const displayedCategories = useMemo(() => {
        return (Array.isArray(categories) ? categories : [])
            .slice()
            .sort((a, b) => (b.count || 0) - (a.count || 0))
            .filter((c) => (c.count || 0) > 0)
            .map((cat) => ({
                id: cat.id || cat._id || cat.name,
                name: cat.name,
                image: cat.image || "/logo.jpeg",
                itemCount: cat.count || 0,
                link: `/shop?category=${encodeURIComponent(cat.name)}`,
            }));
    }, [categories]);

    const isPlaceholder = loading || displayedCategories.length === 0;

    const scrollCarousel = (direction) => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        const firstCard = carousel.querySelector("[data-category-card]");
        const cardWidth = firstCard?.getBoundingClientRect().width || 320;
        const gap = 16;
        const step = cardWidth + gap;
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;

        if (direction === "next") {
            const nextLeft = carousel.scrollLeft + step;
            if (nextLeft >= maxScroll - 2) {
                carousel.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                carousel.scrollBy({ left: step, behavior: "smooth" });
            }
        } else {
            const prevLeft = carousel.scrollLeft - step;
            if (prevLeft <= 0) {
                carousel.scrollTo({ left: maxScroll, behavior: "smooth" });
            } else {
                carousel.scrollBy({ left: -step, behavior: "smooth" });
            }
        }
    };

    const handleTouchStart = (event) => {
        const touch = event.touches[0];
        touchStartXRef.current = touch?.clientX ?? null;
        touchStartYRef.current = touch?.clientY ?? null;
        setIsTouching(true);
    };

    const handleTouchEnd = (event) => {
        const touch = event.changedTouches[0];
        const startX = touchStartXRef.current;
        const startY = touchStartYRef.current;
        const endX = touch?.clientX ?? null;
        const endY = touch?.clientY ?? null;

        if (startX === null || endX === null || startY === null || endY === null) {
            setIsTouching(false);
            return;
        }

        const deltaX = endX - startX;
        const deltaY = endY - startY;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 70) {
            scrollCarousel(deltaX < 0 ? "next" : "prev");
        }

        touchStartXRef.current = null;
        touchStartYRef.current = null;
        setIsTouching(false);
    };

    useEffect(() => {
        if (loading || displayedCategories.length < 2 || isHovered || isTouching) {
            return undefined;
        }

        const intervalId = window.setInterval(() => {
            scrollCarousel("next");
        }, 4500);

        return () => window.clearInterval(intervalId);
    }, [displayedCategories.length, isHovered, isTouching, loading]);

    return (
        <section className="w-full bg-gradient-to-b from-[#f7f9fc] via-white to-[#eef2fb] py-12 lg:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-10 space-y-3 text-center lg:mb-12">
                    <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0a1a44] shadow-sm">
                        Curated picks
                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" aria-hidden="true"></span>
                    </span>
                    <h2 className="text-2xl font-extrabold text-[#0a1a44] sm:text-3xl lg:text-4xl">Shop by Category</h2>
                    <p className="mx-auto max-w-2xl text-sm text-gray-600 sm:text-base">
                        Browse every category in one smooth, touch-friendly slider with effortless navigation on every screen.
                    </p>
                </div>

                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between md:flex">
                        <button
                            type="button"
                            onClick={() => scrollCarousel("prev")}
                            className="pointer-events-auto ml-2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-[#0a1a44] shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                            aria-label="Scroll to previous category"
                        >
                            <FiArrowLeft className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => scrollCarousel("next")}
                            className="pointer-events-auto mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-[#0a1a44] shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                            aria-label="Scroll to next category"
                        >
                            <FiArrowRight className="h-5 w-5" />
                        </button>
                    </div>

                    <div
                        ref={carouselRef}
                        className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory px-1 md:px-12 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                        aria-busy={isPlaceholder}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        onTouchCancel={() => setIsTouching(false)}
                    >
                        {isPlaceholder
                            ? Array.from({ length: 6 }).map((_, index) => (
                                <div
                                    key={`placeholder-${index}`}
                                    className="flex-none w-[78vw] sm:w-[46%] lg:w-[31%] xl:w-[23%] snap-start rounded-3xl border border-gray-100 bg-white/80 p-0 shadow-sm"
                                    aria-hidden="true"
                                >
                                    <div className="relative aspect-square w-full overflow-hidden rounded-t-3xl bg-gray-100 animate-pulse" />
                                    <div className="space-y-3 p-4 sm:p-5">
                                        <div className="h-4 w-2/3 rounded-full bg-gray-100 animate-pulse" />
                                        <div className="h-3 w-full rounded-full bg-gray-100 animate-pulse" />
                                        <div className="h-3 w-3/4 rounded-full bg-gray-100 animate-pulse" />
                                        <div className="h-8 w-24 rounded-full bg-gray-100 animate-pulse" />
                                    </div>
                                </div>
                            ))
                            : displayedCategories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={category.link}
                                    data-category-card
                                    className="group flex-none w-[78vw] snap-start sm:w-[46%] lg:w-[31%] xl:w-[23%] focus:outline-none focus:ring-2 focus:ring-[#0a1a44] focus:ring-offset-2"
                                    aria-label={`Browse ${category.name} category`}
                                >
                                    <div className="relative h-full overflow-hidden rounded-3xl border border-gray-100 bg-white/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#0a1a44]/30 hover:shadow-[0_18px_48px_rgba(10,26,68,0.12)]">
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a44]/6 via-[#4b6bff]/6 to-[#0a1a44]/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                        <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                                            <Image
                                                src={category.image}
                                                alt={category.name}
                                                width={400}
                                                height={400}
                                                sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, (max-width: 1280px) 31vw, 23vw"
                                                quality={60}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                loading="lazy"
                                                fetchPriority="auto"
                                            />

                                            {/* product count badge removed per requirement */}
                                        </div>

                                        <div className="relative flex flex-col gap-2 p-4 sm:p-5">
                                            <h3 className="text-base font-semibold text-[#0a1a44] transition-colors group-hover:text-[#0c245a] sm:text-lg">
                                                {category.name}
                                            </h3>
                                            {/* product count removed */}
                                            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#0a1a44]/10 px-3 py-1.5 text-xs font-semibold text-[#0a1a44]">
                                                Shop Now
                                                <FiArrowRight className="h-4 w-4" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>

                {displayedCategories.length === 0 && !loading && (
                    <div className="mt-6 min-h-[24px] text-center">
                        <p className="text-gray-500">No categories available yet.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
