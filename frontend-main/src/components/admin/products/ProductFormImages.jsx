import Image from 'next/image';
import { FiPlus, FiX, FiCloud } from 'react-icons/fi';

export default function ProductFormImages({ 
  formData, 
  onImageChange, 
  onAddImage, 
  onRemoveImage,
  uploadingImage,
  uploadError,
  onUploadClick
}) {
  const handleUpload = (index) => {
    onUploadClick(index);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
        Product Images <span className="text-red-500">*</span>
      </h3>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800 flex items-start">
          <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>
            <strong>Auto-Optimization:</strong> Uploading images will automatically optimize them for web performance. Images are compressed, resized, and converted to optimal formats for faster loading.
          </span>
        </p>
      </div>
      
      <p className="text-sm text-gray-600">
        Upload images using Cloudinary or enter image URLs directly
      </p>
      
      {uploadError && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{uploadError}</div>
      )}
      
      {formData.images.map((image, index) => (
        <div key={index} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter image URL or upload from Cloudinary"
              value={image}
              onChange={(e) => onImageChange(index, e.target.value)}
            />
            <button
              type="button"
              onClick={() => handleUpload(index)}
              disabled={uploadingImage}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
              title="Upload to Cloudinary"
            >
              <FiCloud className="mr-2" size={18} />
              {uploadingImage ? 'Uploading...' : 'Upload'}
            </button>
            {formData.images.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove image"
              >
                <FiX size={20} />
              </button>
            )}
          </div>
          {image && (
            <div className="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
              <Image
                src={image}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = '/logo.jpeg'; }}
              />
            </div>
          )}
        </div>
      ))}
      
      <button
        type="button"
        onClick={onAddImage}
        className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <FiPlus className="mr-2" />
        Add Another Image
      </button>
    </div>
  );
}

