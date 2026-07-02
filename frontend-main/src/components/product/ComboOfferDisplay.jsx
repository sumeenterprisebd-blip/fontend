'use client';

import { useState, useEffect } from 'react';
import { HiSparkles } from 'react-icons/hi';

export default function ComboOfferDisplay({ product }) {
    const [lowestOffer, setLowestOffer] = useState(null);

    useEffect(() => {
        if (!product) return;

        // Calculate the lowest offer available on this product
        let minDiscount = product.discount || 0;
        let offerType = 'Standard Discount';
        let offerMessage = '';

        // Check if product has original price with discount
        if (product.originalPrice && product.originalPrice > product.price) {
            const priceDiscount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            if (priceDiscount > minDiscount) {
                minDiscount = priceDiscount;
                offerType = 'Special Price Discount';
            }
        }

        // Check if combo offer exists
        if (product.comboOffer?.maxDiscount) {
            if (product.comboOffer.maxDiscount < minDiscount) {
                minDiscount = product.comboOffer.maxDiscount;
                offerType = 'Combo Offer';
                offerMessage = product.comboOffer.description || 'Bundle with other items for extra savings';
            }
        }

        if (minDiscount > 0) {
            setLowestOffer({
                discount: minDiscount,
                type: offerType,
                message: offerMessage,
                originalPrice: product.originalPrice,
                currentPrice: product.price
            });
        }
    }, [product]);

    if (!lowestOffer) return null;

    return (
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-400 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                    <HiSparkles className="text-purple-600 w-6 h-6 mt-1" />
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-bold text-purple-900 mb-1">
                        🎁 Best Offer on This Product
                    </h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-2xl font-black text-red-600">
                                -{lowestOffer.discount}%
                            </span>
                            <span className="text-xs font-semibold text-purple-700 bg-white px-2 py-1 rounded">
                                {lowestOffer.type}
                            </span>
                        </div>
                        {lowestOffer.originalPrice && (
                            <div className="text-sm text-gray-700">
                                <span className="line-through">৳{lowestOffer.originalPrice.toFixed(2)}</span>
                                <span className="ml-2 font-bold text-red-600">
                                    ৳{lowestOffer.currentPrice.toFixed(2)}
                                </span>
                            </div>
                        )}
                        {lowestOffer.message && (
                            <p className="text-xs text-purple-800 italic">
                                {lowestOffer.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
