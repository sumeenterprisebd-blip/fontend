/**
 * Inline Form Error Message (below input fields)
 */
export function FormError({ message, className = '' }) {
    if (!message) return null;

    return (
        <p className={`text-sm text-red-600 mt-1 ${className}`}>
            {message}
        </p>
    );
}
