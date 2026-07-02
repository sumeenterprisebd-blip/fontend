import { useState, useEffect } from 'react';
import { ordersAPI } from '@/services/api';
import { HiDownload, HiRefresh } from 'react-icons/hi';
import { useToast } from '@/contexts/ToastContext';

/**
 * ExportButtons Component
 * Responsibility: Handle export to Excel and Google Sheets (backend-generated)
 * Max Lines: 80-120 ✅
 */
export default function ExportButtons({ orders, startDate, endDate }) {
    const [isExporting, setIsExporting] = useState(false);
    const [isExportingToSheets, setIsExportingToSheets] = useState(false);
    const [unsyncedCount, setUnsyncedCount] = useState(0);
    const [checkingUnsynced, setCheckingUnsynced] = useState(true);
    const [unsyncedError, setUnsyncedError] = useState('');
    const [lastSheetUrl, setLastSheetUrl] = useState('');

    const { showToast } = useToast();

    // Check for unsynced orders
    useEffect(() => {
        const checkUnsyncedOrders = async () => {
            try {
                setCheckingUnsynced(true);
                setUnsyncedError('');
                const response = await ordersAPI.getUnsyncedCount({
                    startDate: startDate || undefined,
                    endDate: endDate || undefined,
                });
                setUnsyncedCount(response.data.count);
            } catch (error) {
                setUnsyncedCount(0);
                setUnsyncedError(error.response?.data?.message || 'Failed to check exportable orders');
            } finally {
                setCheckingUnsynced(false);
            }
        };

        checkUnsyncedOrders();
        // Refresh count every 30 seconds
        const interval = setInterval(checkUnsyncedOrders, 30000);
        return () => clearInterval(interval);
    }, [startDate, endDate]);

    const refreshUnsynced = async () => {
        try {
            setCheckingUnsynced(true);
            setUnsyncedError('');
            const response = await ordersAPI.getUnsyncedCount({
                startDate: startDate || undefined,
                endDate: endDate || undefined,
            });
            setUnsyncedCount(response.data.count);
        } catch (error) {
            setUnsyncedCount(0);
            setUnsyncedError(error.response?.data?.message || 'Failed to check exportable orders');
        } finally {
            setCheckingUnsynced(false);
        }
    };

    const exportToExcel = async () => {
        setIsExporting(true);

        try {
            // Build query params
            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            // Call backend API to generate Excel file
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders/export/excel?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Export failed');
            }

            // Download the file
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            let filename = 'orders_export';
            if (startDate || endDate) {
                filename += '_';
                if (startDate) filename += `from_${startDate}`;
                if (endDate) filename += `_to_${endDate}`;
            } else {
                filename += `_${new Date().toISOString().split('T')[0]}`;
            }
            filename += '.xlsx';

            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            alert(`Successfully exported orders to Excel!`);
        } catch (error) {
            alert('Error exporting orders. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const exportToGoogleSheets = async () => {
        setIsExportingToSheets(true);

        try {
            const response = await ordersAPI.exportToGoogleSheets({
                startDate: startDate || null,
                endDate: endDate || null,
            });

            if (response.data.success) {
                const { ordersCount, itemsCount, sheetUrl } = response.data;

                if (sheetUrl) setLastSheetUrl(sheetUrl);

                // Refresh unsynced count
                await refreshUnsynced();

                if (!ordersCount) {
                    showToast('No orders to export for the selected date range', 'info');
                    return;
                }

                showToast(
                    `Exported ${ordersCount} order(s) (${itemsCount} item(s)) to Google Sheets`,
                    'success'
                );
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error exporting to Google Sheets. Please check your Google Sheets configuration.';
            showToast(errorMessage, 'error');
        } finally {
            setIsExportingToSheets(false);
        }
    };

    const rangeLabel = startDate || endDate
        ? `${startDate ? `From ${startDate}` : ''}${startDate && endDate ? ' • ' : ''}${endDate ? `To ${endDate}` : ''}`
        : 'All time';

    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 flex items-center gap-3">
                <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">Google Sheets export</div>
                    <div className="text-xs text-gray-600 truncate">Range: {rangeLabel}</div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${checkingUnsynced
                            ? 'bg-gray-100 text-gray-700'
                            : unsyncedError
                                ? 'bg-red-100 text-red-800'
                                : unsyncedCount > 0
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-gray-100 text-gray-700'
                            }`}
                        title={unsyncedError ? unsyncedError : (unsyncedCount === 0 ? 'No new orders to export in this range' : `${unsyncedCount} order(s) ready`)}
                    >
                        {checkingUnsynced ? 'Checking…' : unsyncedError ? 'Error' : `${unsyncedCount} ready`}
                    </span>
                    <button
                        type="button"
                        onClick={refreshUnsynced}
                        disabled={checkingUnsynced}
                        className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-50"
                        title="Refresh"
                    >
                        <HiRefresh className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={exportToExcel}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <HiDownload className="w-5 h-5" />
                    {isExporting ? 'Exporting…' : 'Download Excel'}
                </button>

                <button
                    onClick={exportToGoogleSheets}
                    disabled={isExportingToSheets || checkingUnsynced || !!unsyncedError || unsyncedCount === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={checkingUnsynced
                        ? 'Checking exportable orders'
                        : unsyncedError
                            ? unsyncedError
                            : unsyncedCount === 0
                                ? 'No new orders to export in this range'
                                : `${unsyncedCount} new order(s) ready to export`
                    }
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.8 10.7L4.2 5l-.7.7 5.7 15.6.7.7.7-.7 2.1-5.8h7.5c.8 0 1.5-.7 1.5-1.5v-2.1c0-.8-.7-1.5-1.5-1.5h-7.5l-2.1-5.8-.7-.7zm-8.7 9.5l-4.5-12 12 4.5-7.5 7.5zm2.1-7.5l4.5-4.5h2.1v2.1l-4.5 4.5h-2.1v-2.1z" />
                    </svg>
                    {isExportingToSheets ? 'Exporting…' : `Export to Sheets${unsyncedCount > 0 ? ` (${unsyncedCount})` : ''}`}
                </button>

                {lastSheetUrl ? (
                    <button
                        type="button"
                        onClick={() => window.open(lastSheetUrl, '_blank')}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        title="Open last exported sheet"
                    >
                        Open Sheet
                    </button>
                ) : null}
            </div>
        </div>
    );
}
