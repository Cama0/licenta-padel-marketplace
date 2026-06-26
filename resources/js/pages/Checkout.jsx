import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Checkout() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { items, itemCount, subtotal, shippingCost, total, clearCart } = useCart();

    const [form, setForm] = useState({
        shipping_name: user?.name || '',
        shipping_phone: user?.phone || '',
        shipping_email: user?.email || '',
        shipping_address: user?.address || '',
        shipping_city: '',
        shipping_postal_code: '',
        payment_method: 'cash_on_delivery',
        notes: '',
    });

    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // daca nu e logat redirect la login
    useEffect(() => {
        if (!user) {
            navigate('/login?redirect=/checkout');
        }
    }, [user, navigate]);

    // daca cosul e gol redirect inapoi
    useEffect(() => {
        if (items.length === 0) {
            navigate('/cart');
        }
    }, [items, navigate]);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.shipping_name.trim()) newErrors.shipping_name = 'Numele este obligatoriu';
        if (!form.shipping_phone.trim()) newErrors.shipping_phone = 'Telefonul este obligatoriu';
        if (!form.shipping_email.trim() || !form.shipping_email.includes('@')) newErrors.shipping_email = 'Email invalid';
        if (!form.shipping_address.trim()) newErrors.shipping_address = 'Adresa este obligatorie';
        if (!form.shipping_city.trim()) newErrors.shipping_city = 'Orasul este obligatoriu';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                ...form,
                items: items.map((item) => ({
                    product_id: item.id,
                    quantity: item.quantity,
                })),
            };

            const res = await api.post('/orders', payload);
            const order = res.data.order;

            clearCart();
            toast.success('Comanda plasata cu succes!');
            navigate(`/order-confirmation/${order.id}`);
        } catch (err) {
            const msg = err.response?.data?.message || 'A aparut o eroare la plasarea comenzii. Te rog sa incerci din nou.';
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    if (!user || items.length === 0) {
        return null;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-gradient-to-r from-[#0f1720] to-[#1a2332]">
                <div className="max-w-6xl mx-auto px-4 py-10">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 mb-3">
                        <Link to="/cart" className="hover:text-green-400 transition">Cos</Link>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        <span className="text-green-400">Checkout</span>
                    </div>
                    <h1 className="font-['Oswald'] text-3xl font-bold uppercase tracking-wide text-white">
                        Finalizare <span className="text-gradient">comanda</span>
                    </h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-5">
                        <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{ animation: 'slide-up 0.2s ease-out' }}>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-sm">1</div>
                                <h2 className="font-['Oswald'] text-lg font-bold uppercase">Date livrare</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Nume complet *" error={errors.shipping_name}>
                                    <input
                                        type="text"
                                        value={form.shipping_name}
                                        onChange={(e) => handleChange('shipping_name', e.target.value)}
                                        className="form-input"
                                        placeholder="Ion Popescu"
                                    />
                                </Field>
                                <Field label="Telefon *" error={errors.shipping_phone}>
                                    <input
                                        type="tel"
                                        value={form.shipping_phone}
                                        onChange={(e) => handleChange('shipping_phone', e.target.value)}
                                        className="form-input"
                                        placeholder="0721234567"
                                    />
                                </Field>
                                <Field label="Email *" error={errors.shipping_email} fullWidth>
                                    <input
                                        type="email"
                                        value={form.shipping_email}
                                        onChange={(e) => handleChange('shipping_email', e.target.value)}
                                        className="form-input"
                                        placeholder="email@example.com"
                                    />
                                </Field>
                                <Field label="Adresa completa *" error={errors.shipping_address} fullWidth>
                                    <input
                                        type="text"
                                        value={form.shipping_address}
                                        onChange={(e) => handleChange('shipping_address', e.target.value)}
                                        className="form-input"
                                        placeholder="Str. Eroilor nr. 12, bl. A, ap. 5"
                                    />
                                </Field>
                                <Field label="Oras *" error={errors.shipping_city}>
                                    <input
                                        type="text"
                                        value={form.shipping_city}
                                        onChange={(e) => handleChange('shipping_city', e.target.value)}
                                        className="form-input"
                                        placeholder="Cluj-Napoca"
                                    />
                                </Field>
                                <Field label="Cod postal">
                                    <input
                                        type="text"
                                        value={form.shipping_postal_code}
                                        onChange={(e) => handleChange('shipping_postal_code', e.target.value)}
                                        className="form-input"
                                        placeholder="400000"
                                    />
                                </Field>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{ animation: 'slide-up 0.3s ease-out' }}>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-sm">2</div>
                                <h2 className="font-['Oswald'] text-lg font-bold uppercase">Metoda de plata</h2>
                            </div>

                            <div className="space-y-2.5">
                                <PaymentOption
                                    value="cash_on_delivery"
                                    selected={form.payment_method}
                                    onSelect={(v) => handleChange('payment_method', v)}
                                    title="Ramburs la curier"
                                    description="Platesti cu cash sau card direct la livrare"
                                    icon="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                />
                                <PaymentOption
                                    value="card"
                                    selected={form.payment_method}
                                    onSelect={(v) => handleChange('payment_method', v)}
                                    title="Card online"
                                    description="Plata securizata cu cardul (mock pentru demo)"
                                    icon="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                    badge="DEMO"
                                />
                                <PaymentOption
                                    value="bank_transfer"
                                    selected={form.payment_method}
                                    onSelect={(v) => handleChange('payment_method', v)}
                                    title="Transfer bancar"
                                    description="Vei primi datele bancare pe email dupa plasarea comenzii"
                                    icon="M4 10V7a4 4 0 014-4h8a4 4 0 014 4v3M4 10v6a4 4 0 004 4h8a4 4 0 004-4v-6M4 10h16"
                                />
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{ animation: 'slide-up 0.4s ease-out' }}>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-sm">3</div>
                                <h2 className="font-['Oswald'] text-lg font-bold uppercase">Observatii (optional)</h2>
                            </div>

                            <textarea
                                value={form.notes}
                                onChange={(e) => handleChange('notes', e.target.value)}
                                rows={3}
                                className="form-input"
                                placeholder="Mentiuni speciale pentru livrare, instructiuni etc."
                            />
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24" style={{ animation: 'slide-up 0.5s ease-out' }}>
                            <h2 className="font-['Oswald'] text-lg font-bold uppercase mb-4 pb-3 border-b border-gray-100">
                                Comanda ta
                            </h2>

                            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 mb-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-3 items-center">
                                        <div className="relative w-12 h-12 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <span className="absolute -top-1 -right-1 bg-gray-700 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-gray-800 truncate">{item.name}</p>
                                            <p className="text-[11px] text-gray-400">{item.price.toFixed(2)} RON</p>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-800">
                                            {(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'produs' : 'produse'})</span>
                                    <span className="font-medium text-gray-800">{subtotal.toFixed(2)} RON</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Transport</span>
                                    {shippingCost === 0 ? (
                                        <span className="font-medium text-green-600">Gratuit</span>
                                    ) : (
                                        <span className="font-medium text-gray-800">{shippingCost.toFixed(2)} RON</span>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between items-baseline">
                                <span className="font-semibold text-gray-700">Total</span>
                                <span className="font-['Oswald'] text-2xl font-bold text-[#1a2332]">
                                    {total.toFixed(2)}
                                    <span className="text-sm text-gray-400 ml-1">RON</span>
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3.5 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 mt-5 disabled:opacity-50 disabled:cursor-wait"
                            >
                                {submitting ? 'Se proceseaza...' : `Plaseaza comanda ${total.toFixed(2)} RON`}
                            </button>

                            <p className="text-[11px] text-gray-400 text-center mt-3">
                                Apasand "Plaseaza comanda" accepti
                                <Link to="/termeni-conditii" className="text-green-600 hover:underline ml-1">Termenii si Conditiile</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </form>
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
        </div>
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

function PaymentOption({ value, selected, onSelect, title, description, icon, badge }) {
    const isSelected = selected === value;
    return (
        <button
            type="button"
            onClick={() => onSelect(value)}
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
                isSelected
                    ? 'border-green-500 bg-green-50/50 shadow-sm shadow-green-500/10'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
        >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                isSelected ? 'border-green-500' : 'border-gray-300'
            }`}>
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-green-500" />}
            </div>
            <svg className={`w-5 h-5 ${isSelected ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
            </svg>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800">{title}</span>
                    {badge && <span className="text-[9px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-bold">{badge}</span>}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            </div>
        </button>
    );
}
