import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import api, { authAPI } from '@/services/api';
import { API_ENDPOINTS } from '@/config/api';
import {
    HiMail,
    HiCheckCircle,
    HiXCircle,
    HiKey,
    HiLockClosed,
    HiEye,
    HiEyeOff,
} from 'react-icons/hi';
import { FormError } from '@/components/shared/ErrorMessage';
import {
    validateEmail,
    validatePassword,
    validatePasswordMatch,
} from '@/utils/validation';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const cleanEmail = useMemo(() => email.trim().toLowerCase(), [email]);

    const normalizeRole = (role) => (typeof role === 'string' ? role.toLowerCase() : 'user');

    const getSafeNextPath = () => {
        const next = router?.query?.next;
        if (typeof next !== 'string') return '';
        if (!next.startsWith('/')) return '';
        if (next.startsWith('//')) return '';
        return next;
    };

    const showError = (msg) => {
        setSuccess('');
        setError(msg);
    };

    const showSuccess = (msg) => {
        setError('');
        setSuccess(msg);
    };

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const emailErr = validateEmail(cleanEmail);
        if (emailErr) {
            showError(emailErr);
            return;
        }

        setLoading(true);
        try {
            const res = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email: cleanEmail });
            showSuccess(res?.data?.message || 'If that email is registered, a verification code has been sent.');
            setStep(2);
        } catch {
            showError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const emailErr = validateEmail(cleanEmail);
        if (emailErr) {
            showError(emailErr);
            return;
        }
        const code = String(otp || '').trim();
        if (!/^[0-9]{6}$/.test(code)) {
            showError('OTP code must be 6 digits');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD_VERIFY_OTP, {
                email: cleanEmail,
                code,
            });

            if (res?.data?.success && res?.data?.resetToken) {
                setResetToken(res.data.resetToken);
                showSuccess('Code verified. You can now set a new password.');
                setStep(3);
            } else {
                showError(res?.data?.message || 'Invalid or expired verification code');
            }
        } catch (err) {
            showError(err?.response?.data?.message || 'Invalid or expired verification code');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const passErr = validatePassword(password);
        const confirmErr = validatePasswordMatch(password, confirm);
        if (passErr || confirmErr) {
            showError(passErr || confirmErr);
            return;
        }
        if (!resetToken) {
            showError('Reset session expired. Please start again.');
            setStep(1);
            return;
        }

        setLoading(true);
        try {
            const res = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
                token: resetToken,
                password,
            });

            if (res?.data?.success) {
                showSuccess('Password reset successful! Logging you in...');

                try {
                    const loginRes = await authAPI.login({
                        email: res?.data?.email || cleanEmail,
                        password,
                    });

                    if (loginRes?.data?.token) {
                        localStorage.setItem('token', loginRes.data.token);
                        localStorage.setItem('user', JSON.stringify(loginRes.data.user));

                        const role = normalizeRole(loginRes.data.user?.role);
                        const nextPath = getSafeNextPath();

                        if (role === 'admin') {
                            router.push('/admin');
                        } else if (role === 'moderator') {
                            router.push('/admin/analytics');
                        } else {
                            router.push(nextPath || '/');
                        }
                        return;
                    }
                } catch {
                    // Fall back to login if auto-login fails
                }

                showSuccess('Password reset successful! Please log in.');
                setTimeout(() => {
                    router.push('/login');
                }, 1200);
            } else {
                showError(res?.data?.message || 'Reset failed. Please try again.');
            }
        } catch (err) {
            showError(err?.response?.data?.message || 'Reset failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRestart = () => {
        setStep(1);
        setOtp('');
        setResetToken('');
        setPassword('');
        setConfirm('');
        setError('');
        setSuccess('');
    };

    return (
        <>
            <Head>
                <title>Forgot Password | Sume Traders</title>
            </Head>

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold mb-2 text-center">Forgot your password?</h2>
                    <p className="mb-6 text-gray-600 text-center">
                        {step === 1 && 'Enter your registered email to receive an OTP code.'}
                        {step === 2 && 'Enter the 6-digit OTP sent to your email.'}
                        {step === 3 && 'Set a new password for your account.'}
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-center">
                            <HiXCircle className="h-5 w-5 text-red-500 mr-2" />
                            <span className="text-sm text-red-700">{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 rounded-r-lg flex items-center">
                            <HiCheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-sm text-green-700">{success}</span>
                        </div>
                    )}

                    {step === 1 && (
                        <form onSubmit={handleRequestOtp} className="space-y-6" noValidate>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
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
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <FormError message={email && validateEmail(cleanEmail)} />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyOtp} className="space-y-6" noValidate>
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                                    OTP Code
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <HiKey className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="otp"
                                        name="otp"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors tracking-[0.35em]"
                                        placeholder="123456"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength={6}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>

                            <button
                                type="button"
                                onClick={handleRequestOtp}
                                disabled={loading}
                                className="w-full py-3 px-4 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Resend OTP
                            </button>

                            <button
                                type="button"
                                onClick={handleRestart}
                                className="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
                            >
                                Use a different email
                            </button>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-6" noValidate>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
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
                                        className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Enter new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700 transition-colors"
                                        onClick={() => setShowPassword((v) => !v)}
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
                                <FormError message={password && validatePassword(password)} />
                            </div>

                            <div>
                                <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirm"
                                        name="confirm"
                                        type={showConfirm ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        className="block w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Confirm new password"
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700 transition-colors"
                                        onClick={() => setShowConfirm((v) => !v)}
                                        aria-label={showConfirm ? 'Hide password' : 'Show password'}
                                        tabIndex={-1}
                                    >
                                        {showConfirm ? (
                                            <HiEyeOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <HiEye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                <FormError message={confirm && validatePasswordMatch(password, confirm)} />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <Link href="/login" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
