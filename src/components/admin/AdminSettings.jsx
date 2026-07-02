import { FiSave } from 'react-icons/fi';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import SettingsTabs from './settings/SettingsTabs';
import GeneralSettingsTab from './settings/GeneralSettingsTab';
import StoreSettingsTab from './settings/StoreSettingsTab';
import OrderSecuritySettingsTab from './settings/OrderSecuritySettingsTab';

export default function AdminSettings() {
  const {
    settings,
    activeTab,
    saving,
    message,
    handleChange,
    handleSave,
    setActiveTab,
  } = useAdminSettings();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Configure system settings and preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 text-sm sm:text-base"
        >
          <FiSave className="mr-2" size={20} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`px-4 py-3 rounded-lg ${message.type === 'success'
          ? 'bg-green-50 border border-green-200 text-green-700'
          : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="p-6">
          {activeTab === 'general' && (
            <GeneralSettingsTab settings={settings} onChange={handleChange} />
          )}
          {activeTab === 'store' && (
            <StoreSettingsTab settings={settings} onChange={handleChange} />
          )}
          {activeTab === 'security' && (
            <OrderSecuritySettingsTab settings={settings} onChange={handleChange} />
          )}
        </div>
      </div>
    </div>
  );
}

