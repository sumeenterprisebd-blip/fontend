import Image from 'next/image';
import React from 'react';
import { FiImage } from 'react-icons/fi';

export default function ImageUploadField({
    label,
    imageUrl,
    onUpload,
    uploading,
    error,
    required = false
}) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
                {label} {required && '*'}
            </label>
            {imageUrl && (
                <Image
                    src={imageUrl}
                    alt={label}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                />
            )}
            <button
                type="button"
                onClick={onUpload}
                disabled={uploading}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 flex items-center justify-center gap-2"
            >
                <FiImage />
                {uploading ? 'Uploading...' : `Upload ${label}`}
            </button>
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>
    );
}
