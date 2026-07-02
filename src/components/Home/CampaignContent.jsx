import { HiClock } from '@react-icons/all-files/hi/HiClock';
import { HiSparkles } from '@react-icons/all-files/hi/HiSparkles';

export default function CampaignContent({ campaign, timeLeft, handleClick }) {
    return (
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative">
            {/* Decorative Corner Badge */}
            <div className="absolute top-6 right-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                <HiSparkles className="w-4 h-4" />
                Hot Deal
            </div>

            {/* Subtitle/Badge */}
            {campaign.subtitle && (
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 w-fit">
                    <HiSparkles className="w-4 h-4" />
                    {campaign.subtitle}
                </div>
            )}

            {/* Title */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
                {campaign.title}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mt-2">
                    {campaign.discountText || 'Special Offer'}
                </span>
            </h2>

            {/* Description */}
            {campaign.description && (
                <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl">
                    {campaign.description}
                </p>
            )}

            {/* Countdown Timer */}
            {timeLeft && (
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <HiClock className="w-5 h-5 text-blue-600" />
                        Offer ends in:
                    </div>
                    <div className="flex gap-3 sm:gap-4">
                        {[
                            { label: 'Days', value: timeLeft.days },
                            { label: 'Hours', value: timeLeft.hours },
                            { label: 'Mins', value: timeLeft.minutes },
                            { label: 'Secs', value: timeLeft.seconds }
                        ].map((item, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl px-3 sm:px-4 py-2 sm:py-3 min-w-[60px] sm:min-w-[70px] shadow-lg">
                                    <span className="text-2xl sm:text-3xl font-bold block">
                                        {String(item.value).padStart(2, '0')}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-600 mt-2 font-medium">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* CTA Button */}
            <button
                onClick={handleClick}
                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto group relative overflow-hidden"
            >
                <span className="relative z-10 flex items-center gap-3">
                    {campaign.ctaButtonText || 'Shop Now'}
                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            {/* Campaign End Date */}
            {campaign.endDate && !timeLeft && (
                <p className="text-sm text-gray-500 mt-6 flex items-center gap-2">
                    <HiClock className="w-4 h-4" />
                    Valid until {new Date(campaign.endDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            )}
        </div>
    );
}
