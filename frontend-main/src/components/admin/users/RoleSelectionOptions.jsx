import { FiUser, FiShield } from 'react-icons/fi';

export default function RoleSelectionOptions({ selectedRole, onRoleSelect, currentRole }) {
    return (
        <div className="space-y-3">
            <label
                className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedRole === 'user'
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
            >
                <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={selectedRole === 'user'}
                    onChange={() => onRoleSelect('user')}
                    className="mt-1 h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                    aria-label="Select User role"
                />
                <div className="ml-3 flex-1">
                    <div className="flex items-center space-x-2">
                        <FiUser className="text-gray-600" size={18} />
                        <span className="font-semibold text-gray-900">User</span>
                        {currentRole === 'user' && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                                Current
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        Standard user with basic access to browse products, manage cart, and place orders.
                    </p>
                </div>
            </label>

            <label
                className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedRole === 'admin'
                    ? 'border-purple-500 bg-purple-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
            >
                <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={selectedRole === 'admin'}
                    onChange={() => onRoleSelect('admin')}
                    className="mt-1 h-5 w-5 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer"
                    aria-label="Select Admin role"
                />
                <div className="ml-3 flex-1">
                    <div className="flex items-center space-x-2">
                        <FiShield className="text-purple-600" size={18} />
                        <span className="font-semibold text-gray-900">Admin</span>
                        {currentRole === 'admin' && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                                Current
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        Full access to manage users, products, orders, settings, and all administrative features.
                    </p>
                </div>
            </label>

            <label
                className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedRole === 'moderator'
                    ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
            >
                <input
                    type="radio"
                    name="role"
                    value="moderator"
                    checked={selectedRole === 'moderator'}
                    onChange={() => onRoleSelect('moderator')}
                    className="mt-1 h-5 w-5 text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer"
                    aria-label="Select Moderator role"
                />
                <div className="ml-3 flex-1">
                    <div className="flex items-center space-x-2">
                        <FiShield className="text-emerald-600" size={18} />
                        <span className="font-semibold text-gray-900">Moderator</span>
                        {currentRole === 'moderator' && (
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                                Current
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        Access to analytics and read-only operational data without full admin permissions.
                    </p>
                </div>
            </label>
        </div>
    );
}
