'use client';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { FaWhatsapp } from '@react-icons/all-files/fa/FaWhatsapp';
import { FaFacebookMessenger } from '@react-icons/all-files/fa/FaFacebookMessenger';
import { useAuth } from '@/contexts/AuthContext';

export default function FloatingSocialButtons() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();

    const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+8801835847678';
    const whatsappDigits = String(rawNumber || '').replace(/[^\d]/g, '');

    const messengerUrl = process.env.NEXT_PUBLIC_MESSENGER_URL || 'https://m.me/deshwear10';

    const context = useMemo(() => {
        if (typeof window === 'undefined') {
            return { lastOrderId: '', guestOrderId: '', guestPhone: '', currentUrl: '' };
        }

        const currentUrl = `${window.location.origin}${router.asPath || ''}`;

        const lastOrderId = (() => {
            try {
                const raw = localStorage.getItem('lastPlacedOrderId');
                return raw ? String(raw) : '';
            } catch {
                return '';
            }
        })();

        const guest = (() => {
            try {
                const raw = localStorage.getItem('guestOrders');
                const parsed = JSON.parse(raw || '[]');
                const list = Array.isArray(parsed) ? parsed : [];
                const first = list[0] || null;
                return {
                    orderId: first?.orderId ? String(first.orderId) : '',
                    phone: first?.phone ? String(first.phone) : '',
                };
            } catch {
                return { orderId: '', phone: '' };
            }
        })();

        return {
            lastOrderId,
            guestOrderId: guest.orderId,
            guestPhone: guest.phone,
            currentUrl,
        };
    }, [router.asPath]);

    const buildSupportMessage = () => {
        const name = String(user?.firstName || user?.name || '').trim();
        const phone = String(user?.phone || '').trim();

        if (isAuthenticated()) {
            const lines = [
                'Hello, I need help.',
                name ? `Name: ${name}` : null,
                phone ? `Phone: ${phone}` : null,
                context.lastOrderId ? `Last order: ${context.lastOrderId}` : null,
                context.currentUrl ? `Page: ${context.currentUrl}` : null,
            ].filter(Boolean);
            return lines.join('\n');
        }

        const lines = [
            'Hello, I need help.',
            context.guestOrderId ? `Order: ${context.guestOrderId}` : null,
            context.guestPhone ? `Phone: ${context.guestPhone}` : null,
            context.currentUrl ? `Page: ${context.currentUrl}` : null,
        ].filter(Boolean);

        return lines.join('\n');
    };

    const handleWhatsAppClick = () => {
        const message = encodeURIComponent(buildSupportMessage());
        const url = `https://wa.me/${encodeURIComponent(whatsappDigits)}?text=${message}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleMessengerClick = () => {
        const ref = encodeURIComponent(buildSupportMessage());
        const base = String(messengerUrl || '').trim();
        const url = base.includes('?') ? `${base}&ref=${ref}` : `${base}?ref=${ref}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-3">
            <button
                onClick={handleMessengerClick}
                className="relative flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 bg-blue-600 hover:bg-blue-700"
                aria-label="Chat on Messenger"
                type="button"
            >
                <FaFacebookMessenger className="w-7 h-7 text-white" />
            </button>

            <button
                onClick={handleWhatsAppClick}
                className="relative flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 bg-green-600 hover:bg-green-700"
                aria-label="Chat on WhatsApp"
                type="button"
            >
                <FaWhatsapp className="w-7 h-7 text-white" />
            </button>
        </div>
    );
}
