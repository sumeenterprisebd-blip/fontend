import Link from 'next/link';
import Image from 'next/image';
import { HiX } from '@react-icons/all-files/hi/HiX';
import { HiSparkles } from '@react-icons/all-files/hi/HiSparkles';

export default function PopupImage({ popup, onClose, onImageClick }) {
    return (
        <div className="relative w-full mx-auto">
            {/* Close Button - Modern Design */}
            <button
                onClick={onClose}
                className="absolute -top-4 -right-4 z-20 p-3 rounded-full bg-white hover:bg-gray-50 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group border-2 border-gray-100"
                aria-label="Close popup"
            >
                <HiX className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-colors" />
            </button>

            {/* Main Popup Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Decorative Top Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                {/* Image Container */}
                {popup.imageUrl ? (
                    <div className="relative group">
                        {popup.buttonLink ? (
                            <Link href={popup.buttonLink} onClick={onImageClick}>
                                <div className="relative overflow-hidden" style={{ aspectRatio: '937/583' }}>
                                    <Image
                                        src={popup.imageUrl}
                                        alt="Special Offer"
                                        width={937}
                                        height={583}
                                        sizes="(max-width: 768px) 100vw, 665px"
                                        quality={85}
                                        loading="lazy"
                                        className="w-full h-auto object-contain cursor-pointer transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Click Indicator */}
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <div className="bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg">
                                            <span className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                                <HiSparkles className="w-4 h-4 text-yellow-500" />
                                                Click to Explore
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <div className="relative" style={{ aspectRatio: '937/583' }}>
                                <Image
                                    src={popup.imageUrl}
                                    alt="Announcement"
                                    width={937}
                                    height={583}
                                    sizes="(max-width: 768px) 100vw, 665px"
                                    quality={85}
                                    loading="lazy"
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    /* Enhanced Fallback UI */
                    <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8 sm:p-12 min-h-[400px] flex flex-col items-center justify-center text-center">
                        {/* Animated Background Pattern */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full blur-2xl animate-pulse" />
                            <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl animate-pulse delay-75" />
                        </div>

                        {/* Icon Container */}
                        <div className="relative mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl animate-bounce">
                                <HiSparkles className="w-10 h-10 text-white" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse" />
                        </div>

                        {/* Content */}
                        <div className="relative space-y-3 max-w-md">
                            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Welcome to Our Store!
                            </h3>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                Discover amazing products and exclusive deals waiting just for you.
                            </p>
                        </div>

                        {/* CTA Button */}
                        {popup.buttonLink && (
                            <Link
                                href={popup.buttonLink}
                                onClick={onImageClick}
                                className="relative mt-8 group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity" />
                                <div className="relative px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 active:scale-95 flex items-center gap-2">
                                    <span>Explore Now</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </div>
                            </Link>
                        )}
                    </div>
                )}

                {/* Bottom Decorative Element */}
                <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />
            </div>

            {/* Floating Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-3xl -z-10 animate-pulse" />
        </div>
    );
}
