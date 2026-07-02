import { FiX, FiMail, FiPhone, FiAlertTriangle, FiShield, FiCheck, FiList } from 'react-icons/fi';
import { formatDate } from '@/utils/dateFormatter';

export default function UserViewModal({
    user,
    isOpen,
    onClose,
    onUpdateStatus,
    onToggleSuspicious,
    onViewOrders,
    onSetEmailVerified,
    onSetPhoneVerified,
    duplicatePhone = false,
    duplicateEmail = false,
}) {
    if (!isOpen || !user) return null;

    const status = user.status || (user.isBlocked ? 'blocked' : 'active');
    const statusStyles =
        status === 'blocked'
            ? 'bg-red-100 text-red-800'
            : status === 'suspended'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800';

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-9999 p-4 animate-fadeIn"
            onClick={(e) => { if (e.target === e.currentTarget) { onClose(); } }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-modal-title"
        >
            <div
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 sm:p-6">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 id="user-modal-title" className="text-xl sm:text-2xl font-bold text-gray-900">User Details</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-all duration-200 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                            aria-label="Close modal"
                        >
                            <FiX size={20} />
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="space-y-6">
                        {/* Profile Section */}
                        <div className="flex items-center space-x-4">
                            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <span className="text-blue-600 font-bold text-xl sm:text-2xl">
                                    {user.firstName?.[0] || user.email?.[0] || 'U'}
                                </span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                                    {user.firstName} {user.lastName}
                                </h3>
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <span className={`inline-flex px-3 py-1 text-xs sm:text-sm font-semibold rounded-full ${user.role === 'admin'
                                        ? 'bg-purple-100 text-purple-800'
                                        : user.role === 'moderator'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {user.role}
                                    </span>
                                    <span className={`inline-flex px-3 py-1 text-xs sm:text-sm font-semibold rounded-full ${statusStyles}`}>
                                        {status}
                                    </span>
                                    {user.isSuspicious && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs sm:text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                            <FiAlertTriangle size={14} /> Suspicious
                                        </span>
                                    )}
                                    {(duplicatePhone || duplicateEmail) && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs sm:text-sm font-semibold rounded-full bg-gray-100 text-gray-800">
                                            <FiShield size={14} /> Duplicate
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center text-gray-600 mb-2">
                                    <FiMail className="mr-2 shrink-0" size={16} />
                                    <span className="text-sm font-medium">Email</span>
                                </div>
                                <p className="text-gray-900 text-sm break-word">{user.email}</p>
                                <div className="mt-2 inline-flex items-center gap-1 text-xs">
                                    {user.isEmailVerified ? (
                                        <>
                                            <FiCheck className="text-green-600" />
                                            <span className="text-green-700 font-semibold">Verified</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiX className="text-red-600" />
                                            <span className="text-red-700 font-semibold">Unverified</span>
                                        </>
                                    )}
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {user.isEmailVerified ? (
                                        <button
                                            type="button"
                                            onClick={() => onSetEmailVerified?.(user._id, false)}
                                            className="px-3 py-2 rounded-lg text-xs font-semibold bg-red-50 text-red-800 hover:bg-red-100 transition"
                                        >
                                            Revoke
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => onSetEmailVerified?.(user._id, true)}
                                            className="px-3 py-2 rounded-lg text-xs font-semibold bg-green-50 text-green-800 hover:bg-green-100 transition"
                                        >
                                            Verify
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center text-gray-600 mb-2">
                                    <FiPhone className="mr-2 shrink-0" size={16} />
                                    <span className="text-sm font-medium">Phone</span>
                                </div>
                                <p className="text-gray-900 text-sm">{user.phone || 'N/A'}</p>
                                <div className="mt-2 inline-flex items-center gap-1 text-xs">
                                    {user.isPhoneVerified ? (
                                        <>
                                            <FiCheck className="text-green-600" />
                                            <span className="text-green-700 font-semibold">Verified</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiX className="text-red-600" />
                                            <span className="text-red-700 font-semibold">Unverified</span>
                                        </>
                                    )}
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {user.isPhoneVerified ? (
                                        <button
                                            type="button"
                                            onClick={() => onSetPhoneVerified?.(user._id, false)}
                                            className="px-3 py-2 rounded-lg text-xs font-semibold bg-red-50 text-red-800 hover:bg-red-100 transition"
                                        >
                                            Revoke
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => onSetPhoneVerified?.(user._id, true)}
                                            className="px-3 py-2 rounded-lg text-xs font-semibold bg-green-50 text-green-800 hover:bg-green-100 transition"
                                        >
                                            Verify
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Status + Actions */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                                <div>
                                    <p className="text-sm text-gray-600">Member Since</p>
                                    <p className="text-sm font-medium text-gray-900 mt-1" suppressHydrationWarning>
                                        {formatDate(user.createdAt)}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => onViewOrders?.(user)}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
                                >
                                    <FiList /> View Orders
                                </button>
                            </div>

                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => onUpdateStatus?.(user._id, 'active')}
                                    className="px-3 py-2.5 rounded-lg text-sm font-semibold bg-green-50 text-green-800 hover:bg-green-100 transition"
                                >
                                    Set Active
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onUpdateStatus?.(user._id, 'suspended')}
                                    className="px-3 py-2.5 rounded-lg text-sm font-semibold bg-yellow-50 text-yellow-800 hover:bg-yellow-100 transition"
                                >
                                    Suspend
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onUpdateStatus?.(user._id, 'blocked')}
                                    className="px-3 py-2.5 rounded-lg text-sm font-semibold bg-red-50 text-red-800 hover:bg-red-100 transition"
                                >
                                    Block
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => onToggleSuspicious?.(user)}
                                className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-yellow-50 text-yellow-800 hover:bg-yellow-100 transition"
                            >
                                <FiAlertTriangle /> {user.isSuspicious ? 'Unmark Suspicious' : 'Mark Suspicious'}
                            </button>
                        </div>

                        {/* Addresses */}
                        {user.addresses && user.addresses.length > 0 && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="text-sm font-medium text-gray-600 mb-3">Saved Addresses</h4>
                                <div className="space-y-3">
                                    {user.addresses.map((address, index) => (
                                        <div key={index} className="bg-white p-3 rounded border border-gray-200">
                                            <div className="flex items-start justify-between">
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm text-gray-600 mt-1 break-word">
                                                        {address.streetAddress || '—'}, {address.townCity || '—'}
                                                    </p>
                                                    <p className="text-sm text-gray-600">{address.state || '—'} {address.zipCode || ''}</p>
                                                    <p className="text-sm text-gray-600">{address.country || '—'}</p>
                                                </div>
                                                {address.isDefault && (
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded shrink-0 ml-2">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Modal Footer */}
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 active:scale-95 font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- BlockUserButton as a separate component ---
function BlockUserButton({ userId, isBlocked, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [blocked, setBlocked] = useState(isBlocked);

    const handleBlockToggle = async () => {
        setLoading(true);
        setError("");
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const { API_BASE_URL } = await import('@/config/api');
            const res = await fetch(`${API_BASE_URL}/users/${userId}/block`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ block: !blocked })
            });
            if (!res.ok) throw new Error("Failed");
            setBlocked(!blocked);
            setTimeout(() => {
                onSuccess && onSuccess();
            }, 1000);
        } catch {
            setError("Failed to update status. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-2">
            <button
                onClick={handleBlockToggle}
                disabled={loading}
                className={`px-4 py-2 rounded-lg font-semibold transition disabled:opacity-60 ${blocked ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-yellow-500 text-white hover:bg-yellow-600'}`}
            >
                {loading ? (blocked ? "Unblocking..." : "Blocking...") : blocked ? "Unblock User" : "Block User"}
            </button>
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    );
}


