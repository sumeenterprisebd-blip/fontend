import { HiCheck, HiX } from 'react-icons/hi';

export default function ProfileActionButtons({ 
  onSave, 
  onCancel, 
  isSaving = false 
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-2">
      <button
        onClick={onSave}
        disabled={isSaving}
        className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Save changes"
      >
        {isSaving ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          <>
            <HiCheck className="w-5 h-5" />
            <span>Save Changes</span>
          </>
        )}
      </button>
      <button
        onClick={onCancel}
        disabled={isSaving}
        className="flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Cancel editing"
      >
        <HiX className="w-5 h-5" />
        <span>Cancel</span>
      </button>
    </div>
  );
}

