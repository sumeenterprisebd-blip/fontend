import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

export default function RoleChangeConfirmation({
    user,
    selectedRole,
    onConfirm,
    onBack,
    isLoading
}) {
    return (
        <div className="space-y-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                <div className="flex items-start">
                    <FiAlertCircle className="text-yellow-600 mt-0.5 mr-3 shrink-0" size={20} />
                    <div>
                        <h3 className="text-sm font-semibold text-yellow-800 mb-1">
                            Confirm Role Change
                        </h3>
                        <p className="text-sm text-yellow-700">
                            Are you sure you want to change{' '}
                            <span className="font-semibold">{user.firstName} {user.lastName}</span>
                            's role from{' '}
                            <span className="font-semibold capitalize">{user.role}</span>
                            {' '}to{' '}
                            <span className="font-semibold capitalize">{selectedRole}</span>?
                        </p>
                        <p className="text-sm text-yellow-600 mt-2">
                            This will immediately change their access permissions.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
                <button
                    onClick={onBack}
                    disabled={isLoading}
                    className="px-5 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    Go Back
                </button>
                <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium"
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            <span>Updating...</span>
                        </>
                    ) : (
                        <>
                            <FiCheckCircle size={16} />
                            <span>Confirm Change</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
