import { useEffect, useState, useRef } from 'react';
import { categoriesAPI } from '@/services/api';
import { FiSearch, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function AdvancedProductFilter({ filters, setFilters, onFilter, products, loading }) {
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [searchInput, setSearchInput] = useState(filters.search || '');
    const [expanded, setExpanded] = useState(false);
    const searchTimeoutRef = useRef(null);

    useEffect(() => {
        // Only show categories that have products
        const categoriesWithProducts = Array.from(
            new Set(products.map((p) => p.category).filter(Boolean))
        );
        setCategoryOptions(categoriesWithProducts);
    }, [products]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleSearchInput = (e) => {
        const value = e.target.value;
        setSearchInput(value);

        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Debounce search - trigger filter after 500ms of no typing
        searchTimeoutRef.current = setTimeout(() => {
            setFilters((prev) => ({ ...prev, search: value }));
            onFilter();
        }, 500);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Clear timeout and apply filter immediately
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        setFilters((prev) => ({ ...prev, search: searchInput }));
        onFilter();
    };

    const handleClear = () => {
        setFilters({ search: '', category: '', minPrice: '', maxPrice: '' });
        setSearchInput('');
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        onFilter();
    };

    const handleClearSearch = () => {
        setSearchInput('');
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        setFilters((prev) => ({ ...prev, search: '' }));
        onFilter();
    };

    return (
        <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-4">
            <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px]">
                    <FiSearch className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input
                        type="text"
                        name="search"
                        value={searchInput}
                        onChange={handleSearchInput}
                        placeholder="Search by name, SKU, category..."
                        className="border border-gray-300 rounded px-3 py-2 pl-10 text-sm w-full pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        autoComplete="off"
                    />
                    {searchInput && (
                        <button
                            type="button"
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition"
                            onClick={handleClearSearch}
                        >
                            <FiX size={16} />
                        </button>
                    )}
                </div>
                <div className="relative min-w-[160px]">
                    <select
                        name="category"
                        value={filters.category}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading || categoryOptions.length === 0}
                    >
                        <option value="">{categoryOptions.length === 0 ? 'No categories' : 'All Categories'}</option>
                        {categoryOptions.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleChange}
                    placeholder="Min Price"
                    className="border border-gray-300 rounded px-3 py-2 text-sm w-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleChange}
                    placeholder="Max Price"
                    className="border border-gray-300 rounded px-3 py-2 text-sm w-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium flex items-center gap-2 transition"
                    disabled={loading}
                >
                    <FiSearch size={16} /> Filter
                </button>
                <button
                    type="button"
                    className="ml-2 text-gray-500 hover:text-red-600 text-sm flex items-center gap-1 transition"
                    onClick={handleClear}
                    disabled={loading}
                >
                    <FiX size={16} /> Clear
                </button>
                <button
                    type="button"
                    className="ml-auto flex items-center gap-1 text-blue-600 hover:underline text-xs"
                    onClick={() => setExpanded((v) => !v)}
                >
                    {expanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />} Advanced
                </button>
            </form>
            {expanded && (
                <div className="flex flex-wrap gap-3 items-center border-t pt-4 mt-2">
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={!!filters.isActive}
                            onChange={(e) => setFilters((prev) => ({ ...prev, isActive: e.target.checked }))}
                            className="accent-blue-600"
                        />
                        Active Only
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            name="isFeatured"
                            checked={!!filters.isFeatured}
                            onChange={(e) => setFilters((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                            className="accent-yellow-500"
                        />
                        Featured
                    </label>
                </div>
            )}
        </div>
    );
}
