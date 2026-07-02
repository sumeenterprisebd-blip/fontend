import { useState } from 'react';
import Image from 'next/image';
import { HiOutlineUser } from '@react-icons/all-files/hi/HiOutlineUser';

/**
 * UserAvatar - A reusable component for displaying user profile images
 * 
 * Features:
 * - Conditional rendering of avatar image or default icon
 * - Error fallback handling
 * - Responsive sizing
 * - Accessibility compliant
 * - Performance optimized with Next.js Image
 * 
 * @param {Object} props
 * @param {string} props.avatar - URL of the user's avatar image
 * @param {string} props.firstName - User's first name for alt text
 * @param {string} props.size - Size variant: 'xs', 'sm', 'md', 'lg', 'xl'
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.showRing - Show ring on hover (default: true)
 */
export default function UserAvatar({
    avatar,
    firstName = 'User',
    size = 'md',
    className = '',
    showRing = true
}) {
    const [imageError, setImageError] = useState(false);

    // Size configuration
    const sizeConfig = {
        xs: {
            container: 'w-5 h-5',
            icon: 'w-3 h-3',
            image: '20px'
        },
        sm: {
            container: 'w-6 h-6 sm:w-7 sm:h-7',
            icon: 'w-4 h-4 sm:w-5 sm:h-5',
            image: '(max-width: 640px) 24px, 28px'
        },
        md: {
            container: 'w-8 h-8 sm:w-10 sm:h-10',
            icon: 'w-5 h-5 sm:w-6 sm:h-6',
            image: '(max-width: 640px) 32px, 40px'
        },
        lg: {
            container: 'w-12 h-12 sm:w-14 sm:h-14',
            icon: 'w-7 h-7 sm:w-8 sm:h-8',
            image: '(max-width: 640px) 48px, 56px'
        },
        xl: {
            container: 'w-16 h-16 sm:w-20 sm:h-20',
            icon: 'w-10 h-10 sm:w-12 sm:h-12',
            image: '(max-width: 640px) 64px, 80px'
        }
    };

    const config = sizeConfig[size] || sizeConfig.md;
    const ringClass = showRing ? 'ring-2 ring-transparent group-hover:ring-gray-300' : '';

    return (
        <>
            {avatar && !imageError ? (
                <div
                    className={`relative ${config.container} rounded-full overflow-hidden ${ringClass} transition-all bg-gray-100 ${className}`}
                    role="img"
                    aria-label={`${firstName}'s profile picture`}
                >
                    <Image
                        src={avatar}
                        alt={`${firstName}'s profile`}
                        fill
                        sizes={config.image}
                        className="object-cover"
                        priority={false}
                        loading="lazy"
                        onError={() => setImageError(true)}
                        unoptimized={avatar?.includes('googleusercontent.com')}
                    />
                </div>
            ) : (
                <div
                    className={`relative ${config.container} rounded-full ${ringClass} transition-all bg-gray-200 flex items-center justify-center ${className}`}
                    role="img"
                    aria-label={`${firstName}'s profile icon`}
                >
                    <HiOutlineUser
                        className={`${config.icon} text-gray-600`}
                        aria-label="Default user icon"
                    />
                </div>
            )}
        </>
    );
}
