import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export default function MetricCard({
    title,
    value,
    change,
    icon: Icon,
    colorFrom,
    colorTo,
    iconBg,
    timeRange,
    subtitle
}) {
    const hasChange = change !== undefined && timeRange !== 'all';

    return (
        <div className={`bg-linear-to-br ${colorFrom} ${colorTo} rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-${iconBg.split('-')[0]}-200`}>
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-linear-to-br ${iconBg} rounded-xl shadow-lg`}>
                    <Icon className="text-white" size={24} />
                </div>
                {hasChange && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${change >= 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                        }`}>
                        {change >= 0 ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
                        {Math.abs(change).toFixed(1)}%
                    </div>
                )}
            </div>
            <div>
                <p className={`text-sm font-medium text-${iconBg.split('-')[0]}-700 mb-1`}>{title}</p>
                <p className={`text-3xl font-bold text-${iconBg.split('-')[0]}-900`}>{value}</p>
                {subtitle && (
                    <p className={`text-xs text-${iconBg.split('-')[0]}-600 mt-2`}>{subtitle}</p>
                )}
            </div>
        </div>
    );
}
