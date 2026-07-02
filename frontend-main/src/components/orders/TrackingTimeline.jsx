import { FiXCircle, FiClock } from 'react-icons/fi';
import { statusConfig, orderSteps } from './statusConfig';
import TimelineStep from './TimelineStep';
import TrackingHistory from './TrackingHistory';

export default function TrackingTimeline({ currentStatus, trackingHistory = [], lastUpdated }) {
    const currentStatusLower = currentStatus?.toLowerCase() || 'placed';
    const currentStepIndex = orderSteps.indexOf(currentStatusLower);

    // Handle cancelled/failed status
    const isCancelled = currentStatusLower === 'cancelled' || currentStatusLower === 'failed';

    const getStepStatus = (stepIndex) => {
        if (isCancelled && stepIndex > currentStepIndex) return 'cancelled';
        if (stepIndex < currentStepIndex) return 'completed';
        if (stepIndex === currentStepIndex) return 'current';
        return 'pending';
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            {/* Current Status Header */}
            <div className="mb-8 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {statusConfig[currentStatusLower]?.label || 'Order Status'}
                </h2>
                <p className="text-gray-600">
                    {statusConfig[currentStatusLower]?.description || 'Tracking your order'}
                </p>
                {lastUpdated && (
                    <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-2">
                        <FiClock className="w-4 h-4" />
                        Last updated: {new Date(lastUpdated).toLocaleString()}
                    </p>
                )}
            </div>

            {/* Timeline Steps */}
            <div className="relative">
                {/* Vertical line for mobile, horizontal for desktop */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 sm:hidden" />
                <div className="hidden sm:block absolute top-10 left-0 right-0 h-0.5 bg-gray-200" />

                <div className="space-y-8 sm:space-y-0 sm:flex sm:justify-between">
                    {orderSteps.map((step, index) => (
                        <TimelineStep
                            key={step}
                            step={step}
                            index={index}
                            stepStatus={getStepStatus(index)}
                            trackingHistory={trackingHistory}
                        />
                    ))}
                </div>
            </div>

            {/* Cancelled/Failed Status Message */}
            {isCancelled && (
                <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <FiXCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-red-900">
                                {currentStatusLower === 'cancelled' ? 'Order Cancelled' : 'Delivery Failed'}
                            </p>
                            <p className="text-sm text-red-700 mt-1">
                                {currentStatusLower === 'cancelled'
                                    ? 'This order has been cancelled. If you have any questions, please contact our support team.'
                                    : 'The delivery attempt failed. Our team will contact you shortly to reschedule delivery.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Tracking History */}
            {trackingHistory.length > 0 && (
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
            )}
        </div>
    );
}
