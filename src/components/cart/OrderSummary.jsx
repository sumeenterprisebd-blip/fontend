import { useState } from 'react';
import { HiArrowRight } from 'react-icons/hi';
import Link from 'next/link';

export default function OrderSummary({ subtotal, discount, discountPercent, total, className = '' }) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  const safeSubtotal = Number(subtotal || 0);
  const safeDiscount = Number(discount || 0);
  const safeTotal = Number(total || 0);
  const safeDiscountPercent = Number(discountPercent || 0);

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      // In a real app, validate promo code with backend
      setAppliedPromo(promoCode);
      setPromoCode('');
    }
  };

  return (
    <div className={`bg-white border border-gray-100 rounded-2xl p-6 lg:p-7 h-fit w-full shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Order Summary</h2>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6 text-sm sm:text-base">
        <div className="flex items-center justify-between text-gray-700">
          <span className="font-medium">Original Price</span>
          <span className="font-semibold">৳{safeSubtotal.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-gray-700">
            Discount
            <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">-{safeDiscountPercent}%</span>
          </span>
          <span className="font-semibold text-red-500">-৳{safeDiscount.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-4">
          <span className="text-base sm:text-lg font-semibold text-gray-900">Final Payable</span>
          <span className="text-base sm:text-lg font-bold text-gray-900">৳{safeTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <Link
        href="/checkout"
        className="w-full bg-[#0a1a44] text-white py-4 rounded-xl font-semibold hover:bg-[#0c245a] transition-colors flex items-center justify-center gap-2 shadow-md"
      >
        Go to Checkout
        <HiArrowRight className="w-5 h-5" />
      </Link>
    </div>
  );
}