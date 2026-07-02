import { FiClock, FiTruck, FiCheckCircle, FiXCircle, FiInfo } from 'react-icons/fi';

/**
 * QuickStats Component
 * Responsibility: Display quick order status statistics
 */
export default function QuickStats({ stats }) {
    const quickStats = [
        {
            label: 'Pending',
            value: stats.pendingOrders || 0,
            icon: FiClock,
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-700',
            iconColor: 'text-yellow-600',
            description: 'Orders waiting for confirmation',
            pulse: true
        },
        {
            label: 'Processing',
            value: stats.processingOrders || 0,
            icon: FiTruck,
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-700',
            iconColor: 'text-blue-600',
            description: 'Orders being prepared/shipped',
            pulse: true
        },
        {
            label: 'Completed',
            value: stats.completedOrders || 0,
            icon: FiCheckCircle,
            bgColor: 'bg-green-100',
            textColor: 'text-green-700',
            iconColor: 'text-green-600',
            description: 'Successfully delivered orders'
        },
        {
            label: 'Cancelled',
            value: stats.cancelledOrders || 0,
            icon: FiXCircle,
            bgColor: 'bg-red-100',
            textColor: 'text-red-700',
            iconColor: 'text-red-600',
            description: 'Orders that were cancelled'
        },
    ];

    return (
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">Order Status Overview</h3>
                    <div className="group/info relative">
                        <FiInfo size={16} className="text-gray-400 cursor-help" />
                        <div className="absolute left-0 top-full mt-2 w-56 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/info:opacity-100 pointer-events-none transition-opacity z-20 shadow-xl">
                            Real-time breakdown of your order statuses. Active orders require your attention!
                            <div className="absolute bottom-full left-4 w-0 h-0 border-4 border-transparent border-b-gray-900"></div>
                        </div>
                    </div>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Live</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {quickStats.map((stat, index) => (
                    <div
                        key={index}
                        className={`${stat.bgColor} rounded-lg p-3 sm:p-4 flex items-center gap-2 sm:gap-3 hover:shadow-md transition-all duration-300 group relative`}
                    >
                        <div className={`p-2 rounded-lg bg-white shadow-sm ${stat.pulse ? 'animate-pulse' : ''}`}>
                            <stat.icon className={stat.iconColor} size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-xl sm:text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                            <p className={`text-xs sm:text-sm ${stat.textColor} opacity-80 truncate`}>{stat.label}</p>
                        </div>
                        {/* Tooltip */}
                        <div className="absolute left-0 bottom-full mb-2 w-40 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 shadow-lg">
                            {stat.description}
                            <div className="absolute top-full left-4 w-0 h-0 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
