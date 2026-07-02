export default function ChartLegend({ orderStats }) {
    return (
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-xs text-gray-600">Delivered ({orderStats.delivered})</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-xs text-gray-600">Processing ({orderStats.processing})</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-xs text-gray-600">Pending ({orderStats.pending})</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-xs text-gray-600">Cancelled ({orderStats.cancelled})</span>
            </div>
        </div>
    );
}
