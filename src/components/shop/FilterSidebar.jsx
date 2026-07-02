import { memo, useState, useEffect } from 'react';
import { filterSizes } from '../data/shopFiltersData';
import { useCategories } from '@/hooks/useCategories';
import CategoryFilter from './CategoryFilter';
import PriceFilter from './PriceFilter';
import ColorSizeFilters from './ColorSizeFilters';

function FilterSidebar({
  filters,
  onFilterChange,
  onApplyFilters,
  isMobileOpen,
  onMobileClose,
  onMobileOpen,
  initialCategories = [],
}) {
  const { categories: dynamicCategories, loading: categoriesLoading } = useCategories({
    onlyWithActiveProducts: true,
    initialCategories,
    enabled: initialCategories.length === 0,
  });
  const [expanded, setExpanded] = useState({ categories: true, price: true, size: true });
  const [priceInputs, setPriceInputs] = useState({
    min: filters.price?.min !== undefined && filters.price?.min !== null ? filters.price.min : '',
    max: filters.price?.max !== undefined && filters.price?.max !== null ? filters.price.max : ''
  });

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : 'unset';
    return () => (document.body.style.overflow = 'unset');
  }, [isMobileOpen]);

  // Sync local price inputs with filters when filters change externally
  useEffect(() => {
    // Only sync if filters have actual values, otherwise keep empty
    if (filters.price?.min !== undefined && filters.price?.min !== null) {
      setPriceInputs(prev => ({ ...prev, min: filters.price.min }));
    }
    if (filters.price?.max !== undefined && filters.price?.max !== null) {
      setPriceInputs(prev => ({ ...prev, max: filters.price.max }));
    }
  }, [filters.price]);

  const toggle = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleList = (key, value) => {
    const list = filters[key] || [];
    const updated = list.includes(value)
      ? list.filter((item) => item !== value)
      : [...list, value];
    onFilterChange({ ...filters, [key]: updated });
  };

  const handlePriceChange = (type, value) => {
    // Update local state immediately for responsive typing (allow empty string)
    setPriceInputs(prev => ({ ...prev, [type]: value }));

    // Parse and update parent state only if valid number
    if (value === '') {
      // Keep empty state - don't update parent until user types a valid number
      return;
    }

    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      onFilterChange({
        ...filters,
        price: { ...filters.price, [type]: numValue }
      });
    }
  };

  return (
    <>
      {!isMobileOpen && (
        <button onClick={onMobileOpen} className="lg:hidden fixed bottom-24 left-6 z-[80] bg-black text-white p-4 rounded-full shadow-lg flex items-center gap-2 hover:bg-gray-800 transition-all duration-200 active:scale-95">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 6h16" />
            <path d="M10 12h10" />
            <path d="M6 18h8" />
          </svg>
          <span className="font-semibold">Filters</span>
        </button>
      )}

      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] animate-fadeIn"
          onClick={onMobileClose}
        />
      )}

      <aside className={`w-full lg:w-80 bg-white p-6 rounded-lg border h-fit lg:sticky lg:top-24 ${isMobileOpen ? 'fixed inset-y-0 left-0 z-[75] w-[85vw] max-w-[360px] overflow-y-auto animate-slideInLeft' : 'hidden lg:block'}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Filters</h2>
          <button
            onClick={onMobileClose}
            className="lg:hidden text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            aria-label="Close filters"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="mb-6 border-b pb-6">
          <CategoryFilter
            categories={dynamicCategories}
            selectedCategories={filters.categories || []}
            onToggle={(name) => toggleList('categories', name)}
            expanded={expanded.categories}
            onToggleExpanded={() => toggle('categories')}
            loading={categoriesLoading}
          />
        </div>

        <PriceFilter
          priceInputs={priceInputs}
          onPriceChange={handlePriceChange}
          expanded={expanded.price}
          onToggleExpanded={() => toggle('price')}
        />

        <ColorSizeFilters
          sizes={filterSizes}
          selectedSizes={filters.sizes || []}
          onSizeToggle={(size) => toggleList('sizes', size)}
          expandedSizes={expanded.size}
          onToggleSizes={() => toggle('size')}
        />
        <button onClick={onApplyFilters} className="w-full bg-black text-white py-3 rounded-lg font-semibold">Apply Filter</button>
      </aside>
    </>
  );
}

export default memo(FilterSidebar);

