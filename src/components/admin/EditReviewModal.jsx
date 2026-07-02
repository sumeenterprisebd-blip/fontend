import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { reviewsAPI } from '@/services/api';
import ReviewInfo from './EditReview/ReviewInfo';
import ReviewRatingSelector from './EditReview/ReviewRatingSelector';
import ReviewFormFields from './EditReview/ReviewFormFields';

export default function EditReviewModal({ isOpen, onClose, review, onSuccess }) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');
    const [approvalStatus, setApprovalStatus] = useState('pending');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (review) {
            setRating(review.rating || 0);
            setComment(review.comment || '');
            setApprovalStatus(review.approvalStatus || 'pending');
        }
    }, [isOpen, review]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        if (!comment.trim()) {
            setError('Please write a review');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await reviewsAPI.updateReview(review._id, {
                rating,
                comment: comment.trim(),
                approvalStatus
            });
            alert('Review updated successfully!');
            onSuccess?.();
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to update review';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const resetModal = () => {
        setRating(0);
        setComment('');
        setApprovalStatus('pending');
        setError('');
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    if (!isOpen || !review) return null;

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto" style={{ zIndex: 9999 }}>
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                    onClick={handleClose}
                    style={{ zIndex: 9998 }}
                />

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative" style={{ zIndex: 9999 }}>
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">
                                Edit Review
                            </h3>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-500 transition-colors"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        <ReviewInfo review={review} />

                        <form onSubmit={handleSubmit}>
                            <ReviewRatingSelector
                                rating={rating}
                                setRating={setRating}
                                hoveredRating={hoveredRating}
                                setHoveredRating={setHoveredRating}
                            />

                            <ReviewFormFields
                                comment={comment}
                                setComment={setComment}
                                approvalStatus={approvalStatus}
                                setApprovalStatus={setApprovalStatus}
                            />

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                                    disabled={loading}
                                >
                                    {loading ? 'Updating...' : 'Update Review'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
