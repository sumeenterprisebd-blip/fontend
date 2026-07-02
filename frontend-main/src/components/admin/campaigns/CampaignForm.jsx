import React from 'react';
import useImageUpload from '@/hooks/admin/useImageUpload';
import ImageUploadField from './ImageUploadField';

export default function CampaignForm({
    showModal, editingCampaign, formData, onInputChange, onImageUpdate, onSubmit, onClose
}) {
    const { uploading, error, uploadImage } = useImageUpload();

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{editingCampaign ? 'Edit Campaign' : 'Create Campaign'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">✕</button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-6">
                    <input type="text" name="title" value={formData.title} onChange={onInputChange} required placeholder="Campaign Title *" className="w-full px-4 py-3 border-2 rounded-lg" />

                    <div className="grid md:grid-cols-2 gap-4">
                        <input type="text" name="subtitle" value={formData.subtitle} onChange={onInputChange} placeholder="Subtitle" className="w-full px-4 py-3 border-2 rounded-lg" />
                        <input type="text" name="discountText" value={formData.discountText} onChange={onInputChange} placeholder="Discount Text" className="w-full px-4 py-3 border-2 rounded-lg" />
                    </div>

                    <textarea name="description" value={formData.description} onChange={onInputChange} rows="3" placeholder="Description" className="w-full px-4 py-3 border-2 rounded-lg" />

                    <div className="grid md:grid-cols-2 gap-4">
                        <ImageUploadField label="Desktop Banner" imageUrl={formData.bannerImage} onUpload={() => uploadImage((url) => onImageUpdate('bannerImage', url), 'drip_drop/campaigns')} uploading={uploading} error={error} required />
                        <ImageUploadField label="Mobile Banner" imageUrl={formData.mobileBannerImage} onUpload={() => uploadImage((url) => onImageUpdate('mobileBannerImage', url), 'drip_drop/campaigns')} uploading={uploading} error={error} />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <input type="text" name="ctaButtonText" value={formData.ctaButtonText} onChange={onInputChange} placeholder="Button Text" className="w-full px-4 py-3 border-2 rounded-lg" />
                        <input type="text" name="ctaButtonLink" value={formData.ctaButtonLink} onChange={onInputChange} placeholder="Button Link" className="w-full px-4 py-3 border-2 rounded-lg" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <input type="date" name="startDate" value={formData.startDate} onChange={onInputChange} required placeholder="Start Date *" className="w-full px-4 py-3 border-2 rounded-lg" />
                        <input type="date" name="endDate" value={formData.endDate} onChange={onInputChange} required placeholder="End Date *" className="w-full px-4 py-3 border-2 rounded-lg" />
                    </div>

                    <label className="flex items-center gap-3">
                        <input type="checkbox" name="isActive" checked={formData.isActive} onChange={onInputChange} className="w-5 h-5" />
                        <span className="text-sm font-semibold">Activate immediately</span>
                    </label>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={onClose} className="px-6 py-3 border-2 rounded-lg">Cancel</button>
                        <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg">{editingCampaign ? 'Update' : 'Create'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
