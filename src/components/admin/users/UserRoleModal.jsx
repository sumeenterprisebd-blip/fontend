import { FiX, FiShield, FiCheckCircle } from 'react-icons/fi';
import RoleSelectionOptions from './RoleSelectionOptions';
import RoleChangeConfirmation from './RoleChangeConfirmation';

export default function UserRoleModal({
    user,
    isOpen,
    onClose,
    selectedRole,
    onRoleSelect,
    onSave,
    showConfirmation,
    onConfirm,
    onBackFromConfirmation,
    isLoading
}) {
    if (!isOpen || !user) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-9999 p-4 animate-fadeIn"
            onClick={(e) => {
                if (e.target === e.currentTarget && !isLoading && !showConfirmation) {
                    onClose();
                }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="role-modal-title"
        >
            <div
                className="bg-white rounded-2xl max-w-lg w-full shadow-2xl animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    {/* Modal Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-full">
                                <FiShield className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <h2 id="role-modal-title" className="text-xl font-bold text-gray-900">
                                    Change User Role
                                </h2>
                                <p className="text-sm text-gray-600 mt-0.5">
                                    {user.firstName} {user.lastName}
                                </p>
                            </div>
                        </div>
                        {!isLoading && !showConfirmation && (
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-all duration-200 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                aria-label="Close modal"
                            >
                                <FiX size={20} />
                            </button>
                        )}
                    </div>

                    {/* Confirmation View */}
                    {showConfirmation ? (
                        <RoleChangeConfirmation
                            user={user}
                            selectedRole={selectedRole}
                            onConfirm={onConfirm}
                            onBack={onBackFromConfirmation}
                            isLoading={isLoading}
                        />
                    ) : (
                        <>
                            <div className="space-y-4 mb-6">
                                <div className="mb-3">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Select New Role
                                    </label>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Current role: <span className="font-semibold capitalize">{user.role}</span>
                                    </p>
                                </div>

                                <RoleSelectionOptions
                                    selectedRole={selectedRole}
                                    onRoleSelect={onRoleSelect}
                                    currentRole={user.role}
                                />
                            </div>

                            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="px-5 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onSave}
                                    disabled={selectedRole === user.role}
                                    className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium"
                                >
                                    <FiCheckCircle size={16} />
                                    <span>Update Role</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
