import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "@react-icons/all-files/fi/FiArrowRight";
import { useMemo } from "react";

export default function TopCategorySectionView({ categories = [], loading = false }) {
    const displayedCategories = useMemo(() => {
        return (Array.isArray(categories) ? categories : [])
            .slice()
            .sort((a, b) => (b.count || 0) - (a.count || 0))
            .slice(0, 6)
            .map((cat) => {
                return {
                    id: cat.id || cat._id || cat.name,
                    name: cat.name,
                    image: cat.image || "/logo.jpeg",
                    itemCount: cat.count || 0,
                    // Use the same query param the Shop page + backend API understand.
                    link: `/shop?category=${encodeURIComponent(cat.name)}`,
                };
            });
    }, [categories]);

    const isPlaceholder = loading || displayedCategories.length === 0;

    return (
        <section className="w-full bg-gradient-to-b from-[#f7f9fc] via-white to-[#eef2fb] py-12 lg:py-16 min-h-[720px]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 lg:mb-12 space-y-3">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide bg-white shadow-sm border border-gray-200 text-[#0a1a44]">
                        Curated picks
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true"></span>
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0a1a44]">Shop by Category</h2>
                    <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                        Jump straight into the styles you love. Trending edits, fresh drops, and evergreen essentials—one tap away.
                    </p>
                </div>

                <div
                    className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
                    aria-busy={isPlaceholder}
                >
                    {(isPlaceholder ? Array.from({ length: 6 }) : displayedCategories).map((category, index) => {
                        if (isPlaceholder) {
                            return (
                                <div
                                    key={`placeholder-${index}`}
                                    className="relative bg-white/80 rounded-2xl overflow-hidden border border-gray-100 h-full"
                                    aria-hidden="true"
                                >
                                    <div className="relative w-full aspect-square overflow-hidden bg-gray-100 animate-pulse" />
                                    <div className="p-4 sm:p-5 space-y-3">
                                        <div className="h-4 w-2/3 bg-gray-100 rounded-full animate-pulse" />
                                        <div className="h-3 w-full bg-gray-100 rounded-full animate-pulse" />
                                        <div className="h-3 w-3/4 bg-gray-100 rounded-full animate-pulse" />
                                        <div className="h-7 w-24 bg-gray-100 rounded-full animate-pulse" />
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={category.id}
                                href={category.link}
                                className="group focus:outline-none focus:ring-2 focus:ring-[#0a1a44] focus:ring-offset-2 rounded-2xl"
                                aria-label={`Browse ${category.name} category`}
                            >
                                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-100 hover:border-[#0a1a44]/30 hover:shadow-[0_18px_48px_rgba(10,26,68,0.12)] transition-all duration-300 h-full hover:-translate-y-1">
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[#0a1a44]/6 via-[#4b6bff]/6 to-[#0a1a44]/10 pointer-events-none" />

                                    <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            width={400}
                                            height={400}
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                                            quality={60}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                            fetchPriority="auto"
                                        />

                                        <div className="absolute top-3 left-3 inline-flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm border border-gray-100 text-xs font-semibold text-[#0a1a44]">
                                            {category.itemCount} {category.itemCount === 1 ? "Product" : "Products"}
                                        </div>
                                    </div>

                                    <div className="p-4 sm:p-5 relative flex flex-col gap-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="text-base sm:text-lg font-semibold text-[#0a1a44] group-hover:text-[#0c245a] transition-colors line-clamp-1">
                                                {category.name}
                                            </h3>
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-600">
                                            {category.itemCount} {category.itemCount === 1 ? "Product" : "Products"}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#0a1a44] bg-[#0a1a44]/10 px-3 py-1 rounded-full">
                                                Shop Now
                                                <FiArrowRight className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {displayedCategories.length === 0 && !loading && (
                    <div className="text-center mt-6 min-h-[24px]">
                        <p className="text-gray-500">No categories available yet.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
