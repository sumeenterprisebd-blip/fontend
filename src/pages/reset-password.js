
import { useState } from 'react';
import { useRouter } from 'next/router';
import api, { authAPI } from '@/services/api';
import { API_ENDPOINTS } from '@/config/api';
import { HiLockClosed, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';

export default function ResetPassword() {
    const router = useRouter();
    const { token } = router.query;
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (password !== confirm) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const res = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, password });
            const data = res?.data;
            if (data?.success) {
                setSuccess('Password reset successful! Logging you in...');
                // Auto-login after reset
                const loginRes = await authAPI.login({ email: data.email, password });
                if (loginRes.data && loginRes.data.token) {
                    localStorage.setItem('token', loginRes.data.token);
                    localStorage.setItem('user', JSON.stringify(loginRes.data.user));
                    setTimeout(() => {
                        router.push('/');
                    }, 1200);
                } else {
                    setSuccess('Password reset successful! Please log in.');
                    setTimeout(() => router.push('/login'), 1200);
                }
            } else {
                setError(data?.message || 'Reset failed.');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 relative overflow-hidden">
                <div className="flex flex-col items-center mb-8">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full shadow-lg mb-3">
                        <HiLockClosed className="h-8 w-8 text-white" />
                    </span>
                    <h2 className="text-3xl font-extrabold text-center mb-2 text-blue-700 tracking-tight">Reset Your Password</h2>
                    <p className="text-gray-500 text-center text-base">Create a new password for your Sume Traders account.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input
                            type="password"
                            className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors text-lg"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            minLength={6}
                            placeholder="Enter new password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors text-lg"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            required
                            minLength={6}
                            placeholder="Confirm new password"
                        />
                    </div>
                    {error && (
                        <div className="flex items-center p-3 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-sm">
                            <HiExclamationCircle className="h-5 w-5 mr-2" /> {error}
                        </div>
                    )}
                    {success && (
                        <div className="flex items-center p-3 bg-green-50 border-l-4 border-green-500 rounded text-green-700 text-sm">
                            <HiCheckCircle className="h-5 w-5 mr-2" /> {success}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        disabled={loading}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}
