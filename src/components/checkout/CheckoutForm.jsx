import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import PersonalInfoSection from './PersonalInfoSection';
import DeliveryInfoSection from './DeliveryInfoSection';
import PaymentMethodSection from './PaymentMethodSection';
import AdvancePaymentModal from './AdvancePaymentModal';
import { useCheckoutForm } from '@/hooks/useCheckoutForm';
import { useAuth } from '@/contexts/AuthContext';
import { trackEvent } from '@/utils/analytics';
import { useSettings } from '@/contexts/SettingsContext';

const SweetAlert = dynamic(() => import('@/components/shared/SweetAlert'), { ssr: false });

export default function CheckoutForm({
  onDeliveryAreaChange,
  cartItems,
  cartTotals,
  onOrderSuccess,
  onSuccessAlertClose,
  onAdvanceModalChange,
}) {
  const { isAuthenticated } = useAuth();
  const isUserAuthenticated = isAuthenticated();
  const { settings } = useSettings();

  const {
    formData,
    errors,
    showSuccessAlert,
    successTitle,
    successMessage,
    placedOrderId,
    advanceOrder,
    advanceModalOpen,
    isSubmitting,
    handleInputChange,
    handleFieldBlur,
    handleSubmit,
    handleAdvancePaymentSuccess,
    setAdvanceModalOpen,
    setAdvanceOrder,
    setShowSuccessAlert,
  } = useCheckoutForm(onDeliveryAreaChange, cartItems, cartTotals, {
    onOrderSuccess,
  });

  useEffect(() => {
    if (typeof onAdvanceModalChange === 'function') {
      onAdvanceModalChange(Boolean(advanceModalOpen));
    }
  }, [advanceModalOpen, onAdvanceModalChange]);

  const computedSuccessTitle = successTitle || 'Order Confirmed!';

  const orderIdDisplay = (() => {
    if (!placedOrderId) return '';
    const raw = String(placedOrderId);
    if (/^\d+$/.test(raw)) return raw;
    const id = raw.replace(/[^0-9a-fA-F]/g, '');
    if (id.length >= 8) return id.slice(-8).toUpperCase();
    return raw;
  })();

  const computedSuccessMessage =
    successMessage ||
    (orderIdDisplay
      ? `${isUserAuthenticated
        ? 'Your order has been successfully confirmed. You can view it in your orders.'
        : 'Your order has been successfully confirmed. You can log in later to see it in your account (optional).'}\n\nOrder ID: #${orderIdDisplay}`
      : isUserAuthenticated
        ? 'Your order has been successfully confirmed. You can view it in your orders.'
        : 'Your order has been successfully confirmed. You can log in later to see it in your account (optional).');

  const successConfirmText = orderIdDisplay && isUserAuthenticated ? 'View Orders' : 'OK';
  const successRedirectTo = orderIdDisplay && isUserAuthenticated ? '/profile?tab=orders' : undefined;
  const successSecondaryText = orderIdDisplay && !isUserAuthenticated ? 'Login' : undefined;
  const successSecondaryRedirectTo = orderIdDisplay && !isUserAuthenticated ? `/login?next=${encodeURIComponent('/profile?tab=orders')}` : undefined;

  const handleBuyNowClick = () => {
    try {
      const value = Number(cartTotals?.total || 0);
      const quantity = Array.isArray(cartItems)
        ? cartItems.reduce((sum, item) => sum + Number(item?.quantity || 0), 0)
        : 0;

      trackEvent('BuyNowButtonClick', {
        category: 'ecommerce',
        value,
        currency: 'BDT',
        num_items: quantity,
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 sm:p-8 lg:p-10 shadow-lg border border-gray-100">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Checkout Information
        </h2>
        <p className="text-gray-500 text-sm">
          Please fill in your details to complete your order
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <PersonalInfoSection
          formData={formData}
          errors={errors}
          onChange={handleInputChange}
          onBlur={handleFieldBlur}
        />

        <DeliveryInfoSection
          formData={formData}
          errors={errors}
          onChange={handleInputChange}
          onBlur={handleFieldBlur}
          onDeliveryAreaChange={onDeliveryAreaChange}
        />

        <PaymentMethodSection
          value={formData.paymentMethod}
          onChange={handleInputChange}
          onBlur={handleFieldBlur}
          sslcommerzEnabled={!!settings?.payments?.sslcommerz?.enabled}
          advanceAmount={cartTotals?.total ?? cartTotals?.totalAmount ?? 0}
          formData={formData}
          errors={errors}
          paymentNumber={settings?.payments?.advanceNumber || '01995794410'}
          supportedMethods={settings?.payments?.advanceMethods || ['bkash', 'nagad', 'rocket', 'upay']}
        />

        {advanceModalOpen && advanceOrder ? (
          <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
            <div className="font-semibold">Advance payment required</div>
            <p className="mt-2">
              Your current order (#{advanceOrder.orderNumber || String(advanceOrder._id).slice(-8)}) requires a delivery-charge advance because of a prior cancelled order.
            </p>
            <p className="mt-2">
              Please complete the advance payment in the popup to confirm this order. The amount will be deducted from your final balance after verification.
            </p>
          </div>
        ) : null}

        {errors.general && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {errors.general}
          </div>
        )}

        <button
          type="submit"
          onClick={handleBuyNowClick}
          disabled={isSubmitting || cartItems.length === 0}
          className="w-full mt-8 px-8 py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Placing Order...' : 'Order Now'}
        </button>
      </form>

      <AdvancePaymentModal
        isOpen={advanceModalOpen}
        order={advanceOrder}
        paymentNumber={settings?.payments?.advanceNumber || '01995794410'}
        supportedMethods={settings?.payments?.advanceMethods || undefined}
        onClose={() => {
          setAdvanceModalOpen(false);
          setAdvanceOrder(null);
        }}
        onSuccess={handleAdvancePaymentSuccess}
      />

      {showSuccessAlert && (
        <SweetAlert
          isOpen={showSuccessAlert}
          onClose={() => {
            setShowSuccessAlert(false);
            if (typeof onSuccessAlertClose === 'function') onSuccessAlertClose();
          }}
          title={computedSuccessTitle}
          message={computedSuccessMessage}
          type="success"
          confirmText={successConfirmText}
          redirectTo={successRedirectTo}
          secondaryText={successSecondaryText}
          secondaryRedirectTo={successSecondaryRedirectTo}
        />
      )}
    </div>
  );
}
