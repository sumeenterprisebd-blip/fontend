export default function ChartStats({ orderStats }) {
    return (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{orderStats.delivered}</p>
                <p className="text-xs text-gray-600">Delivered</p>
                <p className="text-xs text-green-600 mt-1">
                    {orderStats.total > 0 ? ((orderStats.delivered / orderStats.total) * 100).toFixed(1) : 0}%
                </p>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{orderStats.processing}</p>
                <p className="text-xs text-gray-600">Processing</p>
                <p className="text-xs text-blue-600 mt-1">
                    {orderStats.total > 0 ? ((orderStats.processing / orderStats.total) * 100).toFixed(1) : 0}%
                </p>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{orderStats.pending}</p>
                <p className="text-xs text-gray-600">Pending</p>
                <p className="text-xs text-yellow-600 mt-1">
                    {orderStats.total > 0 ? ((orderStats.pending / orderStats.total) * 100).toFixed(1) : 0}%
                </p>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{orderStats.cancelled}</p>
                <p className="text-xs text-gray-600">Cancelled</p>
                <p className="text-xs text-red-600 mt-1">
                    {orderStats.total > 0 ? ((orderStats.cancelled / orderStats.total) * 100).toFixed(1) : 0}%
                </p>
            </div>
        </div>
    );
}
