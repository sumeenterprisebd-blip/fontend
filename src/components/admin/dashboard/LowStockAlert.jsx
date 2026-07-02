import Link from 'next/link';
import { FiTrendingUp } from 'react-icons/fi';

export default function LowStockAlert({ count }) {
  if (count === 0) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 rounded">
      <div className="flex items-start sm:items-center gap-2 sm:gap-3">
        <div className="shrink-0 pt-0.5 sm:pt-0">
          <FiTrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-yellow-700">
            <span className="font-medium">Low Stock Alert:</span> {count} product(s) have low stock.
            <Link href="/admin/products" className="ml-1 sm:ml-2 text-yellow-600 hover:text-yellow-800 underline inline-block">
              View Products
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

