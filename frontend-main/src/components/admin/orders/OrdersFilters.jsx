import OrdersFiltersHeader from './OrdersFiltersHeader';
import OrdersFilterInputs from './OrdersFilterInputs';
import OrdersFilterTags from './OrdersFilterTags';

export default function OrdersFilters({
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    orderStatus,
    setOrderStatus,
    searchCustomer,
    setSearchCustomer,
    searchProduct,
    setSearchProduct,
    clearFilters,
    hasActiveFilters,
    isFilterOpen,
    setIsFilterOpen,
    ordersCount,
    filteredCount
}) {
    const activeFiltersCount = [startDate, endDate, orderStatus, searchCustomer, searchProduct].filter(Boolean).length;

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <OrdersFiltersHeader
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                hasActiveFilters={hasActiveFilters}
                clearFilters={clearFilters}
                ordersCount={ordersCount}
                filteredCount={filteredCount}
                activeFiltersCount={activeFiltersCount}
            />

            {isFilterOpen && (
                <div className="p-6 space-y-6">
                    <OrdersFilterInputs
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        orderStatus={orderStatus}
                        setOrderStatus={setOrderStatus}
                        searchCustomer={searchCustomer}
                        setSearchCustomer={setSearchCustomer}
                        searchProduct={searchProduct}
                        setSearchProduct={setSearchProduct}
                    />
                    <OrdersFilterTags
                        hasActiveFilters={hasActiveFilters}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        orderStatus={orderStatus}
                        setOrderStatus={setOrderStatus}
                        searchCustomer={searchCustomer}
                        setSearchCustomer={setSearchCustomer}
                        searchProduct={searchProduct}
                        setSearchProduct={setSearchProduct}
                    />
                </div>
            )}
        </div>
    );
}
