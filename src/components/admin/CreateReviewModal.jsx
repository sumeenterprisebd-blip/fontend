import { useState } from 'react';
import { reviewsAPI } from '@/services/api';
import ModalWrapper from './review-modal/ModalWrapper';
import UserSelectionStep from './review-modal/UserSelectionStep';
import ProductSelectionStep from './review-modal/ProductSelectionStep';
import ReviewFormStep from './review-modal/ReviewFormStep';
import useReviewModalState from './review-modal/useReviewModalState';

export default function CreateReviewModal({ isOpen, onClose, onSuccess }) {
    const [step, setStep] = useState(1);
    const [userSelectionMode, setUserSelectionMode] = useState('existing');
    const [loading, setLoading] = useState(false);

    const state = useReviewModalState(isOpen, step, userSelectionMode);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (userSelectionMode === 'existing' && !state.selectedUser) {
            state.setError('Please select a user');
            return;
        }

        if (userSelectionMode === 'new' && !state.newUserFirstName.trim()) {
            state.setError('Please enter user first name');
            return;
        }

        if (!state.selectedProduct) {
            state.setError('Please select a product');
            return;
        }

        if (state.rating === 0) {
            state.setError('Please select a rating');
            return;
        }

        if (!state.comment.trim()) {
            state.setError('Please write a review');
            return;
        }

        setLoading(true);
        state.setError('');

        try {
            const reviewData = {
                productId: state.selectedProduct._id,
                rating: state.rating,
                comment: state.comment.trim(),
                autoApprove: state.autoApprove
            };

            if (userSelectionMode === 'existing') {
                reviewData.userId = state.selectedUser._id;
            } else {
                reviewData.newUserFirstName = state.newUserFirstName.trim();
                reviewData.newUserLastName = state.newUserLastName.trim();
                if (state.newUserEmail.trim()) {
                    reviewData.newUserEmail = state.newUserEmail.trim();
                }
            }

            await reviewsAPI.adminCreateReview(reviewData);
            onSuccess?.();
        } catch (err) {
            state.setError(err.response?.data?.message || 'Failed to create review');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep(1);
        setUserSelectionMode('existing');
        state.resetState();
        onClose();
    };

    return (
        <ModalWrapper isOpen={isOpen} step={step} onClose={handleClose}>
            {step === 1 && (
                <UserSelectionStep
                    userSelectionMode={userSelectionMode}
                    setUserSelectionMode={setUserSelectionMode}
                    users={state.users}
                    fetchingData={state.fetchingData}
                    selectedUser={state.selectedUser}
                    setSelectedUser={state.setSelectedUser}
                    newUserFirstName={state.newUserFirstName}
                    setNewUserFirstName={state.setNewUserFirstName}
                    newUserLastName={state.newUserLastName}
                    setNewUserLastName={state.setNewUserLastName}
                    newUserEmail={state.newUserEmail}
                    setNewUserEmail={state.setNewUserEmail}
                    error={state.error}
                    setError={state.setError}
                    onNext={() => setStep(2)}
                />
            )}

            {step === 2 && (
                <ProductSelectionStep
                    userSelectionMode={userSelectionMode}
                    selectedUser={state.selectedUser}
                    newUserFirstName={state.newUserFirstName}
                    newUserLastName={state.newUserLastName}
                    products={state.products}
                    fetchingData={state.fetchingData}
                    selectedProduct={state.selectedProduct}
                    setSelectedProduct={state.setSelectedProduct}
                    error={state.error}
                    setError={state.setError}
                    onNext={() => setStep(3)}
                    onBack={() => setStep(1)}
                />
            )}

            {step === 3 && (
                <ReviewFormStep
                    userSelectionMode={userSelectionMode}
                    selectedUser={state.selectedUser}
                    newUserFirstName={state.newUserFirstName}
                    newUserLastName={state.newUserLastName}
                    selectedProduct={state.selectedProduct}
                    rating={state.rating}
                    setRating={state.setRating}
                    comment={state.comment}
                    setComment={state.setComment}
                    autoApprove={state.autoApprove}
                    setAutoApprove={state.setAutoApprove}
                    error={state.error}
                    loading={loading}
                    onSubmit={handleSubmit}
                    onBack={() => {
                        setStep(2);
                        state.setSelectedProduct(null);
                    }}
                />
            )}
        </ModalWrapper>
    );
}
