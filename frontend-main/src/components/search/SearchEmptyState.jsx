export default function SearchEmptyState() {
    return (
        <div className="text-center py-16 sm:py-20">
            <div className="max-w-md mx-auto">
                <svg className="w-20 h-20 sm:w-24 sm:h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h2 className="text-2xl sm:text-3xl font-bold text-black mb-3">
                    Start Your Search
                </h2>
                <p className="text-base sm:text-lg text-gray-600 mb-8">
                    Enter a product name, category, or keyword to find what you're looking for.
                </p>
            </div>
        </div>
    );
}

