import { HiShoppingCart } from 'react-icons/hi';
import { useRouter } from 'next/router';
import { useCart } from '@/hooks/useCart';

export default function FloatingCartButton() {
    const router = useRouter();
    const { cartItemCount } = useCart();

    if (!cartItemCount || cartItemCount <= 0) return null;

    const handleClick = () => {
        router.push('/cart');
    };

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-6 right-4 sm:right-6 z-50 flex items-center gap-3 bg-black text-white px-4 py-3 rounded-full shadow-2xl hover:bg-gray-900 active:scale-95 transition-all"
            aria-label="View cart"
        >
            <div className="relative flex items-center justify-center w-7 h-7">
                <HiShoppingCart className="w-6 h-6" />
                <span className="absolute -top-2 -right-3 bg-white text-black text-[11px] font-extrabold rounded-full px-2 py-[2px] shadow-lg min-w-[24px] text-center leading-tight border border-black/10">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
            </div>
            <span className="text-sm font-semibold hidden sm:inline">View Cart</span>
        </button>
    );
}
