import { useState, useEffect } from 'react';
import { popupAPI } from '@/services/api';
import PopupImage from './PopupImage';
import { checkDisplayFrequency, savePopupDisplay } from './popupUtils';

export default function HomepagePopup() {
    const [popup, setPopup] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Delay popup fetch to reduce initial page load impact
        const timer = setTimeout(() => {
            fetchPopup();
        }, 3000); // Wait 3 seconds before fetching popup

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const fetchPopup = async () => {
        try {
            const response = await popupAPI.getHomepagePopup();
            const popupData = response.data.popup;

            if (popupData) {
                const shouldShow = checkDisplayFrequency(popupData);

                if (shouldShow) {
                    setPopup(popupData);
                    setTimeout(() => {
                        setIsOpen(true);
                        setTimeout(() => setIsAnimating(true), 50);
                    }, 1000);
                }
            }
        } catch (error) {
        }
    };

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => setIsOpen(false), 400);

        if (popup) {
            savePopupDisplay(popup);
        }
    };

    const handleImageClick = () => {
        if (popup?.buttonLink) {
            handleClose();
        }
    };

    if (!isOpen || !popup) return null;

    return (
        <>
            {/* Enhanced Backdrop with Better Blur */}
            <div
                className={`fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-sm z-[9998] transition-all duration-400 ${isAnimating ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={handleClose}
                aria-hidden="true"
            />

            {/* Popup Modal Container */}
            <div
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
                role="dialog"
                aria-modal="true"
                aria-labelledby="popup-title"
            >
                <div
                    className={`transform transition-all duration-400 ease-out pointer-events-auto w-full max-w-2xl ${isAnimating
                        ? 'scale-100 opacity-100 translate-y-0'
                        : 'scale-90 opacity-0 translate-y-8'
                        }`}
                >
                    <PopupImage
                        popup={popup}
                        onClose={handleClose}
                        onImageClick={handleImageClick}
                    />
                </div>
            </div>
        </>
    );
}
