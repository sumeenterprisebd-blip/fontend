import { useState, useEffect } from 'react';
import { HiX } from 'react-icons/hi';
import { popupAPI } from '@/services/api';
import PopupImageUpload from './popup/PopupImageUpload';
import usePopupImageUpload from './popup/usePopupImageUpload';
import { createPopupData } from './popup/popupDefaults';

export default function PopupFormModal({ isOpen, onClose, editingPopup, onSuccess }) {
    const [imageUrl, setImageUrl] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const { uploadImage, uploading, error, setError } = usePopupImageUpload();

    useEffect(() => {
        if (editingPopup) {
            setImageUrl(editingPopup.imageUrl || '');
            setImagePreview(editingPopup.imageUrl || '');
        } else {
            setImageUrl('');
            setImagePreview('');
        }
        setError('');
    }, [editingPopup, isOpen, setError]);

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const url = await uploadImage(file);
            if (url) {
                setImageUrl(url);
                setImagePreview(url);
            }
        } catch (err) {
            // Error is already handled in the hook
        }
    };

    const handleRemoveImage = () => {
        setImageUrl('');
        setImagePreview('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imageUrl) {
            setError('Please upload an image');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const submitData = createPopupData(imageUrl);

            if (editingPopup) {
                await popupAPI.updatePopup(editingPopup._id, submitData);
            } else {
                await popupAPI.createPopup(submitData);
            }

            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save popup');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 md:bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center z-[9999] p-3 md:p-4 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-4 md:my-8 transform transition-all max-h-[90vh] md:max-h-none overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header - Responsive */}
                <div className="border-b border-gray-200 px-4 md:px-6 py-4 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">
                        {editingPopup ? 'Edit Popup' : 'Create New Popup'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                        disabled={loading}
                    >
                        <HiX size={20} />
                    </button>
                </div>

                {/* Form - Responsive padding */}
                <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Popup Image <span className="text-red-500">*</span>
                        </label>
                        <PopupImageUpload
                            imagePreview={imagePreview}
                            uploading={uploading}
                            onUpload={handleImageUpload}
                            onRemove={handleRemoveImage}
                        />
                    </div>

                    {/* Action Buttons - Responsive stack */}
                    <div className="flex flex-col md:flex-row gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : editingPopup ? 'Update Popup' : 'Create Popup'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
