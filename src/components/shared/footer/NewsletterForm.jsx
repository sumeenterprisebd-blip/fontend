import { useState } from 'react';

export default function NewsletterForm({
  variant = 'light',
  title = 'Subscribe To Our Newsletter',
  description = '',
}) {
  const [email, setEmail] = useState('');
  const isDark = variant === 'dark';

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <div className="w-full">
      <h4 className={`text-base sm:text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
        {title}
      </h4>
      {description && (
        <p className={`text-sm mb-4 ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
          {description}
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Your Email"
          required
          className={`w-full sm:flex-1 px-4 py-3 sm:py-3 rounded-lg border focus:outline-none focus:ring-2 text-sm sm:text-base ${isDark
              ? 'bg-white/10 border-white/15 text-white placeholder-white/50 focus:ring-white/30 focus:border-white/30'
              : 'border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-teal-600 focus:border-transparent'
            }`}
          aria-label="Email address for newsletter subscription"
        />
        <button
          type="submit"
          className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap text-sm sm:text-base min-h-[44px] sm:min-h-0 ${isDark
              ? 'bg-white text-[#0a1a44] hover:bg-white/90'
              : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
          aria-label="Subscribe to newsletter"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}

