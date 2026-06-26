import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [debugUrl, setDebugUrl] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const res = await api.post('/forgot-password', { email });
            setSuccess(true);
            // in dev backend returneaza url direct
            if (res.data.debug_reset_url) {
                setDebugUrl(res.data.debug_reset_url);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'A aparut o eroare. Te rog incearca din nou.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-180px)] flex items-center justify-center py-12 px-4 mesh-bg">
            <div className="w-full max-w-md" style={{ animation: 'slide-up 0.4s ease-out' }}>
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                    <h1 className="font-['Oswald'] text-2xl font-bold uppercase tracking-wide text-[#1a2332]">
                        Reseteaza <span className="text-gradient">parola</span>
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        Introdu adresa de email asociata contului. Iti vom trimite un link pentru a seta o noua parola.
                    </p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-7 shadow-sm">
                    {success ? (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="font-semibold text-lg text-gray-800 mb-1">Verifica email-ul</h2>
                                <p className="text-sm text-gray-500">
                                    Daca <strong>{email}</strong> exista in sistemul nostru, vei primi un link de resetare in cateva minute.
                                </p>
                            </div>
                            {debugUrl && (
                                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-left">
                                    <p className="text-xs font-bold uppercase text-yellow-700 mb-2 flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        Mod dezvoltare
                                    </p>
                                    <p className="text-xs text-yellow-700 mb-2">
                                        In productie, link-ul e trimis doar pe email. Pentru demo, foloseste link-ul de mai jos:
                                    </p>
                                    <a
                                        href={debugUrl.replace(window.location.origin, '')}
                                        className="text-xs text-blue-600 hover:underline break-all font-mono"
                                    >
                                        {debugUrl}
                                    </a>
                                </div>
                            )}

                            <Link
                                to="/login"
                                className="block w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-green-500/20 mt-4"
                            >
                                Inapoi la conectare
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1.5">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoFocus
                                    placeholder="email@example.com"
                                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition bg-gray-50 focus:bg-white"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-wait"
                            >
                                {submitting ? 'Se trimite...' : 'Trimite link de resetare'}
                            </button>
                        </form>
                    )}

                    <p className="text-center text-xs text-gray-400 mt-5 pt-5 border-t border-gray-100">
                        Iti amintesti parola?{' '}
                        <Link to="/login" className="text-green-600 hover:underline font-medium">
                            Conecteaza-te
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
