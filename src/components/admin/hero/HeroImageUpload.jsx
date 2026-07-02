import { FiImage } from 'react-icons/fi';

/**
 * HeroImageUpload Component
 * Handles desktop and mobile image uploads for hero slide
 */
export default function HeroImageUpload({ formData, errors, uploadingImage, handleImageUpload }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Desktop Image *</label>
                <div className="space-y-2">
                    {formData.desktopImage && (
                        <img
                            src={formData.desktopImage}
                            alt="Desktop preview"
                            className="w-full h-32 object-contain bg-gray-50 rounded-lg"
                        />
                    )}
                    <button
                        type="button"
                        onClick={() => handleImageUpload('desktopImage')}
                        disabled={uploadingImage}
                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors flex items-center justify-center gap-2"
                    >
                        <FiImage />
                        {uploadingImage ? 'Uploading...' : 'Upload Desktop Image'}
                    </button>
                    {errors.desktopImage && <p className="text-red-500 text-sm">{errors.desktopImage}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Mobile Image (Optional)</label>
                <div className="space-y-2">
                    {formData.mobileImage && (
                        <img
                            src={formData.mobileImage}
                            alt="Mobile preview"
                            className="w-full h-32 object-contain bg-gray-50 rounded-lg"
                        />
                    )}
                    <button
                        type="button"
                        onClick={() => handleImageUpload('mobileImage')}
                        disabled={uploadingImage}
                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors flex items-center justify-center gap-2"
                    >
                        <FiImage />
                        {uploadingImage ? 'Uploading...' : 'Upload Mobile Image'}
                    </button>
                </div>
            </div>
        </div>
    );
}
