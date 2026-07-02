import { formatDate } from '@/utils/dateFormatter';
import {
    FiMoreVertical,
    FiEye,
    FiTrash2,
    FiList,
    FiAlertTriangle,
    FiCheck,
    FiX,
    FiMail,
    FiPhone,
    FiShield,
} from 'react-icons/fi';

export default function UserRow({
    user,
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
    hasDuplicatePhone,
    hasDuplicateEmail,
}) {
    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            onToggleDropdown(null);
        } else if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onToggleDropdown(user._id);
        }
    };

    const isDropdownOpen = openDropdown === user._id;

    const status = user.status || (user.isBlocked ? 'blocked' : 'active');
    const statusStyles =
        status === 'blocked'
            ? 'bg-red-100 text-red-800'
            : status === 'suspended'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800';

    const orderCount = typeof user.orderCount === 'number' ? user.orderCount : (user.orderCount ? Number(user.orderCount) : 0);
    const lastOrderLabel = user.lastOrderAt ? formatDate(user.lastOrderAt) : '—';

    const roleLabel = user.role === 'admin' ? 'Admin' : user.role === 'moderator' ? 'Moderator' : 'User';
    const roleDotClass =
        user.role === 'admin'
            ? 'bg-purple-300'
            : user.role === 'moderator'
                ? 'bg-blue-300'
                : 'bg-gray-400';

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm">
                        <span className="text-white font-semibold text-sm">
                            {user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                        </span>
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                            {user.isSuspicious && (
                                <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    <FiAlertTriangle size={12} /> Suspicious
                                </span>
                            )}
                            {(hasDuplicatePhone || hasDuplicateEmail) && (
                                <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full bg-gray-100 text-gray-800">
                                    <FiShield size={12} /> Duplicate
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700">{user.email}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-600">{user.phone || '—'}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <button
                    onClick={() => onOpenRoleModal(user)}
                    className={`flex items-center gap-2 text-sm font-bold rounded-xl px-5 py-2.5 border border-white/30 shadow-xl backdrop-blur-md bg-gradient-to-br transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200/60 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden
                        ${user.role === 'admin'
                            ? 'from-purple-400/80 via-indigo-400/70 to-blue-400/60 text-white hover:from-purple-500 hover:to-blue-500'
                            : user.role === 'moderator'
                                ? 'from-blue-400/80 via-sky-400/70 to-indigo-400/60 text-white hover:from-blue-500 hover:to-indigo-500'
                                : 'from-gray-200/80 via-gray-300/70 to-gray-400/60 text-gray-900 hover:from-gray-300 hover:to-gray-500'}
                    `}
                    style={{ minWidth: 100, letterSpacing: 0.5, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}
                    disabled={actionLoading}
                    aria-label={`Change role for ${user.firstName} ${user.lastName}`}
                >
                    <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 shadow-md transition-colors duration-300 ${roleDotClass}`}></span>
                    {user.role === 'admin' ? (
                        <svg className="w-4 h-4 mr-1 text-yellow-200 drop-shadow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 7.464" /></svg>
                    ) : user.role === 'moderator' ? (
                        <svg className="w-4 h-4 mr-1 text-white/90 drop-shadow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 4v5c0 5-3 9-7 9s-7-4-7-9V7l7-4z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-5" /></svg>
                    ) : (
                        <svg className="w-4 h-4 mr-1 text-blue-400 drop-shadow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1112 21a8.963 8.963 0 01-6.879-3.196z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0 3 3 0 016 0z" /></svg>
                    )}
                    {roleLabel}
                    <span className="absolute inset-0 opacity-0 hover:opacity-10 transition-opacity duration-300 bg-white pointer-events-none" />
                </button>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusStyles}`}>
                    {status}
                </span>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3 text-xs text-gray-700">
                    <span className="inline-flex items-center gap-1">
                        <FiMail className="text-gray-400" />
                        {user.isEmailVerified ? (
                            <FiCheck className="text-green-600" aria-label="Email verified" />
                        ) : (
                            <FiX className="text-red-600" aria-label="Email unverified" />
                        )}
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <FiPhone className="text-gray-400" />
                        {user.isPhoneVerified ? (
                            <FiCheck className="text-green-600" aria-label="Phone verified" />
                        ) : (
                            <FiX className="text-red-600" aria-label="Phone unverified" />
                        )}
                    </span>
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 font-semibold">{Number.isFinite(orderCount) ? orderCount : 0}</div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600" suppressHydrationWarning>
                {lastOrderLabel}
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600" suppressHydrationWarning>
                {formatDate(user.createdAt)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="relative inline-block text-left" ref={isDropdownOpen ? dropdownRef : null}>
                    <button
                        type="button"
                        onClick={() => onToggleDropdown(user._id)}
                        onKeyDown={handleKeyDown}
                        className="inline-flex items-center justify-center min-w-11 min-h-11 text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation active:scale-95"
                        title="User Actions"
                        aria-label={`Actions for ${user.firstName} ${user.lastName}`}
                        aria-haspopup="true"
                        aria-expanded={isDropdownOpen}
                        disabled={actionLoading}
                    >
                        {actionLoading && isDropdownOpen ? (
                            <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
                        ) : (
                            <FiMoreVertical size={20} />
                        )}
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div
                            className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-xl shadow-xl z-9999 border border-gray-200 animate-fade-in overflow-hidden"
                            style={{ position: 'absolute' }}
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="user-menu"
                        >
                            <button
                                type="button"
                                onClick={() => onViewUser(user)}
                                className="flex items-center w-full min-h-11 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors focus:outline-none focus:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                                role="menuitem"
                                disabled={actionLoading}
                                aria-label={`View details for ${user.firstName} ${user.lastName}`}
                            >
                                <FiEye className="mr-3 shrink-0 text-blue-600" size={18} />
                                <span className="font-medium">View Details</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => onViewOrders?.(user)}
                                className="flex items-center w-full min-h-11 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation border-t border-gray-100"
                                role="menuitem"
                                disabled={actionLoading}
                                aria-label={`View orders for ${user.firstName} ${user.lastName}`}
                            >
                                <FiList className="mr-3 shrink-0 text-gray-700" size={18} />
                                <span className="font-medium">View Orders</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => onToggleSuspicious?.(user)}
                                className="flex items-center w-full min-h-11 px-4 py-3 text-sm text-gray-700 hover:bg-yellow-50 transition-colors focus:outline-none focus:bg-yellow-50 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation border-t border-gray-100"
                                role="menuitem"
                                disabled={actionLoading}
                                aria-label={`Toggle suspicious for ${user.firstName} ${user.lastName}`}
                            >
                                <FiAlertTriangle className="mr-3 shrink-0 text-yellow-700" size={18} />
                                <span className="font-medium">{user.isSuspicious ? 'Unmark Suspicious' : 'Mark Suspicious'}</span>
                            </button>

                            <div className="border-t border-gray-100 px-3 py-2">
                                <div className="text-[11px] font-semibold text-gray-500 mb-2">Set Status</div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => onUpdateStatus?.(user._id, 'active')}
                                        className="flex-1 px-2 py-2 text-xs font-semibold rounded-lg bg-green-50 text-green-800 hover:bg-green-100 transition-colors"
                                        disabled={actionLoading}
                                    >
                                        Active
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onUpdateStatus?.(user._id, 'suspended')}
                                        className="flex-1 px-2 py-2 text-xs font-semibold rounded-lg bg-yellow-50 text-yellow-800 hover:bg-yellow-100 transition-colors"
                                        disabled={actionLoading}
                                    >
                                        Susp.
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onUpdateStatus?.(user._id, 'blocked')}
                                        className="flex-1 px-2 py-2 text-xs font-semibold rounded-lg bg-red-50 text-red-800 hover:bg-red-100 transition-colors"
                                        disabled={actionLoading}
                                    >
                                        Block
                                    </button>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => onDeleteUser(user._id)}
                                className="flex items-center w-full min-h-11 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation border-t border-gray-100"
                                role="menuitem"
                                disabled={actionLoading}
                                aria-label={`Delete ${user.firstName} ${user.lastName}`}
                            >
                                <FiTrash2 className="mr-3 shrink-0" size={18} />
                                <span className="font-medium">Delete User</span>
                            </button>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
}
