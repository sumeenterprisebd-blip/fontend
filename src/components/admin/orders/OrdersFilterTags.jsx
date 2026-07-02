import { HiX } from 'react-icons/hi';

export default function OrdersFilterTags({
    hasActiveFilters,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    orderStatus,
    setOrderStatus,
    searchCustomer,
    setSearchCustomer,
    searchProduct,
    setSearchProduct
}) {
    if (!hasActiveFilters()) return null;

    return (
        <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
                {startDate && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        From: {new Date(startDate).toLocaleDateString()}
                        <button onClick={() => setStartDate('')} className="hover:text-blue-900">
                            <HiX className="w-3.5 h-3.5" />
                        </button>
                    </span>
                )}
                {endDate && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        To: {new Date(endDate).toLocaleDateString()}
                        <button onClick={() => setEndDate('')} className="hover:text-blue-900">
                            <HiX className="w-3.5 h-3.5" />
                        </button>
                    </span>
                )}
                {orderStatus && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm capitalize">
                        Status: {orderStatus}
                        <button onClick={() => setOrderStatus('')} className="hover:text-green-900">
                            <HiX className="w-3.5 h-3.5" />
                        </button>
                    </span>
                )}
                {searchCustomer && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                        Customer: {searchCustomer}
                        <button onClick={() => setSearchCustomer('')} className="hover:text-purple-900">
                            <HiX className="w-3.5 h-3.5" />
                        </button>
                    </span>
                )}
                {searchProduct && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                        Product: {searchProduct}
                        <button onClick={() => setSearchProduct('')} className="hover:text-purple-900">
                            <HiX className="w-3.5 h-3.5" />
                        </button>
                    </span>
                )}
            </div>
        </div>
    );
}
