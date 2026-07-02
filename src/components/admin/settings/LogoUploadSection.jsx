import { useRef } from 'react';
import { HiUpload, HiX } from 'react-icons/hi';

/**
 * LogoUploadSection Component
 * Handles site logo upload with preview
 */
export default function LogoUploadSection({
    logoPreview,
    uploading,
    uploadMessage,
    onUpload,
    onRemove
}) {
    const fileInputRef = useRef(null);

    return (
        <div className="border-b border-gray-200 pb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
                Site Logo
            </label>

            <div className="flex items-start gap-6">
                {/* Logo Preview */}
                <div className="relative">
                    <div className="w-32 h-32 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                        {logoPreview ? (
                            <img
                                src={logoPreview}
                                alt="Site Logo"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        ) : (
                            <span className="text-gray-400 text-sm">No logo</span>
                        )}
                    </div>
                    {logoPreview && logoPreview !== '/logo.jpeg' && (
                        <button
                            onClick={onRemove}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            title="Remove logo"
                        >
                            <HiX className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Upload Controls */}
                <div className="flex-1">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                        onChange={onUpload}
                        className="hidden"
                        id="logo-upload"
                        disabled={uploading}
                    />
                    <label
                        htmlFor="logo-upload"
                        className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        {uploading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <>
                                <HiUpload className="w-5 h-5" />
                                <span>Upload Logo</span>
                            </>
                        )}
                    </label>

                    <p className="mt-2 text-sm text-gray-500">
                        Supported formats: PNG, JPG, WEBP, SVG. Max size: 2MB. Recommended: 200x200px or larger
                    </p>

                    {/* Upload Message */}
                    {uploadMessage.text && (
                        <div className={`mt-3 px-3 py-2 rounded-md text-sm ${uploadMessage.type === 'success'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {uploadMessage.text}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
