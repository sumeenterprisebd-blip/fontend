import Link from 'next/link';

export default function Pagination({ currentPage, totalPages, basePath = '/shop', query = {} }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const buildHref = (page) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      if (Array.isArray(value)) {
        value.forEach((val) => params.append(key, String(val)));
        return;
      }
      params.set(key, String(value));
    });
    params.set('page', String(page));
    return `${basePath}?${params.toString()}`;
  };

  const PreviousButton = currentPage === 1 ? (
    <span className="px-4 py-2 rounded-lg border border-gray-300 text-gray-400 cursor-not-allowed">
      ← Previous
    </span>
  ) : (
    <Link
      href={buildHref(currentPage - 1)}
      className="px-4 py-2 rounded-lg border border-gray-300 text-black hover:bg-gray-50 transition-colors"
    >
      ← Previous
    </Link>
  );

  const NextButton = currentPage === totalPages ? (
    <span className="px-4 py-2 rounded-lg border border-gray-300 text-gray-400 cursor-not-allowed">
      Next →
    </span>
  ) : (
    <Link
      href={buildHref(currentPage + 1)}
      className="px-4 py-2 rounded-lg border border-gray-300 text-black hover:bg-gray-50 transition-colors"
    >
      Next →
    </Link>
  );

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {PreviousButton}

      <div className="flex items-center gap-2">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                ...
              </span>
            );
          }

          const isActive = page === currentPage;
          return (
            <Link
              key={page}
              href={buildHref(page)}
              className={`px-4 py-2 rounded-lg border transition-colors ${isActive
                  ? 'bg-black text-white border-black'
                  : 'border-gray-300 text-black hover:bg-gray-50'
                }`}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {NextButton}
    </div>
  );
}

