import { useState } from 'react';
import { reviewsAPI } from '@/services/api';

export default function useReviewForm(product, orderId, onSuccess) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      await reviewsAPI.createReview({
        product: product._id,
        order: orderId,
        rating,
        comment: comment.trim()
      });
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return { rating, setRating, hoveredRating, setHoveredRating, comment, setComment, loading, error, handleSubmit };
}
