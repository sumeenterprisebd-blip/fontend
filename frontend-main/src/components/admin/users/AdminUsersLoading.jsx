export default function AdminUsersLoading() {
    return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600"></div>
            <p className="text-gray-500 font-medium">Loading users...</p>
        </div>
    );
}
