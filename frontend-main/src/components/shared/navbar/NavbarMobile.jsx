import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { FiMenu } from '@react-icons/all-files/fi/FiMenu';
import { FiX } from '@react-icons/all-files/fi/FiX';
import { useAuth } from '@/contexts/AuthContext';

const MobileMenuDrawer = dynamic(() => import('./MobileMenuDrawer'), { ssr: false });

export default function NavbarMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const buttonRef = useRef(null);
  const router = useRouter();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleRouteChange = () => setIsOpen(false);
    router.events.on('routeChangeStart', handleRouteChange);
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      document.body.style.overflow = 'unset';
    };
  }, [router, isOpen]);

  useEffect(() => {
    if (isOpen) setHasOpened(true);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setIsOpen(false);
  }, [logout]);

  useEffect(() => {
    if (!isOpen && hasOpened) {
      // Return focus to the menu button after closing the drawer.
      buttonRef.current?.focus();
    }
  }, [isOpen, hasOpened]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="h-11 w-11 inline-flex items-center justify-center rounded-xl text-gray-700 hover:text-black hover:bg-gray-100 active:scale-95 transition-all duration-200 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu-drawer"
        aria-haspopup="dialog"
      >
        {isOpen ? <FiX className="w-7 h-7" /> : <FiMenu className="w-7 h-7" />}
      </button>

      {mounted && hasOpened && (
        <MobileMenuDrawer
          isOpen={isOpen}
          pathname={router.pathname}
          user={user}
          isAuthenticated={isAuthenticated()}
          isAdmin={isAdmin()}
          onClose={handleClose}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
