import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { createPortal } from 'react-dom';
import { HiCheckCircle } from '@react-icons/all-files/hi/HiCheckCircle';
import { HiExclamationCircle } from '@react-icons/all-files/hi/HiExclamationCircle';
import { HiInformationCircle } from '@react-icons/all-files/hi/HiInformationCircle';
import { HiXCircle } from '@react-icons/all-files/hi/HiXCircle';
import { HiX } from '@react-icons/all-files/hi/HiX';

export default function SweetAlert({
  isOpen,
  onClose,
  title = 'Order Placed Successfully!',
  message = 'Your order has been placed successfully. We will contact you soon.',
  type = 'success',
  confirmText = 'OK',
  redirectTo,
  secondaryText,
  secondaryRedirectTo
}) {
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onClose();
    if (redirectTo) {
      router.push(redirectTo);
    }
  };

  const handleSecondary = () => {
    onClose();
    if (secondaryRedirectTo) {
      router.push(secondaryRedirectTo);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const iconConfig = {
    success: { color: 'text-green-500', bg: 'bg-green-100' },
    error: { color: 'text-red-500', bg: 'bg-red-100' },
    warning: { color: 'text-yellow-500', bg: 'bg-yellow-100' },
    info: { color: 'text-blue-500', bg: 'bg-blue-100' }
  };

  const { color, bg } = iconConfig[type] || iconConfig.success;
  const Icon = (() => {
    switch (type) {
      case 'error':
        return HiXCircle;
      case 'warning':
        return HiExclamationCircle;
      case 'info':
        return HiInformationCircle;
      case 'success':
      default:
        return HiCheckCircle;
    }
  })();

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sweet-alert-title"
      aria-describedby="sweet-alert-message"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" aria-hidden="true" />

      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400"
          aria-label="Close dialog"
        >
          <HiX className="w-5 h-5" />
        </button>

        <div className="p-8 text-center">
          <div className={`mx-auto w-20 h-20 rounded-full ${bg} flex items-center justify-center mb-4 shadow-lg`}>
            <Icon className={`w-12 h-12 ${color}`} />
          </div>

          <h2 id="sweet-alert-title" className="text-2xl font-bold text-gray-900 mb-3">
            {title}
          </h2>

          <p id="sweet-alert-message" className="text-gray-600 mb-6 leading-relaxed">
            {message}
          </p>

          <div className={secondaryText ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : ''}>
            <button
              onClick={handleConfirm}
              className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-black hover:shadow-lg active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
            >
              {confirmText}
            </button>

            {secondaryText && (
              <button
                onClick={handleSecondary}
                className="w-full px-6 py-3 border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                {secondaryText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Render into document.body so it cannot be clipped/stacked under page sections
  // (e.g., transformed parents or higher-z elements like sticky summaries).
  // SweetAlert is imported with ssr: false, but keep this safe anyway.
  if (typeof document === 'undefined') return modalContent;
  return createPortal(modalContent, document.body);
}
