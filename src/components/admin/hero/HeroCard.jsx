import {
    FiImage,
    FiEdit2,
    FiTrash2,
    FiToggleLeft,
    FiToggleRight,
    FiArrowUp,
    FiArrowDown,
} from 'react-icons/fi';

/**
 * HeroCard Component
 * Responsibility: Display single hero card with actions
 * Props only, no business logic
 */
export default function HeroCard({ hero, onEdit, onDelete, onToggleStatus, onPriorityChange }) {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="flex flex-col md:flex-row">
                {/* Image Preview */}
                <div className="w-full md:w-80 h-48 bg-gray-200 relative flex">
                    {Array.isArray(hero.images) && hero.images.length > 0 ? (
                        hero.images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`Hero ${idx + 1}`}
                                className="w-full h-full object-contain bg-gray-50"
                                style={{ zIndex: 1, position: 'absolute', left: 0, top: 0, opacity: idx === 0 ? 1 : 0.5 }}
                            />
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-full w-full">
                            <FiImage className="w-12 h-12 text-gray-400" />
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                        {hero.isActive ? (
                            <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                                Active
                            </span>
                        ) : (
                            <span className="px-3 py-1 bg-gray-500 text-white text-xs font-semibold rounded-full">
                                Inactive
                            </span>
                        )}
                    </div>

                    {/* Priority Badge */}
                    <div className="absolute top-2 left-2">
                        <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                            Priority: {hero.priority}
                        </span>
                    </div>
                </div>

                {/* Hero Details */}
                <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{hero.title}</h3>
                            {hero.subtitle && (
                                <p className="text-gray-600">{hero.subtitle}</p>
                            )}
                            {hero.description && (
                                <p className="text-sm text-gray-500 mt-2">{hero.description}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="text-sm text-gray-500">Text Alignment</p>
                            <p className="font-semibold capitalize">{hero.textAlignment}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">CTA Button</p>
                            <p className="font-semibold">{hero.ctaButtonText}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Impressions</p>
                            <p className="font-semibold">{hero.impressions}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Clicks</p>
                            <p className="font-semibold">{hero.clicks}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => onPriorityChange(hero, 'up')}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                            title="Increase priority"
                        >
                            <FiArrowUp size={18} />
                        </button>

                        <button
                            onClick={() => onPriorityChange(hero, 'down')}
                            disabled={hero.priority === 0}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Decrease priority"
                        >
                            <FiArrowDown size={18} />
                        </button>

                        <button
                            onClick={() => onToggleStatus(hero)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${hero.isActive
                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                        >
                            {hero.isActive ? (
                                <>
                                    <FiToggleRight size={18} />
                                    Deactivate
                                </>
                            ) : (
                                <>
                                    <FiToggleLeft size={18} />
                                    Activate
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => onEdit(hero)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all"
                        >
                            <FiEdit2 size={18} />
                            Edit
                        </button>

                        <button
                            onClick={() => onDelete(hero._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
                        >
                            <FiTrash2 size={18} />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
