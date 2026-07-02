import React from 'react';
import { FiPlus, FiBarChart2 } from 'react-icons/fi';
import CampaignCard from './CampaignCard';

export default function CampaignsList({ campaigns, onEdit, onDelete, onToggleStatus, onCreateNew }) {
    if (campaigns.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-12 text-center">
                <FiBarChart2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Campaigns Yet</h3>
                <p className="text-gray-600 mb-4">Create your first promotional campaign to get started</p>
                <button
                    onClick={onCreateNew}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                    <FiPlus size={20} />
                    Create Campaign
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {campaigns.map((campaign) => (
                <CampaignCard
                    key={campaign._id}
                    campaign={campaign}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleStatus={onToggleStatus}
                />
            ))}
        </div>
    );
}
