/**
 * Lightweight Revenue Chart - CSS-based
 * Responsibility: Display revenue trend with simple bars (No chart.js dependency)
 */
export default function RevenueChart({ chartData }) {
    if (!chartData || !chartData.labels || !chartData.revenueData) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
                <p className="text-gray-500">No data available</p>
            </div>
        );
    }

    const maxRevenue = Math.max(...chartData.revenueData, 1);

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Revenue Trend</h3>
                <div className="text-sm text-gray-600">
                    Total: ৳{chartData.revenueData.reduce((a, b) => a + b, 0).toLocaleString()}
                </div>
            </div>

            {/* Simple Bar Chart */}
            <div className="space-y-3 h-80 overflow-y-auto">
                {chartData.labels.map((label, index) => {
                    const revenue = chartData.revenueData[index] || 0;
                    const percentage = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;

                    return (
                        <div key={index} className="flex items-center gap-3">
                            <div className="w-24 text-xs text-gray-600 text-right flex-shrink-0">
                                {label}
                            </div>
                            <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                                <div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                />
                                <div className="absolute inset-0 flex items-center justify-start px-3">
                                    <span className="text-xs font-semibold text-gray-900">
                                        ৳{revenue.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Period: Last {chartData.labels.length} entries</span>
                    <span>Peak: ৳{maxRevenue.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}
