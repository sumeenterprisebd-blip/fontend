import { useEffect } from 'react';
import LogoUploadSection from './LogoUploadSection';
import useLogoUpload from './useLogoUpload';

export default function GeneralSettingsTab({ settings, onChange }) {
  const { logoPreview, setLogoPreview, uploading, uploadMessage, handleLogoUpload, handleRemoveLogo } = useLogoUpload(settings, onChange);

  // Sync logoPreview when settings.logo changes
  useEffect(() => {
    if (settings.logo) {
      setLogoPreview(settings.logo);
    }
  }, [settings.logo, setLogoPreview]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>

      {/* Logo Upload Section */}
      <div className="border-b border-gray-200 pb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Site Logo
        </label>
        <LogoUploadSection
          logoPreview={logoPreview}
          uploading={uploading}
          uploadMessage={uploadMessage}
          onUpload={handleLogoUpload}
          onRemove={handleRemoveLogo}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Site Name
        </label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={settings.siteName}
          onChange={(e) => onChange('siteName', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Site Email
        </label>
        <input
          type="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={settings.siteEmail}
          onChange={(e) => onChange('siteEmail', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Site Phone
        </label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={settings.sitePhone}
          onChange={(e) => onChange('sitePhone', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Site Description
        </label>
        <textarea
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={settings.siteDescription}
          onChange={(e) => onChange('siteDescription', e.target.value)}
        />
      </div>
    </div>
  );
}