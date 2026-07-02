import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import {
    FiBarChart2,
    FiBell,
    FiChevronDown,
    FiChevronLeft,
    FiChevronRight,
    FiClock,
    FiCreditCard,
    FiExternalLink,
    FiHome,
    FiLayers,
    FiLogOut,
    FiMail,
    FiMonitor,
    FiPackage,
    FiShield,
    FiShoppingCart,
    FiSettings,
    FiStar,
    FiUsers,
    FiX,
    FiDollarSign,
} from 'react-icons/fi';

const menuGroups = [
    {
        title: 'Main',
        icon: FiHome,
        items: [
            { icon: FiHome, label: 'Dashboard', href: '/admin' },
            { icon: FiMonitor, label: 'Hero Section', href: '/admin/hero' },
            { icon: FiBell, label: 'Popups', href: '/admin/popups' },
        ],
    },
    {
        title: 'Commerce',
        icon: FiShoppingCart,
        items: [
            { icon: FiPackage, label: 'Products', href: '/admin/products' },
            { icon: FiShoppingCart, label: 'Orders', href: '/admin/orders' },
            { icon: FiBell, label: 'Notifications', href: '/admin/notifications', badgeKey: 'notifications' },
            { icon: FiDollarSign, label: 'Advance Payments', href: '/admin/advance-payments' },
            { icon: FiShield, label: 'Blacklist', href: '/admin/blacklist' },
        ],
    },
    {
        title: 'Community',
        icon: FiUsers,
        items: [
            { icon: FiUsers, label: 'Users', href: '/admin/users' },
            { icon: FiStar, label: 'Reviews', href: '/admin/reviews' },
            { icon: FiLayers, label: 'Brands', href: '/admin/brands' },
            { icon: FiClock, label: 'Campaigns', href: '/admin/campaigns' },
            { icon: FiMail, label: 'Contacts', href: '/admin/contacts', badgeKey: 'unread' },
        ],
    },
    {
        title: 'Insights',
        icon: FiBarChart2,
        items: [
            { icon: FiBarChart2, label: 'Analytics', href: '/admin/analytics' },
            { icon: FiCreditCard, label: 'Payment Settings', href: '/admin/payment-settings' },
            { icon: FiSettings, label: 'Settings', href: '/admin/settings' },
        ],
    },
];

