import { FiUser } from 'react-icons/fi';
import UserRow from './UserRow';

export default function UsersTable({
    currentUsers,
    searchTerm,
    filterRole,
    hasActiveFilters: hasActiveFiltersProp,
    openDropdown,
    dropdownRef,
    actionLoading,
    onToggleDropdown,
    onViewUser,
    onViewOrders,
    onDeleteUser,
    onOpenRoleModal,
    onUpdateStatus,
    onToggleSuspicious,
    duplicatePhoneUserIds,
    duplicateEmailUserIds,
    onClearFilters
}) {
    const hasActiveFilters =
        typeof hasActiveFiltersProp === 'boolean'
            ? hasActiveFiltersProp
            : Boolean(searchTerm) || filterRole !== 'all';

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Verified</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Orders</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Last Order</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {currentUsers.length === 0 ? (
                        <tr>
                            <td colSpan="10" className="px-6 py-16 text-center">
                                <div className="flex flex-col items-center justify-center space-y-3">
                                    <div className="p-4 bg-gray-100 rounded-full">
                                        <FiUser className="text-gray-400" size={32} />
                                    </div>
                                    <p className="text-gray-600 font-medium">
                                        {hasActiveFilters ? 'No users found matching your criteria' : 'No users found'}
                                    </p>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={onClearFilters}
                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                        >
                                            Clear all filters
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ) : (
                        currentUsers.map((user) => (
                            <UserRow
                                key={user._id}
                                user={user}
                                openDropdown={openDropdown}
                                dropdownRef={dropdownRef}
                                actionLoading={actionLoading}
                                onToggleDropdown={onToggleDropdown}
                                onViewUser={onViewUser}
                                onViewOrders={onViewOrders}
                                onDeleteUser={onDeleteUser}
                                onOpenRoleModal={onOpenRoleModal}
                                onUpdateStatus={onUpdateStatus}
                                onToggleSuspicious={onToggleSuspicious}
                                hasDuplicatePhone={duplicatePhoneUserIds?.has ? duplicatePhoneUserIds.has(user._id) : false}
                                hasDuplicateEmail={duplicateEmailUserIds?.has ? duplicateEmailUserIds.has(user._id) : false}
                            />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
