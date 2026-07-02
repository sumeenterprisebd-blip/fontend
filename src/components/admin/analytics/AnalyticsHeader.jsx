import { FiBarChart2, FiCalendar, FiHelpCircle } from 'react-icons/fi';

/**
 * AnalyticsHeader Component
 * Responsibility: Display header and time range filter
 */
export default function AnalyticsHeader({ timeRange, onTimeRangeChange }) {
    const timeRangeOptions = [
        { value: 'today', label: 'Today', icon: FiCalendar, description: "Today's performance" },
        { value: 'week', label: '7 Days', icon: FiCalendar, description: 'Last week overview' },
        { value: 'month', label: '30 Days', icon: FiCalendar, description: 'Monthly trends' },
        { value: 'all', label: 'All Time', icon: FiBarChart2, description: 'Complete history' }
    ];

    return (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 text-white shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <FiBarChart2 size={28} className="sm:w-8 sm:h-8" />
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Analytics Dashboard</h1>
                            <p className="text-blue-100 text-xs sm:text-sm mt-1">
                                Track your business performance at a glance
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 bg-white/10 rounded-lg px-3 py-2 text-xs sm:text-sm">
                        <FiHelpCircle size={16} />
                        <span className="text-blue-100">
                            Select a time range to filter your data
                        </span>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 flex flex-wrap sm:flex-nowrap gap-1">
                    {timeRangeOptions.map(({ value, label, icon: Icon, description }) => (
                        <button
                            key={value}
                            onClick={() => onTimeRangeChange(value)}
                            className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 ${timeRange === value
                                ? 'bg-white text-blue-600 shadow-md'
                                : 'text-white hover:bg-white/20'
                                }`}
                            title={description}
                        >
                            <Icon size={14} className="hidden sm:block" />
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
