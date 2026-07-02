import { statusConfig, orderSteps, getColorClasses } from './statusConfig';

/**
 * TimelineStep Component
 * Individual step in the tracking timeline
 */
export default function TimelineStep({ step, index, stepStatus, trackingHistory = [] }) {
    const config = statusConfig[step];
    const Icon = config.icon;
    const colorClasses = getColorClasses(config.color, stepStatus);
    const isActive = stepStatus === 'current';
    const isCompleted = stepStatus === 'completed';
    const isCancelledStep = stepStatus === 'cancelled';

    return (
        <div
            key={step}
            className="relative flex items-start sm:items-center sm:flex-col sm:flex-1"
        >
            {/* Icon Container */}
            <div
                className={`relative z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300 ${isActive
                    ? `${colorClasses.bg} ${colorClasses.border} shadow-lg ring-4 ring-${config.color}-100`
                    : isCompleted
                        ? `${colorClasses.bg} ${colorClasses.border}`
                        : isCancelledStep
                            ? `${colorClasses.bg} ${colorClasses.border}`
                            : 'bg-gray-50 border-gray-300'
                    }`}
            >
                <Icon
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive || isCompleted
                        ? colorClasses.text
                        : isCancelledStep
                            ? 'text-gray-400'
                            : 'text-gray-400'
                        }`}
                />
            </div>

            {/* Step Label */}
            <div className="ml-4 sm:ml-0 sm:mt-4 sm:text-center flex-1 sm:flex-none">
                <p
                    className={`text-sm sm:text-base font-semibold mb-1 ${isActive
                        ? 'text-gray-900'
                        : isCompleted
                            ? 'text-gray-900'
                            : 'text-gray-500'
                        }`}
                >
                    {config.label}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                    {config.description}
                </p>

                {/* Show timestamp if available from tracking history */}
                {trackingHistory.find(h => h.status === step) && (
                    <p className="text-xs text-gray-400 mt-1">
                        {new Date(trackingHistory.find(h => h.status === step).timestamp).toLocaleDateString()}
                    </p>
                )}
            </div>

            {/* Progress Line (between steps) */}
            {index < orderSteps.length - 1 && (
                <div
                    className={`absolute hidden sm:block h-0.5 transition-all duration-300 ${isCompleted ? colorClasses.line : 'bg-gray-200'
                        }`}
                    style={{
                        left: 'calc(50% + 24px)',
                        right: 'calc(-50% + 24px)',
                        top: '20px'
                    }}
                />
            )}
        </div>
    );
}
