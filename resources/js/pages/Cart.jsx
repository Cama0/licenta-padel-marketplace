import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
    const navigate = useNavigate();
    const { items, itemCount, subtotal, shippingCost, total, updateQuantity, removeFromCart, clearCart } = useCart();

    if (items.length === 0) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <div className="bg-gradient-to-r from-[#0f1720] to-[#1a2332]">
                    <div className="max-w-4xl mx-auto px-4 py-10 text-center">
                        <h1 className="font-['Oswald'] text-3xl font-bold uppercase tracking-wide text-white">
                            Cosul <span className="text-gradient">tau</span>
                        </h1>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 shadow-sm">
                        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h2 className="font-['Oswald'] text-2xl font-bold uppercase mb-2">Cosul este gol</h2>
                        <p className="text-gray-500 mb-6">
                            Nu ai adaugat inca niciun produs in cos. Exploreaza catalogul nostru si gaseste echipamentul potrivit.
                        </p>
                        <Link
                            to="/products"
                            className="inline-block bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-green-500/25"
                        >
                            Vezi produsele
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-gradient-to-r from-[#0f1720] to-[#1a2332]">
                <div className="max-w-6xl mx-auto px-4 py-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-['Oswald'] text-3xl font-bold uppercase tracking-wide text-white">
                                Cosul <span className="text-gradient">tau</span>
                            </h1>
                            <p className="text-gray-400 mt-1 text-sm">{itemCount} {itemCount === 1 ? 'produs' : 'produse'} in cos</p>
                        </div>
                        <button
                            onClick={() => {
                                if (confirm('Sigur vrei sa golesti cosul?')) clearCart();
                            }}
                            className="text-gray-400 hover:text-red-400 text-xs uppercase tracking-wider transition flex items-center gap-1.5"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Goleste cosul
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-3">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-center" style={{ animation: 'slide-up 0.2s ease-out' }}>
                                <Link to={`/products/${item.slug}`} className="flex-shrink-0 w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                                    {item.image_url ? (
                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                                            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </Link>
                                <div className="flex-1 min-w-0">
                                    <Link to={`/products/${item.slug}`} className="block">
                                        <h3 className="font-['Oswald'] font-semibold uppercase text-sm text-[#1a2332] hover:text-green-600 transition truncate">
                                            {item.name}
                                        </h3>
                                    </Link>
                                    <p className="text-xs text-gray-400 mt-0.5">{item.price.toFixed(2)} RON / bucata</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg>
                                            </button>
                                            <span className="w-9 text-center text-sm font-semibold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                disabled={item.quantity >= item.stock}
                                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                                            </button>
                                        </div>
                                        <span className="text-[10px] text-gray-400">Max {item.stock}</span>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="font-['Oswald'] text-lg font-bold text-[#1a2332]">
                                        {(item.price * item.quantity).toFixed(2)}
                                        <span className="text-xs text-gray-400 ml-1">RON</span>
                                    </p>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-xs text-red-500 hover:text-red-600 mt-1 flex items-center gap-1 ml-auto transition"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        Sterge
                                    </button>
                                </div>
                            </div>
                        ))}

                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium mt-4 transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Continua cumparaturile
                        </Link>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24" style={{ animation: 'slide-up 0.3s ease-out' }}>
                            <h2 className="font-['Oswald'] text-lg font-bold uppercase mb-4 pb-3 border-b border-gray-100">
                                Sumar comanda
                            </h2>

                            <div className="space-y-2.5 text-sm">
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
                                {subtotal < 500 && (
                                    <div className="bg-orange-50 border border-orange-100 rounded-lg p-2.5 text-xs text-orange-700">
                                        Adauga inca <strong>{(500 - subtotal).toFixed(2)} RON</strong> pentru transport gratuit.
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-baseline">
                                <span className="font-semibold text-gray-700">Total</span>
                                <span className="font-['Oswald'] text-2xl font-bold text-[#1a2332]">
                                    {total.toFixed(2)}
                                    <span className="text-sm text-gray-400 ml-1">RON</span>
                                </span>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3.5 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 mt-5"
                            >
                                Continua catre checkout
                            </button>

                            <div className="mt-4 grid grid-cols-3 gap-2">
                                {[
                                    { label: 'Plati sigure', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                                    { label: 'Retur 30 zile', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
                                    { label: 'Suport rapid', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
                                ].map((b) => (
                                    <div key={b.label} className="text-center bg-gray-50 rounded-lg py-2 border border-gray-100">
                                        <svg className="w-4 h-4 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={b.icon} /></svg>
                                        <p className="text-[9px] text-gray-500 uppercase tracking-wider mt-0.5">{b.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
