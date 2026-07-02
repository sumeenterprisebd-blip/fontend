import { FiGlobe, FiDatabase, FiShield } from 'react-icons/fi';

const tabs = [
  { id: 'general', label: 'General', icon: FiGlobe },
  { id: 'store', label: 'Store', icon: FiDatabase },
  { id: 'security', label: 'Order Security', icon: FiShield },
];

export default function SettingsTabs({ activeTab, onTabChange }) {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex -mb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Icon className="mr-2" size={18} />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

