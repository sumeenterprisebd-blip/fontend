import Image from 'next/image';
import React from 'react';
import { FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiImage } from 'react-icons/fi';

export default function CampaignCard({ campaign, onEdit, onDelete, onToggleStatus }) {
    const isExpired = (endDate) => new Date(endDate) < new Date();
    const isUpcoming = (startDate) => new Date(startDate) > new Date();

    const getStatusBadge = () => {
        if (campaign.isActive) {
            if (isExpired(campaign.endDate)) {
                return <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">Expired</span>;
            }
            if (isUpcoming(campaign.startDate)) {
                return <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">Upcoming</span>;
            }
            return <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">Active</span>;
        }
        return <span className="px-3 py-1 bg-gray-500 text-white text-xs font-semibold rounded-full">Inactive</span>;
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-64 h-48 bg-gray-200 relative">
                    {campaign.bannerImage ? (
                        <Image
                            src={campaign.bannerImage}
                            alt={campaign.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <FiImage className="w-12 h-12 text-gray-400" />
                        </div>
                    )}
                    <div className="absolute top-2 right-2">{getStatusBadge()}</div>
                </div>

                <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{campaign.title}</h3>
                            {campaign.subtitle && <p className="text-gray-600">{campaign.subtitle}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="text-sm text-gray-500">Start Date</p>
                            <p className="font-semibold">{new Date(campaign.startDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">End Date</p>
                            <p className="font-semibold">{new Date(campaign.endDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Impressions</p>
                            <p className="font-semibold">{campaign.impressions}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Clicks</p>
                            <p className="font-semibold">{campaign.clicks}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => onToggleStatus(campaign)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${campaign.isActive
                                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                        >
                            {campaign.isActive ? (
                                <>
                                    <FiToggleRight size={18} />
                                    Deactivate
                                </>
                            ) : (
                                <>
                                    <FiToggleLeft size={18} />
                                    Activate
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => onEdit(campaign)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all"
                        >
                            <FiEdit2 size={18} />
                            Edit
                        </button>

                        <button
                            onClick={() => onDelete(campaign._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
                        >
                            <FiTrash2 size={18} />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
