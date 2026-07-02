export function CardSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="space-y-4">
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-10 bg-gray-300 rounded w-1/3"></div>
            </div>
        </div>
    );
}
