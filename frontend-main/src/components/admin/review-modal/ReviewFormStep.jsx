import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

export default function ReviewFormStep({
    userSelectionMode,
    selectedUser,
    newUserFirstName,
    newUserLastName,
    selectedProduct,
    rating,
    setRating,
    comment,
    setComment,
    autoApprove,
    setAutoApprove,
    error,
    loading,
    onSubmit,
    onBack
}) {
    const [hoveredRating, setHoveredRating] = useState(0);

    const getUserName = () => {
        if (userSelectionMode === 'existing') {
            return `${selectedUser?.firstName} ${selectedUser?.lastName}`;
        }
        return `${newUserFirstName} ${newUserLastName}`.trim();
    };

    const handleBack = () => {
        onBack();
    };

    return (
        <form onSubmit={onSubmit}>
            <div className="mb-4">
                <p className="text-gray-600">
                    User: <span className="font-semibold">{getUserName()}</span>
                </p>
                <p className="text-gray-600">
                    Product: <span className="font-semibold">{selectedProduct.name}</span>
                </p>
                <button
                    type="button"
                    onClick={handleBack}
                    className="text-sm text-blue-600 hover:text-blue-800"
                >
                    Change Product
                </button>
            </div>

            {/* Rating */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating *
                </label>
                <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="transition-transform hover:scale-110"
                        >
                            <FaStar
                                className={`w-8 h-8 ${star <= (hoveredRating || rating)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                    }`}
                            />
                        </button>
                    ))}
                    {rating > 0 && (
                        <span className="ml-2 text-sm text-gray-600">
                            {rating} out of 5
                        </span>
                    )}
                </div>
            </div>

            {/* Comment */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Comment *
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                    placeholder="Write the review comment..."
                />
            </div>

            {/* Auto Approve */}
            <div className="mb-6">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={autoApprove}
                        onChange={(e) => setAutoApprove(e.target.checked)}
                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                    />
                    <span className="text-sm text-gray-700">
                        Auto-approve this review
                    </span>
                </label>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    disabled={loading}
                >
                    Back
                </button>
                <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Review'}
                </button>
            </div>
        </form>
    );
}
