/**
 * OrderStatusBreakdown Component
 * Responsibility: Display order status breakdown with progress bars
 */
export default function OrderStatusBreakdown({ stats }) {
    const statusData = [
        {
            status: 'Completed',
            count: stats.completedOrders || 0,
            color: 'bg-green-500',
            bgColor: 'bg-green-100',
        },
        {
            status: 'Processing',
            count: stats.processingOrders || 0,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-100',
        },
        {
            status: 'Pending',
            count: stats.pendingOrders || 0,
            color: 'bg-yellow-500',
            bgColor: 'bg-yellow-100',
        },
        {
            status: 'Cancelled',
            count: stats.cancelledOrders || 0,
            color: 'bg-red-500',
            bgColor: 'bg-red-100',
        },
    ];

    const totalOrders = stats.totalOrders || 1;

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Order Status Breakdown</h3>
            <div className="space-y-6">
                {statusData.map((item, index) => {
                    const percentage = ((item.count / totalOrders) * 100).toFixed(1);
                    return (
                        <div key={index}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">{item.status}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-800">{item.count}</span>
                                    <span className="text-xs text-gray-500">({percentage}%)</span>
                                </div>
                            </div>
                            <div className={`w-full ${item.bgColor} rounded-full h-3`}>
                                <div
                                    className={`${item.color} h-3 rounded-full transition-all duration-500`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
