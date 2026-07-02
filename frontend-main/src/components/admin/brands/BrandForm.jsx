import React from 'react';
import Image from 'next/image';
import { FiSave, FiX, FiCloud } from 'react-icons/fi';
import { useCloudinaryUpload } from '../products/hooks/useCloudinaryUpload';

export default function BrandForm({
    showModal,
    editingBrand,
    formData,
    onInputChange,
    onLogoUpdate,
    onSubmit,
    onClose
}) {
    const { uploading: uploadingLogo, error: uploadError, uploadImage } = useCloudinaryUpload();

    const handleLogoUpload = async () => {
        await uploadImage(onLogoUpdate, { folder: 'drip_drop/brands' });
    };

    if (!showModal) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-9999 flex items-center justify-center p-4 animate-fadeIn"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {editingBrand ? 'Edit Brand' : 'Add Brand'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-6">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Brand Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={onInputChange}
                                required
                                placeholder="Enter brand name"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Logo *
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    name="logo"
                                    value={formData.logo}
                                    onChange={onInputChange}
                                    required
                                    placeholder="Enter logo URL or upload image"
                                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={handleLogoUpload}
                                    disabled={uploadingLogo}
                                    className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center whitespace-nowrap"
                                >
                                    {uploadingLogo ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <FiCloud className="mr-2" size={18} />
                                            Upload
                                        </>
                                    )}
                                </button>
                            </div>
                            {uploadError && (
                                <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                                    {uploadError}
                                </div>
                            )}
                            {formData.logo && (
                                <div className="mt-3 relative h-24 w-auto border border-gray-200 rounded-lg p-3 bg-gray-50 flex items-center justify-center">
                                    <Image
                                        src={formData.logo}
                                        alt="Logo Preview"
                                        width={100}
                                        height={100}
                                        className="object-contain max-h-20"
                                        onError={(e) => {
                                            e.target.src = '/logo.jpeg';
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                        >
                            <FiSave className="mr-2" size={18} />
                            {editingBrand ? 'Update Brand' : 'Create Brand'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
