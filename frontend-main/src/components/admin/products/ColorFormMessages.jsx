import { FiCheck } from 'react-icons/fi';

/**
 * ColorFormMessages Component
 * Success and error messages for color form
 */
export default function ColorFormMessages({ success, error }) {
    if (!success && !error) return null;

    return (
        <>
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-pulse">
                    <FiCheck className="text-green-600" size={20} />
                    <span className="font-medium">Color added successfully!</span>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}
        </>
    );
}
