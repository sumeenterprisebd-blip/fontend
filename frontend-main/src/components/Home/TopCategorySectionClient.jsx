import { useCategories } from "@/hooks/useCategories";
import TopCategorySectionView from "./TopCategorySectionView";

export default function TopCategorySectionClient({ onlyWithActiveProducts = true }) {
    const { categories, loading } = useCategories({
        onlyWithActiveProducts,
        initialCategories: [],
        enabled: true,
    });

    return <TopCategorySectionView categories={categories} loading={loading} />;
}
