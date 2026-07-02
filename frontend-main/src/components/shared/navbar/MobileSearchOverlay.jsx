import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiSearch } from '@react-icons/all-files/fi/FiSearch';
import { FiX } from '@react-icons/all-files/fi/FiX';
import OptimizedImage from '@/components/shared/OptimizedImage';
import { sanitizeSearchQuery } from '@/utils/searchQuery';
import { useProductSearchSuggestions } from '@/hooks/useProductSearchSuggestions';

export default function MobileSearchOverlay({
  isOpen,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onClose
}) {
  const router = useRouter();
  const searchInputRef = useRef(null);

  const sanitized = sanitizeSearchQuery(searchValue);
  const { results, loading } = useProductSearchSuggestions(sanitized, { limit: 6, debounceMs: 150, minChars: 2 });
  const showPanel = sanitized.length >= 2;

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-9998 animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-2xl z-9999 animate-slideDown rounded-b-2xl">
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-lg font-bold text-gray-900">Search Products</h3>
            <button
              onClick={onClose}
              className="ml-auto p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-label="Close search"
            >
              <FiX className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <form onSubmit={onSearchSubmit} className="relative" suppressHydrationWarning>
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={searchInputRef}
              type="search"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              maxLength={64}
              placeholder="Search products by name or title..."
              className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-gray-50 border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-black focus:bg-white transition-all duration-200 text-base text-gray-900 placeholder-gray-400"
              aria-label="Search for products"
              suppressHydrationWarning
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Clear search"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </form>

          {showPanel && (
            <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden bg-white">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {loading ? 'Searching…' : results.length > 0 ? 'Products' : 'No results'}
                </p>
                <Link
                  href={`/search?q=${encodeURIComponent(sanitized)}&page=1`}
                  prefetch={false}
                  className="text-sm font-semibold text-black hover:underline"
                  onClick={() => {
                    onClose();
                    onSearchChange('');
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
                <div className="max-h-80 overflow-auto">
                  {results.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        router.push(item.link);
                        onSearchChange('');
                        onClose();
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
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {searchValue && (
            <button
              onClick={onSearchSubmit}
              className="mt-3 w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all duration-200"
            >
              Search
            </button>
          )}
        </div>
      </div>
    </>
  );
}

