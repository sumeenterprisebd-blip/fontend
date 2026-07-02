import { useState } from 'react';
import { FiPlus, FiImage } from 'react-icons/fi';
import SweetAlert from '@/components/shared/SweetAlert';
import ErrorMessage, { EmptyState, NetworkError } from '@/components/shared/ErrorMessage';
import { TableSkeleton } from '@/components/shared/LoadingSkeletons';
import { useHeroManager } from '@/hooks/useHeroManager';
import { useHeroActions } from './hero/useHeroActions';
import HeroList from './hero/HeroList';
import HeroFormModal from './hero/HeroFormModal';

export default function AdminHero() {
    const [showAlert, setShowAlert] = useState({ show: false, message: '', type: 'success' });
    const heroManager = useHeroManager();

    const {
        showModal,
        editingHero,
        handleOpenModal,
        handleEdit,
        handleCloseModal,
        handleSubmit,
        handleDelete,
        handleToggleStatus,
        handlePriorityChange,
    } = useHeroActions(heroManager, setShowAlert);

    if (heroManager.loading) {
        return (
            <div className="p-6">
                <div className="mb-6">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                </div>
                <TableSkeleton rows={3} columns={3} />
            </div>
        );
    }

    if (heroManager.networkError) {
        return (
            <div className="p-6">
                <NetworkError
                    onRetry={heroManager.fetchHeroes}
                    message="Unable to connect to the server. Please check your connection and try again."
                />
            </div>
        );
    }

    if (heroManager.error) {
        return (
            <div className="p-6">
                <ErrorMessage type="error" message={heroManager.error} onClose={() => { }} />
                <button
                    onClick={heroManager.fetchHeroes}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Hero Section Management</h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">Create and manage homepage hero slides</p>
                </div>
                <button
                    onClick={handleOpenModal}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95 text-sm sm:text-base"
                >
                    <FiPlus size={18} />
                    <span className="hidden sm:inline">New Hero Slide</span>
                    <span className="sm:hidden">New Slide</span>
                </button>
            </div>

            {heroManager.heroes.length === 0 ? (
                <EmptyState
                    icon={FiImage}
                    title="No Hero Slides Yet"
                    message="Create your first hero slide to showcase on your homepage"
                    action={handleOpenModal}
                    actionText="Create Hero Slide"
                />
            ) : (
                <HeroList
                    heroes={heroManager.heroes}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                    onPriorityChange={handlePriorityChange}
                />
            )}

            {showModal && (
                <HeroFormModal
                    hero={editingHero}
                    onSubmit={handleSubmit}
                    onClose={handleCloseModal}
                />
            )}

            <SweetAlert
                isOpen={showAlert.show}
                onClose={() => setShowAlert({ show: false, message: '', type: 'success' })}
                title={showAlert.type === 'success' ? 'Success' : 'Error'}
                message={showAlert.message}
                type={showAlert.type}
            />
        </div>
    );
}
