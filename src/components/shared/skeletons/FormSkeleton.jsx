export function FormSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="h-10 bg-gray-300 rounded w-32"></div>
        </div>
    );
}
