import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

export default function RecentProducts({ products, router }) {
  const formatPrice = (value) => Number(value || 0).toFixed(2);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Products</h2>
          <p className="text-xs sm:text-sm text-gray-500">Latest items added to the catalog</p>
        </div>
        <Link
          href="/admin/products"
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <span className="hidden sm:inline">View All</span>
          <span className="sm:hidden">All</span>
          <FiArrowRight size={14} />
        </Link>
      </div>

      <div className="divide-y divide-gray-100">
        {products.length > 0 ? (
          products.map((product) => {
            const imageSrc = product.images?.[0] || '/logo.jpeg';
            const isLowStock = Number(product.stock || 0) < 10;
            const hasDiscount = Number(product.originalPrice || 0) > Number(product.price || 0);

            return (
              <button
                key={product._id}
                type="button"
                className="w-full text-left px-5 sm:px-6 py-4 hover:bg-gray-50 transition-colors"
                onClick={() => router.push('/admin/products')}
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-gray-200 bg-white shrink-0">
                    <Image
                      src={imageSrc}
                      alt={product.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">{product.name}</p>
                      {product.isFeatured && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {product.category && (
                        <span className="text-xs text-gray-500">{product.category}</span>
                      )}
                      {product.rating > 0 && (
                        <span className="text-xs text-yellow-600">★ {Number(product.rating).toFixed(1)}</span>
                      )}
                      {product.dressStyle && (
                        <span className="text-xs text-gray-400 hidden sm:inline">{product.dressStyle}</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">৳{formatPrice(product.price)}</div>
                    {hasDiscount && (
                      <div className="text-xs text-gray-400 line-through whitespace-nowrap">৳{formatPrice(product.originalPrice)}</div>
                    )}
                    <div className={`text-xs mt-1 ${isLowStock ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                      Stock: {Number(product.stock || 0)}
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="px-5 sm:px-6 py-10 text-center">
            <p className="text-sm text-gray-500">No products yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

