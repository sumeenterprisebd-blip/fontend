import { useRouter } from 'next/router';

export default function SearchInput({ searchQuery, onSearchChange, onSubmit }) {
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSubmit(searchQuery.trim());
        }
    };

    const handleClear = () => {
        onSearchChange('');
        router.push('/search', undefined, { shallow: true });
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl">
            <div className="relative">
                <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full pl-12 pr-10 py-3 rounded-lg bg-white border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 placeholder-gray-400"
                    aria-label="Search for products"
                />
                <button
                    type="submit"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                    aria-label="Search"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
                {searchQuery && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                        aria-label="Clear search"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </form>
    );
}

