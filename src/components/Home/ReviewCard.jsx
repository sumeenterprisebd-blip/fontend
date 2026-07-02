import Image from 'next/image';
import { FaStar } from '@react-icons/all-files/fa/FaStar';
import { HiOutlineChatAlt2 } from '@react-icons/all-files/hi/HiOutlineChatAlt2';

export default function ReviewCard({ review }) {
    // Extract user data
    const userName = review.user
        ? `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim()
        : review.name || 'Anonymous';

    const userAvatar = review.user?.avatar || review.avatar || '/images/default-avatar.png';

    // Extract product name if available
    const productName = review.product?.name || review.productName || '';

    return (
        <div className="group relative bg-white rounded-2xl p-5 sm:p-6 lg:p-7 border border-gray-200 hover:border-gray-300 hover:shadow-2xl active:shadow-xl transition-all duration-300 h-full flex flex-col overflow-hidden">
            {/* Decorative Background Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-bl-full" />

            {/* Quote Icon - Decorative */}
            <div className="absolute top-5 right-5 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <HiOutlineChatAlt2 className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400" />
            </div>

            {/* Rating Section */}
            <div className="flex items-center gap-2 mb-4 sm:mb-5 relative z-10">
                <div className="flex items-center gap-0.5 sm:gap-1">
                    {[...Array(5)].map((_, i) => (
                        <FaStar
                            key={i}
                            className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200 ${i < review.rating
                                ? 'text-yellow-400 scale-100 group-hover:scale-110'
                                : 'text-gray-200'
                                }`}
                        />
                    ))}
                </div>
                <span className="ml-1 text-sm sm:text-base font-bold text-gray-700">
                    {review.rating}.0
                </span>
            </div>

            {/* Review Comment */}
            <div className="flex-1 mb-5 sm:mb-6 relative z-10">
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 line-clamp-4 sm:line-clamp-5 leading-relaxed font-medium">
                    <span className="text-2xl sm:text-3xl text-gray-300 leading-none mr-1">&quot;</span>
                    {review.comment}
                    <span className="text-2xl sm:text-3xl text-gray-300 leading-none ml-1">&quot;</span>
                </p>
            </div>

            {/* Customer Info Section */}
            <div className="flex items-center gap-3 sm:gap-4 pt-4 sm:pt-5 border-t border-gray-100 relative z-10">
                <div className="relative shrink-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 ring-2 ring-gray-100 group-hover:ring-yellow-200 transition-all duration-300">
                        <Image
                            src={userAvatar}
                            alt={userName}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                                e.target.src = '/images/default-avatar.png';
                            }}
                        />
                    </div>
                    {/* Verified Badge */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center ring-2 ring-white">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm sm:text-base text-black truncate mb-0.5 group-hover:text-gray-800 transition-colors">
                        {userName}
                    </p>
                    {productName && (
                        <div className="flex items-center gap-1.5">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <p className="text-xs sm:text-sm text-gray-500 truncate">
                                {productName}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

