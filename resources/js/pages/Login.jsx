import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(form.email, form.password);
            navigate(user.role === 'admin' ? '/admin' : '/');
        } catch (err) {
            setError(err.response?.data?.message || 'Email sau parola incorecta.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] bg-gray-50 mesh-bg flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md" style={{ animation: 'slide-up 0.4s ease-out' }}>
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h1 className="font-['Oswald'] text-2xl font-bold uppercase tracking-wide">Autentificare</h1>
                    <p className="text-gray-400 text-sm mt-1">Intra in contul tau PadelMarket</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-3.5 rounded-xl mb-5 text-sm flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition text-sm"
                                placeholder="email@exemplu.ro"
                                required
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider">Parola</label>
                                <Link to="/forgot-password" className="text-[11px] text-green-600 hover:text-green-700 font-medium">
                                    Am uitat parola
                                </Link>
                            </div>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition text-sm"
                                placeholder="Parola ta"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3.5 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-green-500/25 disabled:opacity-50"
                        >
                            {loading ? 'Se autentifica...' : 'Intra in cont'}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-5 text-sm text-gray-400">
                    Nu ai cont?{' '}
                    <Link to="/register" className="text-green-500 hover:text-green-600 font-semibold transition">Creaza unul acum</Link>
                </p>
            </div>
        </div>
    );
}
