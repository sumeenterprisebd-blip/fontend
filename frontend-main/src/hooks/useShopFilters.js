import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { productsAPI } from "@/services/api";
import { sanitizeSearchQuery } from "@/utils/searchQuery";

export function useShopFilters(options = {}) {
  const {
    initialProducts = [],
    initialSearchQuery = "",
    initialTotalPages = 1,
    initialTotalProducts = 0,
    initialSort = "newest",
  } = options;
  const router = useRouter();
  const currentPage = parseInt(router.query.page) || 1;
  const itemsPerPage = 20;

  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(initialProducts.length === 0);
  const [totalPages, setTotalPages] = useState(initialTotalPages || 1);
  const [totalProducts, setTotalProducts] = useState(initialTotalProducts || initialProducts.length);
  const [filters, setFilters] = useState({
    categories: [],
    price: { min: null, max: null },
    sizes: [],
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [searchQuery, setSearchQuery] = useState(() => sanitizeSearchQuery(initialSearchQuery));
  const [debouncedSearch, setDebouncedSearch] = useState(() => sanitizeSearchQuery(initialSearchQuery));
  const [sortBy, setSortBy] = useState(initialSort || "newest");
  const skipInitialFetchRef = useRef(initialProducts.length > 0);

  // Keep search state in sync with URL (e.g., when navigating from Navbar)
  useEffect(() => {
    if (!router.isReady) return;
    const urlSearch = sanitizeSearchQuery(typeof router.query.search === "string" ? router.query.search : "");
    const stateSearch = sanitizeSearchQuery(searchQuery);

    if (urlSearch !== stateSearch) {
      setSearchQuery(urlSearch);
      setDebouncedSearch(urlSearch);
    }
  }, [router.isReady, router.query.search, searchQuery]);

  // Parse URL category parameter
  const urlCategories = useMemo(() => {
    // Backward compatibility: Home used to pass `categoryFirst`.
    const categoryParam = router.query.category ?? router.query.categoryFirst;
    if (!categoryParam) return null;
    return Array.isArray(categoryParam)
      ? categoryParam
      : String(categoryParam)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
  }, [router.query.category, router.query.categoryFirst]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(sanitizeSearchQuery(searchQuery));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Reflect debounced search in the URL for consistent UX + shareable links
  useEffect(() => {
    if (!router.isReady) return;
    const urlSearch = sanitizeSearchQuery(typeof router.query.search === "string" ? router.query.search : "");
    if (debouncedSearch === urlSearch) return;

    const newQuery = { ...router.query, page: "1" };
    if (debouncedSearch) {
      newQuery.search = debouncedSearch;
    } else {
      delete newQuery.search;
    }

    router.replace({ pathname: router.pathname, query: newQuery }, undefined, {
      shallow: true,
    });
  }, [debouncedSearch, router]);

  const mapSizes = (sizes = []) => {
    const sizeMap = { Small: "S", Medium: "M", Large: "L" };
    return sizes.map((size) => sizeMap[size] || size);
  };

  // Fetch products from API (server-driven pagination)
  useEffect(() => {
    if (skipInitialFetchRef.current) {
      skipInitialFetchRef.current = false;
      return undefined;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const categoriesToUse = urlCategories ?? appliedFilters.categories;
        const params = {
          limit: itemsPerPage,
          page: currentPage,
          sort: sortBy || "newest",
        };

        if (debouncedSearch) {
          params.search = debouncedSearch;
        }

        if (categoriesToUse?.length > 0) {
          params.category = categoriesToUse;
        }

        if (appliedFilters.price?.min !== null && appliedFilters.price?.min !== undefined && appliedFilters.price?.min !== "") {
          params.minPrice = appliedFilters.price.min;
        }

        if (appliedFilters.price?.max !== null && appliedFilters.price?.max !== undefined && appliedFilters.price?.max !== "") {
          params.maxPrice = appliedFilters.price.max;
        }

        if (appliedFilters.sizes?.length > 0) {
          params.size = mapSizes(appliedFilters.sizes);
        }

        const response = await productsAPI.getProducts(params);
        const fetchedProducts = response.data.products || [];

        const transformedProducts = fetchedProducts
          .map((product) => {
            const categoryName = typeof product.category === "string"
              ? product.category
              : product.category?.name || "";

            return ({
              id: product._id,
              _id: product._id,
              name: product.name,
              title: product.title || product.name,
              image:
                product.images && product.images[0]
                  ? product.images[0]
                  : "/logo.jpeg",
              rating: product.rating || 0,
              price: Number(product.price || 0),
              originalPrice:
                product.originalPrice !== undefined && product.originalPrice !== null
                  ? Number(product.originalPrice)
                  : null,
              discount:
                product.discount !== undefined && product.discount !== null
                  ? Number(product.discount)
                  : null,
              link: `/product/${product.slug || product._id}`,
              category: categoryName,
              color: Array.isArray(product.colors)
                ? (typeof product.colors[0] === "string"
                  ? product.colors[0].toLowerCase()
                  : product.colors[0]?.name
                    ? String(product.colors[0].name).toLowerCase()
                    : "")
                : "",
              colors: Array.isArray(product.colors)
                ? product.colors
                  .map((c) => (typeof c === "string" ? c : c?.name))
                  .filter(Boolean)
                : [],
              size: product.sizes || [],
              sizes: product.sizes || [],
              dressStyle: product.dressStyle || "Casual",
              stock: Number(product.stock || 0),
              isActive: product.isActive !== false,
              slug: product.slug,
              createdAt: product.createdAt,
            });
          })
          .filter((product) => product.isActive);

        setProducts(transformedProducts);
        setTotalPages(response.data.pages || 1);
        setTotalProducts(response.data.total || transformedProducts.length);
      } catch (error) {
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearch, appliedFilters, urlCategories, currentPage, sortBy]);

  // Sync filters with URL categories on mount
  useEffect(() => {
    if (urlCategories?.length > 0) {
      setFilters((prev) => ({ ...prev, categories: urlCategories }));
      setAppliedFilters((prev) => ({ ...prev, categories: urlCategories }));
    } else {
      setFilters((prev) => ({ ...prev, categories: [] }));
      setAppliedFilters((prev) => ({ ...prev, categories: [] }));
    }
  }, [urlCategories]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    const newQuery = { ...router.query, page: "1" };
    router.replace({ pathname: router.pathname, query: newQuery }, undefined, {
      shallow: true,
    });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    const newQuery = { ...router.query, page: "1" };
    router.replace({ pathname: router.pathname, query: newQuery }, undefined, {
      shallow: true,
    });
  };

  const filteredProducts = useMemo(() => products, [products]);

  const handleSearchClear = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    const newQuery = { ...router.query, page: "1" };
    delete newQuery.search;
    router.replace({ pathname: router.pathname, query: newQuery }, undefined, {
      shallow: true,
    });
  };

  return {
    currentPage,
    itemsPerPage,
    filters,
    appliedFilters,
    searchQuery,
    filteredProducts,
    totalPages,
    totalProducts,
    loading,
    handleFilterChange,
    handleApplyFilters,
    handleSortChange,
    setSearchQuery,
    handleSearchClear,
    sortBy,
    setSortBy,
  };
}
