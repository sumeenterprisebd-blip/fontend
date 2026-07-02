export function TableSkeleton({ rows = 5, columns = 4 }) {
    return (
        <div className="animate-pulse">
            {/* Table Header */}
            <div className="bg-gray-100 rounded-t-lg p-4 flex gap-4">
                {Array.from({ length: columns }).map((_, i) => (
                    <div key={i} className="h-4 bg-gray-300 rounded flex-1"></div>
                ))}
            </div>

            {/* Table Rows */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="bg-white border-b p-4 flex gap-4">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <div key={colIndex} className="h-4 bg-gray-200 rounded flex-1"></div>
                    ))}
                </div>
            ))}
        </div>
    );
}
