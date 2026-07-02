export default function CheckoutFormField({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  type = 'text',
  placeholder,
  error,
  required = false,
  className = ''
}) {
  const inputClasses = `w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${error
      ? 'border-red-400 focus:ring-red-400 focus:border-red-500 bg-red-50'
      : 'border-gray-200 focus:ring-gray-800 focus:border-gray-800 bg-gray-50 hover:border-gray-300'
    } ${className}`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2.5">
        {label}
        {required && <span className="text-red-500 font-normal ml-1">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={inputClasses}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

