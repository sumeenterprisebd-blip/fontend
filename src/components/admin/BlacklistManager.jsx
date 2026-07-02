import { useEffect, useMemo, useState } from 'react';
import { blacklistAPI } from '@/services/api';
import { useToast } from '@/contexts/ToastContext';
import { formatDate } from '@/utils/dateFormatter';

const TYPE_OPTIONS = [
    { value: 'phone', label: 'Phone' },
    { value: 'ip', label: 'IP' },
    { value: 'address', label: 'Address' },
];

export default function BlacklistManager() {
    const { showToast } = useToast();
    const [type, setType] = useState('phone');
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [value, setValue] = useState('');
    const [reason, setReason] = useState('');

    const placeholder = useMemo(() => {
        if (type === 'phone') return '01XXXXXXXXX';
        if (type === 'ip') return 'Client IP address';
        return 'Street, Area, City (delivery address)';
    }, [type]);

    const fetchEntries = async () => {
        setLoading(true);
        try {
            const res = await blacklistAPI.list({ type });
            setEntries(res?.data?.entries || []);
        } catch (error) {
            showToast(error?.response?.data?.message || 'Failed to load blacklist', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

    const handleAdd = async (e) => {
        e.preventDefault();
        const v = String(value || '').trim();
        if (!v) {
            showToast('Value is required', 'error');
            return;
        }

        setSaving(true);
        try {
            const res = await blacklistAPI.create({ type, value: v, reason: String(reason || '').trim() });
            showToast(res?.data?.message || 'Added to blacklist', 'success');
            setValue('');
            setReason('');
            await fetchEntries();
        } catch (error) {
            showToast(error?.response?.data?.message || 'Failed to add to blacklist', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleRemove = async (id) => {
        if (!id) return;
        setDeletingId(id);
        try {
            const res = await blacklistAPI.remove(id);
            showToast(res?.data?.message || 'Removed from blacklist', 'success');
            await fetchEntries();
        } catch (error) {
            showToast(error?.response?.data?.message || 'Failed to remove', 'error');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Blacklist</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Block phone numbers, IP addresses, or delivery addresses from placing new orders.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex flex-wrap gap-2 mb-4">
                    {TYPE_OPTIONS.map((opt) => {
                        const active = opt.value === type;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setType(opt.value)}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${active
                                    ? 'bg-blue-50 text-blue-700 border-blue-100'
                                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>

                <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-5">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Value</label>
                        <input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={placeholder}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="md:col-span-5">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Reason (optional)</label>
                        <input
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g., Fake orders / spam"
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="md:col-span-2 flex items-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? 'Adding…' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900">Blocked {TYPE_OPTIONS.find((t) => t.value === type)?.label}</h2>
                    {loading ? <span className="text-sm text-gray-500">Loading…</span> : null}
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Value</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reason</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {entries.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-5 py-8 text-center text-sm text-gray-500">
                                        No entries
                                    </td>
                                </tr>
                            ) : (
                                entries.map((entry) => (
                                    <tr key={entry._id}>
                                        <td className="px-5 py-4 text-sm text-gray-900 font-medium">{entry.value}</td>
                                        <td className="px-5 py-4 text-sm text-gray-600">{entry.reason || '—'}</td>
                                        <td className="px-5 py-4 text-sm text-gray-600" suppressHydrationWarning>
                                            {formatDate(entry.createdAt)}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => handleRemove(entry._id)}
                                                disabled={deletingId === entry._id}
                                                className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                                            >
                                                {deletingId === entry._id ? 'Removing…' : 'Remove'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
