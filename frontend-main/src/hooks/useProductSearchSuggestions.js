import { useEffect, useMemo, useRef, useState } from "react";
import { searchAPI } from "@/services/api";
import { sanitizeSearchQuery } from "@/utils/searchQuery";

const normalizeProducts = (rawProducts = []) => {
    return rawProducts
        .map((product) => {
            const id = product?._id || product?.id;
            const slug = product?.slug;
            const name = product?.name || product?.title || "";
            const price = Number(product?.price || 0);
            const image = Array.isArray(product?.images) && product.images[0]
                ? product.images[0]
                : product?.image || "/logo.jpeg";

            return {
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

const matchesQuery = (product, query) => {
    const text = String(query || "").toLowerCase().trim();
    if (!text) return true;
    const haystack = String(product?.name || "").toLowerCase();
    return text.split(/\s+/).every((t) => t && haystack.includes(t));
};

const getBestPrefixCached = (cache, query) => {
    if (!cache || cache.size === 0) return null;

    let bestKey = null;
    for (const key of cache.keys()) {
        if (typeof key !== "string") continue;
        if (query.startsWith(key) && (!bestKey || key.length > bestKey.length)) {
            bestKey = key;
        }
    }

    if (!bestKey) return null;
    return { key: bestKey, value: cache.get(bestKey) };
};

export function useProductSearchSuggestions(rawQuery, options = {}) {
    const {
        limit = 6,
        debounceMs = 100,
        minChars = 2,
    } = options;

    const sanitizedQuery = useMemo(() => sanitizeSearchQuery(rawQuery), [rawQuery]);

    const [debouncedQuery, setDebouncedQuery] = useState(sanitizedQuery);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const cacheRef = useRef(new Map());
    const abortRef = useRef(null);
    const requestSeqRef = useRef(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(sanitizedQuery);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [sanitizedQuery, debounceMs]);

    useEffect(() => {
        const query = debouncedQuery;

        if (query.length < minChars) {
            abortRef.current?.abort?.();
            setResults([]);
            setLoading(false);
            return undefined;
        }

        const cached = cacheRef.current.get(query);
        if (cached) {
            setResults(cached);
            setLoading(false);
            return undefined;
        }

        // Instant UX: show best prefix-cached results immediately while we fetch the exact query.
        const prefixCached = getBestPrefixCached(cacheRef.current, query);
        if (prefixCached?.value?.length) {
            const optimistic = prefixCached.value
                .filter((p) => matchesQuery(p, query))
                .slice(0, limit);
            if (optimistic.length) setResults(optimistic);
        }

        const controller = new AbortController();
        abortRef.current?.abort?.();
        abortRef.current = controller;

        const requestSeq = ++requestSeqRef.current;

        const run = async () => {
            try {
                setLoading(true);
                const res = await searchAPI.suggest(
                    { q: query, limit },
                    { signal: controller.signal }
                );

                if (requestSeq !== requestSeqRef.current) return;

                const normalized = normalizeProducts(res?.data?.results || []);
                cacheRef.current.set(query, normalized);
                setResults(normalized);
            } catch (e) {
                if (controller.signal.aborted) return;
                setResults([]);
            } finally {
                if (requestSeq === requestSeqRef.current) setLoading(false);
            }
        };

        run();

        return () => {
            controller.abort();
        };
    }, [debouncedQuery, limit, minChars]);

    return {
        query: sanitizedQuery,
        debouncedQuery,
        results,
        loading,
    };
}
