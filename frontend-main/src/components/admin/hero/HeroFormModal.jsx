import { useState } from 'react';
import Image from 'next/image';
import { useImageUpload } from '@/hooks/useImageUpload';

/**
 * HeroFormModal Component
 * Responsibility: Hero form modal UI and form state management
 * Uses hooks for logic separation
 */
export default function HeroFormModal({ hero, onSubmit, onClose }) {
    // Support multiple images for hero slider
    const [images, setImages] = useState(hero?.images || (hero?.desktopImage ? [hero.desktopImage] : []));
    const [uploading, setUploading] = useState(false);
    const [alert, setAlert] = useState(null);
    const { triggerUpload } = useImageUpload({ folder: 'drip_drop/heroes' });

    // Handle image upload (multiple)
    const handleImageUpload = async () => {
        setUploading(true);
        try {
            const imageUrl = await triggerUpload();
            setImages(prev => [...prev, imageUrl]);
            setAlert({ message: 'Image uploaded successfully', type: 'success' });
        } catch (error) {
            setAlert({ message: error.message, type: 'error' });
        } finally {
            setUploading(false);
        }
    };

    // Remove image
    const handleRemoveImage = (url) => {
        setImages(prev => prev.filter(img => img !== url));
        setAlert({ message: 'Image removed.', type: 'info' });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (images.length === 0) {
            setAlert({ message: 'Please upload at least one image.', type: 'error' });
            return;
        }
        const success = await onSubmit({
            images
        });
        if (!success) {
            setAlert({ message: 'Failed to save hero images', type: 'error' });
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {hero ? 'Edit Hero Images' : 'Add Hero Images'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {alert && (
                    <div className={`mx-6 mt-4 p-3 rounded-lg ${alert.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {alert.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Hero Images *</label>
                        <div className="flex flex-wrap gap-4 mb-4">
                            {images.length > 0 ? (
                                images.map((img, idx) => (
                                    <div key={idx} className="relative group">
                                        <Image
                                            src={img}
                                            alt={`Hero ${idx + 1}`}
                                            width={128}
                                            height={80}
                                            className="w-32 h-20 object-contain bg-gray-50 rounded-lg border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(img)}
                                            className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-red-600 hover:bg-red-100"
                                            title="Remove"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <span className="text-gray-400">No images. Please upload one or more.</span>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={handleImageUpload}
                            disabled={uploading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                        >
                            {uploading ? 'Uploading...' : 'Add Image'}
                        </button>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200 font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95 disabled:opacity-50"
                        >
                            {hero ? 'Update Images' : 'Add Images'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
