export default function FormField({
  id,
  name,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  isEditing,
  error,
  required = false,
  icon: Icon,
  className = '',
  disabled = false
}) {
  const inputClasses = `w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-sm sm:text-base ${
    error
      ? 'border-red-400 focus:ring-red-400 focus:border-red-500 bg-red-50'
      : 'border-gray-200 focus:ring-black focus:border-black bg-gray-50 hover:border-gray-300'
  } ${className}`;

  return (
    <div>
      <label 
        htmlFor={id} 
        className={`${Icon ? 'flex items-center gap-2' : 'block'} text-xs sm:text-sm font-semibold text-gray-700 mb-2`}
      >
        {Icon && <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {isEditing ? (
        <>
          <input
            type={type}
            id={id}
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            className={`${inputClasses} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            autoComplete={type === 'email' ? 'email' : type === 'tel' ? 'tel' : 'off'}
          />
          {error && (
            <p id={`${id}-error`} className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-center gap-1 animate-fadeIn">
              <span>⚠</span> {error}
            </p>
          )}
        </>
      ) : (
        <p className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg sm:rounded-xl text-gray-900 font-medium text-sm sm:text-base min-h-[2.75rem] sm:min-h-[3rem] flex items-center">
          {value || <span className="text-gray-400 italic">Not provided</span>}
        </p>
      )}
    </div>
  );
}

