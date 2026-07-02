import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { FiBell } from "@react-icons/all-files/fi/FiBell";
import { adminNotificationsAPI } from "@/services/api";
import { formatDateWithMonth } from "@/utils/dateFormatter";

const getTargetUrl = (notification) => {
    if (notification?.data?.url) return notification.data.url;
    if (notification?.type === "order" && notification?.referenceId) {
        return `/admin/orders?orderId=${encodeURIComponent(notification.referenceId)}`;
    }
    if (notification?.type === "contact") {
        return "/admin/contacts";
    }
    if (notification?.type === "review") {
        return "/admin/reviews";
    }
    return "/admin/notifications";
};

const getBadgeText = (count) => {
    if (count > 99) return "99+";
    return String(count || 0);
};

export default function AdminNotificationsMenu({ onCountChange }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const rootRef = useRef(null);

    const refreshCount = async () => {
        try {
            const response = await adminNotificationsAPI.unreadCount();
            if (response.data.success) {
                const count = Number(response.data.unreadCount || 0);
                setUnreadCount(count);
                if (typeof onCountChange === "function") {
                    onCountChange(count);
                }
            }
        } catch {
            // ignore
        }
    };

    const refreshList = async () => {
        setLoading(true);
        try {
            const response = await adminNotificationsAPI.list({ limit: 5 });
            if (response.data.success) {
                setNotifications(Array.isArray(response.data.notifications) ? response.data.notifications : []);
            }
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshCount();
        const interval = setInterval(refreshCount, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!open) return;
        refreshList();
    }, [open]);

    useEffect(() => {
        const onDocumentClick = (event) => {
            if (rootRef.current && !rootRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", onDocumentClick);
        return () => document.removeEventListener("mousedown", onDocumentClick);
    }, []);

    const handleNotificationClick = async (notification) => {
        const targetUrl = getTargetUrl(notification);
        if (notification && !notification.isRead) {
            try {
                await adminNotificationsAPI.markRead(notification._id);
                setUnreadCount((count) => Math.max(0, count - 1));
                setNotifications((prev) => prev.map((item) => item._id === notification._id ? { ...item, isRead: true, readAt: new Date().toISOString() } : item));
                if (typeof onCountChange === "function") {
                    onCountChange(Math.max(0, unreadCount - 1));
                }
            } catch {
                // ignore
            }
        }
        setOpen(false);
        router.push(targetUrl);
    };

    const handleMarkAllRead = async () => {
        try {
            await adminNotificationsAPI.markAllRead();
            setUnreadCount(0);
            setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true, readAt: new Date().toISOString() })));
            if (typeof onCountChange === "function") {
                onCountChange(0);
            }
        } catch {
            // ignore
        }
    };

    return (
        <div className="relative" ref={rootRef}>
            <button
                type="button"
                className="relative inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                onClick={() => setOpen((prev) => !prev)}
                aria-label="Admin notifications"
                aria-expanded={open}
            >
                <FiBell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-semibold text-white shadow-sm">
                        {getBadgeText(unreadCount)}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-[360px] rounded-3xl border border-slate-200 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.12)] z-50 overflow-hidden">
                    <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-100">
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Admin notifications</p>
                            <p className="text-xs text-slate-500">Recent action items</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleMarkAllRead}
                            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                        >
                            Mark all read
                        </button>
                    </div>
                    <div className="max-h-[380px] overflow-auto">
                        {loading ? (
                            <div className="px-4 py-6 text-sm text-slate-600">Loading notifications…</div>
                        ) : notifications.length === 0 ? (
                            <div className="px-4 py-6 text-sm text-slate-600">No notifications yet.</div>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {notifications.map((notification) => (
                                    <li key={notification._id}>
                                        <button
                                            type="button"
                                            onClick={() => handleNotificationClick(notification)}
                                            className={`w-full text-left px-4 py-4 transition ${notification.isRead ? "bg-white" : "bg-slate-50"}`}
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-sm font-semibold text-slate-900 line-clamp-2">{notification.title}</p>
                                                <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{notification.type}</span>
                                            </div>
                                            <p className="mt-1 text-sm text-slate-600 line-clamp-2">{notification.message}</p>
                                            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                                                <span>{formatDateWithMonth(notification.createdAt)}</span>
                                                {!notification.isRead && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">New</span>}
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="border-t border-slate-100 px-4 py-3 bg-slate-50">
                        <button
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                router.push("/admin/notifications");
                            }}
                            className="w-full text-sm font-semibold text-slate-900 hover:text-black"
                        >
                            View all notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
