import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CartItem from '@/components/cart/CartItem';
import OrderSummary from '@/components/cart/OrderSummary';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { useComboOffer } from '@/hooks/useComboOffer';
import dynamic from 'next/dynamic';
import SEO from '@/components/shared/SEO';
import { useSettings } from '@/contexts/SettingsContext';

const SweetAlert = dynamic(() => import('@/components/shared/SweetAlert'), { ssr: false });

export default function CartPage() {
  const cartStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Shopping Cart',
    description: 'Review your shopping cart items'
  };
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const {
    cartItems,
    cartTotals,
    loading,
    error,
    updateQuantity,
    removeItem,
    refreshCart,
  } = useCart();
  const { settings } = useSettings();
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const { comboStatus, loading: comboLoading } = useComboOffer(cartItems);

  const freeShippingThreshold = Math.max(
    999,
    Number(cartTotals?.freeShippingThreshold || settings?.freeShippingThreshold || 999)
  );
  const qualifiesByAmount = Boolean(cartTotals?.qualifiesFreeShippingByAmount) || Number(cartTotals?.total || 0) >= freeShippingThreshold;
  const totalQuantity = Number(
    cartTotals?.totalQuantity ?? comboStatus?.totalQuantity ?? cartItems.reduce((sum, item) => sum + Number(item?.quantity || 0), 0)
  );
  const qualifiesByPieces = Boolean(cartTotals?.qualifiesFreeShippingByQuantity) || totalQuantity >= 3;
  const qualifiesFreeDelivery = Boolean(comboStatus?.freeDelivery) || qualifiesByAmount || qualifiesByPieces;

  const piecesRemaining = Math.max(0, 3 - totalQuantity);
  const amountRemaining = Math.max(0, freeShippingThreshold - Number(cartTotals?.total || 0));

  // Ensure fresh data on entry (covers rehydration / tab returns)
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    const result = await updateQuantity(itemId, newQuantity);
    if (!result.success) {
      setAlert({
        show: true,
        message: result.message || 'Failed to update quantity',
        type: 'error',
      });
    }
  };

  const handleRemoveItem = async (itemId) => {
    const result = await removeItem(itemId);
    if (result.success) {
      setAlert({
        show: true,
        message: 'Item removed from cart',
        type: 'success',
      });
    } else {
      setAlert({
        show: true,
        message: result.message || 'Failed to remove item',
        type: 'error',
      });
    }
  };

  if (loading) {
    return (
      <>
        <SEO
          title="Your Shopping Cart - DeshWear"
          description="Review your selected items and proceed to checkout. Your cart is saved for your convenience."
          noindex={true}
          structuredData={cartStructuredData}
        />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cart...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Your Shopping Cart - DeshWear"
        description="Review your selected items and proceed to checkout. Your cart is saved for your convenience."
        noindex={true}
        structuredData={cartStructuredData}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-8 pt-10 pb-28">

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Main Content */}
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 mb-4">Cart is empty</p>
            </div>
          ) : (
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-10">
              {/* Cart Items - Top on mobile, Left Column on desktop (2/3 width) */}
              <div className="w-full lg:col-span-2 space-y-3 sm:space-y-6">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>

              {/* Order Summary - Bottom on mobile, Right Column on desktop (1/3 width) */}
              <div className="w-full lg:col-span-1">
                <div className="mb-6">
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-extrabold text-gray-900">🔥 কম্বো অফার</h3>
                      {comboLoading && <span className="text-xs text-gray-500">Checking…</span>}
                    </div>

                    <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-gray-800">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <span>🎁</span>
                          <div>
                            ৩ পিস কিনলেই <span className="font-semibold text-green-700">ফ্রি ডেলিভারি</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span>💰</span>
                          <div>
                            অথবা মোট অর্ডার <span className="font-semibold">{settings?.currencySymbol || '৳'}{Number(freeShippingThreshold).toLocaleString('en-US')}</span> হলে ফ্রি ডেলিভারি।
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span>🚚</span>
                          <div>চুক্তি না হলে নিয়মিত ডেলিভারি চার্জ প্রযোজ্য হবে।</div>
                        </div>
                      </div>

                      <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-900">
                        <div className="font-semibold mb-2">📌 বিশেষ অনুরোধ</div>
                        <p className="leading-relaxed">
                          প্রিয় ভাই/আপু, অনুগ্রহ করে নিশ্চিত হয়ে অর্ডার করুন। ফেক অর্ডার আমাদের ছোট ব্যবসার জন্য বড় ক্ষতির কারণ হয়।
                        </p>
                        <p className="mt-3 leading-relaxed">
                          যদি কোনো কারণে পণ্য গ্রহণ না করতে চান বা রিটার্ন করতে হয়, তাহলে অনুগ্রহ করে ডেলিভারি ম্যানকে <span className="font-semibold">ডেলিভারি চার্জ প্রদান করে</span> পণ্যটি রিটার্ন করবেন।
                        </p>
                        <p className="mt-3 font-semibold text-gray-900">
                          আপনার আন্তরিক সহযোগিতাই আমাদের এগিয়ে যাওয়ার অনুপ্রেরণা। ❤️
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <OrderSummary
                  subtotal={cartTotals.subtotal}
                  discount={cartTotals.discount}
                  discountPercent={cartTotals.discountPercent}
                  total={cartTotals.total}
                />
              </div>
            </div>
          )}
        </div>

        {/* Alert */}
        {alert.show && (
          <SweetAlert
            isOpen={alert.show}
            onClose={() => setAlert({ ...alert, show: false })}
            title={alert.type === 'success' ? 'Success' : 'Error'}
            message={alert.message}
            type={alert.type}
            confirmText="OK"
          />
        )}
      </div>
    </>
  );
}
