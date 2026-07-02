import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

export default function StatCard({ stat, router }) {
  const CardContent = (
    <div
      className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4 sm:p-6 ${stat.link ? 'cursor-pointer' : ''
        }`}
      onClick={() => stat.link && router.push(stat.link)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <div className={`${stat.color} p-2 sm:p-3 rounded-lg flex-shrink-0`}>
            <stat.icon className="text-white" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-gray-600 truncate">{stat.title}</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{stat.value}</p>
          </div>
        </div>
        {stat.link && (
          <FiArrowRight className={`${stat.textColor} opacity-50 flex-shrink-0 ml-2`} size={18} />
        )}
      </div>
    </div>
  );

  return stat.link ? (
    <Link href={stat.link}>
      {CardContent}
    </Link>
  ) : (
    <div>{CardContent}</div>
  );
}

