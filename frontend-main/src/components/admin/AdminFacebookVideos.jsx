import { useState } from 'react';
import { FiPlus, FiVideo } from 'react-icons/fi';
import SweetAlert from '@/components/shared/SweetAlert';
import ErrorMessage, { EmptyState, NetworkError } from '@/components/shared/ErrorMessage';
import { TableSkeleton } from '@/components/shared/LoadingSkeletons';
import { useFacebookVideoManager } from '@/hooks/useFacebookVideoManager';
import { useFacebookVideoActions } from './facebook-videos/useFacebookVideoActions';
import FacebookVideoList from './facebook-videos/FacebookVideoList';
import FacebookVideoFormModal from './facebook-videos/FacebookVideoFormModal';

export default function AdminFacebookVideos() {
    const [showAlert, setShowAlert] = useState({ show: false, message: '', type: 'success' });
    const videoManager = useFacebookVideoManager();

    const {
        showModal,
        editingVideo,
        handleOpenModal,
        handleEdit,
        handleCloseModal,
        handleSubmit,
        handleDelete,
    } = useFacebookVideoActions(videoManager, setShowAlert);

    if (videoManager.loading) {
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

    if (videoManager.networkError) {
        return (
            <div className="p-6">
                <NetworkError
                    onRetry={videoManager.fetchVideos}
                    message="Unable to connect to the server. Please check your connection and try again."
                />
            </div>
        );
    }

    if (videoManager.error) {
        return (
            <div className="p-6">
                <ErrorMessage type="error" message={videoManager.error} onClose={() => { }} />
                <button
                    onClick={videoManager.fetchVideos}
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
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Facebook Videos Management</h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">Create and manage Facebook videos on homepage</p>
                </div>
                <button
                    onClick={handleOpenModal}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95 text-sm sm:text-base"
                >
                    <FiPlus size={18} />
                    <span className="hidden sm:inline">New Facebook Video</span>
                    <span className="sm:hidden">New Video</span>
                </button>
            </div>

            {videoManager.videos.length === 0 ? (
                <EmptyState
                    icon={FiVideo}
                    title="No Facebook Videos Yet"
                    message="Add Facebook videos to showcase on your homepage"
                    action={handleOpenModal}
                    actionText="Add Facebook Video"
                />
            ) : (
                <FacebookVideoList
                    videos={videoManager.videos}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {showModal && (
                <FacebookVideoFormModal
                    video={editingVideo}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmit}
                />
            )}

            <SweetAlert
                show={showAlert.show}
                type={showAlert.type}
                message={showAlert.message}
                onClose={() => setShowAlert({ show: false, message: '', type: 'success' })}
            />
        </div>
    );
}
