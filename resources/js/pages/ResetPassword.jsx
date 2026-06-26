import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api from '../api';

export default function ResetPassword() {
    const { token } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialEmail = searchParams.get('email') || '';

    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== passwordConfirmation) {
            setError('Parolele nu coincid.');
            return;
        }
        if (password.length < 8) {
            setError('Parola trebuie sa aiba minim 8 caractere.');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/reset-password', {
                token,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });
            setSuccess(true);
            // redirect dupa 2 secunde
            setTimeout(() => navigate('/login'), 2500);
        } catch (err) {
            setError(err.response?.data?.message || 'Token invalid sau expirat. Te rog cere un nou link.');
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="font-['Oswald'] text-2xl font-bold uppercase tracking-wide text-[#1a2332]">
                        Noua <span className="text-gradient">parola</span>
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        Alege o parola sigura, de minim 8 caractere.
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
                            <h2 className="font-semibold text-lg text-gray-800 mb-1">Parola resetata!</h2>
                            <p className="text-sm text-gray-500">Vei fi redirectionat catre pagina de conectare...</p>
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
                                    placeholder="email@example.com"
                                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition bg-gray-50 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1.5">
                                    Noua parola
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    autoFocus
                                    placeholder="Minim 8 caractere"
                                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition bg-gray-50 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1.5">
                                    Confirmare parola
                                </label>
                                <input
                                    type="password"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    required
                                    minLength={8}
                                    placeholder="Repeta noua parola"
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
                                {submitting ? 'Se proceseaza...' : 'Reseteaza parola'}
                            </button>
                        </form>
                    )}

                    <p className="text-center text-xs text-gray-400 mt-5 pt-5 border-t border-gray-100">
                        <Link to="/login" className="text-green-600 hover:underline font-medium">
                            Inapoi la conectare
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
