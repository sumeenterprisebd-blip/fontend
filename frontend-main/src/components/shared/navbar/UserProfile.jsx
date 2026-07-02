import Link from 'next/link';
import Image from 'next/image';
import { FiUser } from '@react-icons/all-files/fi/FiUser';
import { HiChevronRight } from '@react-icons/all-files/hi/HiChevronRight';

export default function UserProfile({ user, isAuthenticated, isAdmin, onClose }) {
    if (!isAuthenticated) {
        return (
            <Link
                href="/login"
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                aria-label="Sign in"
            >
                <div className="h-12 w-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-700 flex-shrink-0">
                    <FiUser className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] text-gray-900 truncate">Welcome</p>
                    <p className="text-sm text-gray-600 truncate">Tap to sign in</p>
                </div>
                <HiChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
        );
    }

    return (
        <Link
            href={isAdmin ? "/admin" : "/profile"}
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
            aria-label={isAdmin ? 'Go to admin dashboard' : 'Go to profile'}
        >
            {user?.avatar ? (
                <div className="h-12 w-12 rounded-2xl overflow-hidden border border-gray-200 bg-white flex-shrink-0">
                    <Image
                        src={user.avatar}
                        alt={`${user?.firstName}'s profile`}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                        unoptimized={user.avatar?.includes('googleusercontent.com')}
                    />
                </div>
            ) : (
                <div className="h-12 w-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-900 font-bold text-lg flex-shrink-0">
                    {user?.firstName?.[0]?.toUpperCase() || 'U'}
                </div>
            )}
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-[15px] text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-gray-600 truncate">{user?.email}</p>
            </div>
            <HiChevronRight className="w-5 h-5 text-gray-400" />
        </Link>
    );
}
