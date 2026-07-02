import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ordersAPI, advanceAPI } from "@/services/api";
import { useCart } from "@/hooks/useCart";
import { validatePhone, normalizePhone } from "@/utils/validation";
import { useSettings } from "@/contexts/SettingsContext";

const initialFormData = {
  firstName: "",
  email: "",
  phone: "",
  streetAddress: "",
  townCity: "",
  state: "",
  zipCode: "",
  country: "Bangladesh",
  paymentMethod: "cash",
  advanceBankMethod: "bkash",
  advanceSenderNumber: "",
  advancePaidAmount: "",
  advanceTransactionId: "",
};

export function useCheckoutForm(
  onDeliveryAreaChange,
  cartItems = [],
  cartTotals = {},
  options = {}
) {
  const { user, isAuthenticated } = useAuth();
  const { clearCart } = useCart();
  const { settings } = useSettings();
  const [errors, setErrors] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successTitle, setSuccessTitle] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [placedOrderId, setPlacedOrderId] = useState(null);
  const [advanceOrder, setAdvanceOrder] = useState(null);
  const [advanceModalOpen, setAdvanceModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  // Pre-fill form with user data when available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        email: user.email || "",
        phone: user.phone || "",
        streetAddress: user.addresses?.[0]?.streetAddress || "",
        townCity: user.addresses?.[0]?.townCity || "",
        state: user.addresses?.[0]?.state || "",
        zipCode: user.addresses?.[0]?.zipCode || "",
        country: user.addresses?.[0]?.country || "Bangladesh",
        paymentMethod: "cash",
      });
    }
  }, [user]);

  const validateEmailOptional = (email) => {
    const value = String(email || '').trim();
    if (!value) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'paymentMethod' && value === 'advance') {
        const totalAmount = Number(cartTotals?.total ?? cartTotals?.totalAmount ?? 0);
        if (!next.advancePaidAmount && totalAmount > 0) {
          next.advancePaidAmount = String(totalAmount);
        }
      }
      return next;
    });

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (name === "townCity" && onDeliveryAreaChange) {
      onDeliveryAreaChange(value);
    }
  };

  const handleFieldBlur = (e) => {
    const { name, value } = e?.target || {};
    if (!name) return;
    let fieldError = '';

    if (name === 'firstName') {
      if (!String(value || '').trim()) fieldError = 'First name is required';
    }

    if (name === 'email') {
      fieldError = validateEmailOptional(value);
    }

    if (name === 'phone') {
      fieldError = validatePhone(value);
    }

    if (name === 'streetAddress') {
      if (!String(value || '').trim()) fieldError = 'Street address is required';
    }

    if (name === 'townCity') {
      if (!String(value || '').trim()) fieldError = 'Delivery area is required';
    }

    if (name === 'advanceSenderNumber' && formData.paymentMethod === 'advance') {
      const normalized = normalizePhone(value);
      const phoneError = validatePhone(normalized);
      if (phoneError) {
        fieldError = 'Enter a valid Bangladesh sender mobile number';
      }
    }

    if (name === 'advancePaidAmount' && formData.paymentMethod === 'advance') {
      const paidAmount = Number(value);
      const requiredTotal = Number(cartTotals?.total ?? cartTotals?.totalAmount ?? 0);
      if (!Number.isFinite(paidAmount) || paidAmount <= 0) {
        fieldError = 'Paid amount must be greater than zero';
      } else if (paidAmount < requiredTotal) {
        fieldError = 'You have paid less than the total amount';
      } else if (paidAmount > requiredTotal) {
        fieldError = 'Paid amount cannot exceed total amount';
      }
    }

    if (name === 'advanceTransactionId' && formData.paymentMethod === 'advance') {
      const valueText = String(value || '').trim();
      if (valueText.length > 0 && valueText.length < 3) {
        fieldError = 'Transaction ID is too short';
      }
    }

    setErrors((prev) => {
      const next = { ...prev };
      if (fieldError) {
        next[name] = fieldError;
      } else if (next[name]) {
        delete next[name];
      }
      return next;
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";

    const emailError = validateEmailOptional(formData.email);
    if (emailError) newErrors.email = emailError;

    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;
    if (!formData.streetAddress.trim())
      newErrors.streetAddress = "Street address is required";
    if (!formData.townCity) newErrors.townCity = "Delivery area is required";

    if (String(formData.paymentMethod).toLowerCase() === 'advance') {
      const requiredTotal = Number(cartTotals?.total ?? cartTotals?.totalAmount ?? 0);
      if (!String(formData.advanceBankMethod || '').trim()) {
        newErrors.advanceBankMethod = 'Select a mobile banking method';
      }
      const advanceSender = normalizePhone(formData.advanceSenderNumber);
      const senderError = validatePhone(advanceSender);
      if (senderError) {
        newErrors.advanceSenderNumber = 'Enter a valid Bangladesh sender mobile number';
      }
      const paidAmount = Number(formData.advancePaidAmount);
      if (!Number.isFinite(paidAmount) || paidAmount <= 0) {
        newErrors.advancePaidAmount = 'Paid amount must be greater than zero';
      } else if (paidAmount < requiredTotal) {
        newErrors.advancePaidAmount = 'You have paid less than the total amount';
      } else if (paidAmount > requiredTotal) {
        newErrors.advancePaidAmount = 'Paid amount cannot exceed total amount';
      }
      const transactionId = String(formData.advanceTransactionId || '').trim();
      if (transactionId.length > 0 && transactionId.length < 3) {
        newErrors.advanceTransactionId = 'Transaction ID is too short';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        const firstError = Object.keys(newErrors)[0];
        const element = document.getElementById(
          firstError === "townCity" ? "deliveryArea" : firstError
        );
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
        element?.focus();
      }, 100);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (cartItems.length === 0) {
      setErrors({
        general: "Your cart is empty. Please add items to your cart.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Build shipping address
      const shippingAddress = {
        firstName: formData.firstName,
        email: formData.email,
        phone: normalizePhone(formData.phone),
        streetAddress: formData.streetAddress,
        townCity: formData.townCity,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country || "Bangladesh",
      };

      // Determine delivery fee based on the checkout totals (includes free-delivery rules)

      const metaEventId = (() => {
        try {
          if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
          }
        } catch {
          // ignore
        }
        return `evt_${Date.now()}_${Math.random().toString(16).slice(2)}`;
      })();

      let deliveryFee = Number(cartTotals?.shipping ?? cartTotals?.deliveryFee ?? 0);
      if (cartTotals?.comboApplied) {
        deliveryFee = 0;
      } else if (!Number.isFinite(deliveryFee) || deliveryFee <= 0) {
        deliveryFee = 15;
        if (formData.townCity === "Inside Dhaka") {
          deliveryFee = 70;
        } else if (formData.townCity === "Outside Dhaka") {
          deliveryFee = 120;
        }
      }

      // For guest users, prepare order items from cart
      let orderData = {
        shippingAddress,
        paymentMethod: String(formData.paymentMethod || "cash"),
        // Product-level savings are already reflected in item/product `price` vs `originalPrice`.
        // Keep this as 0 unless/until you add a true cart-level/coupon discount.
        discountPercent: 0,
        metaEventId,
        deliveryFee,
      };

      if (String(formData.paymentMethod).toLowerCase() === 'advance') {
        const fullPaymentMethod = String(formData.advanceBankMethod || "bkash").toLowerCase();
        const paidAmount = Number(formData.advancePaidAmount || 0);
        orderData.advancePayment = {
          paymentMethod: fullPaymentMethod,
          senderNumber: normalizePhone(formData.advanceSenderNumber),
          transactionId: String(formData.advanceTransactionId || '').trim(),
          last4: String(formData.advanceTransactionId || '').trim().slice(-4),
          amount: paidAmount,
          paidAt: new Date(),
          status: 'Paid',
        };
        orderData.advancePaid = paidAmount;
      }

      // Always include cart items in the request for safety
      // Backend will use database cart for authenticated users if available,
      // otherwise will fall back to these orderItems
      orderData.orderItems = cartItems.map((item) => ({
        product: item.productId,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.price,
      }));

      // Attach Pixel cookies (fbp/fbc) if available so backend CAPI can use them
      try {
        const getCookie = (name) => {
          if (typeof document === 'undefined' || !document.cookie) return '';
          const m = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]*)'));
          return m ? decodeURIComponent(m[2]) : '';
        };
        const _fbp = getCookie('_fbp') || '';
        const _fbc = getCookie('_fbc') || '';
        if (_fbp) orderData.fbp = _fbp;
        if (_fbc) orderData.fbc = _fbc;
      } catch (e) {
        // ignore cookie failures
      }



      const response = await ordersAPI.createOrder(orderData);

      if (response.data.success) {
        const guest = !isAuthenticated();
        const order = response.data?.order;
        const newOrderId = order?.orderNumber || order?._id || response.data?.orderId || null;
        
        console.log('[CHECKOUT_ORDER_RESPONSE]', {
          timestamp: new Date().toISOString(),
          hasOrder: Boolean(order),
          orderNumber: order?.orderNumber,
          orderId: order?._id,
          fallbackId: response.data?.orderId,
          finalOrderId: newOrderId,
          isGuest: guest,
        });

        setPlacedOrderId(newOrderId);
        setSuccessTitle("Order Confirmed!");
        setSuccessMessage(
          `${isAuthenticated()
            ? "Your order has been successfully confirmed. You can view it in your orders."
            : "Your order has been successfully confirmed. You can log in later to see it in your account (optional)."}

Order ID: #${newOrderId}`
        );

        // Persist last placed order reference (best-effort) for support chat prefill
        try {
          if (typeof window !== "undefined" && newOrderId) {
            localStorage.setItem("lastPlacedOrderId", String(newOrderId));
          }
        } catch {
          // ignore
        }

        if (response.data?.payment?.redirectUrl) {
          try {
            await clearCart();
          } catch {
            // ignore
          }

          try {
            if (typeof window !== "undefined") {
              window.location.assign(String(response.data.payment.redirectUrl));
              return;
            }
          } catch {
            // ignore
          }
        }

        const isAdvanceRequired = Boolean(order?.advancePaymentRequired);
        if (isAdvanceRequired) {
          setAdvanceOrder(order);
          setAdvanceModalOpen(true);
          return;
        }

        if (typeof options?.onOrderSuccess === "function") {
          await options.onOrderSuccess({
            isGuest: guest,
            orderId: newOrderId,
            metaEventId,
          });
          await clearCart();
          return;
        }

        try {
          const transactionId = order?.orderNumber || order?._id || response.data?.orderId || null;
          const currency = settings?.currency || "BDT";
          const value = Number(cartTotals?.total ?? 0);
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
          trackPurchase({ transactionId, value, currency, items, eventId: metaEventId });
        } catch {
          // Ignore analytics failures
        }

        setShowSuccessAlert(true);

        try {
          if (guest && typeof window !== "undefined") {
            const orderRef = {
              orderId: newOrderId ? String(newOrderId) : "",
              phone: shippingAddress.phone ? String(shippingAddress.phone) : "",
            };

            if (orderRef.orderId && orderRef.phone) {
              const raw = localStorage.getItem("guestOrders");
              const prev = (() => {
                try {
                  const parsed = JSON.parse(raw || "[]");
                  return Array.isArray(parsed) ? parsed : [];
                } catch {
                  return [];
                }
              })();

              const next = [orderRef, ...prev]
                .filter((x) => x && x.orderId && x.phone)
                .filter((x, idx, arr) => arr.findIndex((y) => y.orderId === x.orderId && y.phone === x.phone) === idx)
                .slice(0, 5);

              localStorage.setItem("guestOrders", JSON.stringify(next));

              try {
                window.dispatchEvent(new Event('guestOrdersUpdated'));
              } catch {
                // ignore
              }
            }
          }
        } catch {
          // ignore
        }

        if (typeof options?.onOrderSuccess === "function") {
          options.onOrderSuccess({
            isGuest: guest,
            orderId: newOrderId,
          });
        }

        await clearCart();
      }
    } catch (error) {

      // Guest checkout is supported; treat 401 as a standard error.

      // Extract meaningful error message
      let errorMessage = "Failed to create order. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (
        error.response?.data?.errors &&
        Array.isArray(error.response.data.errors)
      ) {
        errorMessage = error.response.data.errors.map((e) => e.msg).join(", ");
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors({
        general: errorMessage,
      });

      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdvancePaymentSuccess = async (returnedAdvance) => {
    setAdvanceOrder(null);
    setAdvanceModalOpen(false);
    setSuccessTitle("Advance Payment Submitted");
    setSuccessMessage(
      "Your advance delivery payment request has been submitted. Please wait for admin approval before placing your order again."
    );
    setShowSuccessAlert(true);
  };

  return {
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
    setSuccessTitle,
    setSuccessMessage,
  };
}

