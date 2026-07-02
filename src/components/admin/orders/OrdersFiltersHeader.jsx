import { HiFilter, HiX, HiChevronDown, HiChevronUp } from 'react-icons/hi';

export default function OrdersFiltersHeader({
    isFilterOpen,
    setIsFilterOpen,
    hasActiveFilters,
    clearFilters,
    ordersCount,
    filteredCount,
    activeFiltersCount
}) {
    return (
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                    <HiFilter className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Filter Orders</h2>
                    <p className="text-sm text-gray-600">
                        {filteredCount} of {ordersCount} orders
                        {hasActiveFilters() && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {activeFiltersCount} active
                            </span>
                        )}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {hasActiveFilters() && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                    >
                        <HiX className="w-4 h-4" />
                        Clear All
                    </button>
                )}
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                    {isFilterOpen ? (
                        <>
                            <HiChevronUp className="w-4 h-4" />
                            Hide
                        </>
                    ) : (
                        <>
                            <HiChevronDown className="w-4 h-4" />
                            Show
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
