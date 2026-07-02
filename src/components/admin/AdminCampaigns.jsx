import React from 'react';
import { FiPlus } from 'react-icons/fi';
import useAdminCampaigns from '@/hooks/admin/useAdminCampaigns';
import CampaignsList from '@/components/admin/campaigns/CampaignsList';
import CampaignForm from '@/components/admin/campaigns/CampaignForm';
import SweetAlert from '@/components/shared/SweetAlert';

export default function AdminCampaigns() {
    const {
        campaigns,
        loading,
        showModal,
        editingCampaign,
        showAlert,
        formData,
        setShowModal,
        handleInputChange,
        handleImageUpdate,
        handleSubmit,
        handleEdit,
        handleDelete,
        handleToggleStatus,
        handleCloseModal,
        closeAlert,
    } = useAdminCampaigns();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Campaign Management</h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">Create and manage promotional campaigns</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                    <FiPlus size={20} />
                    New Campaign
                </button>
            </div>

            <CampaignsList
                campaigns={campaigns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                onCreateNew={() => setShowModal(true)}
            />

            <CampaignForm
                showModal={showModal}
                editingCampaign={editingCampaign}
                formData={formData}
                onInputChange={handleInputChange}
                onImageUpdate={handleImageUpdate}
                onSubmit={handleSubmit}
                onClose={handleCloseModal}
            />

            <SweetAlert
                isOpen={showAlert.show}
                onClose={closeAlert}
                title={showAlert.type === 'success' ? 'Success' : 'Error'}
                message={showAlert.message}
                type={showAlert.type}
            />
        </div>
    );
}
