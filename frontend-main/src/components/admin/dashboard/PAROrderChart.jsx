import { useState, useEffect } from 'react';
import { ordersAPI } from '@/services/api';
import { FiShoppingCart, FiTrendingUp } from 'react-icons/fi';
import { formatChartDate } from '@/utils/dateFormatter';
import OrderChartBars from './OrderChartBars';
import ChartLegend from './ChartLegend';
import ChartStats from './ChartStats';

export default function PAROrderChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    delivered: 0,
    pending: 0,
    processing: 0,
    cancelled: 0,
  });

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getOrders();
      const orders = response.data.orders || [];

      // Calculate order stats
      const stats = {
        total: orders.length,
        delivered: orders.filter(o => o.orderStatus === 'delivered').length,
        pending: orders.filter(o => ['pending', 'confirmed', 'hold'].includes(o.orderStatus)).length,
        processing: orders.filter(o => ['processing', 'shipped'].includes(o.orderStatus)).length,
        cancelled: orders.filter(o => ['cancelled', 'paid_return'].includes(o.orderStatus)).length,
      };
      setOrderStats(stats);

      // Generate chart data for last 7 days
      const chartDataArray = [];
      const now = new Date();

      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);

        const dayOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= dayStart && orderDate < dayEnd;
        });

        const dayStats = {
          date: formatChartDate(dayStart),
          delivered: dayOrders.filter(o => o.orderStatus === 'delivered').length,
          pending: dayOrders.filter(o => ['pending', 'confirmed', 'hold'].includes(o.orderStatus)).length,
          processing: dayOrders.filter(o => ['processing', 'shipped'].includes(o.orderStatus)).length,
          cancelled: dayOrders.filter(o => ['cancelled', 'paid_return'].includes(o.orderStatus)).length,
          total: dayOrders.length,
        };

        chartDataArray.push(dayStats);
      }

      setChartData(chartDataArray);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const maxOrders = Math.max(...chartData.map(d => d.total), 1);

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FiShoppingCart className="text-purple-600" size={18} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">PAR Order Chart</h3>
            <p className="text-xs sm:text-sm text-gray-600">Last 7 Days</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
          <FiTrendingUp size={14} />
          <span>{orderStats.total} Total Orders</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 sm:h-64 flex items-end justify-between gap-1 sm:gap-2 mb-4 overflow-x-auto">
        <OrderChartBars chartData={chartData} maxOrders={maxOrders} />
      </div>

      <ChartLegend orderStats={orderStats} />
      <ChartStats orderStats={orderStats} />
    </div>
  );
}

