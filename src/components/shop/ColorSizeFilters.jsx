import { FiCheck, FiChevronRight } from 'react-icons/fi';

/**
 * ColorSizeFilters Component
 * Color and size filter sections
 */
export default function ColorSizeFilters({
    sizes,
    selectedSizes,
    onSizeToggle,
    expandedSizes,
    onToggleSizes
}) {
    return (
        <>
            {/* Sizes */}
            <div className="mb-6 border-b pb-6">
                <button onClick={onToggleSizes} className="w-full flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Size</h3>
                    <FiChevronRight className={`w-5 h-5 transition-transform ${expandedSizes ? 'rotate-90' : ''}`} />
                </button>
                {expandedSizes && (
                    <div className="grid grid-cols-3 gap-2">
                        {sizes.map((s) => {
                            const sel = selectedSizes.includes(s);
                            return <button key={s} onClick={() => onSizeToggle(s)} className={`px-3 py-2 text-sm border rounded ${sel ? 'bg-black text-white' : 'bg-white'}`}>{s}</button>;
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
