import TopCategorySectionView from './TopCategorySectionView';
import { useCategories } from '@/hooks/useCategories';

export default function TopCategorySection({ initialCategories = [] }) {
    const { categories, loading } = useCategories({
        onlyWithActiveProducts: false,
        initialCategories,
        enabled: true,
        // Ensure new categories show up without waiting for ISR window.
        refreshOnMount: true,
    });

    return <TopCategorySectionView categories={categories} loading={loading} />;
}
