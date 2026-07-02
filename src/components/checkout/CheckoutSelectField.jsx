export default function CheckoutSelectField({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  options,
  error,
  required = false
}) {
  const selectClasses = `w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 bg-white transition-all duration-200 appearance-none cursor-pointer ${error
    ? 'border-red-400 focus:ring-red-400 focus:border-red-500 bg-red-50'
    : 'border-gray-200 focus:ring-gray-800 focus:border-gray-800 bg-gray-50 hover:border-gray-300'
    }`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2.5">
        {label}
        {required && <span className="text-red-500 font-normal ml-1">*</span>}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={selectClasses}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 0.75rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem'
        }}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <option value="">-- Select {label} --</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

