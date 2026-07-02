import Link from 'next/link';
import SearchProductCard from './SearchProductCard';

export default function SearchResults({ products, searchQuery, sortBy, onSortChange, total, loading, error }) {
    const totalCount = typeof total === 'number' ? total : products.length;

    if (loading) {
        return (
            <div className="py-10">
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="h-5 w-64 bg-gray-200 rounded animate-pulse" />
                    <div className="h-10 w-44 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    {Array.from({ length: 8 }).map((_, idx) => (
                        <div key={idx} className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                            <div className="aspect-square bg-gray-100 animate-pulse" />
                            <div className="p-4">
                                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                                <div className="mt-3 h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-16 sm:py-20">
                <div className="max-w-md mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-black mb-3">Something went wrong</h2>
                    <p className="text-base sm:text-lg text-gray-600 mb-8">{error}</p>
                    <Link
                        href="/search"
                        className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 active:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                    >
                        Try Again
                    </Link>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-16 sm:py-20">
                <div className="max-w-md mx-auto">
                    <svg className="w-20 h-20 sm:w-24 sm:h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h2 className="text-2xl sm:text-3xl font-bold text-black mb-3">
                        No Results Found
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 mb-8">
                        Try searching with different keywords or browse our categories.
                    </p>
                    <Link
                        href="/shop"
                        className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 active:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                    >
                        Browse Shop
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <p className="text-sm sm:text-base text-gray-600">
                    Found <span className="font-semibold">{totalCount}</span> {totalCount === 1 ? 'result' : 'results'} for &quot;<span className="font-semibold">{searchQuery}</span>&quot;
                </p>
                <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    aria-label="Sort results"
                >
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                </select>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {products.map((product) => (
                    <SearchProductCard key={product.id} product={product} />
                ))}
            </div>
        </>
    );
}

