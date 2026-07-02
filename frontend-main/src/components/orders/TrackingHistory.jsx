import { statusConfig } from './statusConfig';

/**
 * TrackingHistory Component
 * Display detailed tracking history with timestamps
 */
export default function TrackingHistory({ trackingHistory = [] }) {
    if (trackingHistory.length === 0) return null;

    return (
        <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tracking History</h3>
            <div className="space-y-3">
                {trackingHistory.map((entry, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                                {statusConfig[entry.status]?.label || entry.status}
                            </p>
                            {entry.message && (
                                <p className="text-sm text-gray-600 mt-0.5">{entry.message}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                {new Date(entry.timestamp).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
