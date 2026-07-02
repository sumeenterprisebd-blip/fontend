export default function ErrorMessage({ error }) {
  if (!error) return null;

  const isInfo = error.includes('not configured') || error.includes('enter image URLs manually');
  
  return (
    <div className={`px-4 py-3 rounded-lg ${
      isInfo
        ? 'bg-blue-50 border border-blue-200 text-blue-700'
        : 'bg-red-50 border border-red-200 text-red-700'
    }`}>
      <div className="flex items-start">
        <div className="shrink-0">
          {isInfo ? (
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm whitespace-pre-line">{error}</p>
        </div>
      </div>
    </div>
  );
}

