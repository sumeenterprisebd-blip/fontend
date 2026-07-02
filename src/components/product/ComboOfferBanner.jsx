import ComboOfferStatus from './ComboOfferStatus';
import useComboOfferLogic from './useComboOfferLogic';
import { useMemo } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

const normalizeFreeShippingThreshold = (settings) => {
    const raw = Number(settings?.freeShippingThreshold || 0);
    if (!Number.isFinite(raw)) return 999;
    return Math.max(999, raw);
};

export default function ComboOfferBanner({ productId, quantity, onComboUpdate }) {
    const { comboStatus } = useComboOfferLogic(productId, quantity, onComboUpdate);
    const { settings: globalSettings } = useSettings();

    const freeShippingThreshold = useMemo(
        () => normalizeFreeShippingThreshold(globalSettings),
        [globalSettings]
    );
    const currencySymbol = globalSettings?.currencySymbol || '৳';
    const thresholdLabel = useMemo(() => {
        const formatted = Number(freeShippingThreshold).toLocaleString('en-US');
        return `${currencySymbol}${formatted}+`;
    }, [currencySymbol, freeShippingThreshold]);

    if (!productId || typeof productId !== 'string' || productId.trim() === '' || !comboStatus) {
        return null;
    }

    const { comboApplied, settings, current, quantityQualifies, likesQualify } = comboStatus;

    // If there is no combo offer configured for this product, don't render a banner.
    const minQty = settings?.minQuantity;
    if (!minQty) {
        return null;
    }

    const remaining = Math.max(Number(minQty) - Number(current?.quantity || 0), 0);
    const remainingLabel = remaining === 1 ? '1 more item' : `${remaining} more items`;

    const thresholdAmountLabel = `${currencySymbol}${Number(freeShippingThreshold).toLocaleString('en-US')}`;

    return (
        <div className="mb-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-3 ring-1 ring-yellow-200/60 sm:bg-white sm:p-5">
            {/* Mobile: short, clean summary (3 lines total) */}
            <div className="sm:hidden">
                <div className="text-base leading-snug text-gray-900">
                    Free delivery on shopping of{' '}
                    <span className="font-extrabold">{thresholdAmountLabel}</span> or more.
                </div>
            </div>

            {/* sm+: keep the existing detailed banner */}
            <div className="hidden sm:block">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="text-[11px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Combo Offer
                        </div>
                        <h3 className="mt-1 text-base sm:text-lg font-bold text-gray-900">
                            Unlock free delivery with this offer
                        </h3>
                        <p className="mt-1 text-xs sm:text-sm text-gray-700">
                            Meet the combo requirements below to become eligible. You can also get free delivery on orders of {thresholdLabel}.
                        </p>
                    </div>

                    <div className="shrink-0">
                        {comboApplied ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                                Eligible
                            </span>
                        ) : (
                            <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-900">
                                {remaining > 0 ? `Add ${remaining}` : 'Check'}
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                        <div className="text-xs font-semibold text-gray-900">Free Delivery on {thresholdLabel}</div>
                        <div className="mt-0.5 text-xs sm:text-sm text-gray-700">
                            {thresholdLabel.replace('+', '')} বা তার বেশি শপিং হলে ডেলিভারি চার্জ অটোমেটিক ফ্রি হবে।
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                        <div className="text-xs font-semibold text-gray-900">Combo status</div>
                        <div className="mt-0.5 text-xs sm:text-sm text-gray-700">
                            {comboApplied
                                ? 'You are eligible for the combo offer.'
                                : remaining > 0
                                    ? `Add ${remainingLabel} to reach the minimum quantity.`
                                    : 'Check the requirements below to see what’s needed.'}
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <ComboOfferStatus
                        settings={settings}
                        current={current}
                        quantityQualifies={quantityQualifies}
                        likesQualify={likesQualify}
                    />
                </div>
            </div>
        </div>
    );
}