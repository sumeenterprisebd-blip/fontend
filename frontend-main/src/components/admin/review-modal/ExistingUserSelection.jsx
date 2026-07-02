import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function ExistingUserSelection({
    users,
    fetchingData,
    onUserSelect
}) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(user => {
        if (!searchTerm) return true;
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
        const email = user.email?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        return fullName.includes(search) || email.includes(search);
    });

    const handleUserSelect = (user) => {
        setSearchTerm('');
        onUserSelect(user);
    };

    return (
        <>
            {/* Search */}
            <div className="relative mb-4">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
            </div>

            {/* Loading State */}
            {fetchingData ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading users...</p>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    {users.length === 0 ? 'No users found' : 'No matching users'}
                </div>
            ) : (
                <div className="max-h-96 overflow-y-auto space-y-2">
                    {filteredUsers.map((user) => (
                        <button
                            key={user._id}
                            onClick={() => handleUserSelect(user)}
                            className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                        >
                            <p className="font-semibold text-black">
                                {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                        </button>
                    ))}
                </div>
            )}
        </>
    );
}
