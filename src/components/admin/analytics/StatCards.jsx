import { FiDollarSign, FiShoppingCart, FiUsers, FiPackage, FiTrendingUp, FiTrendingDown, FiInfo } from 'react-icons/fi';

/**
 * StatCards Component
 * Responsibility: Display main metric cards
 */
export default function StatCards({ stats, timeRange }) {
    const cards = [
        {
            title: 'Net Revenue',
            value: `৳${stats.totalRevenue.toFixed(2)}`,
            change: stats.revenueChange,
            icon: FiDollarSign,
            gradient: 'from-green-50 to-emerald-100',
            iconGradient: 'from-green-500 to-emerald-600',
            border: 'border-green-200',
            textColor: 'text-green-700',
            valueColor: 'text-green-900',
            description: 'Delivered sales minus cancelled/returned orders',
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            change: stats.ordersChange,
            subtitle: `${stats.completedOrders} completed`,
            icon: FiShoppingCart,
            gradient: 'from-blue-50 to-indigo-100',
            iconGradient: 'from-blue-500 to-indigo-600',
            border: 'border-blue-200',
            textColor: 'text-blue-700',
            valueColor: 'text-blue-900',
            description: 'Number of orders placed by customers',
        },
        {
            title: 'Total Users',
            value: stats.totalUsers,
            change: stats.usersChange,
            subtitle: `${stats.newUsers || 0} new ${timeRange !== 'all' ? `this ${timeRange}` : ''}`,
            icon: FiUsers,
            gradient: 'from-purple-50 to-violet-100',
            iconGradient: 'from-purple-500 to-violet-600',
            border: 'border-purple-200',
            textColor: 'text-purple-700',
            valueColor: 'text-purple-900',
            description: 'Registered customers on your platform',
        },
        {
            title: 'Avg Order Value',
            value: `৳${stats.averageOrderValue.toFixed(2)}`,
            change: stats.avgOrderValueChange,
            subtitle: 'per order',
            icon: FiPackage,
            gradient: 'from-amber-50 to-orange-100',
            iconGradient: 'from-amber-500 to-orange-600',
            border: 'border-amber-200',
            textColor: 'text-amber-700',
            valueColor: 'text-amber-900',
            description: 'Average amount spent per order',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className={`bg-gradient-to-br ${card.gradient} rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border ${card.border} group relative overflow-hidden`}
                >
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                            <div className={`p-2 sm:p-3 bg-gradient-to-br ${card.iconGradient} rounded-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                                <card.icon className="text-white" size={20} />
                            </div>
                            {card.change !== undefined && timeRange !== 'all' && (
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${card.change >= 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                                    }`}>
                                    {card.change >= 0 ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
                                    {Math.abs(card.change).toFixed(1)}%
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                <p className={`text-xs sm:text-sm font-medium ${card.textColor}`}>{card.title}</p>
                                <div className="group/tooltip relative">
                                    <FiInfo size={12} className={`${card.textColor} opacity-50 cursor-help`} />
                                    <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity z-20 shadow-lg">
                                        {card.description}
                                        <div className="absolute top-full left-4 w-0 h-0 border-4 border-transparent border-t-gray-900"></div>
                                    </div>
                                </div>
                            </div>
                            <p className={`text-2xl sm:text-3xl font-bold ${card.valueColor} mb-1`}>{card.value}</p>
                            {card.subtitle ? (
                                <p className={`text-xs ${card.textColor} mt-2`}>{card.subtitle}</p>
                            ) : null}
                            {timeRange !== 'all' && card.change !== undefined ? (
                                <p className="text-[11px] text-gray-500 mt-1">
                                    {timeRange === 'today' ? 'vs previous day' : `vs previous ${timeRange}`}
                                </p>
                            ) : null}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
