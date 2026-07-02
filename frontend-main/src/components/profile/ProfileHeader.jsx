import { HiPencil } from 'react-icons/hi';

export default function ProfileHeader({ isEditing, onEdit }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-1.5 sm:mb-2">
          MY PROFILE
        </h1>
        <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
          Manage your account information and preferences
        </p>
      </div>
      {!isEditing && (
        <button
          onClick={onEdit}
          className="hidden lg:flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 shadow-lg hover:shadow-xl"
          aria-label="Edit profile"
        >
          <HiPencil className="w-5 h-5" />
          Edit Profile
        </button>
      )}
    </div>
  );
}

