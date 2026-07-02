import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { useAuth } from "@/contexts/AuthContext";
import {
  HiEye,
  HiEyeOff,
  HiMail,
  HiLockClosed,
  HiCheckCircle,
  HiXCircle,
} from "react-icons/hi";
import { checkAPIConnection } from "@/utils/debug";
import { validateEmail, validatePassword, getErrorMessage } from "@/utils/validation";
import { FormError } from "@/components/shared/ErrorMessage";

const firstQueryParam = (value) => {
  if (Array.isArray(value)) return value[0] ?? "";
  if (typeof value === "string") return value;
  return "";
};

export default function LoginPageClient() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const normalizeRole = (role) => (typeof role === "string" ? role.toLowerCase() : "user");

  const getSafeNextPath = () => {
    const next = router?.query?.next;
    if (typeof next !== "string") return "";
    if (!next.startsWith("/")) return "";
    if (next.startsWith("//")) return "";
    return next;
  };


  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      try {
        const user = JSON.parse(storedUser);
        const role = normalizeRole(user?.role);
        if (role === "admin") {
          router.push("/admin");
        } else if (role === "moderator") {
          router.push("/admin/analytics");
        } else {
          const nextPath = getSafeNextPath();
          router.push(nextPath || "/");
        }
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    checkAPIConnection().then((result) => {
      setApiStatus(result.success);
    });
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        return validateEmail(value);
      case "password":
        return validatePassword(value);
      default:
        return "";
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    if (hasSubmitted) {
      const fieldError = validateField(name, formData[name]);
      setFieldErrors({ ...fieldErrors, [name]: fieldError });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setHasSubmitted(true);
    setTouched({ email: true, password: true });

    const emailError = validateField("email", formData.email);
    const passwordError = validateField("password", formData.password);
    setFieldErrors({ email: emailError, password: passwordError });

    if (emailError || passwordError) {
      setError("Please fix the errors above");
      return;
    }

    setLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        const user = result.user;
        const role = normalizeRole(user?.role);
        if (role === "admin") {
          router.push("/admin");
        } else if (role === "moderator") {
          router.push("/admin/analytics");
        } else {
          const nextPath = getSafeNextPath();
          router.push(nextPath || "/");
        }
      } else {
        setError(result.message || "Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError("");
    if (hasSubmitted && touched[name]) {
      const fieldError = validateField(name, value);
      setFieldErrors({ ...fieldErrors, [name]: fieldError });
    }
  };

  return (
    <>
      <Head>
        <title>Sign In | DeshWear</title>
        <meta name="description" content="Sign in to your DeshWear account" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DeshWear
              </div>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to continue your shopping experience</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {apiStatus === false && (
              <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                <div className="flex items-start">
                  <HiXCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-yellow-700">
                    Cannot connect to server. Please ensure the backend is running.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg animate-shake">
                <div className="flex items-start">
                  <HiXCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
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
                    className={`block w-full pl-10 pr-10 py-3 border ${
                      hasSubmitted && touched.email && fieldErrors.email
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={hasSubmitted && touched.email && fieldErrors.email ? "true" : "false"}
                    aria-describedby={hasSubmitted && touched.email && fieldErrors.email ? "email-error" : undefined}
                  />
                  {hasSubmitted && touched.email && !fieldErrors.email && formData.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <HiCheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
                <FormError message={hasSubmitted && touched.email && fieldErrors.email} />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiLockClosed className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className={`block w-full pl-10 pr-10 py-3 border ${
                      hasSubmitted && touched.password && fieldErrors.password
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={
                      hasSubmitted && touched.password && fieldErrors.password ? "true" : "false"
                    }
                    aria-describedby={
                      hasSubmitted && touched.password && fieldErrors.password ? "password-error" : undefined
                    }
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <HiEyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <HiEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <FormError message={hasSubmitted && touched.password && fieldErrors.password} />

                <div className="mt-2 text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
            >
              Create Account
            </Link>
          </p>

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

