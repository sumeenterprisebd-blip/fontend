import { useState, useEffect } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { reviewsAPI } from '@/services/api';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CreateReviewModal from '@/components/admin/CreateReviewModal';
import EditReviewModal from '@/components/admin/EditReviewModal';
import ReviewList from '@/components/admin/reviews/ReviewList';
import ReviewsPagination from '@/components/admin/reviews/ReviewsPagination';

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
    const [searchTerm, setSearchTerm] = useState('');
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: 10
            };

            if (filter !== 'all') {
                params.status = filter;
            }

            const response = await reviewsAPI.getAllReviews(params);
            setReviews(response.data.reviews || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch reviews';
            setReviews([]);
            // Show error to user
            if (error.response?.status === 401) {
                alert('Authentication required. Please login again.');
            } else if (error.response?.status === 403) {
                alert('Access denied. Admin privileges required.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, currentPage]);

    const handleApprove = async (reviewId) => {
        try {
            await reviewsAPI.approveReview(reviewId);
            await fetchReviews();
            alert('Review approved successfully!');
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'Failed to approve review';
            alert(errorMsg);
        }
    };

    const handleReject = async (reviewId) => {
        try {
            await reviewsAPI.rejectReview(reviewId);
            await fetchReviews();
            alert('Review rejected successfully!');
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'Failed to reject review';
            alert(errorMsg);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!confirm('Are you sure you want to delete this review?')) return;

        try {
            await reviewsAPI.deleteReview(reviewId);
            await fetchReviews();
            alert('Review deleted successfully!');
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'Failed to delete review';
            alert(errorMsg);
        }
    };

    const handleEdit = (review) => {
        setSelectedReview(review);
        setEditModalOpen(true);
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800'
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    const filteredReviews = reviews.filter(review => {
        if (!searchTerm) return true;

        const userName = review.user
            ? `${review.user.firstName || ''} ${review.user.lastName || ''}`.toLowerCase()
            : '';
        const productName = review.product?.name?.toLowerCase() || '';
        const comment = review.comment?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();

        return userName.includes(search) || productName.includes(search) || comment.includes(search);
    });

    return (
        <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-black">Review Management</h1>
                                <p className="text-gray-600 mt-1">Manage customer reviews and create admin reviews</p>
                            </div>
                            <button
                                onClick={() => setCreateModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                            >
                                <FaPlus />
                                Create Review
                            </button>
                        </div>

                        {/* Filters & Search */}
                        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex gap-2 flex-wrap">
                                    {['all', 'pending', 'approved', 'rejected'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => {
                                                setFilter(status);
                                                setCurrentPage(1);
                                            }}
                                            className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${filter === status
                                                ? 'bg-black text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex-1 relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by user, product, or comment..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Reviews List */}
                        <ReviewList
                            reviews={reviews}
                            loading={loading}
                            filteredReviews={filteredReviews}
                            getStatusBadge={getStatusBadge}
                            handleEdit={handleEdit}
                            handleApprove={handleApprove}
                            handleReject={handleReject}
                            handleDelete={handleDelete}
                        />

                        {/* Pagination */}
                        <ReviewsPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            setCurrentPage={setCurrentPage}
                        />

                        {/* Create Review Modal */}
                        {createModalOpen && (
                            <CreateReviewModal
                                isOpen={createModalOpen}
                                onClose={() => setCreateModalOpen(false)}
                                onSuccess={() => {
                                    setCreateModalOpen(false);
                                    fetchReviews();
                                }}
                            />
                        )}

                        {/* Edit Review Modal */}
                        {editModalOpen && (
                            <EditReviewModal
                                isOpen={editModalOpen}
                                review={selectedReview}
                                onClose={() => {
                                    setEditModalOpen(false);
                                    setSelectedReview(null);
                                }}
                                onSuccess={() => {
                                    setEditModalOpen(false);
                                    setSelectedReview(null);
                                    fetchReviews();
                                }}
                            />
                        )}
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}
