import { FiSearch } from 'react-icons/fi';

export default function UsersFilters({
    searchTerm,
    setSearchTerm,
    filterRole,
    setFilterRole,
    filterStatus,
    setFilterStatus,
    filterHasOrders,
    setFilterHasOrders,
    filterSuspicious,
    setFilterSuspicious,
    filterEmailVerified,
    setFilterEmailVerified,
    filterPhoneVerified,
    setFilterPhoneVerified,
    registeredFrom,
    setRegisteredFrom,
    registeredTo,
    setRegisteredTo,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    currentUsersCount,
    totalUsersCount,
    onClearFilters,
}) {
    const hasActiveFilters =
        !!searchTerm ||
        filterRole !== 'all' ||
        filterStatus !== 'all' ||
        filterHasOrders !== 'all' ||
        filterSuspicious !== 'all' ||
        filterEmailVerified !== 'all' ||
        filterPhoneVerified !== 'all' ||
        !!registeredFrom ||
        !!registeredTo ||
        sortBy !== 'createdAt' ||
        sortOrder !== 'desc';

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-5 relative">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select
                    className="lg:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm font-medium bg-white"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                    <option value="user">User</option>
                </select>

                <select
                    className="lg:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm font-medium bg-white"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="blocked">Blocked</option>
                </select>

                <select
                    className="lg:col-span-3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm font-medium bg-white"
                    value={filterHasOrders}
                    onChange={(e) => setFilterHasOrders(e.target.value)}
                >
                    <option value="all">Order History: Any</option>
                    <option value="yes">Has Orders</option>
                    <option value="no">No Orders</option>
                </select>
            </div>

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
                <select
                    className="lg:col-span-3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm font-medium bg-white"
                    value={filterSuspicious}
                    onChange={(e) => setFilterSuspicious(e.target.value)}
                >
                    <option value="all">Suspicious: Any</option>
                    <option value="yes">Suspicious Only</option>
                    <option value="no">Not Suspicious</option>
                </select>

                <select
                    className="lg:col-span-3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm font-medium bg-white"
                    value={filterEmailVerified}
                    onChange={(e) => setFilterEmailVerified(e.target.value)}
                >
                    <option value="all">Email: Any</option>
                    <option value="yes">Email Verified</option>
                    <option value="no">Email Unverified</option>
                </select>

                <select
                    className="lg:col-span-3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm font-medium bg-white"
                    value={filterPhoneVerified}
                    onChange={(e) => setFilterPhoneVerified(e.target.value)}
                >
                    <option value="all">Phone: Any</option>
                    <option value="yes">Phone Verified</option>
                    <option value="no">Phone Unverified</option>
                </select>

                <div className="lg:col-span-3 grid grid-cols-2 gap-3">
                    <input
                        type="date"
                        className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm font-medium bg-white"
                        value={registeredFrom}
                        onChange={(e) => setRegisteredFrom(e.target.value)}
                        aria-label="Registered from"
                    />
                    <input
                        type="date"
                        className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm font-medium bg-white"
                        value={registeredTo}
                        onChange={(e) => setRegisteredTo(e.target.value)}
                        aria-label="Registered to"
                    />
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
                <select
                    className="lg:col-span-3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm font-medium bg-white"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="createdAt">Sort: Registration Date</option>
                    <option value="lastOrderAt">Sort: Last Order</option>
                    <option value="orderCount">Sort: Order Count</option>
                </select>
                <select
                    className="lg:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm font-medium bg-white"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="desc">Desc</option>
                    <option value="asc">Asc</option>
                </select>
            </div>

            {/* Results count */}
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm">
                <span className="text-gray-600">
                    Showing <span className="font-semibold text-gray-900">{currentUsersCount}</span> of <span className="font-semibold text-gray-900">{totalUsersCount}</span> users
                </span>
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Clear filters
                    </button>
                )}
            </div>
        </div>
    );
}
