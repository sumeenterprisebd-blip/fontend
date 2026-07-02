import { useState, useEffect } from 'react';
import { HiPlus, HiEye } from 'react-icons/hi';
import { popupAPI } from '@/services/api';
import PopupFormModal from './PopupFormModal';
import SweetAlert from '@/components/shared/SweetAlert';
import PopupCard from './popups/PopupCard';

export default function AdminPopups() {
    const [popups, setPopups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPopup, setEditingPopup] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

    useEffect(() => {
        fetchPopups();
    }, []);

    const fetchPopups = async () => {
        try {
            setLoading(true);
            const response = await popupAPI.getPopups();
            setPopups(response.data.popups || []);
        } catch (error) {
            showAlert('Failed to load popups', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (message, type = 'success') => {
        setAlert({ show: true, message, type });
    };

    const handleAddPopup = () => {
        setEditingPopup(null);
        setIsModalOpen(true);
    };

    const handleEditPopup = (popup) => {
        setEditingPopup(popup);
        setIsModalOpen(true);
    };

    const handleDeletePopup = async (id) => {
        if (!confirm('Are you sure you want to delete this popup?')) return;

        try {
            await popupAPI.deletePopup(id);
            showAlert('Popup deleted successfully');
            fetchPopups();
        } catch (error) {
            showAlert('Failed to delete popup', 'error');
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await popupAPI.togglePopupStatus(id);
            showAlert('Popup status updated');
            fetchPopups();
        } catch (error) {
            showAlert('Failed to update popup status', 'error');
        }
    };

    const handleModalSuccess = () => {
        setIsModalOpen(false);
        showAlert(editingPopup ? 'Popup updated successfully' : 'Popup created successfully');
        fetchPopups();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Homepage Popups</h1>
                    <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Manage announcement popups for your homepage</p>
                </div>
                <button
                    onClick={handleAddPopup}
                    className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm sm:text-base"
                >
                    <HiPlus className="mr-2" size={18} />
                    <span className="hidden sm:inline">Create Popup</span>
                    <span className="sm:hidden">Create</span>
                </button>
            </div>

            {/* Popups List */}
            {popups.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <div className="text-gray-400 mb-4">
                        <HiEye size={64} className="mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Popups Created</h3>
                    <p className="text-gray-500 mb-6">Create your first popup to engage visitors on your homepage</p>
                    <button
                        onClick={handleAddPopup}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <HiPlus className="mr-2" size={20} />
                        Create First Popup
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {popups.map((popup) => (
                        <PopupCard
                            key={popup._id}
                            popup={popup}
                            onEdit={handleEditPopup}
                            onDelete={handleDeletePopup}
                            onToggleStatus={handleToggleStatus}
                        />
                    ))}
                </div>
            )}

            <PopupFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingPopup={editingPopup}
                onSuccess={handleModalSuccess}
            />

            {/* Alert */}
            <SweetAlert
                isOpen={alert.show}
                onClose={() => setAlert({ ...alert, show: false })}
                title={alert.type === 'success' ? 'Success' : 'Error'}
                message={alert.message}
                type={alert.type}
                confirmText="OK"
            />
        </div>
    );
}
