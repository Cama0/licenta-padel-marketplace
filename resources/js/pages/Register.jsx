import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', phone: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);
        try {
            await register(form);
            navigate('/');
        } catch (err) {
            if (err.response?.data?.errors) setErrors(err.response.data.errors);
            else setErrors({ general: [err.response?.data?.message || 'Eroare la inregistrare.'] });
        } finally {
            setLoading(false);
        }
    };

    const setField = (field, value) => setForm({ ...form, [field]: value });

    return (
        <div className="min-h-[80vh] bg-gray-50 mesh-bg flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md" style={{ animation: 'slide-up 0.4s ease-out' }}>
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className="font-['Oswald'] text-2xl font-bold uppercase tracking-wide">Creaza Cont</h1>
                    <p className="text-gray-400 text-sm mt-1">Alatura-te comunitatii PadelMarket</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                    {errors.general && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-3.5 rounded-xl mb-5 text-sm flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {errors.general[0]}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2">Nume complet</label>
                            <input type="text" value={form.name} onChange={(e) => setField('name', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition text-sm" placeholder="Ion Popescu" required />
                            {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2">Email</label>
                            <input type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition text-sm" placeholder="email@exemplu.ro" required />
                            {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2">Telefon (optional)</label>
                            <input type="tel" value={form.phone} onChange={(e) => setField('phone', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition text-sm" placeholder="0721 000 000" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2">Parola</label>
                            <input type="password" value={form.password} onChange={(e) => setField('password', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition text-sm" placeholder="Minim 8 caractere" required />
                            {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2">Confirma parola</label>
                            <input type="password" value={form.password_confirmation} onChange={(e) => setField('password_confirmation', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition text-sm" placeholder="Repeta parola" required />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3.5 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-green-500/25 disabled:opacity-50"
                        >
                            {loading ? 'Se creaza contul...' : 'Inregistrare'}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-5 text-sm text-gray-400">
                    Ai deja cont?{' '}
                    <Link to="/login" className="text-green-500 hover:text-green-600 font-semibold transition">Autentifica-te</Link>
                </p>
            </div>
        </div>
    );
}
