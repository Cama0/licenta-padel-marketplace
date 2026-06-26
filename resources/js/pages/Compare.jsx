import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import StarRating from '../components/StarRating';

export default function Compare() {
    const { items, remove, clear } = useCompare();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (items.length === 0) {
            setProducts([]);
            setLoading(false);
            return;
        }

        Promise.all(
            items.map((item) =>
                api.get(`/products/${item.slug}`)
                    .then((res) => res.data)
                    .catch(() => null) // daca un produs e sters return null
            )
        ).then((results) => {
            setProducts(results.filter(Boolean));
            setLoading(false);
        });
    }, [items]);

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="flex gap-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
                            Compara <span className="text-gradient">produse</span>
                        </h1>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 shadow-sm">
                        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="font-['Oswald'] text-2xl font-bold uppercase mb-2">Niciun produs in comparator</h2>
                        <p className="text-gray-500 mb-6">
                            Apasa butonul "Compara" pe orice produs din magazin pentru a-l adauga aici.
                        </p>
                        <Link
                            to="/products"
                            className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-blue-500/25"
                        >
                            Vezi produsele
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // cea mai buna valoare pentru atributele numerice
    const bestValues = computeBestValues(products);

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-gradient-to-r from-[#0f1720] to-[#1a2332]">
                <div className="max-w-7xl mx-auto px-4 py-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                            <h1 className="font-['Oswald'] text-3xl font-bold uppercase tracking-wide text-white">
                                Compara <span className="text-gradient">produse</span>
                            </h1>
                            <p className="text-gray-400 text-sm mt-1">
                                {products.length} {products.length === 1 ? 'produs' : 'produse'} in comparator
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                if (confirm('Sigur vrei sa golesti comparatorul?')) clear();
                            }}
                            className="text-gray-400 hover:text-red-400 text-xs uppercase tracking-wider transition flex items-center gap-1.5 self-start md:self-auto"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Goleste comparator
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="text-left px-5 py-4 bg-gray-50 border-b border-gray-100 sticky left-0 z-10 min-w-[140px]"></th>
                                    {products.map((p) => (
                                        <th key={p.id} className="px-5 py-5 border-b border-gray-100 align-top min-w-[200px]">
                                            <ProductHeader product={p} onRemove={() => remove(p.id)} />
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                <Row label="Pret">
                                    {products.map((p) => (
                                        <td key={p.id} className="px-5 py-4 text-center">
                                            <span className="font-['Oswald'] text-2xl font-bold text-[#1a2332]">
                                                {p.price}
                                            </span>
                                            <span className="text-sm text-gray-400 ml-1">RON</span>
                                        </td>
                                    ))}
                                </Row>
                                <Row label="Tip">
                                    {products.map((p) => (
                                        <td key={p.id} className="px-5 py-3 text-center">
                                            {p.type === 'refurbished' ? (
                                                <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 px-2.5 py-1 rounded">
                                                    Refurbished {p.condition_grade || ''}
                                                </span>
                                            ) : (
                                                <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-1 rounded">
                                                    Nou
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                </Row>
                                <Row label="Disponibilitate">
                                    {products.map((p) => (
                                        <td key={p.id} className="px-5 py-3 text-center text-sm">
                                            {p.stock > 0 ? (
                                                <span className="text-green-600 font-medium">In stoc ({p.stock})</span>
                                            ) : (
                                                <span className="text-red-500 font-medium">Indisponibil</span>
                                            )}
                                        </td>
                                    ))}
                                </Row>
                                <Row label="Rating clienti">
                                    {products.map((p) => (
                                        <td key={p.id} className="px-5 py-3 text-center">
                                            {p.reviews_count > 0 ? (
                                                <div className="flex flex-col items-center gap-1">
                                                    <StarRating value={parseFloat(p.reviews_avg_rating) || 0} size="sm" />
                                                    <span className="text-[11px] text-gray-500">
                                                        {parseFloat(p.reviews_avg_rating).toFixed(1)} ({p.reviews_count} recenzii)
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400">Fara recenzii</span>
                                            )}
                                        </td>
                                    ))}
                                </Row>

                                <SectionHeader label="Specificatii tehnice" />

                                <Row label="Forma">
                                    {products.map((p) => (
                                        <td key={p.id} className="px-5 py-3 text-center text-sm capitalize">
                                            {p.shape || '—'}
                                        </td>
                                    ))}
                                </Row>

                                <Row label="Balans">
                                    {products.map((p) => (
                                        <td key={p.id} className="px-5 py-3 text-center text-sm capitalize">
                                            {p.balance || '—'}
                                        </td>
                                    ))}
                                </Row>

                                <Row label="Duritate spuma">
                                    {products.map((p) => (
                                        <td key={p.id} className="px-5 py-3 text-center text-sm capitalize">
                                            {p.core_hardness || '—'}
                                        </td>
                                    ))}
                                </Row>

                                <Row label="Greutate">
                                    {products.map((p) => (
                                        <td key={p.id} className="px-5 py-3 text-center text-sm">
                                            {p.weight_range ? `${p.weight_range} g` : '—'}
                                        </td>
                                    ))}
                                </Row>

                                <Row label="Grosime">
                                    {products.map((p) => (
                                        <td key={p.id} className="px-5 py-3 text-center text-sm">
                                            {p.thickness_mm ? `${p.thickness_mm} mm` : '—'}
                                        </td>
                                    ))}
                                </Row>

                                <Row label="Material suprafata">
                                    {products.map((p) => (
                                        <td key={p.id} className="px-5 py-3 text-center text-sm">
                                            {p.surface_material || '—'}
                                        </td>
                                    ))}
                                </Row>

                                <Row label="Material miez">
                                    {products.map((p) => (
                                        <td key={p.id} className="px-5 py-3 text-center text-sm">
                                            {p.core_material || '—'}
                                        </td>
                                    ))}
                                </Row>

                                <SectionHeader label="Joc" />

                                <Row label="Stil de joc">
                                    {products.map((p) => (
                                        <td key={p.id} className="px-5 py-3 text-center text-sm capitalize">
                                            {p.playing_style || '—'}
                                        </td>
                                    ))}
                                </Row>

                                <Row label="Nivel">
                                    {products.map((p) => (
                                        <td key={p.id} className="px-5 py-3 text-center text-sm capitalize">
                                            {p.playing_level || '—'}
                                        </td>
                                    ))}
                                </Row>

                                <SectionHeader label="Performanta" />

                                <RatingRow label="Putere" products={products} field="power_rating" best={bestValues.power} color="from-red-400 to-red-500" />
                                <RatingRow label="Control" products={products} field="control_rating" best={bestValues.control} color="from-blue-400 to-blue-500" />
                                <RatingRow label="Spin" products={products} field="spin_rating" best={bestValues.spin} color="from-purple-400 to-purple-500" />
                                <RatingRow label="Confort" products={products} field="comfort_rating" best={bestValues.comfort} color="from-green-400 to-green-500" />
                                <Row label="">
                                    {products.map((p) => (
                                        <td key={p.id} className="px-5 py-5 text-center">
                                            <CartButton product={p} />
                                        </td>
                                    ))}
                                </Row>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="text-center mt-6">
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Continua cumparaturile
                    </Link>
                </div>
            </div>
        </div>
    );
}

/* ===== Componente helper ===== */

function ProductHeader({ product, onRemove }) {
    return (
        <div className="relative">
            <button
                onClick={onRemove}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-100 hover:bg-red-500 hover:text-white text-gray-400 flex items-center justify-center shadow transition z-10"
                title="Elimina din comparator"
            >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <Link to={`/products/${product.slug}`} className="block">
                <div className="w-full aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100 mb-3">
                    {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                </div>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">
                    {product.brand?.name}
                </p>
                <h3 className="font-['Oswald'] text-sm font-semibold text-[#1a2332] uppercase line-clamp-2 hover:text-blue-600 transition">
                    {product.name}
                </h3>
            </Link>
        </div>
    );
}

function Row({ label, children }) {
    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50/30 transition">
            <td className="px-5 py-3 bg-gray-50/50 sticky left-0 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                {label}
            </td>
            {children}
        </tr>
    );
}

function SectionHeader({ label }) {
    return (
        <tr className="border-b border-gray-100">
            <td colSpan={4} className="px-5 py-2.5 bg-gray-100 text-[11px] font-bold uppercase tracking-widest text-gray-600">
                {label}
            </td>
        </tr>
    );
}

function RatingRow({ label, products, field, best, color }) {
    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50/30 transition">
            <td className="px-5 py-3 bg-gray-50/50 sticky left-0 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                {label}
            </td>
            {products.map((p) => {
                const value = p[field];
                const isBest = best !== null && value === best && products.filter(x => x[field] === best).length === 1;
                return (
                    <td key={p.id} className="px-5 py-3">
                        {value ? (
                            <div className={`relative ${isBest ? 'ring-2 ring-green-400 ring-offset-2 rounded-lg p-1.5' : ''}`}>
                                <div className="flex items-center justify-between gap-2 mb-1">
                                    <span className="text-xs font-semibold text-gray-700">{value}/10</span>
                                    {isBest && (
                                        <span className="text-[9px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                            Cel mai bun
                                        </span>
                                    )}
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div className={`h-1.5 rounded-full bg-gradient-to-r ${color}`} style={{ width: `${value * 10}%` }} />
                                </div>
                            </div>
                        ) : (
                            <span className="text-xs text-gray-300 block text-center">—</span>
                        )}
                    </td>
                );
            })}
        </tr>
    );
}

function CartButton({ product }) {
    const { addToCart } = useCart();
    const [feedback, setFeedback] = useState(false);

    const handleAdd = () => {
        if (product.stock === 0) return;
        const ok = addToCart(product, 1);
        if (ok) {
            setFeedback(true);
            setTimeout(() => setFeedback(false), 1500);
        }
    };

    if (product.stock === 0) {
        return (
            <span className="block text-xs text-red-500 font-medium">Indisponibil</span>
        );
    }

    return (
        <button
            onClick={handleAdd}
            className={`w-full px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                feedback
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md shadow-green-500/20'
            }`}
        >
            {feedback ? 'Adaugat' : 'In cos'}
        </button>
    );
}

function computeBestValues(products) {
    const fields = ['power_rating', 'control_rating', 'spin_rating', 'comfort_rating'];
    const result = {};

    for (const field of fields) {
        const values = products.map((p) => p[field]).filter((v) => v != null);
        if (values.length === 0) {
            result[field.replace('_rating', '')] = null;
            continue;
        }

        const max = Math.max(...values);
        // Daca toate sunt egale, nu evidentiem niciuna
        const allSame = values.every((v) => v === max);
        result[field.replace('_rating', '')] = allSame ? null : max;
    }

    return result;
}
