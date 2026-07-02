import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Breadcrumb from '@/components/shop/Breadcrumb';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import CartDetails from '@/components/checkout/CartDetails';
import { useCart } from '@/hooks/useCart';
import { useComboOffer } from '@/hooks/useComboOffer';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import SEO from '@/components/shared/SEO';
import { useRef } from 'react';
import { trackInitiateCheckout } from '@/utils/analytics';
import { useSettings } from '@/contexts/SettingsContext';
import dynamic from 'next/dynamic';

const SweetAlert = dynamic(() => import('@/components/shared/SweetAlert'), { ssr: false });

const SHIPPING_FEES = {
  'Inside Dhaka': 70,
  'Outside Dhaka': 120
};

const FREE_DELIVERY_MIN_PIECES = 3;

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { cartItems, cartTotals, loading: cartLoading } = useCart();
  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false);
  const { settings } = useSettings();
  const { comboStatus } = useComboOffer(cartItems);
  const [deliveryArea, setDeliveryArea] = useState('');
  const [hasInvalidItems, setHasInvalidItems] = useState(false);
  const [invalidItemNames, setInvalidItemNames] = useState([]);
  const [orderJustPlaced, setOrderJustPlaced] = useState(false);
  const didTrackCheckoutRef = useRef(false);

  const [showFreeDeliveryPopup, setShowFreeDeliveryPopup] = useState(false);
  const [freeDeliveryPopupMessage, setFreeDeliveryPopupMessage] = useState('');
  const didShowFreeDeliveryPopupRef = useRef(false);

  // Validate cart items for size and color on mount and when cart changes
  useEffect(() => {
    if (!cartLoading && cartItems.length > 0) {
      const itemsWithoutSizeOrColor = cartItems.filter(item =>
        !item.size || !item.color || item.size === '' || item.color === '' ||
        item.size === 'undefined' || item.color === 'undefined'
      );

      if (itemsWithoutSizeOrColor.length > 0) {
        setHasInvalidItems(true);
        setInvalidItemNames(itemsWithoutSizeOrColor.map(item => item.name));
      } else {
        setHasInvalidItems(false);
        setInvalidItemNames([]);
      }
    }
  }, [cartItems, cartLoading]);

  // Apply combo offer or category-based free delivery to shipping fee
  const baseShippingFee = SHIPPING_FEES[deliveryArea] || cartTotals.deliveryFee || 0;
  const subtotal = cartTotals.subtotal || 0;

  const discountPercent = cartTotals.discountPercent || 0;
  // Use the already-computed discount amount from cart totals.
  // Recomputing from a rounded percent can cause mismatches.
  const discountValue = cartTotals.discount || 0;

  const effectiveSubtotal = cartTotals.total || (subtotal - discountValue);
  const freeShippingThreshold = Number(cartTotals?.freeShippingThreshold || 999);
  const qualifiesByAmount = Boolean(cartTotals?.qualifiesFreeShippingByAmount) || effectiveSubtotal >= freeShippingThreshold;

  const totalQuantity = Number(cartTotals?.totalQuantity || 0) || (
    Array.isArray(cartItems)
      ? cartItems.reduce((sum, item) => sum + Number(item?.quantity || 0), 0)
      : 0
  );
  const qualifiesByQuantity = Boolean(cartTotals?.qualifiesFreeShippingByQuantity) || totalQuantity >= FREE_DELIVERY_MIN_PIECES;

  const freeShippingApplied = !!comboStatus.freeDelivery || qualifiesByAmount || qualifiesByQuantity;
  const shippingFee = freeShippingApplied ? 0 : baseShippingFee;
  const freeShippingReason = qualifiesByAmount
    ? `🎉 ${settings?.currencySymbol || '৳'}${Number(freeShippingThreshold).toLocaleString('en-US')}+ শপিং করলে ডেলিভারি ফ্রি`
    : (qualifiesByQuantity
      ? `🎉 ${FREE_DELIVERY_MIN_PIECES}+ পিস নিলে ডেলিভারি ফ্রি`
      : (comboStatus.freeDelivery ? (comboStatus.reason || '🎉 কম্বো অফার অনুযায়ী ডেলিভারি ফ্রি প্রযোজ্য হয়েছে!') : ''));
  const totals = {
    subtotal,
    discount: discountValue,
    discountPercent,
    shipping: shippingFee,
    originalShipping: baseShippingFee,
    comboApplied: freeShippingApplied,
    freeShippingReason,
    // cartTotals.total is the effective subtotal (after item discounts)
    total: effectiveSubtotal + shippingFee
  };

  // Auto free-delivery prompt on entering Checkout (only when not eligible)
  useEffect(() => {
    if (didShowFreeDeliveryPopupRef.current) return;
    if (cartLoading) return;
    if (orderJustPlaced) return;
    if (!Array.isArray(cartItems) || cartItems.length === 0) return;

    const eligible = !!comboStatus.freeDelivery || qualifiesByAmount || qualifiesByQuantity;
    if (eligible) return;

    const currencySymbol = settings?.currencySymbol || '৳';
    const amountRemainingRaw = Math.max(0, freeShippingThreshold - Number(effectiveSubtotal || 0));
    const amountRemaining = Math.ceil(amountRemainingRaw);
    const qtyRemaining = Math.max(0, FREE_DELIVERY_MIN_PIECES - Number(totalQuantity || 0));

    // Choose the more achievable target (relative distance).
    const amountRatio = freeShippingThreshold > 0 ? (amountRemainingRaw / freeShippingThreshold) : 1;
    const qtyRatio = FREE_DELIVERY_MIN_PIECES > 0 ? (qtyRemaining / FREE_DELIVERY_MIN_PIECES) : 1;

    const message = (qtyRemaining > 0 && qtyRatio < amountRatio)
      ? `🎁 Add just ${qtyRemaining} more product${qtyRemaining === 1 ? '' : 's'} to get Free Delivery!`
      : `🎁 Shop ${currencySymbol}${Number(amountRemaining).toLocaleString('en-US')} more to get Free Delivery!`;

    setFreeDeliveryPopupMessage(message);
    setShowFreeDeliveryPopup(true);
    didShowFreeDeliveryPopupRef.current = true;
  }, [cartLoading, orderJustPlaced, cartItems, comboStatus.freeDelivery, qualifiesByAmount, qualifiesByQuantity, effectiveSubtotal, freeShippingThreshold, totalQuantity, settings?.currencySymbol]);

  // Facebook Pixel / GA: InitiateCheckout
  useEffect(() => {
    if (didTrackCheckoutRef.current) return;
    if (cartLoading) return;
    if (orderJustPlaced) return;
    if (!Array.isArray(cartItems) || cartItems.length === 0) return;

    didTrackCheckoutRef.current = true;

    const currency = settings?.currency || 'BDT';
    const items = cartItems.map((item) => {
      const id = item.productId || item.id;
      const quantity = Number(item.quantity || 1);
      const price = Number(item.price || 0);
      return {
        id,
        item_id: String(id),
        item_name: item.name,
        price,
        item_price: price,
        quantity,
      };
    });

    trackInitiateCheckout({ value: Number(totals.total || 0), currency, items });
  }, [cartLoading, orderJustPlaced, cartItems, totals.total, settings?.currency]);

  // Redirect to cart if cart is empty (removed login requirement)
  // Keep checkout mounted when an order was just placed so the success popup can render.
  if (!cartLoading && cartItems.length === 0 && !orderJustPlaced) {
    return (
      <>
        <SEO
          title="Secure Checkout - DeshWear"
          description="Complete your purchase securely. Enter your shipping details and choose your preferred payment method for fast delivery."
          noindex={true}
        />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Please add items to your cart before checkout</p>
            <Link
              href="/cart"
              className="inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Go to Cart
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (!cartLoading && hasInvalidItems) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Size & Color Required</h2>
            <p className="text-gray-600 mb-4">
              Some items in your cart are missing size or color selection. Please go back to your cart and select the required options for these items:
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <ul className="text-left text-sm text-gray-700 space-y-1">
                {invalidItemNames.map((name, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    <span className="font-medium">{name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Link
            href="/cart"
            className="inline-block w-full bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Go to Cart to Add Size & Color
          </Link>
        </div>
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Checkout | Drip Drop"
        description="Complete your order securely at Drip Drop. Review your items and provide delivery information."
        keywords="checkout, order, payment, delivery, secure checkout"
        noindex={true}
      />

      <SweetAlert
        isOpen={showFreeDeliveryPopup}
        onClose={() => setShowFreeDeliveryPopup(false)}
        type="info"
        title="Free Delivery"
        message={freeDeliveryPopupMessage}
        confirmText="OK"
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Cart', href: '/cart' },
              { label: 'Checkout', href: '/checkout' }
            ]}
          />

          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Cart Details - First on mobile, Right on desktop */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <CartDetails
                cartItems={cartItems}
                subtotal={totals.subtotal}
                discount={totals.discount}
                discountPercent={totals.discountPercent}
                shipping={totals.shipping}
                originalShipping={totals.originalShipping}
                comboApplied={totals.comboApplied}
                freeShippingReason={totals.freeShippingReason}
                freeShippingThreshold={freeShippingThreshold}
                freeDeliveryMinPieces={FREE_DELIVERY_MIN_PIECES}
                total={totals.total}
              />
            </div>

            {/* Checkout Form - Second on mobile, Left on desktop */}
            <div className="lg:col-span-2 order-2 lg:order-1">
                <CheckoutForm
                onDeliveryAreaChange={setDeliveryArea}
                cartItems={cartItems}
                cartTotals={totals}
                onOrderSuccess={async ({ orderId, metaEventId }) => {
                  if (orderId) {
                    const params = new URLSearchParams();
                    params.set('id', String(orderId));
                    if (metaEventId) params.set('event_id', String(metaEventId));
                    await router.push(`/order-success?${params.toString()}`);
                    return;
                  }
                  setOrderJustPlaced(true);
                }}
                onSuccessAlertClose={() => setOrderJustPlaced(false)}
                onAdvanceModalChange={setIsAdvanceModalOpen}
              />
            </div>
          </div>
        </div>
      </div>
      {cartItems.length > 0 && !isAdvanceModalOpen && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-start justify-between gap-4">
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <span>Original</span>
                  <span className="font-semibold text-gray-900">৳{Number(totals.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Discount</span>
                  <span className="font-semibold text-red-500">-{Number(totals.discountPercent || 0)}% (৳{Number(totals.discount || 0).toFixed(2)})</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-semibold text-gray-900">Final Price</span>
                  <span className="font-bold text-gray-900">৳{Number(totals.total || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


