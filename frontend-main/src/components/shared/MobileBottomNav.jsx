import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiHome } from '@react-icons/all-files/fi/FiHome';
import { FiShoppingBag } from '@react-icons/all-files/fi/FiShoppingBag';
import { FiShoppingCart } from '@react-icons/all-files/fi/FiShoppingCart';
import { FiUser } from '@react-icons/all-files/fi/FiUser';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';

export default function MobileBottomNav() {
    const router = useRouter();
    const { cartItemCount } = useCart();
    const { isAuthenticated, isAdmin } = useAuth();

    const accountHref = isAuthenticated()
        ? isAdmin() ? '/admin' : '/profile'
        : '/login';

    const tabs = [
        { href: '/', label: 'Home', icon: FiHome },
        { href: '/shop', label: 'Shop', icon: FiShoppingBag },
        { href: '/cart', label: 'Cart', icon: FiShoppingCart },
        { href: accountHref, label: 'Account', icon: FiUser },
    ];

    const isActive = (href) => {
        if (href === '/') return router.pathname === '/';
        return router.pathname === href || router.pathname.startsWith(`${href}/`);
    };

    return (
        <>
            {/* Spacer to prevent content being hidden behind the fixed bar on mobile */}
            <div className="lg:hidden h-16" aria-hidden />

            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
                <ul className="flex items-stretch justify-around text-sm font-medium text-gray-600">
                    {tabs.map(({ href, label, icon: IconComponent }) => {
                        const active = isActive(href);
                        return (
                            <li key={href} className="flex-1">
                                <Link
                                    href={href}
                                    className={`flex flex-col items-center justify-center gap-1 py-3 transition-colors duration-150 ${active ? 'text-black' : 'text-gray-500 hover:text-black'}`}
                                    aria-label={label}
                                >
                                    <div className="relative">
                                        <IconComponent className="w-6 h-6" />
                                        {href === '/cart' && cartItemCount > 0 && (
                                            <span className="absolute -top-2 -right-3 min-w-[1.5rem] h-6 px-1 rounded-full bg-black text-white text-[10px] font-semibold flex items-center justify-center shadow-sm">
                                                {cartItemCount > 99 ? '99+' : cartItemCount}
                                            </span>
                                        )}
                                    </div>
                                    <span>{label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </>
    );
}
