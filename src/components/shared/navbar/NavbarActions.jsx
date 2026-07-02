import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FiSearch } from '@react-icons/all-files/fi/FiSearch';
import { FiShoppingCart } from '@react-icons/all-files/fi/FiShoppingCart';
import { FiX } from '@react-icons/all-files/fi/FiX';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { useUserWebPush } from '@/hooks/useUserWebPush';
import { useGuestWebPush } from '@/hooks/useGuestWebPush';
import UserAvatar from '@/components/shared/UserAvatar';
import { sanitizeSearchQuery } from '@/utils/searchQuery';
import NavbarNotifications from './NavbarNotifications';

const MobileSearchOverlay = dynamic(() => import('./MobileSearchOverlay'), {
  ssr: false,
});
export default function NavbarActions() {
  const router = useRouter();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { cartItemCount } = useCart(); // Reactive cart count - updates immediately
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [cartHighlight, setCartHighlight] = useState(false);
  const prevCountRef = useRef(0);
  const [guestOrders, setGuestOrders] = useState([]);

  // Enable customer Web Push subscription (order status updates)
  useUserWebPush({ enabled: Boolean(isAuthenticated() && user && !isAdmin()) });

  // Enable guest Web Push subscription (order status updates) for recently placed guest orders.
  useGuestWebPush({ enabled: Boolean(!isAuthenticated()), orders: guestOrders });

  // Load guest order refs (phone-verified) from localStorage for guest notifications.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const parseGuestOrders = () => {
      try {
        const raw = localStorage.getItem('guestOrders');
        const parsed = JSON.parse(raw || '[]');
        const list = Array.isArray(parsed) ? parsed : [];

        const normalized = list
          .map((x) => ({
            orderId: x?.orderId ? String(x.orderId) : '',
            phone: x?.phone ? String(x.phone) : '',
          }))
          .filter((x) => x.orderId && x.phone)
          .slice(0, 5);

        setGuestOrders(normalized);
      } catch {
        setGuestOrders([]);
      }
    };

    parseGuestOrders();

    const onUpdated = () => parseGuestOrders();
    window.addEventListener('guestOrdersUpdated', onUpdated);
    window.addEventListener('storage', onUpdated);
    return () => {
      window.removeEventListener('guestOrdersUpdated', onUpdated);
      window.removeEventListener('storage', onUpdated);
    };
  }, []);

  // Trigger highlight animation when cart count changes
  useEffect(() => {
    const prevCount = prevCountRef.current;

    if (cartItemCount > prevCount && cartItemCount > 0) {
      setCartHighlight(true);
      const timer = setTimeout(() => setCartHighlight(false), 500);
      prevCountRef.current = cartItemCount;
      return () => clearTimeout(timer);
    }

    prevCountRef.current = cartItemCount;
  }, [cartItemCount]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = sanitizeSearchQuery(searchValue);
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}&page=1`);
      setSearchValue('');
      setIsSearchOpen(false);
    }
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchValue('');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div className="flex items-center space-x-1.5 sm:space-x-3 lg:space-x-5 shrink-0">
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="lg:hidden h-11 w-11 inline-flex items-center justify-center rounded-xl text-gray-700 hover:text-black hover:bg-gray-100 active:scale-95 transition-all duration-200 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
          aria-label="Search"
          aria-expanded={isSearchOpen}
          type="button"
        >
          {isSearchOpen ? (
            <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <FiSearch className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </button>

        <Link
          href="/cart"
          prefetch={false}
          className="relative h-11 w-11 inline-flex items-center justify-center rounded-xl text-gray-700 hover:text-black hover:bg-gray-100 transition-all duration-200 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 group"
          aria-label="Shopping cart"
        >
          <FiShoppingCart
            className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform ${cartHighlight ? 'animate-cart-highlight' : 'group-hover:scale-110'
              }`}
          />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
              {cartItemCount > 99 ? '99+' : cartItemCount}
            </span>
          )}
        </Link>

        {(() => {
          const showForUser = Boolean(isAuthenticated() && user && !isAdmin());
          if (!showForUser) return null;

          return (
            <NavbarNotifications
              mode="user"
              guestOrders={[]}
            />
          );
        })()}

        {(() => {
          const showForGuest = Boolean(!isAuthenticated() && guestOrders.length > 0);
          if (!showForGuest) return null;

          return (
            <NavbarNotifications
              mode="guest"
              guestOrders={guestOrders}
            />
          );
        })()}

        {isAuthenticated() && user ? (
          <>
            {isAdmin() && (
              <Link
                href="/admin"
                prefetch={false}
                className="h-11 w-11 inline-flex items-center justify-center rounded-xl text-gray-700 hover:text-black hover:bg-gray-100 transition-all duration-200 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                aria-label="Admin panel"
                title="Admin Panel"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
            )}
            <Link
              href={isAdmin() ? "/admin" : "/profile"}
              prefetch={false}
              className="h-11 w-11 inline-flex items-center justify-center rounded-xl text-gray-700 hover:text-black hover:bg-gray-100 transition-all duration-200 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
              aria-label={isAdmin() ? "Admin Dashboard" : "User profile"}
              title={isAdmin() ? "Go to Admin Dashboard" : `${user?.firstName || 'User'}'s profile`}
            >
              <UserAvatar
                avatar={user?.avatar}
                firstName={user?.firstName || 'User'}
                size="sm"
                showRing={true}
              />
            </Link>
            <button
              onClick={handleLogout}
              className="hidden sm:block px-4 py-2 text-sm font-semibold text-[#0a1a44] bg-[#0a1a44]/10 hover:bg-[#0a1a44]/15 rounded-full transition-all duration-200"
              aria-label="Logout"
              type="button"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            prefetch={false}
            className="hidden sm:block px-4 py-2 text-sm font-semibold text-[#0a1a44] bg-[#0a1a44]/10 hover:bg-[#0a1a44]/15 rounded-full transition-all duration-200"
          >
            Login
          </Link>
        )}
      </div>

      {isSearchOpen && (
        <MobileSearchOverlay
          isOpen={isSearchOpen}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearchSubmit={handleSearchSubmit}
          onClose={handleCloseSearch}
        />
      )}
    </>
  );
}
