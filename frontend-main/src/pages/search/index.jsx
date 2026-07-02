import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import SEO from '@/components/shared/SEO';
import Breadcrumb from '@/components/shop/Breadcrumb';
import SearchInput from '@/components/search/SearchInput';
import SearchResults from '@/components/search/SearchResults';
import SearchEmptyState from '@/components/search/SearchEmptyState';
import Pagination from '@/components/shop/Pagination';
import { searchAPI } from '@/services/api';
import { sanitizeSearchQuery } from '@/utils/searchQuery';

const normalizeSearchProducts = (rawProducts = []) => {
    return (rawProducts || [])
        .map((product) => {
            const id = product?._id || product?.id;
            const slug = product?.slug;
            const name = product?.name || product?.title || '';
            const price = Number(product?.price || 0);
            const image = Array.isArray(product?.images) && product.images[0]
                ? product.images[0]
                : product?.image || '/logo.jpeg';

            return {
                ...product,
                _id: id,
                id,
                slug,
                name,
                price,
                image,
                link: `/product/${slug || id}`,
            };
        })
        .filter((p) => Boolean(p.id) && Boolean(p.name));
};

export default function SearchPage() {
    const router = useRouter();
    const { q } = router.query;
    // Use query parameter directly, fallback to empty string
    const urlQuery = typeof q === 'string' ? q : '';
    const urlPage = typeof router.query.page === 'string' ? router.query.page : '1';
    const urlSort = typeof router.query.sort === 'string' ? router.query.sort : '';

    const [searchQuery, setSearchQuery] = useState(urlQuery);
    const [sortBy, setSortBy] = useState(urlSort || 'relevance');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    useEffect(() => {
        setSearchQuery(urlQuery);
    }, [urlQuery]);

    useEffect(() => {
        setSortBy(urlSort || 'relevance');
    }, [urlSort]);

    const currentQuery = useMemo(() => sanitizeSearchQuery(urlQuery || searchQuery), [urlQuery, searchQuery]);
    const currentPage = useMemo(() => {
        const parsed = Number.parseInt(urlPage, 10);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
    }, [urlPage]);

    useEffect(() => {
        let mounted = true;
        const controller = new AbortController();

        const run = async () => {
            if (!currentQuery) {
                setProducts([]);
                setPagination({ page: 1, pages: 1, total: 0 });
                setLoading(false);
                setError('');
                return;
            }

            try {
                setLoading(true);
                setError('');

                const res = await searchAPI.search(
                    {
                        q: currentQuery,
                        sort: sortBy,
                        page: currentPage,
                        limit: 12,
                    },
                    { signal: controller.signal }
                );

                if (!mounted) return;

                const normalized = normalizeSearchProducts(res?.data?.products || []);
                setProducts(normalized);
                setPagination({
                    page: Number(res?.data?.page || currentPage),
                    pages: Number(res?.data?.pages || 1),
                    total: Number(res?.data?.total || 0),
                });
            } catch (e) {
                if (controller.signal.aborted) return;
                setProducts([]);
                setPagination({ page: currentPage, pages: 1, total: 0 });
                setError('Failed to load search results. Please try again.');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        run();

        return () => {
            mounted = false;
            controller.abort();
        };
    }, [currentQuery, sortBy, currentPage]);

    const handleSearch = (query) => {
        const sanitized = sanitizeSearchQuery(query);
        setSearchQuery(sanitized);

        const params = new URLSearchParams();
        if (sanitized) params.set('q', sanitized);
        params.set('page', '1');
        if (sortBy && sortBy !== 'relevance') params.set('sort', sortBy);
        router.push(`/search?${params.toString()}`, undefined, { shallow: true });
    };

    const handleSortChange = (nextSort) => {
        setSortBy(nextSort);

        const params = new URLSearchParams();
        if (currentQuery) params.set('q', currentQuery);
        params.set('page', '1');
        if (nextSort && nextSort !== 'relevance') params.set('sort', nextSort);
        router.push(`/search?${params.toString()}`, undefined, { shallow: true });
    };

    return (
        <>
            <SEO
                title={currentQuery ? `Search: ${currentQuery} - DeshWear` : 'Search Products - DeshWear'}
                description={currentQuery ? `Search results for "${currentQuery}". Find what you're looking for at DeshWear.` : 'Search our complete product catalog. Find clothing and accessories for every style.'}
                noindex={true}
            />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Breadcrumb
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Search', href: '/search' }
                        ]}
                    />

                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-black mb-4">Search Products</h1>
                        <SearchInput
                            searchQuery={urlQuery || searchQuery}
                            onSearchChange={setSearchQuery}
                            onSubmit={handleSearch}
                        />
                    </div>

                    {currentQuery ? (
                        <SearchResults
                            products={products}
                            searchQuery={currentQuery}
                            sortBy={sortBy}
                            onSortChange={handleSortChange}
                            total={pagination.total}
                            loading={loading}
                            error={error}
                        />
                    ) : (
                        <SearchEmptyState />
                    )}

                    {currentQuery && pagination.pages > 1 && (
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.pages}
                            basePath="/search"
                            query={{
                                q: currentQuery,
                                sort: sortBy && sortBy !== 'relevance' ? sortBy : undefined,
                            }}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
