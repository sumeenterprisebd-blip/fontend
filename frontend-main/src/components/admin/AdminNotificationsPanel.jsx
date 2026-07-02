import { useEffect, useState } from "react";
import Link from "next/link";
import { adminNotificationsAPI } from "@/services/api";
import { formatDateWithMonth } from "@/utils/dateFormatter";

export default function AdminNotificationsPanel() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const [listRes, countRes] = await Promise.all([
                adminNotificationsAPI.list({ limit: 4 }),
                adminNotificationsAPI.unreadCount(),
            ]);

            if (listRes?.data?.success) {
                setNotifications(Array.isArray(listRes.data.notifications) ? listRes.data.notifications : []);
            }
            if (countRes?.data?.success) {
                setUnreadCount(Number(countRes.data.unreadCount || 0));
            }
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">Recent notifications</h2>
                    <p className="text-sm text-slate-600 mt-1">Central activity updates for admins.</p>
                </div>
                <div className="text-right">
                    <div className="text-sm font-semibold text-slate-900">{unreadCount}</div>
                    <div className="text-xs text-slate-500">unread</div>
                </div>
            </div>

            <div className="mt-4 min-h-[180px]">
                {loading ? (
                    <div className="text-sm text-slate-600">Loading…</div>
                ) : notifications.length === 0 ? (
                    <div className="text-sm text-slate-600">No recent notifications yet.</div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className={`rounded-2xl border px-4 py-3 ${notification.isRead ? "bg-slate-50 border-slate-200" : "bg-slate-100 border-slate-300"}`}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-semibold text-slate-900 line-clamp-2">{notification.title}</p>
                                    {!notification.isRead && (
                                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">New</span>
                                    )}
                                </div>
                                <p className="mt-1 text-sm text-slate-600 line-clamp-2">{notification.message}</p>
                                <div className="mt-2 text-[11px] text-slate-500">{formatDateWithMonth(notification.createdAt)}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-4 border-t border-slate-200 pt-4">
                <Link href="/admin/notifications" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-black">
                    View all notifications
                </Link>
            </div>
        </div>
    );
}
