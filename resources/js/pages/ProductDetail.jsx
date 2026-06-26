import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import { useCart } from '../context/CartContext';
import StarRating from '../components/StarRating';
import ReviewSection from '../components/ReviewSection';
import CompareToggleButton from '../components/CompareToggleButton';
import WishlistButton from '../components/WishlistButton';

export default function ProductDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addedFeedback, setAddedFeedback] = useState(false);

    const handleAddToCart = () => {
        if (!product || product.stock === 0) return;
        const success = addToCart(product, quantity);
        if (success) {
            setAddedFeedback(true);
            setTimeout(() => setAddedFeedback(false), 2000);
        } else {
            toast.error(`Stoc insuficient. Disponibil: ${product.stock} buc.`);
        }
    };

    const handleBuyNow = () => {
        if (!product || product.stock === 0) return;
        const success = addToCart(product, quantity);
        if (success) {
            navigate('/cart');
        } else {
            toast.error(`Stoc insuficient. Disponibil: ${product.stock} buc.`);
        }
    };

    useEffect(() => {
        api.get(`/products/${slug}`)
            .then((res) => setProduct(res.data))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="h-96 shimmer rounded-2xl" />
                    <div className="space-y-4">
                        <div className="h-4 shimmer rounded w-1/4" />
                        <div className="h-8 shimmer rounded w-3/4" />
                        <div className="h-12 shimmer rounded w-1/3" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-24">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <p className="text-gray-500 text-lg font-medium">Produsul nu a fost gasit.</p>
                <Link to="/products" className="text-green-500 hover:text-green-600 mt-2 inline-block font-medium transition">
                    ← Inapoi la produse
                </Link>
            </div>
        );
    }

    const hasSpecs = product.shape || product.balance || product.core_hardness || product.playing_style;
    const hasRatings = product.power_rating || product.control_rating || product.spin_rating || product.comfort_rating;

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-3.5">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Link to="/" className="hover:text-green-500 transition">Acasa</Link>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        <Link to="/products" className="hover:text-green-500 transition">Produse</Link>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        <span className="text-gray-700 font-medium">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center min-h-[420px]">
                            {product.image_url ? (
                                <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                                <div className="text-center">
                                    <svg className="w-24 h-24 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-gray-300 text-sm mt-2">Imagine indisponibila</p>
                                </div>
                            )}
                            <div className="absolute top-5 left-5">
                                {product.type === 'refurbished' ? (
                                    <span className="bg-green-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl uppercase tracking-wider shadow-lg shadow-green-500/20">
                                        Refurbished - Grad {product.condition_grade}
                                    </span>
                                ) : (
                                    <span className="bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl uppercase tracking-wider shadow-lg shadow-blue-500/20">
                                        Nou
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="p-8 md:p-10 lg:p-12">
                            <p className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-2">
                                {product.brand?.name} · {product.category?.name}
                            </p>

                            <h1 className="font-['Oswald'] text-3xl font-bold text-[#1a2332] uppercase mb-3">
                                {product.name}
                            </h1>
                            <div className="mb-5">
                                <a href="#reviews" className="inline-flex items-center gap-2 hover:opacity-80 transition">
                                    <StarRating
                                        value={parseFloat(product.reviews_avg_rating) || 0}
                                        size="sm"
                                        showValue={product.reviews_count > 0}
                                        showCount={product.reviews_count || 0}
                                    />
                                </a>
                            </div>

                            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-gray-100">
                                <span className="font-['Oswald'] text-4xl font-bold text-[#1a2332]">
                                    {product.price}
                                </span>
                                <span className="text-lg text-gray-400 font-medium">RON</span>
                            </div>
                            <div className="flex items-center gap-2 mb-6">
                                {product.stock > 0 ? (
                                    <>
                                        <span className="w-2 h-2 bg-green-400 rounded-full" style={{ animation: 'pulse-glow 2s ease-in-out infinite' }} />
                                        <span className="text-green-600 font-medium text-sm">In stoc ({product.stock} disponibile)</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="w-2 h-2 bg-red-400 rounded-full" />
                                        <span className="text-red-500 font-medium text-sm">Stoc epuizat</span>
                                    </>
                                )}
                            </div>

                            {product.description && (
                                <div className="mb-6">
                                    <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                        Descriere
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
                                </div>
                            )}
                            {hasSpecs && (
                                <div className="mb-6">
                                    <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">
                                        Specificatii tehnice
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {product.shape && <SpecItem label="Forma" value={product.shape} />}
                                        {product.balance && <SpecItem label="Balans" value={product.balance} />}
                                        {product.core_hardness && <SpecItem label="Spuma" value={product.core_hardness} />}
                                        {product.playing_style && <SpecItem label="Stil joc" value={product.playing_style} />}
                                        {product.playing_level && <SpecItem label="Nivel" value={product.playing_level} />}
                                        {product.weight_range && <SpecItem label="Greutate" value={`${product.weight_range}g`} />}
                                        {product.thickness_mm && <SpecItem label="Grosime" value={`${product.thickness_mm}mm`} />}
                                        {product.frame_material && <SpecItem label="Cadru" value={product.frame_material} />}
                                    </div>
                                </div>
                            )}
                            {hasRatings && (
                                <div className="mb-6">
                                    <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">
                                        Performanta
                                    </h3>
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                                        <RatingBar label="Putere" value={product.power_rating} color="from-red-400 to-red-500" />
                                        <RatingBar label="Control" value={product.control_rating} color="from-blue-400 to-blue-500" />
                                        <RatingBar label="Spin" value={product.spin_rating} color="from-purple-400 to-purple-500" />
                                        <RatingBar label="Confort" value={product.comfort_rating} color="from-green-400 to-green-500" />
                                    </div>
                                </div>
                            )}

                            {product.type === 'refurbished' && (
                                <div className="bg-green-50 border border-green-100 rounded-xl p-5 mb-6">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-green-800 text-sm mb-1">Produs Refurbished Certificat</h3>
                                            <p className="text-green-700 text-sm leading-relaxed">
                                                Inspectat, reconditionat profesional si testat riguros.
                                                Gradul <strong>{product.condition_grade}</strong> indica starea produsului. Garantie inclusa.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {product.stock > 0 ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-gray-700">Cantitate:</span>
                                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                disabled={quantity <= 1}
                                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg>
                                            </button>
                                            <span className="w-12 text-center font-semibold text-gray-800">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                                disabled={quantity >= product.stock}
                                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                                            </button>
                                        </div>
                                        <span className="text-xs text-gray-400">Max {product.stock}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={handleAddToCart}
                                            className={`relative py-4 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all border-2 overflow-hidden ${
                                                addedFeedback
                                                    ? 'bg-green-500 border-green-500 text-white'
                                                    : 'border-green-500 text-green-600 hover:bg-green-50'
                                            }`}
                                        >
                                            {addedFeedback ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                    Adaugat
                                                </span>
                                            ) : (
                                                'Adauga in cos'
                                            )}
                                        </button>
                                        <button
                                            onClick={handleBuyNow}
                                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                                        >
                                            Cumpara acum
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <WishlistButton productId={product.id} variant="full" />
                                        <CompareToggleButton product={product} variant="full" />
                                    </div>
                                </div>
                            ) : (
                                <button
                                    disabled
                                    className="w-full bg-gray-200 text-gray-500 py-4 rounded-xl font-semibold text-sm uppercase tracking-wider cursor-not-allowed"
                                >
                                    Indisponibil momentan
                                </button>
                            )}
                            <div className="grid grid-cols-3 gap-3 mt-6">
                                {[
                                    { label: 'Transport gratuit', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
                                    { label: 'Retur 30 zile', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
                                    { label: 'Garantie inclusa', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                                ].map((badge) => (
                                    <div key={badge.label} className="text-center py-3.5 bg-gray-50 rounded-xl border border-gray-100">
                                        <svg className="w-5 h-5 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={badge.icon} />
                                        </svg>
                                        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{badge.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div id="reviews" className="mt-10 scroll-mt-20">
                    <div className="flex items-center gap-2 mb-5">
                        <h2 className="font-['Oswald'] text-2xl font-bold uppercase tracking-wide">
                            Recenziile <span className="text-gradient">clientilor</span>
                        </h2>
                    </div>
                    <ReviewSection productId={product.id} />
                </div>
            </div>
        </div>
    );
}

function SpecItem({ label, value }) {
    return (
        <div className="bg-gray-50 rounded-xl px-3.5 py-2.5 border border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</p>
            <p className="text-sm font-semibold text-gray-700 capitalize">{value}</p>
        </div>
    );
}

function RatingBar({ label, value, color }) {
    if (!value) return null;
    return (
        <div>
            <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-gray-500">{label}</span>
                <span className="text-xs font-bold text-gray-700">{value}/10</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
                <div className={`h-2 rounded-full bg-gradient-to-r ${color} transition-all`} style={{ width: `${value * 10}%` }} />
            </div>
        </div>
    );
}
