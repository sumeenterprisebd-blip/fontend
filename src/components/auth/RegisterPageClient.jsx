import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { useAuth } from "@/contexts/AuthContext";
import {
  HiEye,
  HiEyeOff,
  HiMail,
  HiLockClosed,
  HiUser,
  HiPhone,
  HiCheckCircle,
  HiXCircle,
} from "react-icons/hi";
import { validatePhone, normalizePhone } from "@/utils/validation";

export default function RegisterPageClient() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    acceptTerms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { register } = useAuth();
  const router = useRouter();

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: 'Weak', color: 'red' };
    if (strength <= 3) return { strength, label: 'Fair', color: 'yellow' };
    if (strength <= 4) return { strength, label: 'Good', color: 'blue' };
    return { strength, label: 'Strong', color: 'green' };
  };

  // Validate individual field
  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        if (!value.trim()) return 'First name is required';
        if (value.trim().length < 2) return 'First name must be at least 2 characters';
        return '';
      case 'lastName':
        if (!value.trim()) return 'Last name is required';
        if (value.trim().length < 2) return 'Last name must be at least 2 characters';
        return '';
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'phone':
        return validatePhone(value);
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      case 'acceptTerms':
        if (!value) return 'You must accept the terms and conditions';
        return '';
      default:
        return '';
    }
  };

  // Handle field blur
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, formData[name]);
    setFieldErrors({ ...fieldErrors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Mark all fields as touched
    const allTouched = {
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      password: true,
      acceptTerms: true,
    };
    setTouched(allTouched);

    // Validate all fields
    const errors = {
      firstName: validateField('firstName', formData.firstName),
      lastName: validateField('lastName', formData.lastName),
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
      phone: validateField('phone', formData.phone),
      acceptTerms: validateField('acceptTerms', formData.acceptTerms),
    };

    setFieldErrors(errors);

    // Check if any errors exist
    const hasErrors = Object.values(errors).some(error => error !== '');
    if (hasErrors) {
      setError('Please fix the errors above');
      return;
    }

    setLoading(true);

    try {
      // Remove acceptTerms before sending to API
      const { acceptTerms, ...registerData } = formData;
      registerData.phone = normalizePhone(registerData.phone);
      const result = await register(registerData);

      if (result.success) {
        router.push('/');
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: fieldValue });

    // Clear errors when user starts typing
    if (error) setError('');
    if (touched[name]) {
      const error = validateField(name, fieldValue);
      setFieldErrors({ ...fieldErrors, [name]: error });
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <>
      <Head>
        <title>Create Account | Sume Traders</title>
        <meta name="description" content="Create your Sume Traders account" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Sume Traders
              </div>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Your Account
            </h2>
            <p className="text-gray-600">
              Join us and start your shopping journey
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg animate-shake">
                <div className="flex items-start">
                  <HiXCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      className={`block w-full pl-10 pr-10 py-3 border ${touched.firstName && fieldErrors.firstName
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                        } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={touched.firstName && fieldErrors.firstName ? 'true' : 'false'}
                      aria-describedby={touched.firstName && fieldErrors.firstName ? 'firstName-error' : undefined}
                    />
                    {touched.firstName && !fieldErrors.firstName && formData.firstName && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <HiCheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>
                  {touched.firstName && fieldErrors.firstName && (
                    <p id="firstName-error" className="mt-2 text-sm text-red-600 flex items-center">
                      <HiXCircle className="h-4 w-4 mr-1" />
                      {fieldErrors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      className={`block w-full pl-10 pr-10 py-3 border ${touched.lastName && fieldErrors.lastName
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                        } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={touched.lastName && fieldErrors.lastName ? 'true' : 'false'}
                      aria-describedby={touched.lastName && fieldErrors.lastName ? 'lastName-error' : undefined}
                    />
                    {touched.lastName && !fieldErrors.lastName && formData.lastName && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <HiCheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>
                  {touched.lastName && fieldErrors.lastName && (
                    <p id="lastName-error" className="mt-2 text-sm text-red-600 flex items-center">
                      <HiXCircle className="h-4 w-4 mr-1" />
                      {fieldErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={`block w-full pl-10 pr-10 py-3 border ${touched.email && fieldErrors.email
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                      } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={touched.email && fieldErrors.email ? 'true' : 'false'}
                    aria-describedby={touched.email && fieldErrors.email ? 'email-error' : undefined}
                  />
                  {touched.email && !fieldErrors.email && formData.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <HiCheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
                {touched.email && fieldErrors.email && (
                  <p id="email-error" className="mt-2 text-sm text-red-600 flex items-center">
                    <HiXCircle className="h-4 w-4 mr-1" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className={`block w-full pl-10 pr-10 py-3 border ${touched.phone && fieldErrors.phone
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                      } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                    placeholder="01XXXXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={touched.phone && fieldErrors.phone ? 'true' : 'false'}
                    aria-describedby={touched.phone && fieldErrors.phone ? 'phone-error' : undefined}
                  />
                  {touched.phone && !fieldErrors.phone && formData.phone && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <HiCheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
                {touched.phone && fieldErrors.phone && (
                  <p id="phone-error" className="mt-2 text-sm text-red-600 flex items-center">
                    <HiXCircle className="h-4 w-4 mr-1" />
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiLockClosed className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`block w-full pl-10 pr-10 py-3 border ${touched.password && fieldErrors.password
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                      } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={touched.password && fieldErrors.password ? 'true' : 'false'}
                    aria-describedby={touched.password && fieldErrors.password ? 'password-error' : 'password-strength'}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <HiEyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <HiEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {touched.password && fieldErrors.password ? (
                  <p id="password-error" className="mt-2 text-sm text-red-600 flex items-center">
                    <HiXCircle className="h-4 w-4 mr-1" />
                    {fieldErrors.password}
                  </p>
                ) : formData.password && (
                  <div id="password-strength" className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Password Strength:</span>
                      <span className={`text-xs font-medium text-${passwordStrength.color}-600`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 bg-${passwordStrength.color}-500`}
                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="acceptTerms"
                      name="acceptTerms"
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 transition-colors ${touched.acceptTerms && fieldErrors.acceptTerms ? 'border-red-500' : ''
                        }`}
                      aria-invalid={touched.acceptTerms && fieldErrors.acceptTerms ? 'true' : 'false'}
                      aria-describedby={touched.acceptTerms && fieldErrors.acceptTerms ? 'terms-error' : undefined}
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                      I agree to the{' '}
                      <Link href="/terms" className="font-medium text-purple-600 hover:text-purple-500 transition-colors">
                        Terms and Conditions
                      </Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="font-medium text-purple-600 hover:text-purple-500 transition-colors">
                        Privacy Policy
                      </Link>
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                  </div>
                </div>
                {touched.acceptTerms && fieldErrors.acceptTerms && (
                  <p id="terms-error" className="mt-2 text-sm text-red-600 flex items-center ml-7">
                    <HiXCircle className="h-4 w-4 mr-1" />
                    {fieldErrors.acceptTerms}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-purple-600 hover:text-purple-500 transition-colors">
              Sign In
            </Link>
          </p>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
