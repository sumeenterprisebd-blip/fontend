import { HiSparkles } from 'react-icons/hi';
import { FaTruck } from 'react-icons/fa';

export default function CartDetails({
  cartItems,
  subtotal,
  discount,
  discountPercent,
  shipping,
  total,
  comboApplied = false,
  originalShipping = 0,
  freeShippingReason = '',
  freeShippingThreshold,
  freeDeliveryMinPieces
}) {
  const safeSubtotal = Number(subtotal || 0);
  const safeDiscount = Number(discount || 0);
  const safeDiscountPercent = Number(discountPercent || 0);
  const safeTotal = Number(total || 0);
  const threshold = Math.max(999, Number(freeShippingThreshold || 999));
  const minPieces = Math.max(1, Number(freeDeliveryMinPieces || 3));
  return (
    <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 h-fit lg:sticky lg:top-24 border border-gray-100">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6">Order Summary</h2>

      {/* Product List */}
      <div className="mb-6 space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id || item._id} className="flex items-start justify-between gap-3 pb-4 border-b border-gray-200 last:border-0">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                  {item.name || 'Product'}
                </h3>

                {/* Size and Color */}
                {(item.size || item.color) && (
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">
                    {item.color && <span className="capitalize">{item.color}</span>}
                    {item.color && item.size && <span> / </span>}
                    {item.size && <span className="uppercase">{item.size}</span>}
                  </p>
                )}

                {/* Price and Quantity */}
                <div className="flex items-center justify-between">
                  <p className="text-sm sm:text-base font-bold text-gray-900">
                    ৳{(item.price || 0).toFixed(2)}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    Qty: {item.quantity || 1}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">No items in cart</p>
        )}
      </div>

      {/* Order Summary */}
      <div className="pt-5 border-t-2 border-gray-200">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm sm:text-base">
            <span className="text-gray-700 font-medium">Original Price</span>
            <span className="font-semibold text-gray-900">৳{safeSubtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center text-sm sm:text-base">
            <span className="flex items-center gap-2 text-gray-700 font-medium">
              Discount
              <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">-{safeDiscountPercent}%</span>
            </span>
            <span className="font-semibold text-red-500">-৳{safeDiscount.toFixed(2)}</span>
          </div>

          {/* Shipping */}
          <div className="flex justify-between items-center text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <FaTruck className={`w-4 h-4 ${comboApplied ? 'text-green-500' : 'text-gray-600'}`} />
              <span className="text-gray-700 font-medium">ডেলিভারি চার্জ</span>
            </div>
            <div className="flex items-center gap-2">
              {comboApplied ? (
                <>
                  <span className="text-xs text-gray-400 line-through">৳{originalShipping?.toFixed(2) || '0.00'}</span>
                  <span className="text-base font-bold text-green-600">ফ্রি</span>
                  <HiSparkles className="w-4 h-4 text-green-500" />
                </>
              ) : (
                <span className="font-semibold text-gray-900">
                  {shipping > 0 ? `৳${shipping.toFixed(2)}` : 'Calculated Delivery Area'}
                </span>
              )}
            </div>
          </div>

          {/* Combo Offer Badge */}
          {comboApplied && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <HiSparkles className="w-5 h-5 text-green-600 flex-shrink-0 animate-pulse" />
                <p className="text-xs sm:text-sm text-green-800 font-semibold">
                  {freeShippingReason || '🎉 ডেলিভারি ফ্রি প্রযোজ্য হয়েছে!'}
                </p>
              </div>
            </div>
          )}

          {!comboApplied && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
              <p className="text-xs sm:text-sm text-gray-800 font-medium">
                🚚 Free delivery on <span className="font-semibold">৳{threshold.toLocaleString('en-US')}+</span> or <span className="font-semibold">{minPieces}+ pcs</span>
              </p>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300">
            <span className="text-lg sm:text-xl font-bold text-gray-900">Total Price</span>
            <span className="text-xl sm:text-2xl font-bold text-gray-900">৳{safeTotal.toFixed(2)}</span>
          </div>

          {/* Tax Note */}
          <p className="text-xs text-gray-500 text-center pt-2">
            Tax included • Secure checkout
          </p>
        </div>
      </div>
    </div>
  );
}