import { useMemo, useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiSearch } from '@react-icons/all-files/fi/FiSearch';
import { FiX } from '@react-icons/all-files/fi/FiX';
import { sanitizeSearchQuery } from '@/utils/searchQuery';
import OptimizedImage from '@/components/shared/OptimizedImage';
import { useProductSearchSuggestions } from '@/hooks/useProductSearchSuggestions';

export default function NavbarSearch() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef(null);

  const sanitized = useMemo(() => sanitizeSearchQuery(searchValue), [searchValue]);
  const { results, loading } = useProductSearchSuggestions(sanitized, { limit: 6, debounceMs: 150, minChars: 2 });
  const showPanel = isOpen && sanitized.length >= 2;

  // Only render after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!showPanel) setActiveIndex(-1);
  }, [showPanel]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickAway = (e) => {
      const root = rootRef.current;
      if (!root) return;
      if (!root.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickAway);
    return () => document.removeEventListener('mousedown', handleClickAway);
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = sanitizeSearchQuery(searchValue);
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}&page=1`);
      setSearchValue('');
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setSearchValue('');
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      return;
    }

    if (!showPanel) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => {
        const next = prev + 1;
        return next >= results.length ? 0 : next;
      });
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => {
        const next = prev - 1;
        return next < 0 ? results.length - 1 : next;
      });
    }

    if (e.key === 'Enter' && activeIndex >= 0 && results[activeIndex]) {
      e.preventDefault();
      const item = results[activeIndex];
      router.push(item.link);
      setSearchValue('');
      setIsOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8">
      <form onSubmit={handleSubmit} className="relative w-full" suppressHydrationWarning>
        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
        <input
          type="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            setTimeout(() => {
              const root = rootRef.current;
              if (!root) return;
              if (!root.contains(document.activeElement)) setIsOpen(false);
            }, 0);
          }}
          onKeyDown={handleKeyDown}
          maxLength={64}
          placeholder="Search products by name or title..."
          className="w-full pl-12 pr-10 py-3 rounded-full bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0a1a44]/30 focus:border-[#0a1a44]/40 transition-all text-gray-900 placeholder-gray-400 shadow-sm"
          aria-label="Search for products"
          suppressHydrationWarning
        />
        {mounted && searchValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Clear search"
          >
            <FiX className="w-4 h-4 text-gray-500" />
          </button>
        )}

        {mounted && showPanel && (
          <div
            className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden z-50"
            role="listbox"
            aria-label="Search suggestions"
            onMouseDown={(e) => {
              // Keep focus on input so click doesn't close panel before navigation
              e.preventDefault();
            }}
          >
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {loading ? 'Searching…' : results.length > 0 ? 'Products' : 'No results'}
              </p>
              <Link
                href={`/search?q=${encodeURIComponent(sanitized)}&page=1`}
                prefetch={false}
                className="text-sm font-semibold text-[#0a1a44] hover:underline"
                onClick={() => {
                  setSearchValue('');
                  setIsOpen(false);
                }}
              >
                View all
              </Link>
            </div>

            {loading && (
              <div className="px-4 py-4">
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="mt-3 h-3 w-40 bg-gray-200 rounded animate-pulse" />
              </div>
            )}

            {!loading && results.length === 0 && (
              <div className="px-4 py-4 text-sm text-gray-600">
                No products found for “{sanitized}”.
              </div>
            )}

            {!loading && results.length > 0 && (
              <ul className="max-h-80 overflow-auto">
                {results.map((item, idx) => {
                  const active = idx === activeIndex;
                  return (
                    <li key={item.id} role="option" aria-selected={active}>
                      <Link
                        href={item.link}
                        prefetch={false}
                        className={`no-underline hover:no-underline flex items-center gap-3 px-4 py-3 transition-colors ${active ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => {
                          setSearchValue('');
                          setIsOpen(false);
                        }}
                      >
                        <div className="shrink-0 w-11 h-11 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                          <OptimizedImage
                            src={item.image}
                            alt={item.name}
                            width={44}
                            height={44}
                            className="w-11 h-11 object-cover"
                            cloudinaryOptions={{
                              width: 120,
                              quality: 'auto:best',
                              crop: 'fill',
                              gravity: 'auto',
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-600">৳{Number(item.price || 0).toFixed(2)}</p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