export default function AdminSidebar({ open, onClose, user, unreadCount, notificationsUnreadCount, onLogout }) {
    const router = useRouter();
    const [expandedGroups, setExpandedGroups] = useState({});
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    const isActive = (href) => {
        if (href === '/admin') {
            return router.pathname === '/admin';
        }
        return router.pathname === href || router.pathname.startsWith(`${href}/`);
    };

    const activeGroup = useMemo(
        () => menuGroups.find((group) => group.items.some((item) => isActive(item.href)))?.title,
        [router.pathname]
    );

    useEffect(() => {
        const defaultState = {};
        menuGroups.forEach((group) => {
            defaultState[group.title] = group.title === activeGroup || group.title === 'Main';
        });
        setExpandedGroups(defaultState);
    }, [activeGroup]);

    useEffect(() => {
        // Auto-collapse on desktop and track viewport changes
        if (typeof window === 'undefined') return;

        const handleResize = () => {
            const desktop = window.innerWidth >= 1024; // lg breakpoint
            setIsDesktop(desktop);
            if (desktop) {
                setIsCollapsed(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleGroup = (groupTitle) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [groupTitle]: !prev[groupTitle],
        }));
    };

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 bg-white shadow-2xl border-r border-slate-200 transform transition-all duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                } ${isCollapsed ? 'w-[80px] lg:w-[80px]' : 'w-[320px] max-w-[320px] lg:w-[280px]'}`}
            aria-label="Admin sidebar"
        >
            <div className="flex h-full flex-col overflow-hidden">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 bg-gradient-to-r from-sky-600 to-blue-700 px-3 lg:px-4 py-4">
                    {!isCollapsed && (
                        <div className="min-w-0">
                            <p className="text-lg font-semibold text-white truncate">DeshWear Admin</p>
                            <p className="text-xs text-sky-100/90">Manage operations</p>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="hidden lg:inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            title={isCollapsed ? 'Expand' : 'Collapse'}
                        >
                            {isCollapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex lg:hidden h-9 w-9 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                            aria-label="Close sidebar"
                        >
                            <FiX size={18} />
                        </button>
                    </div>
                </div>

                {!isCollapsed && (
                    <div className="p-4">
                        <Link
                            href="/"
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center justify-between gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                        >
                            <span>Visit storefront</span>
                            <FiExternalLink className="text-slate-500" size={16} />
                        </Link>
                    </div>
                )}

                <nav className="flex-1 overflow-y-auto px-2 lg:px-3 pb-6">
                    {menuGroups.map((group) => {
                        const GroupIcon = group.icon;
                        const groupId = `admin-sidebar-${group.title.toLowerCase().replace(/\s+/g, '-')}`;
                        const isOpen = Boolean(expandedGroups[group.title]);

                        if (isCollapsed) {
                            return (
                                <div key={group.title} className="mb-3 last:mb-0 rounded-2xl bg-slate-50 p-1">
                                    <button
                                        type="button"
                                        onClick={() => toggleGroup(group.title)}
                                        aria-expanded={isOpen}
                                        aria-controls={groupId}
                                        className="flex w-full items-center justify-center h-12 rounded-2xl bg-white text-slate-600 hover:bg-slate-100 transition"
                                        title={group.title}
                                    >
                                        <GroupIcon size={20} />
                                    </button>
                                </div>
                            );
                        }

                        return (
                            <div key={group.title} className="mb-5 last:mb-0 rounded-3xl bg-slate-50 p-2">
                                <button
                                    type="button"
                                    onClick={() => toggleGroup(group.title)}
                                    aria-expanded={isOpen}
                                    aria-controls={groupId}
                                    className="flex w-full items-center justify-between gap-3 rounded-3xl bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
                                >
                                    <span className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                                            <GroupIcon size={18} />
                                        </span>
                                        <span>{group.title}</span>
                                    </span>
                                    <FiChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-slate-500' : 'text-slate-400'}`} size={16} />
                                </button>
                                <div
                                    id={groupId}
                                    className={`mt-3 overflow-hidden transition-[max-height,opacity] duration-300 ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <div className="space-y-2 pb-2">
                                        {group.items.map((item) => {
                                            const Icon = item.icon;
                                            const active = isActive(item.href);
                                            const badge = item.badgeKey === 'unread' ? unreadCount : item.badgeKey === 'notifications' ? notificationsUnreadCount : undefined;

                                            if (isCollapsed) {
                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={(e) => {
                                                            if (!isDesktop && typeof onClose === 'function') onClose();
                                                        }}
                                                        aria-current={active ? 'page' : undefined}
                                                        title={item.label}
                                                        className={`group flex items-center justify-center h-12 rounded-2xl relative transition ${active
                                                            ? 'bg-slate-900 text-white shadow-sm'
                                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                                            }`}
                                                    >
                                                        <Icon size={18} />
                                                        {badge > 0 && (
                                                            <span className="absolute -top-2 -right-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                                                                {badge > 99 ? '99+' : badge}
                                                            </span>
                                                        )}
                                                    </Link>
                                                );
                                            }

                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={(e) => {
                                                        if (!isDesktop && typeof onClose === 'function') onClose();
                                                    }}
                                                    aria-current={active ? 'page' : undefined}
                                                    className={`group flex items-center justify-between gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${active
                                                        ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-200'
                                                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${active ? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                                                            <Icon size={18} />
                                                        </span>
                                                        <span>{item.label}</span>
                                                    </div>
                                                    {badge > 0 ? (
                                                        <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-rose-500 px-2 text-[11px] font-semibold text-white">
                                                            {badge > 99 ? '99+' : badge}
                                                        </span>
                                                    ) : null}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </nav>

                <div className="border-t border-slate-100 bg-slate-50 p-3 lg:p-4">
                    {isCollapsed ? (
                        <button
                            type="button"
                            onClick={onLogout}
                            className="flex w-full items-center justify-center h-12 rounded-2xl bg-white text-slate-600 hover:bg-slate-100 transition"
                            title="Logout"
                        >
                            <FiLogOut size={18} />
                        </button>
                    ) : (
                        <>
                            <div className="flex items-center gap-3 rounded-3xl bg-white px-4 py-3 shadow-sm">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-blue-700 text-white font-semibold">
                                    {user?.firstName?.[0] || 'A'}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-slate-900">
                                        {user?.firstName} {user?.lastName}
                                    </p>
                                    <p className="truncate text-xs text-slate-500 capitalize">{user?.role || 'admin'}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={onLogout}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-3xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition ring-1 ring-slate-200 hover:bg-slate-50"
                            >
                                <FiLogOut size={16} />
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </aside>
    );
}
