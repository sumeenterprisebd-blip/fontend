import React from 'react';

export default function TrustSignals() {
    return (
        <div className="flex flex-wrap gap-4 items-center justify-center py-4">
            <div className="flex flex-col items-center">
                <img
                    src="/images/payment-icons.png"
                    alt="Secure Payment"
                    className="h-8 mb-1"
                    loading="lazy"
                    decoding="async"
                />
                <span className="text-xs text-gray-600">Secure Payment</span>
            </div>
            <div className="flex flex-col items-center">
                <svg className="h-8 mb-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2l4-4" /></svg>
                <span className="text-xs text-gray-600">30-Day Returns</span>
            </div>
            <div className="flex flex-col items-center">
                <svg className="h-8 mb-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h2l.4 2M7 16h10l4-8H5.4M7 16L5.4 8M7 16l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <span className="text-xs text-gray-600">Fast Shipping</span>
            </div>
            <div className="flex flex-col items-center">
                <svg className="h-8 mb-1 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h3.28a2 2 0 011.42.59l1.71 1.7A2 2 0 0014.72 7H19a2 2 0 012 2v9a2 2 0 01-2 2z" /></svg>
                <span className="text-xs text-gray-600">Size Guide</span>
            </div>
        </div>
    );
}
