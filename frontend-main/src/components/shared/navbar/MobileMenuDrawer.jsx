import { createPortal } from 'react-dom';
import { useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { FiHome } from '@react-icons/all-files/fi/FiHome';
import { FiLogOut } from '@react-icons/all-files/fi/FiLogOut';
import { FiMail } from '@react-icons/all-files/fi/FiMail';
import { FiMapPin } from '@react-icons/all-files/fi/FiMapPin';
import { FiPackage } from '@react-icons/all-files/fi/FiPackage';
import { FiSettings } from '@react-icons/all-files/fi/FiSettings';
import { FiShoppingBag } from '@react-icons/all-files/fi/FiShoppingBag';
import { FiUser } from '@react-icons/all-files/fi/FiUser';
import { FiX } from '@react-icons/all-files/fi/FiX';
import { navLinks } from '../../data/navbarData';
import UserProfile from './UserProfile';

export default function MobileMenuDrawer({
    isOpen,
    pathname,
    user,
    isAuthenticated,
    isAdmin,
    onClose,
    onLogout,
}) {
    const closeButtonRef = useRef(null);
    const panelRef = useRef(null);

    const focusableSelector = useMemo(
        () =>
            [
                'a[href]',
                'button:not([disabled])',
                'input:not([disabled])',
                'select:not([disabled])',
                'textarea:not([disabled])',
                '[tabindex]:not([tabindex="-1"])',
            ].join(','),
        []
    );

    useEffect(() => {
        if (!isOpen) return;

        const previouslyFocused = document.activeElement;
        const focusClose = () => closeButtonRef.current?.focus();

        // Focus the close button for immediate keyboard accessibility.
        const raf = window.requestAnimationFrame(focusClose);

        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
                return;
            }

            if (e.key !== 'Tab') return;

            const panelEl = panelRef.current;
            if (!panelEl) return;

            const focusables = Array.from(panelEl.querySelectorAll(focusableSelector)).filter(
                (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
            );

            if (focusables.length === 0) {
                e.preventDefault();
                return;
            }

            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement;

            if (e.shiftKey) {
                if (active === first || !panelEl.contains(active)) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (active === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener('keydown', onKeyDown);

        return () => {
            window.cancelAnimationFrame(raf);
            document.removeEventListener('keydown', onKeyDown);
            // Restore focus to whatever was focused before opening.
            if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
                previouslyFocused.focus();
            }
        };
    }, [isOpen, onClose, focusableSelector]);

    const NavLink = ({ href, icon: IconComponent, label, isActive }) => (
        <Link
            href={href}
            prefetch={false}
            onClick={onClose}
            className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-semibold transition-colors duration-200 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 ${isActive
                ? 'bg-[#0a1a44] text-white'
                : 'text-gray-800 hover:bg-gray-50 active:bg-gray-100'
                }`}
            aria-current={isActive ? 'page' : undefined}
        >
            <span className={`h-10 w-10 rounded-xl inline-flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-white/10' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                <IconComponent className="w-5 h-5" />
            </span>
            <span className="flex-1 min-w-0 truncate">{label}</span>
            <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-white' : 'bg-transparent'}`} aria-hidden="true" />
        </Link>
    );

    return createPortal(
        <>
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[998] transition-opacity duration-300 ease-out motion-reduce:transition-none ${isOpen ? 'opacity-100' : 'opacity-0 invisible pointer-events-none'
                    }`}
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                id="mobile-menu-drawer"
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                className={`fixed top-0 right-0 bottom-0 w-[85vw] max-w-[360px] bg-white shadow-2xl z-[999] transform transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full overflow-hidden">
                    <div className="bg-white p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                            <button
                                ref={closeButtonRef}
                                onClick={onClose}
                                className="h-11 w-11 inline-flex items-center justify-center rounded-xl text-gray-700 hover:text-black hover:bg-gray-100 active:scale-95 transition-all duration-200 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                                aria-label="Close menu"
                                type="button"
                            >
                                <FiX className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="mt-3">
                            <UserProfile
                                user={user}
                                isAuthenticated={isAuthenticated}
                                isAdmin={isAdmin}
                                onClose={onClose}
                            />
                        </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto overscroll-contain py-5 px-4">
                        <div className="space-y-2">
                            <div className="mb-4">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                                    Navigation
                                </p>

                                <NavLink href="/" icon={FiHome} label="Home" isActive={pathname === '/'} />
                                {navLinks.map((link) => {
                                    let icon = FiShoppingBag;
                                    if (link.href === '/shop') icon = FiShoppingBag;
                                    else if (link.href === '/new-arrivals') icon = FiPackage;
                                    else if (link.href === '/orders/track') icon = FiMapPin;
                                    else if (link.href === '/contact') icon = FiMail;

                                    return (
                                        <NavLink
                                            key={link.href}
                                            href={link.href}
                                            icon={icon}
                                            label={link.label}
                                            isActive={
                                                pathname === link.href ||
                                                (link.href !== '/' && pathname.startsWith(link.href))
                                            }
                                        />
                                    );
                                })}
                            </div>

                            {isAuthenticated && (
                                <div className="mt-6">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                                        Account
                                    </p>
                                    <NavLink
                                        href={isAdmin ? '/admin' : '/profile'}
                                        icon={FiUser}
                                        label={isAdmin ? 'Admin Dashboard' : 'My Profile'}
                                        isActive={pathname === '/profile' || (isAdmin && pathname.startsWith('/admin'))}
                                    />
                                    {isAdmin && (
                                        <NavLink
                                            href="/admin"
                                            icon={FiSettings}
                                            label="Admin Panel"
                                            isActive={pathname.startsWith('/admin')}
                                        />
                                    )}
                                    <button
                                        onClick={onLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-semibold text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors duration-200 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 mt-2"
                                        type="button"
                                    >
                                        <span className="h-10 w-10 rounded-xl inline-flex items-center justify-center bg-red-50 flex-shrink-0">
                                            <FiLogOut className="w-5 h-5" />
                                        </span>
                                        <span className="flex-1 min-w-0 text-left">Sign Out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </nav>

                    <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                        <p className="text-xs text-gray-500 text-center leading-relaxed">
                            © 2026 <span className="font-bold">DeshWear</span>
                            <br />All rights reserved
                        </p>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}
