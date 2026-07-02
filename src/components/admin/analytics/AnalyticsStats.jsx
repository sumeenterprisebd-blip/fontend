import { FiDollarSign, FiShoppingCart, FiUsers, FiPackage } from 'react-icons/fi';
import MetricCard from './MetricCard';

export default function AnalyticsStats({ stats, timeRange }) {
    const metricsConfig = [
        {
            title: 'Net Revenue',
            value: `৳${stats.totalRevenue.toFixed(2)}`,
            change: stats.revenueChange,
            icon: FiDollarSign,
            colorFrom: 'from-green-50',
            colorTo: 'to-emerald-100',
            iconBg: 'from-green-500 to-emerald-600',
            subtitle: timeRange !== 'all' ? `vs previous ${timeRange === 'today' ? 'day' : timeRange}` : null,
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            change: stats.ordersChange,
            icon: FiShoppingCart,
            colorFrom: 'from-blue-50',
            colorTo: 'to-indigo-100',
            iconBg: 'from-blue-500 to-indigo-600',
            subtitle: `${stats.completedOrders} completed`,
        },
        {
            title: 'Total Users',
            value: stats.totalUsers,
            change: stats.usersChange,
            icon: FiUsers,
            colorFrom: 'from-purple-50',
            colorTo: 'to-violet-100',
            iconBg: 'from-purple-500 to-violet-600',
            subtitle: `${stats.newUsers || 0} new ${timeRange !== 'all' ? `this ${timeRange}` : ''}`,
        },
        {
            title: 'Avg Order Value',
            value: `৳${stats.averageOrderValue.toFixed(2)}`,
            change: stats.avgOrderValueChange,
            icon: FiPackage,
            colorFrom: 'from-amber-50',
            colorTo: 'to-orange-100',
            iconBg: 'from-amber-500 to-orange-600',
            subtitle: timeRange !== 'all' ? 'per order' : null,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {metricsConfig.map((metric, index) => (
                <MetricCard key={index} {...metric} timeRange={timeRange} />
            ))}
        </div>
    );
}
