import { FiX } from '@react-icons/all-files/fi/FiX';

/**
 * ModalBackdrop Component
 * Background overlay for modal
 */
export function ModalBackdrop({ onClick }) {
    return (
        <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={onClick}
            aria-hidden="true"
        />
    );
}

/**
 * ModalHeader Component
 * Standard modal header with title and close button
 */
export function ModalHeader({ title, showCloseButton, onClose }) {
    if (!title && !showCloseButton) return null;

    return (
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            {title && (
                <h2 id="modal-title" className="text-xl sm:text-2xl font-bold text-gray-900 pr-8">
                    {title}
                </h2>
            )}
            {showCloseButton && (
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    aria-label="Close modal"
                    type="button"
                >
                    <FiX className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}

/**
 * ModalContent Component
 * Scrollable content area
 */
export function ModalContent({ children }) {
    return (
        <div className="overflow-y-auto max-h-[calc(90vh-8rem)] p-6">
            {children}
        </div>
    );
}

/**
 * ModalFooterWrapper Component
 * Footer container for actions
 */
export function ModalFooterWrapper({ children }) {
    if (!children) return null;

    return (
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
            {children}
        </div>
    );
}
