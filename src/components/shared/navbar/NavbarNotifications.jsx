import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { FiBell } from "@react-icons/all-files/fi/FiBell";
import { notificationsAPI } from "@/services/api";
import { formatDateWithMonth } from "@/utils/dateFormatter";

const getNotificationTargetUrl = (n, mode) => {
    if (mode === "guest") {
        const trackingId = n?.data?.orderNumber || n?.data?.shortId || n?.data?.orderId;
        if (trackingId) return `/orders/track?id=${encodeURIComponent(String(trackingId))}`;
        return "/orders/track";
    }

    const orderId = n?.data?.orderId;
    if (orderId) return `/orders/${encodeURIComponent(String(orderId))}`;
    return "/orders";
};

export default function NavbarNotifications({ mode = "user", guestOrders = [] }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [items, setItems] = useState([]);
    const [loadingList, setLoadingList] = useState(false);
    const rootRef = useRef(null);

    const cappedUnreadLabel = useMemo(() => {
        if (unreadCount > 99) return "99+";
        return String(unreadCount || 0);
    }, [unreadCount]);

    const refreshUnread = async () => {
        try {
            if (mode === "guest") {
                const res = await notificationsAPI.guestUnreadCount({ orders: guestOrders });
                setUnreadCount(Number(res?.data?.unreadCount || 0));
            } else {
                const res = await notificationsAPI.unreadCount();
                setUnreadCount(Number(res?.data?.unreadCount || 0));
            }
        } catch {
            // ignore
        }
    };

    const refreshList = async () => {
        setLoadingList(true);
        try {
            if (mode === "guest") {
                const res = await notificationsAPI.guestList({ orders: guestOrders, limit: 15 });
                setItems(Array.isArray(res?.data?.notifications) ? res.data.notifications : []);
            } else {
                const res = await notificationsAPI.listMy({ limit: 15 });
                setItems(Array.isArray(res?.data?.notifications) ? res.data.notifications : []);
            }
        } catch {
            // ignore
        } finally {
            setLoadingList(false);
        }
    };

    useEffect(() => {
        refreshUnread();

        const interval = setInterval(() => {
            refreshUnread();
        }, 30000);

        const onVisibility = () => {
            if (document.visibilityState === "visible") {
                refreshUnread();
            }
        };

        document.addEventListener("visibilitychange", onVisibility);

        return () => {
            clearInterval(interval);
            document.removeEventListener("visibilitychange", onVisibility);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!open) return;
        refreshList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, mode, guestOrders]);

    useEffect(() => {
        const onDocMouseDown = (e) => {
            const el = rootRef.current;
            if (!el) return;
            if (!el.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", onDocMouseDown);
        return () => document.removeEventListener("mousedown", onDocMouseDown);
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!("serviceWorker" in navigator)) return;

        const handler = (event) => {
            const data = event?.data;
            if (!data || typeof data !== "object") return;
            if (data.type !== "PUSH_NOTIFICATION") return;
            refreshUnread();
            if (open) refreshList();
        };

        navigator.serviceWorker.addEventListener("message", handler);
        return () => navigator.serviceWorker.removeEventListener("message", handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const markAllRead = async () => {
        try {
            if (mode === "guest") {
                await notificationsAPI.guestMarkAllRead({ orders: guestOrders });
            } else {
                await notificationsAPI.markAllRead();
            }
            setUnreadCount(0);
            setItems((prev) => prev.map((n) => ({ ...n, isRead: true, readAt: n.readAt || new Date().toISOString() })));
        } catch {
            // ignore
        }
    };

    const openNotification = async (n) => {
        const target = getNotificationTargetUrl(n, mode);

        try {
            if (n && !n.isRead && n._id) {
                if (mode === "guest") {
                    await notificationsAPI.guestMarkRead(n._id, { orders: guestOrders });
                } else {
                    await notificationsAPI.markRead(n._id);
                }
                setUnreadCount((c) => Math.max(0, Number(c || 0) - 1));
                setItems((prev) =>
                    prev.map((x) => (x._id === n._id ? { ...x, isRead: true, readAt: new Date().toISOString() } : x))
                );
            }
        } catch {
            // ignore
        } finally {
            setOpen(false);
            router.push(target);
        }
    };

    return (
        <div className="relative" ref={rootRef}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="relative h-11 w-11 inline-flex items-center justify-center rounded-xl text-gray-700 hover:text-black hover:bg-gray-100 transition-all duration-200 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                aria-label="Notifications"
                aria-expanded={open}
            >
                <FiBell className="w-5 h-5 sm:w-6 sm:h-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                        {cappedUnreadLabel}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-[320px] sm:w-[360px] bg-white border border-gray-200 rounded-2xl shadow-[0_20px_60px_rgba(15,23,42,0.12)] overflow-hidden z-50">
                    <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
                        <div className="text-sm font-semibold text-gray-900">Notifications</div>
                        <button
                            type="button"
                            onClick={markAllRead}
                            className="text-xs font-semibold text-gray-700 hover:text-black"
                        >
                            Mark all read
                        </button>
                    </div>

                    <div className="max-h-[420px] overflow-auto">
                        {loadingList ? (
                            <div className="px-4 py-6 text-sm text-gray-600">Loading…</div>
                        ) : items.length === 0 ? (
                            <div className="px-4 py-6 text-sm text-gray-600">No notifications yet.</div>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {items.map((n) => (
                                    <li key={n._id}>
                                        <button
                                            type="button"
                                            onClick={() => openNotification(n)}
                                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition ${n.isRead ? "" : "bg-gray-50"
                                                }`}
                                        >
                                            <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                                {n.message}
                                            </div>
                                            <div className="mt-1 text-xs text-gray-500">
                                                {formatDateWithMonth(n.createdAt)}
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="px-4 py-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                router.push(mode === "guest" ? "/orders/track" : "/orders");
                            }}
                            className="text-sm font-semibold text-gray-800 hover:text-black"
                        >
                            View orders
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
