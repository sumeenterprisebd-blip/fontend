import { CardSkeleton } from './CardSkeleton';
import { TableSkeleton } from './TableSkeleton';

export function PageSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 p-6 animate-pulse">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="h-8 bg-gray-300 rounded w-1/4"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
                <div className="bg-white rounded-lg p-6">
                    <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                    <TableSkeleton />
                </div>
            </div>
        </div>
    );
}
