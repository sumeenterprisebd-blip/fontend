export function ProductSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
            <div className="bg-gray-300 h-64 w-full"></div>
            <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-6 bg-gray-300 rounded w-1/4"></div>
            </div>
        </div>
    );
}
