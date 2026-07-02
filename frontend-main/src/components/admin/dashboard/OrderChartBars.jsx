export default function OrderChartBars({ chartData, maxOrders }) {
    if (chartData.length === 0) {
        return <p className="text-sm text-gray-500 w-full text-center">No data available</p>;
    }

    return chartData.map((data, index) => {
        const totalHeight = (data.total / maxOrders) * 100;
        const deliveredHeight = data.total > 0 ? (data.delivered / data.total) * 100 : 0;
        const processingHeight = data.total > 0 ? (data.processing / data.total) * 100 : 0;
        const pendingHeight = data.total > 0 ? (data.pending / data.total) * 100 : 0;
        const cancelledHeight = data.total > 0 ? (data.cancelled / data.total) * 100 : 0;

        return (
            <div key={index} className="flex-1 flex flex-col items-center group">
                <div className="w-full flex items-end justify-center h-48 relative">
                    {data.total > 0 ? (
                        <div
                            className="w-full rounded-t transition-all hover:shadow-lg cursor-pointer flex flex-col-reverse"
                            style={{ height: `${totalHeight}%`, minHeight: '4px' }}
                            title={`Total: ${data.total} | Delivered: ${data.delivered} | Processing: ${data.processing} | Pending: ${data.pending} | Cancelled: ${data.cancelled}`}
                        >
                            {data.cancelled > 0 && (
                                <div
                                    className="w-full bg-red-500 transition-all hover:bg-red-600"
                                    style={{ height: `${cancelledHeight}%` }}
                                ></div>
                            )}
                            {data.pending > 0 && (
                                <div
                                    className="w-full bg-yellow-500 transition-all hover:bg-yellow-600"
                                    style={{ height: `${pendingHeight}%` }}
                                ></div>
                            )}
                            {data.processing > 0 && (
                                <div
                                    className="w-full bg-blue-500 transition-all hover:bg-blue-600"
                                    style={{ height: `${processingHeight}%` }}
                                ></div>
                            )}
                            {data.delivered > 0 && (
                                <div
                                    className="w-full bg-green-500 rounded-t transition-all hover:bg-green-600"
                                    style={{ height: `${deliveredHeight}%` }}
                                ></div>
                            )}
                        </div>
                    ) : (
                        <div className="w-full h-1 bg-gray-200 rounded"></div>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left whitespace-nowrap">
                    {data.date}
                </p>
                <p className="text-xs font-medium text-gray-700 mt-1">{data.total}</p>
            </div>
        );
    });
}
