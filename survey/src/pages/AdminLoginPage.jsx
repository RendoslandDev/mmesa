import React, { useState } from 'react';
import { Lock, AlertCircle, Loader, ArrowRight } from 'lucide-react';
import { apiCall } from '../services/api'; // use the new api.js

export const AdminLoginPage = ({ onLoginSuccess, onNavigate }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Use a relative URL so the browser targets the same origin (allowing your dev server proxy
            // to forward requests to the backend), which avoids CORS issues when configured.
            const res = await fetch('https://mmesa-server.vercel.app/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                // Try to read error body for a clearer message
                const errText = await res.text().catch(() => null);
                throw new Error(errText || `Request failed with status ${res.status}`);
            }

            const response = await res.json();

            if (response.success) {
                localStorage.setItem('adminToken', response.token);
                localStorage.setItem('adminUser', JSON.stringify(response.admin));
                onLoginSuccess(response.token, response.admin);
                onNavigate('admin-dashboard');
            } else {
                setError(response.error || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold">Admin Portal</h1>
                    <p className="text-gray-600 mt-2">MMESA Survey Results</p>
                </div>

                {error && (
                    <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isLoading}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-black focus:ring-1 focus:ring-black outline-none transition disabled:bg-gray-100"
                            placeholder="Enter username"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-black focus:ring-1 focus:ring-black outline-none transition disabled:bg-gray-100"
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-black text-white px-6 py-4 rounded-full font-bold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                        {isLoading ? (
                            <>
                                <Loader className="animate-spin" size={20} />
                                Logging in...
                            </>
                        ) : (
                            <>
                                Login
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <button
                    onClick={() => onNavigate('home')}
                    disabled={isLoading}
                    className="w-full mt-4 px-6 py-3 border-2 border-gray-300 rounded-full font-medium hover:bg-gray-50 transition disabled:opacity-50"
                >
                    Back to Survey
                </button>
                {/* 
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-900">
                        <strong>Demo Credentials:</strong><br />
                        Username: admin<br />
                        Password: admin123
                    </p>
                </div> */}
            </div>
        </div>
    );
};
