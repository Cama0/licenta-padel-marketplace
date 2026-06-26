import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const { user, setUser } = useAuth();
    const [activeTab, setActiveTab] = useState('info');
    const [stats, setStats] = useState(null);

    useEffect(() => {
        api.get('/profile/stats').then((res) => setStats(res.data)).catch(() => {});
    }, []);

    if (!user) return null;

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-gradient-to-r from-[#0f1720] to-[#1a2332]">
                <div className="max-w-5xl mx-auto px-4 py-10">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/30 to-green-600/30 border-2 border-green-500/30 flex items-center justify-center text-green-400 font-bold text-2xl">
                            {user.name[0]}
                        </div>
                        <div>
                            <h1 className="font-['Oswald'] text-2xl font-bold uppercase tracking-wide text-white">
                                {user.name}
                            </h1>
                            <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        <StatCard
                            label="Comenzi"
                            value={stats.orders_count}
                            icon="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            color="from-blue-400 to-blue-500"
                            link="/my-orders"
                        />
                        <StatCard
                            label="Wishlist"
                            value={stats.wishlist_count || 0}
                            icon="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            color="from-pink-400 to-red-500"
                            link="/wishlist"
                        />
                        <StatCard
                            label="Cereri buyback"
                            value={stats.buyback_requests_count}
                            icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"
                            color="from-orange-400 to-orange-500"
                            link="/my-requests"
                        />
                        <StatCard
                            label="Total cheltuit"
                            value={`${parseFloat(stats.total_spent || 0).toFixed(0)} RON`}
                            icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            color="from-green-400 to-green-500"
                        />
                    </div>
                )}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="border-b border-gray-100 flex">
                        <TabButton active={activeTab === 'info'} onClick={() => setActiveTab('info')}>
                            Date personale
                        </TabButton>
                        <TabButton active={activeTab === 'password'} onClick={() => setActiveTab('password')}>
                            Schimba parola
                        </TabButton>
                    </div>

                    <div className="p-6">
                        {activeTab === 'info' && <PersonalInfoTab user={user} setUser={setUser} />}
                        {activeTab === 'password' && <ChangePasswordTab />}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                    <QuickLink to="/my-orders" label="Comenzile mele" icon="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" color="blue" />
                    <QuickLink to="/my-requests" label="Cereri buyback" icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" color="orange" />
                    <QuickLink to="/cart" label="Cosul meu" icon="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" color="green" />
                </div>
            </div>
        </div>
    );
}

/* ===== Tab: Date personale ===== */
function PersonalInfoTab({ user, setUser }) {
    const [form, setForm] = useState({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
        setSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSubmitting(true);
        try {
            const res = await api.put('/profile', form);
            setUser(res.data.user);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setErrors(err.response?.data?.errors || {});
            if (err.response?.data?.message && !err.response?.data?.errors) {
                toast.error(err.response.data.message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nume complet *" error={errors.name?.[0]}>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        required
                        className="form-input"
                    />
                </Field>
                <Field label="Email *" error={errors.email?.[0]}>
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        required
                        className="form-input"
                    />
                </Field>
                <Field label="Telefon" error={errors.phone?.[0]}>
                    <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="0721234567"
                        className="form-input"
                    />
                </Field>
                <Field label="Adresa" error={errors.address?.[0]} fullWidth>
                    <input
                        type="text"
                        value={form.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        placeholder="Str. Eroilor nr. 12, ap. 5"
                        className="form-input"
                    />
                </Field>
            </div>

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-2.5 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Profilul a fost actualizat cu succes!
                </div>
            )}

            <div className="pt-3 border-t border-gray-100">
                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-wait"
                >
                    {submitting ? 'Se salveaza...' : 'Salveaza modificarile'}
                </button>
            </div>

            <FormStyles />
        </form>
    );
}

/* ===== Tab: Schimbare parola ===== */
function ChangePasswordTab() {
    const [form, setForm] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setErrors({});

        if (form.password !== form.password_confirmation) {
            setError('Parolele nu coincid.');
            return;
        }
        if (form.password.length < 8) {
            setError('Noua parola trebuie sa aiba minim 8 caractere.');
            return;
        }

        setSubmitting(true);
        try {
            await api.put('/profile/password', form);
            setSuccess(true);
            setForm({ current_password: '', password: '', password_confirmation: '' });
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            }
            setError(err.response?.data?.message || 'A aparut o eroare.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <Field label="Parola curenta *" error={errors.current_password?.[0]}>
                <input
                    type="password"
                    value={form.current_password}
                    onChange={(e) => setForm({ ...form, current_password: e.target.value })}
                    required
                    className="form-input"
                />
            </Field>
            <Field label="Noua parola *" error={errors.password?.[0]}>
                <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    minLength={8}
                    placeholder="Minim 8 caractere"
                    className="form-input"
                />
            </Field>
            <Field label="Confirmare parola noua *">
                <input
                    type="password"
                    value={form.password_confirmation}
                    onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                    required
                    minLength={8}
                    className="form-input"
                />
            </Field>

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-2.5 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Parola a fost schimbata cu succes!
                </div>
            )}

            {error && !success && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-wait"
            >
                {submitting ? 'Se schimba...' : 'Schimba parola'}
            </button>

            <FormStyles />
        </form>
    );
}

/* ===== Componente helper ===== */
function TabButton({ active, onClick, children }) {
    return (
        <button
            onClick={onClick}
            className={`px-5 py-3.5 text-sm font-semibold uppercase tracking-wider transition relative ${
                active
                    ? 'text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
            }`}
        >
            {children}
            {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-green-600" />}
        </button>
    );
}

function Field({ label, error, fullWidth = false, children }) {
    return (
        <div className={fullWidth ? 'md:col-span-2' : ''}>
            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1.5">{label}</label>
            {children}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}

function StatCard({ label, value, icon, color, link }) {
    const Wrapper = link ? Link : 'div';
    const wrapperProps = link ? { to: link } : {};

    return (
        <Wrapper
            {...wrapperProps}
            className={`bg-white rounded-2xl border border-gray-100 p-4 ${link ? 'hover:shadow-md transition-shadow cursor-pointer' : ''}`}
        >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-md`}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                </svg>
            </div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wider">{label}</p>
            <p className="font-['Oswald'] text-xl font-bold text-[#1a2332] mt-0.5">{value}</p>
        </Wrapper>
    );
}

function QuickLink({ to, label, icon, color }) {
    const colorMap = {
        blue: 'hover:border-blue-300 hover:text-blue-600',
        orange: 'hover:border-orange-300 hover:text-orange-600',
        green: 'hover:border-green-300 hover:text-green-600',
    };
    return (
        <Link
            to={to}
            className={`flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-4 transition-all group ${colorMap[color]}`}
        >
            <svg className="w-5 h-5 text-gray-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
            </svg>
            <span className="text-sm font-medium text-gray-700 flex-1">{label}</span>
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </Link>
    );
}

function FormStyles() {
    return (
        <style>{`
            .form-input {
                width: 100%;
                padding: 0.625rem 0.875rem;
                font-size: 0.875rem;
                color: #1f2937;
                background-color: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 0.625rem;
                transition: all 0.2s;
                outline: none;
            }
            .form-input:focus {
                border-color: #22c55e;
                background-color: #ffffff;
                box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
            }
        `}</style>
    );
}
