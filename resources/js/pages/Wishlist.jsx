import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import StarRating from '../components/StarRating';

export default function Wishlist() {
    const { remove } = useWishlist();
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState({}); // { productId: 'added' | 'removed' }

    const fetchWishlist = async () => {
        try {
            const res = await api.get('/wishlist');
            setProducts(res.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const handleRemove = async (productId) => {
        await remove(productId);
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        toast('Scos din wishlist');
    };

    const handleAddToCart = (product) => {
        const ok = addToCart(product, 1);
        if (ok) {
            setFeedback((prev) => ({ ...prev, [product.id]: 'added' }));
            setTimeout(() => {
                setFeedback((prev) => {
                    const next = { ...prev };
                    delete next[product.id];
                    return next;
                });
            }, 1500);
        } else {
            toast.error(`Stoc insuficient (disponibil: ${product.stock})`);
        }
    };

    const handleMoveToCart = async (product) => {
        const ok = addToCart(product, 1);
        if (!ok) {
            toast.error(`Stoc insuficient (disponibil: ${product.stock})`);
            return;
        }
        await remove(product.id);
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
        toast.success(`${product.name} mutat in cos`);
    };

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="flex gap-2">
                    <span className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <div className="bg-gradient-to-r from-[#0f1720] to-[#1a2332]">
                    <div className="max-w-4xl mx-auto px-4 py-10 text-center">
                        <h1 className="font-['Oswald'] text-3xl font-bold uppercase tracking-wide text-white">
                            Wishlist-ul <span className="text-gradient">tau</span>
                        </h1>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 shadow-sm">
                        <div className="w-20 h-20 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <svg className="w-10 h-10 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h2 className="font-['Oswald'] text-2xl font-bold uppercase mb-2">Wishlist gol</h2>
                        <p className="text-gray-500 mb-6">
                            Apasa pe inima de pe orice produs pentru a-l salva pentru mai tarziu. Asa nu vei pierde echipamentele care iti plac.
                        </p>
                        <Link
                            to="/products"
                            className="inline-block bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-8 py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-pink-500/25"
                        >
                            Exploreaza produsele
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
                    <h1 className="font-['Oswald'] text-3xl font-bold uppercase tracking-wide text-white">
                        Wishlist-ul <span className="text-gradient">tau</span>
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {products.length} {products.length === 1 ? 'produs salvat' : 'produse salvate'}
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {products.map((product) => (
                        <WishlistCard
                            key={product.id}
                            product={product}
                            feedback={feedback[product.id]}
                            onRemove={() => handleRemove(product.id)}
                            onAddToCart={() => handleAddToCart(product)}
                            onMoveToCart={() => handleMoveToCart(product)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function WishlistCard({ product, feedback, onRemove, onAddToCart, onMoveToCart }) {
    return (
        <div
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col"
            style={{ animation: 'slide-up 0.2s ease-out' }}
        >
            <div className="relative h-48 bg-gray-50">
                <Link to={`/products/${product.slug}`}>
                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                </Link>
                <button
                    onClick={onRemove}
                    className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-500/30 transition"
                    title="Scoate din wishlist"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
                <div className="absolute top-3 left-3">
                    {product.type === 'refurbished' ? (
                        <span className="bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                            Refurbished {product.condition_grade}
                        </span>
                    ) : (
                        <span className="bg-blue-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                            Nou
                        </span>
                    )}
                </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-1">
                    {product.brand?.name}
                </p>
                <Link to={`/products/${product.slug}`}>
                    <h3 className="font-['Oswald'] text-base font-semibold uppercase text-[#1a2332] hover:text-green-600 transition line-clamp-2 leading-snug min-h-[44px]">
                        {product.name}
                    </h3>
                </Link>
                <div className="mt-2">
                    <StarRating
                        value={parseFloat(product.reviews_avg_rating) || 0}
                        size="xs"
                        showCount={product.reviews_count || 0}
                    />
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="font-['Oswald'] text-xl font-bold text-[#1a2332]">
                        {product.price} <span className="text-xs font-medium text-gray-400">RON</span>
                    </span>
                    {product.stock > 0 ? (
                        <span className="text-[10px] text-green-600 font-medium">In stoc</span>
                    ) : (
                        <span className="text-[10px] text-red-500 font-medium">Indisponibil</span>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                    {product.stock > 0 ? (
                        <>
                            <button
                                onClick={onAddToCart}
                                className={`py-2 rounded-lg text-xs font-bold uppercase tracking-wider border-2 transition ${
                                    feedback === 'added'
                                        ? 'border-green-500 bg-green-500 text-white'
                                        : 'border-green-500 text-green-600 hover:bg-green-50'
                                }`}
                            >
                                {feedback === 'added' ? 'Adaugat' : 'In cos'}
                            </button>
                            <button
                                onClick={onMoveToCart}
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-sm shadow-green-500/20"
                            >
                                Muta in cos
                            </button>
                        </>
                    ) : (
                        <button
                            disabled
                            className="col-span-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-400 cursor-not-allowed"
                        >
                            Indisponibil
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
