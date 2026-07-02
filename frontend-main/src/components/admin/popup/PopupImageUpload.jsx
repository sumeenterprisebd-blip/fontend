import { useRef } from 'react';
import { HiUpload, HiTrash } from 'react-icons/hi';
import Image from 'next/image';

/**
 * PopupImageUpload Component
 * Handles popup image upload and preview
 */
export default function PopupImageUpload({ imagePreview, uploading, onUpload, onRemove }) {
    const fileInputRef = useRef(null);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Popup Image <span className="text-red-500">*</span>
            </label>

            {imagePreview ? (
                <div className="relative">
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-300">
                        <Image
                            src={imagePreview}
                            alt="Popup preview"
                            fill
                            unoptimized
                            className="object-cover"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        disabled={uploading}
                    >
                        <HiTrash size={16} />
                    </button>
                </div>
            ) : (
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={onUpload}
                        className="hidden"
                        disabled={uploading}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50"
                        disabled={uploading}
                    >
                        <HiUpload size={24} className="text-gray-400" />
                        <span className="text-gray-600">
                            {uploading ? 'Uploading...' : 'Click to upload image'}
                        </span>
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                        Recommended: 800x400px, Max 5MB (JPG, PNG, GIF)
                    </p>
                </div>
            )}
        </div>
    );
}
