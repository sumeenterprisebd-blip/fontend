import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { adminNotificationsAPI } from "@/services/api";
import { formatDateWithMonth } from "@/utils/dateFormatter";

const filterOptions = [
    { value: "all", label: "All" },
    { value: "unread", label: "Unread" },
    { value: "read", label: "Read" },
];

const typeOptions = [
    { value: "all", label: "All types" },
    { value: "order", label: "Order" },
    { value: "advance", label: "Advance Payment" },
    { value: "registration", label: "New User" },
    { value: "login", label: "Login" },
    { value: "review", label: "Review" },
    { value: "contact", label: "Contact" },
];

const getStatusLabel = (isRead) => (isRead ? "Read" : "Unread");
const getStatusClass = (isRead) =>
    isRead ? "bg-slate-100 text-slate-700 border-slate-200" : "bg-emerald-100 text-emerald-700 border-emerald-200";

export default function AdminNotificationsPage({ onCountChange }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(15);
    const [typeFilter, setTypeFilter] = useState("all");
    const [readFilter, setReadFilter] = useState("all");
    const [refreshToggle, setRefreshToggle] = useState(false);

    const typeLabel = useMemo(() => {
        const option = typeOptions.find((item) => item.value === typeFilter);
        return option ? option.label : "All types";
    }, [typeFilter]);

    const readLabel = useMemo(() => {
        const option = filterOptions.find((item) => item.value === readFilter);
        return option ? option.label : "All";
    }, [readFilter]);

    const listNotifications = async () => {
        setLoading(true);
        setError("");
        try {
            const params = {
                page,
                limit,
            };
            if (typeFilter !== "all") params.type = typeFilter;
            if (readFilter === "read") params.isRead = true;
            if (readFilter === "unread") params.isRead = false;

            const [listRes, countRes] = await Promise.all([
                adminNotificationsAPI.list(params),
                adminNotificationsAPI.unreadCount(),
            ]);

            if (listRes?.data?.success) {
                setNotifications(Array.isArray(listRes.data.notifications) ? listRes.data.notifications : []);
                const total = Number(listRes.data.pagination?.total ?? 0);
                setTotalPages(Math.max(1, Math.ceil(total / limit)));
            } else {
                setError(listRes?.data?.message || "Failed to load notifications.");
            }

            if (countRes?.data?.success) {
                const count = Number(countRes.data.unreadCount || 0);
                setUnreadCount(count);
                if (typeof onCountChange === "function") onCountChange(count);
            }
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || "Failed to load notifications.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        listNotifications();
    }, [page, typeFilter, readFilter, refreshToggle]);

    const handleMarkReadToggle = async (id, isRead) => {
        try {
            if (isRead) {
                await adminNotificationsAPI.markUnread(id);
            } else {
                await adminNotificationsAPI.markRead(id);
            }
            setRefreshToggle((prev) => !prev);
        } catch {
            setError("Could not update notification status.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await adminNotificationsAPI.delete(id);
            setRefreshToggle((prev) => !prev);
        } catch {
            setError("Could not delete notification.");
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await adminNotificationsAPI.markAllRead();
            setRefreshToggle((prev) => !prev);
        } catch {
            setError("Could not mark all notifications read.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Notifications</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage admin alerts for orders, payments, users, reviews, and messages.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-700">
                        Unread: <span className="font-semibold">{unreadCount}</span>
                    </div>
                    <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Mark all read
                    </button>
                    <Link
                        href="/admin"
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                        Back to dashboard
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Filters</p>
                    <div className="mt-3 space-y-3">
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Read status</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {filterOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            setReadFilter(option.value);
                                            setPage(1);
                                        }}
                                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${readFilter === option.value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Notification type</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {typeOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            setTypeFilter(option.value);
                                            setPage(1);
                                        }}
                                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${typeFilter === option.value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Showing</p>
                            <p className="text-xs text-slate-500">
                                {typeLabel} • {readLabel}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setRefreshToggle((prev) => !prev)}
                                className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                            >
                                Refresh
                            </button>
                            <span className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-600">
                                Page {page} / {totalPages}
                            </span>
                        </div>
                    </div>

                    <div className="mt-4">
                        {error ? (
                            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                                {error}
                            </div>
                        ) : null}

                        <div className="mt-3 overflow-hidden rounded-3xl border border-slate-200">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th className="px-4 py-3">Type</th>
                                        <th className="px-4 py-3">Title</th>
                                        <th className="px-4 py-3">Message</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Received</th>
                                        <th className="px-4 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                                                Loading notifications…
                                            </td>
                                        </tr>
                                    ) : notifications.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                                                No notifications match the selected filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        notifications.map((notification) => (
                                            <tr key={notification._id} className="border-t border-slate-200 bg-white">
                                                <td className="px-4 py-4 align-top text-slate-700">{notification.type}</td>
                                                <td className="px-4 py-4 align-top text-slate-900">{notification.title}</td>
                                                <td className="px-4 py-4 align-top text-slate-600 max-w-[320px] break-words">{notification.message}</td>
                                                <td className="px-4 py-4 align-top">
                                                    <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${getStatusClass(notification.isRead)}`}>
                                                        {getStatusLabel(notification.isRead)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 align-top text-slate-500">{formatDateWithMonth(notification.createdAt)}</td>
                                                <td className="px-4 py-4 align-top space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleMarkReadToggle(notification._id, notification.isRead)}
                                                        className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                                                    >
                                                        {notification.isRead ? "Mark unread" : "Mark read"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(notification._id)}
                                                        className="rounded-2xl bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-200"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
                        <div>{notifications.length} notifications shown</div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                disabled={page <= 1}
                                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                type="button"
                                disabled={page >= totalPages}
                                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
