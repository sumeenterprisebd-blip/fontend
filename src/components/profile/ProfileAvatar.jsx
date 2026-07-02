import { useState } from 'react';
import Image from 'next/image';
import { HiCamera, HiOutlineUser } from 'react-icons/hi';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileAvatar({ 
  avatarUrl, 
  firstName, 
  lastName, 
  isEditing,
  onAvatarChange,
  memberSince 
}) {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  
  // Use AuthContext as source of truth, fallback to props
  const displayFirstName = user?.firstName || firstName || '';
  const displayLastName = user?.lastName || lastName || '';
  const displayAvatar = user?.avatar || avatarUrl;
  
  const initials = `${displayFirstName?.[0] || ''}${displayLastName?.[0] || ''}`.toUpperCase();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      if (onAvatarChange) {
        onAvatarChange(reader.result);
      }
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 ring-4 ring-white shadow-xl transition-transform duration-300 hover:scale-105">
          {displayAvatar ? (
            <Image
              src={displayAvatar}
              alt={`${displayFirstName} ${displayLastName}`}
              width={160}
              height={160}
              className="w-full h-full object-cover"
              priority
              unoptimized={displayAvatar?.includes('googleusercontent.com')}
              onError={(e) => {
                // Fallback to initials if image fails to load
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
              {initials ? (
                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-700">
                  {initials}
                </span>
              ) : (
                <HiOutlineUser className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-gray-500" />
              )}
            </div>
          )}
        </div>
        
        {isEditing && (
          <label
            className="absolute bottom-0 right-0 w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
            aria-label="Change profile picture"
          >
            {isUploading ? (
              <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <HiCamera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        )}
      </div>
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mt-3 sm:mt-4">
        {displayFirstName} {displayLastName}
      </h2>
      {memberSince && (
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Member since {memberSince}</p>
      )}
    </div>
  );
}

