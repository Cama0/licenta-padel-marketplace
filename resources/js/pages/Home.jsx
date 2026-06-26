import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';
import StarRating from '../components/StarRating';
import CompareToggleButton from '../components/CompareToggleButton';
import WishlistButton from '../components/WishlistButton';

export default function Home() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [refurbishedProducts, setRefurbishedProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        api.get('/products?per_page=4&type=new').then((res) => setFeaturedProducts(res.data.data || []));
        api.get('/products?per_page=4&type=refurbished').then((res) => setRefurbishedProducts(res.data.data || []));
        api.get('/brands').then((res) => setBrands(res.data || []));
        api.get('/categories').then((res) => setCategories(res.data || []));
    }, []);

    return (
        <div>

            <section className="relative bg-[#0f1720] overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 opacity-30" style={{
                        backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(19, 155, 72, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(242, 103, 35, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(19, 155, 72, 0.1) 0%, transparent 50%)'
                    }} />
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                    }} />
                </div>

                <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div style={{ animation: 'slide-up 0.6s ease-out' }}>
                            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider mb-6">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                #1 Marketplace Padel din Romania
                            </div>
                            <h1 className="font-['Oswald'] text-5xl md:text-7xl font-bold text-white uppercase leading-[0.95] mb-6">
                                Echipamentul tau
                                <br />
                                <span className="text-gradient">de padel</span> perfect
                            </h1>
                            <p className="text-gray-400 text-lg mb-10 max-w-lg leading-relaxed">
                                Rachete noi si refurbished de la cele mai bune branduri.
                                Economiseste pana la <span className="text-green-400 font-semibold">50%</span> cu produsele noastre reconditionate profesional.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/products"
                                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3.5 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-0.5"
                                >
                                    Vezi Magazinul
                                </Link>
                                <Link
                                    to="/buyback"
                                    className="border border-orange-500/50 text-orange-400 hover:bg-orange-500 hover:text-white hover:border-orange-500 px-8 py-3.5 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all hover:-translate-y-0.5"
                                >
                                    Vinde Racheta Ta
                                </Link>
                            </div>
                            <div className="flex items-center gap-8 mt-12">
                                {[
                                    { label: 'Garantie inclusa', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                                    { label: 'Transport gratuit', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
                                    { label: 'Retur 30 zile', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
                                ].map((badge) => (
                                    <div key={badge.label} className="flex items-center gap-2 text-gray-500 text-sm">
                                        <svg className="w-4 h-4 text-green-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={badge.icon} />
                                        </svg>
                                        <span>{badge.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="hidden md:flex justify-center" style={{ animation: 'fade-in 0.8s ease-out 0.2s both' }}>
                            <div className="relative">
                                <div className="w-80 h-80 rounded-3xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/10 flex items-center justify-center" style={{ animation: 'float 6s ease-in-out infinite' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="#000000" viewBox="0 0 256 256"><path d="M201.57,54.46a104,104,0,1,0,0,147.08A103.4,103.4,0,0,0,201.57,54.46ZM65.75,65.77a87.63,87.63,0,0,1,53.66-25.31A87.31,87.31,0,0,1,94,94.06a87.42,87.42,0,0,1-53.62,25.35A87.58,87.58,0,0,1,65.75,65.77ZM40.33,135.48a103.29,103.29,0,0,0,65-30.11,103.24,103.24,0,0,0,30.13-65,87.78,87.78,0,0,1,80.18,80.14,104,104,0,0,0-95.16,95.1,87.78,87.78,0,0,1-80.18-80.14Zm149.92,54.75a87.69,87.69,0,0,1-53.66,25.31,88,88,0,0,1,79-78.95A87.58,87.58,0,0,1,190.25,190.23Z"></path></svg>
                                </div>
                                <div
                                    className="absolute -bottom-4 -right-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-xl font-['Oswald'] font-bold text-lg uppercase shadow-lg shadow-orange-500/30">
                                    -50% Refurbished
                                </div>
                                <div
                                    className="absolute -top-3 -left-3 bg-[#1e2b3a] border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg">
                                    <span className="text-green-400">30+</span> Rachete disponibile
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {categories.length > 0 && (
                <section className="py-16 bg-white mesh-bg">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-10">
                            <h2 className="font-['Oswald'] text-3xl font-bold uppercase tracking-wide">
                                Cumpara pe <span className="text-gradient">categorii</span>
                            </h2>
                            <p className="text-gray-400 mt-2">Gaseste echipamentul perfect pentru tine</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    to={`/products?category_id=${cat.id}`}
                                    className="group relative bg-[#1a2332] rounded-2xl overflow-hidden h-40 flex items-end p-5 card-hover w-[calc(50%-0.5rem)] sm:w-56 md:w-60 lg:w-64"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg className="w-14 h-14 text-white/20 group-hover:text-white/40 group-hover:scale-110 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="absolute inset-0 bg-green-500/0 group-hover:bg-green-500/10 transition-all duration-300" />
                                    <span className="relative z-20 font-['Oswald'] text-white font-semibold uppercase tracking-wide text-sm">
                                        {cat.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-14">
                        <span className="inline-block text-xs font-semibold text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider mb-3">Buy-Back Program</span>
                        <h2 className="font-['Oswald'] text-3xl font-bold uppercase tracking-wide">
                            Cum functioneaza <span className="text-gradient-orange">Buy-Back</span>?
                        </h2>
                        <p className="text-gray-400 mt-2">Vinde-ti racheta veche in 3 pasi simpli</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: '01', title: 'Alege Racheta', desc: 'Selecteaza brandul si modelul rachetei tale din catalogul nostru.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
                            { step: '02', title: 'Evaluare Online', desc: 'Completeaza formularul cu starea rachetei si primesti un pret instant.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
                            { step: '03', title: 'Primeste Banii', desc: 'Trimite-ne racheta si primesti banii in cel mai scurt timp.', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                        ].map((item) => (
                            <div key={item.step} className="bg-white rounded-2xl p-8 relative group card-hover border border-gray-100">
                                <div className="font-['Oswald'] text-6xl font-bold text-gray-100 absolute top-6 right-6 group-hover:text-green-50 transition">
                                    {item.step}
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/10 flex items-center justify-center mb-5">
                                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                                    </svg>
                                </div>
                                <h3 className="font-['Oswald'] text-lg font-semibold uppercase mb-2">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <Link
                            to="/buyback"
                            className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3.5 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5"
                        >
                            Incepe Evaluarea Acum
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <span className="inline-block text-xs font-semibold text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2">Nou in stoc</span>
                            <h2 className="font-['Oswald'] text-3xl font-bold uppercase tracking-wide">
                                Produse Noi
                            </h2>
                        </div>
                        <Link to="/products?type=new" className="text-green-500 hover:text-green-600 font-semibold text-sm uppercase tracking-wider transition flex items-center gap-1 group">
                            Vezi toate
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                    <ProductGrid products={featuredProducts} />
                </div>
            </section>

            <section className="relative overflow-hidden">
                <div className="bg-gradient-to-r from-[#0f1720] via-[#1a2332] to-[#0f1720]">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(ellipse at 30% 50%, rgba(19, 155, 72, 0.1) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(19, 155, 72, 0.05) 0%, transparent 60%)'
                    }} />
                    <div className="max-w-7xl mx-auto px-4 py-16 relative">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-center md:text-left">
                                <span className="inline-flex items-center gap-2 text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                    Ghid personalizat
                                </span>
                                <h2 className="font-['Oswald'] text-3xl md:text-4xl font-bold text-white uppercase mb-3">
                                    Nu stii ce racheta <span className="text-gradient">sa alegi</span>?
                                </h2>
                                <p className="text-gray-400 max-w-lg">
                                    Raspunde la cateva intrebari simple si iti recomandam racheta potrivita stilului si nivelului tau de joc.
                                </p>
                            </div>
                            <Link
                                to="/advisor"
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-10 py-4 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-0.5 whitespace-nowrap"
                            >
                                Gaseste Racheta Perfecta
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== REFURBISHED PRODUCTS ===== */}
            {refurbishedProducts.length > 0 && (
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex justify-between items-end mb-10">
                            <div>
                                <span className="inline-block text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2">Economiseste</span>
                                <h2 className="font-['Oswald'] text-3xl font-bold uppercase tracking-wide">
                                    Top <span className="text-gradient">Refurbished</span>
                                </h2>
                            </div>
                            <Link to="/products?type=refurbished" className="text-green-500 hover:text-green-600 font-semibold text-sm uppercase tracking-wider transition flex items-center gap-1 group">
                                Vezi toate
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                        <ProductGrid products={refurbishedProducts} />
                    </div>
                </section>
            )}

            {/* ===== BRANDS SECTION ===== */}
            {brands.length > 0 && (
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="font-['Oswald'] text-xl font-bold uppercase tracking-wide text-center mb-10 text-gray-400">
                            Branduri Disponibile
                        </h2>
                        <div className="flex justify-center flex-wrap gap-4">
                            {brands.map((brand) => (
                                <Link
                                    key={brand.id}
                                    to={`/products?brand_id=${brand.id}`}
                                    className="bg-white hover:bg-gray-50 border border-gray-200 hover:border-green-300 px-10 py-5 rounded-2xl text-center transition-all group card-hover"
                                >
                                    <span className="font-['Oswald'] text-lg font-semibold text-gray-500 group-hover:text-green-600 uppercase tracking-wide transition">
                                        {brand.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

/* ===== Product Card Grid Component ===== */
function ProductGrid({ products }) {
    if (!products.length) {
        return <div className="text-center text-gray-400 py-8">Niciun produs disponibil momentan.</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <Link
                    key={product.id}
                    to={`/products/${product.slug}`}
                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover"
                >
                    <div className="relative h-52 bg-gray-50 overflow-hidden">
                        {product.image_url ? (
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                                <svg className="w-16 h-16 text-gray-300 group-hover:text-gray-400 group-hover:scale-110 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                            {product.type === 'refurbished' && (
                                <span className="bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                                    Refurbished {product.condition_grade}
                                </span>
                            )}
                            {product.type === 'new' && (
                                <span className="bg-blue-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                                    Nou
                                </span>
                            )}
                        </div>
                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                            <WishlistButton productId={product.id} />
                            <CompareToggleButton product={product} />
                        </div>
                        {product.stock <= 3 && product.stock > 0 && (
                            <div className="absolute bottom-3 right-3">
                                <span className="bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                                    Ultimele {product.stock} buc!
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="p-5">
                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-1.5">
                            {product.brand?.name}
                        </p>
                        <h3 className="font-medium text-gray-800 group-hover:text-green-600 transition line-clamp-2 text-sm leading-snug">
                            {product.name}
                        </h3>
                        {product.reviews_count > 0 ? (
                            <div className="mt-2">
                                <StarRating
                                    value={parseFloat(product.reviews_avg_rating) || 0}
                                    size="xs"
                                    showCount={product.reviews_count}
                                />
                            </div>
                        ) : (
                            <div className="mt-2">
                                <StarRating value={0} size="xs" showCount={0} />
                            </div>
                        )}
                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                            <span className="font-['Oswald'] text-xl font-bold text-[#1a2332]">
                                {product.price} <span className="text-xs font-medium text-gray-400">RON</span>
                            </span>
                            {product.stock > 0 ? (
                                <span className="flex items-center gap-1.5 text-[10px] text-green-600 font-medium">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                                    In stoc
                                </span>
                            ) : (
                                <span className="text-[10px] text-red-500 font-medium">Indisponibil</span>
                            )}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
