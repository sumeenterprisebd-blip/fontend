import { FiUser, FiShield, FiUserCheck, FiAlertTriangle, FiSlash } from 'react-icons/fi';

export default function UsersStats({ stats }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm p-6 border border-blue-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-blue-600 mb-1">Total Users</p>
                        <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
                    </div>
                    <div className="p-4 bg-blue-200 rounded-full">
                        <FiUser className="text-blue-700" size={28} />
                    </div>
                </div>
            </div>

            <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm p-6 border border-purple-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-purple-600 mb-1">Administrators</p>
                        <p className="text-3xl font-bold text-purple-900">{stats.admins}</p>
                    </div>
                    <div className="p-4 bg-purple-200 rounded-full">
                        <FiShield className="text-purple-700" size={28} />
                    </div>
                </div>
            </div>

            <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl shadow-sm p-6 border border-green-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-green-600 mb-1">Regular Users</p>
                        <p className="text-3xl font-bold text-green-900">{stats.regular}</p>
                    </div>
                    <div className="p-4 bg-green-200 rounded-full">
                        <FiUserCheck className="text-green-700" size={28} />
                    </div>
                </div>
            </div>

            <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Blocked</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.blocked || 0}</p>
                    </div>
                    <div className="p-4 bg-gray-200 rounded-full">
                        <FiSlash className="text-gray-700" size={28} />
                    </div>
                </div>
            </div>

            <div className="bg-linear-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-sm p-6 border border-yellow-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-yellow-700 mb-1">Suspicious</p>
                        <p className="text-3xl font-bold text-yellow-900">{stats.suspicious || 0}</p>
                    </div>
                    <div className="p-4 bg-yellow-200 rounded-full">
                        <FiAlertTriangle className="text-yellow-800" size={28} />
                    </div>
                </div>
            </div>
        </div>
    );
}
