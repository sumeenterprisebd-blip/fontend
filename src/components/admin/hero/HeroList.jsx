import HeroCard from './HeroCard';

/**
 * HeroList Component
 * Responsibility: Render list of hero cards
 * Pure UI component - no logic
 */
export default function HeroList({ heroes, onEdit, onDelete, onToggleStatus, onPriorityChange }) {
    return (
        <div className="grid grid-cols-1 gap-6">
            {heroes.map((hero) => (
                <HeroCard
                    key={hero._id}
                    hero={hero}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleStatus={onToggleStatus}
                    onPriorityChange={onPriorityChange}
                />
            ))}
        </div>
    );
}
