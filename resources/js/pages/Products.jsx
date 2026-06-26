import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';
import StarRating from '../components/StarRating';
import CompareToggleButton from '../components/CompareToggleButton';
import WishlistButton from '../components/WishlistButton';

// ===== Optiuni filtrare specs (sincronizate cu backend) =====
const SHAPE_OPTIONS = [
    { value: 'round', label: 'Rotunda', desc: 'Sweet spot mare, control' },
    { value: 'teardrop', label: 'Teardrop', desc: 'Echilibrata, versatila' },
    { value: 'diamond', label: 'Diamond', desc: 'Putere maxima, atac' },
    { value: 'geometric', label: 'Geometrica', desc: 'Design hibrid' },
];
const BALANCE_OPTIONS = [
    { value: 'low', label: 'Jos (maner)', desc: 'Manevrabilitate' },
    { value: 'medium', label: 'Mediu', desc: 'Echilibru' },
    { value: 'high', label: 'Sus (cap)', desc: 'Putere la impact' },
];
const HARDNESS_OPTIONS = [
    { value: 'soft', label: 'Moale', desc: 'Confort, control' },
    { value: 'medium', label: 'Medie', desc: 'Echilibrata' },
    { value: 'hard', label: 'Tare', desc: 'Putere, reactivitate' },
];
const STYLE_OPTIONS = [
    { value: 'control', label: 'Control', desc: 'Joc defensiv' },
    { value: 'allround', label: 'All-round', desc: 'Versatilitate' },
    { value: 'attack', label: 'Atac', desc: 'Joc ofensiv' },
];
const LEVEL_OPTIONS = [
    { value: 'beginner', label: 'Incepator' },
    { value: 'intermediate', label: 'Intermediar' },
    { value: 'advanced', label: 'Avansat' },
    { value: 'professional', label: 'Profesionist' },
];
const SORT_OPTIONS = [
    { value: 'created_at:desc', label: 'Cele mai noi' },
    { value: 'price:asc', label: 'Pret crescator' },
    { value: 'price:desc', label: 'Pret descrescator' },
    { value: 'name:asc', label: 'Nume A-Z' },
    { value: 'rating:desc', label: 'Rating' },
    { value: 'popular:desc', label: 'Popularitate' },
];

const PRICE_MIN = 0;
const PRICE_MAX = 2500;

export default function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // filtre simple
    const type = searchParams.get('type') || '';
    const brandId = searchParams.get('brand_id') || '';
    const categoryId = searchParams.get('category_id') || '';
    const search = searchParams.get('search') || '';
    const page = searchParams.get('page') || 1;

    // filtre specs
    const shapes = parseCsv(searchParams.get('shapes'));
    const balances = parseCsv(searchParams.get('balances'));
    const hardnesses = parseCsv(searchParams.get('core_hardnesses'));
    const styles = parseCsv(searchParams.get('playing_styles'));
    const levels = parseCsv(searchParams.get('playing_levels'));

    // range pret si rating
    const priceMin = searchParams.get('price_min') || '';
    const priceMax = searchParams.get('price_max') || '';
    const minRating = searchParams.get('min_rating') || '';

    // sortare
    const sortKey = `${searchParams.get('sort_by') || 'created_at'}:${searchParams.get('sort_dir') || 'desc'}`;

    useEffect(() => {
        api.get('/brands').then((res) => setBrands(res.data));
        api.get('/categories').then((res) => setCategories(res.data));
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        if (type) params.set('type', type);
        if (brandId) params.set('brand_id', brandId);
        if (categoryId) params.set('category_id', categoryId);
        if (search) params.set('search', search);
        if (shapes.length) params.set('shapes', shapes.join(','));
        if (balances.length) params.set('balances', balances.join(','));
        if (hardnesses.length) params.set('core_hardnesses', hardnesses.join(','));
        if (styles.length) params.set('playing_styles', styles.join(','));
        if (levels.length) params.set('playing_levels', levels.join(','));
        if (priceMin) params.set('price_min', priceMin);
        if (priceMax) params.set('price_max', priceMax);
        if (minRating) params.set('min_rating', minRating);

        const [sortBy, sortDir] = sortKey.split(':');
        params.set('sort_by', sortBy);
        params.set('sort_dir', sortDir);

        params.set('page', page);
        params.set('per_page', 12);

        api.get(`/products?${params.toString()}`)
            .then((res) => {
                setProducts(res.data.data);
                setPagination({
                    currentPage: res.data.current_page,
                    lastPage: res.data.last_page,
                    total: res.data.total,
                });
            })
            .finally(() => setLoading(false));
    }, [type, brandId, categoryId, search, shapes.join(','), balances.join(','), hardnesses.join(','), styles.join(','), levels.join(','), priceMin, priceMax, minRating, sortKey, page]);

    const updateParam = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
            params.delete(key);
        } else {
            params.set(key, Array.isArray(value) ? value.join(',') : value);
        }
        params.delete('page');
        setSearchParams(params);
    };

    const toggleArrayValue = (key, value, currentArr) => {
        const next = currentArr.includes(value)
            ? currentArr.filter((v) => v !== value)
            : [...currentArr, value];
        updateParam(key, next);
    };

    const handleSortChange = (newKey) => {
        const [sortBy, sortDir] = newKey.split(':');
        const params = new URLSearchParams(searchParams);
        params.set('sort_by', sortBy);
        params.set('sort_dir', sortDir);
        params.delete('page');
        setSearchParams(params);
    };

    const pageTitle = type === 'refurbished' ? 'Produse Refurbished' : type === 'new' ? 'Produse Noi' : 'Toate Produsele';

    // numar filtre active pentru badge
    const activeFilterCount =
        [type, brandId, categoryId, search, priceMin, priceMax, minRating].filter(Boolean).length +
        shapes.length + balances.length + hardnesses.length + styles.length + levels.length;

    // Filter chips deasupra grilei
    const activeChips = useMemo(() => {
        const chips = [];
        if (search) chips.push({ key: 'search', label: `"${search}"`, action: () => updateParam('search', '') });
        if (type) chips.push({ key: 'type', label: type === 'new' ? 'Noi' : 'Refurbished', action: () => updateParam('type', '') });
        const brand = brands.find((b) => String(b.id) === String(brandId));
        if (brand) chips.push({ key: 'brand', label: brand.name, action: () => updateParam('brand_id', '') });
        const cat = categories.find((c) => String(c.id) === String(categoryId));
        if (cat) chips.push({ key: 'cat', label: cat.name, action: () => updateParam('category_id', '') });

        shapes.forEach((s) => {
            const opt = SHAPE_OPTIONS.find((o) => o.value === s);
            if (opt) chips.push({ key: `shape-${s}`, label: `Forma: ${opt.label}`, action: () => toggleArrayValue('shapes', s, shapes) });
        });
        balances.forEach((s) => {
            const opt = BALANCE_OPTIONS.find((o) => o.value === s);
            if (opt) chips.push({ key: `bal-${s}`, label: `Balans: ${opt.label}`, action: () => toggleArrayValue('balances', s, balances) });
        });
        hardnesses.forEach((s) => {
            const opt = HARDNESS_OPTIONS.find((o) => o.value === s);
            if (opt) chips.push({ key: `hd-${s}`, label: `Spuma: ${opt.label}`, action: () => toggleArrayValue('core_hardnesses', s, hardnesses) });
        });
        styles.forEach((s) => {
            const opt = STYLE_OPTIONS.find((o) => o.value === s);
            if (opt) chips.push({ key: `st-${s}`, label: `Stil: ${opt.label}`, action: () => toggleArrayValue('playing_styles', s, styles) });
        });
        levels.forEach((s) => {
            const opt = LEVEL_OPTIONS.find((o) => o.value === s);
            if (opt) chips.push({ key: `lv-${s}`, label: `Nivel: ${opt.label}`, action: () => toggleArrayValue('playing_levels', s, levels) });
        });

        if (priceMin || priceMax) {
            const label = priceMin && priceMax ? `${priceMin} - ${priceMax} RON`
                : priceMin ? `Min ${priceMin} RON`
                : `Max ${priceMax} RON`;
            chips.push({
                key: 'price',
                label,
                action: () => {
                    const params = new URLSearchParams(searchParams);
                    params.delete('price_min');
                    params.delete('price_max');
                    setSearchParams(params);
                }
            });
        }

        if (minRating) chips.push({ key: 'rating', label: `${minRating}+ stele`, action: () => updateParam('min_rating', '') });

        return chips;
    }, [type, brandId, categoryId, search, brands, categories, shapes, balances, hardnesses, styles, levels, priceMin, priceMax, minRating]); // eslint-disable-line react-hooks/exhaustive-deps

    const filterContent = (
        <>
            <FilterSection title="Cauta">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Nume produs..."
                        value={search}
                        onChange={(e) => updateParam('search', e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition pl-9"
                    />
                    <svg className="w-4 h-4 text-gray-300 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </FilterSection>
            <FilterSection title="Tip">
                <div className="space-y-1">
                    {[
                        { value: '', label: 'Toate' },
                        { value: 'new', label: 'Noi' },
                        { value: 'refurbished', label: 'Refurbished' },
                    ].map((opt) => (
                        <label key={opt.value} className={`flex items-center gap-2.5 cursor-pointer text-sm px-3 py-2 rounded-lg transition ${type === opt.value ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <input type="radio" name="type" checked={type === opt.value} onChange={() => updateParam('type', opt.value)} className="accent-green-500" />
                            {opt.label}
                        </label>
                    ))}
                </div>
            </FilterSection>
            <FilterSection title="Brand">
                <select
                    value={brandId}
                    onChange={(e) => updateParam('brand_id', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition"
                >
                    <option value="">Toate brandurile</option>
                    {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
            </FilterSection>
            <FilterSection title="Categorie">
                <select
                    value={categoryId}
                    onChange={(e) => updateParam('category_id', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition"
                >
                    <option value="">Toate categoriile</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </FilterSection>
            <FilterSection title="Pret (RON)">
                <div className="flex gap-2 items-center">
                    <input
                        type="number"
                        placeholder="Min"
                        value={priceMin}
                        onChange={(e) => updateParam('price_min', e.target.value)}
                        min={PRICE_MIN}
                        className="w-full border border-gray-200 rounded-xl px-2.5 py-2 text-sm focus:outline-none focus:border-green-500 transition"
                    />
                    <span className="text-gray-300">—</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={priceMax}
                        onChange={(e) => updateParam('price_max', e.target.value)}
                        max={PRICE_MAX}
                        className="w-full border border-gray-200 rounded-xl px-2.5 py-2 text-sm focus:outline-none focus:border-green-500 transition"
                    />
                </div>
            </FilterSection>
            <FilterSection title="Rating minim">
                <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((r) => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => updateParam('min_rating', String(r) === minRating ? '' : String(r))}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                                String(r) === minRating
                                    ? 'bg-amber-400 text-white shadow-sm'
                                    : 'bg-gray-50 text-gray-500 hover:bg-amber-50 hover:text-amber-600'
                            }`}
                            title={`${r}+ stele`}
                        >
                            <span className="inline-flex items-center gap-0.5">
                                {r}
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                            </span>
                        </button>
                    ))}
                </div>
            </FilterSection>

            {/* === Specificatii rachete === */}
            <CollapsibleSection title="Forma" count={shapes.length} defaultOpen={shapes.length > 0}>
                {SHAPE_OPTIONS.map((opt) => (
                    <SpecCheckbox
                        key={opt.value}
                        label={opt.label}
                        desc={opt.desc}
                        checked={shapes.includes(opt.value)}
                        onChange={() => toggleArrayValue('shapes', opt.value, shapes)}
                    />
                ))}
            </CollapsibleSection>

            <CollapsibleSection title="Balans" count={balances.length} defaultOpen={balances.length > 0}>
                {BALANCE_OPTIONS.map((opt) => (
                    <SpecCheckbox
                        key={opt.value}
                        label={opt.label}
                        desc={opt.desc}
                        checked={balances.includes(opt.value)}
                        onChange={() => toggleArrayValue('balances', opt.value, balances)}
                    />
                ))}
            </CollapsibleSection>

            <CollapsibleSection title="Duritate spuma" count={hardnesses.length} defaultOpen={hardnesses.length > 0}>
                {HARDNESS_OPTIONS.map((opt) => (
                    <SpecCheckbox
                        key={opt.value}
                        label={opt.label}
                        desc={opt.desc}
                        checked={hardnesses.includes(opt.value)}
                        onChange={() => toggleArrayValue('core_hardnesses', opt.value, hardnesses)}
                    />
                ))}
            </CollapsibleSection>

            <CollapsibleSection title="Stil de joc" count={styles.length} defaultOpen={styles.length > 0}>
                {STYLE_OPTIONS.map((opt) => (
                    <SpecCheckbox
                        key={opt.value}
                        label={opt.label}
                        desc={opt.desc}
                        checked={styles.includes(opt.value)}
                        onChange={() => toggleArrayValue('playing_styles', opt.value, styles)}
                    />
                ))}
            </CollapsibleSection>

            <CollapsibleSection title="Nivel jucator" count={levels.length} defaultOpen={levels.length > 0}>
                {LEVEL_OPTIONS.map((opt) => (
                    <SpecCheckbox
                        key={opt.value}
                        label={opt.label}
                        checked={levels.includes(opt.value)}
                        onChange={() => toggleArrayValue('playing_levels', opt.value, levels)}
                    />
                ))}
            </CollapsibleSection>
            <button
                onClick={() => setSearchParams({})}
                className="w-full text-sm text-gray-400 hover:text-red-500 py-2.5 border border-gray-200 rounded-xl hover:border-red-200 hover:bg-red-50 transition mt-3"
            >
                Reseteaza toate filtrele
            </button>
        </>
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-gradient-to-r from-[#0f1720] to-[#1a2332]">
                <div className="max-w-7xl mx-auto px-4 py-10">
                    <h1 className="font-['Oswald'] text-3xl font-bold uppercase tracking-wide text-white">{pageTitle}</h1>
                    <p className="text-gray-500 text-sm mt-1.5">
                        {loading ? 'Se incarca...' : pagination.total > 0 ? `${pagination.total} produse gasite` : 'Niciun produs gasit'}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="hidden lg:block lg:w-72 flex-shrink-0">
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-28 shadow-sm max-h-[calc(100vh-8rem)] overflow-y-auto">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-['Oswald'] font-semibold uppercase tracking-wider text-sm text-gray-800">
                                    Filtreaza
                                </h3>
                                {activeFilterCount > 0 && (
                                    <span className="text-[10px] bg-green-500 text-white min-w-[20px] h-5 rounded-full flex items-center justify-center font-bold px-1.5">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </div>
                            {filterContent}
                        </div>
                    </aside>
                    <div className="lg:hidden -mt-4 mb-3 flex gap-2">
                        <button
                            onClick={() => setMobileFiltersOpen(true)}
                            className="flex-1 bg-white border border-gray-200 rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-semibold"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                            Filtre {activeFilterCount > 0 && <span className="bg-green-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">{activeFilterCount}</span>}
                        </button>
                        <select
                            value={sortKey}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="flex-1 bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-sm font-medium focus:outline-none focus:border-green-500"
                        >
                            {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </div>
                    {mobileFiltersOpen && (
                        <div className="lg:hidden fixed inset-0 z-50 flex" onClick={() => setMobileFiltersOpen(false)}>
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                            <div
                                className="relative ml-auto w-full max-w-sm bg-white shadow-2xl overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
                                    <h3 className="font-['Oswald'] font-bold uppercase">Filtre</h3>
                                    <button onClick={() => setMobileFiltersOpen(false)} className="text-gray-400 p-1">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                                <div className="p-4">{filterContent}</div>
                                <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
                                    <button
                                        onClick={() => setMobileFiltersOpen(false)}
                                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold uppercase text-sm tracking-wider"
                                    >
                                        Vezi {pagination.total || 0} produse
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex-grow min-w-0">
                        <div className="hidden lg:flex items-center justify-between mb-5 gap-3 flex-wrap">
                            {activeChips.length > 0 ? (
                                <div className="flex flex-wrap items-center gap-2">
                                    {activeChips.map((chip) => (
                                        <button
                                            key={chip.key}
                                            onClick={chip.action}
                                            className="inline-flex items-center gap-1.5 bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition rounded-full px-3 py-1 text-xs font-medium text-gray-700 group"
                                        >
                                            {chip.label}
                                            <svg className="w-3 h-3 text-gray-400 group-hover:text-red-500 transition" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setSearchParams({})}
                                        className="text-xs text-gray-400 hover:text-red-500 underline ml-2"
                                    >
                                        Sterge tot
                                    </button>
                                </div>
                            ) : <div />}

                            <select
                                value={sortKey}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm font-medium focus:outline-none focus:border-green-500 cursor-pointer"
                            >
                                {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                        <div className="h-52 shimmer" />
                                        <div className="p-5 space-y-3">
                                            <div className="h-3 shimmer rounded w-1/3" />
                                            <div className="h-4 shimmer rounded w-2/3" />
                                            <div className="h-5 shimmer rounded w-1/4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 font-medium">Niciun produs gasit cu filtrele selectate.</p>
                                <button onClick={() => setSearchParams({})} className="mt-3 text-green-500 hover:text-green-600 font-medium text-sm transition">
                                    Reseteaza filtrele
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {products.map((product) => (
                                        <Link
                                            key={product.id}
                                            to={`/products/${product.slug}`}
                                            className="group bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover"
                                        >
                                            <div className="relative h-52 bg-gray-50 overflow-hidden">
                                                {product.image_url ? (
                                                    <img src={product.image_url} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                                                        <span className="bg-blue-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">Nou</span>
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
                                                    {product.brand?.name} {product.category && `· ${product.category.name}`}
                                                </p>
                                                <h3 className="font-medium text-gray-800 group-hover:text-green-600 transition line-clamp-2 text-sm leading-snug">
                                                    {product.name}
                                                </h3>
                                                <div className="mt-2">
                                                    <StarRating
                                                        value={parseFloat(product.reviews_avg_rating) || 0}
                                                        size="xs"
                                                        showCount={product.reviews_count || 0}
                                                    />
                                                </div>
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
                                {pagination.lastPage > 1 && (
                                    <div className="flex justify-center gap-2 mt-10">
                                        {Array.from({ length: pagination.lastPage }, (_, i) => i + 1).map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => {
                                                    const params = new URLSearchParams(searchParams);
                                                    params.set('page', p);
                                                    setSearchParams(params);
                                                }}
                                                className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                                                    p === pagination.currentPage
                                                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                                                        : 'bg-white text-gray-500 border border-gray-200 hover:border-green-300 hover:text-green-600'
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ===== Componente helper ===== */

function FilterSection({ title, children }) {
    return (
        <div className="mb-5">
            <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2">{title}</label>
            {children}
        </div>
    );
}

function CollapsibleSection({ title, count, defaultOpen, children }) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="mb-3 border-t border-gray-100 pt-3">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between text-left mb-2 group"
            >
                <span className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                    {title}
                    {count > 0 && (
                        <span className="bg-green-500 text-white text-[9px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1.5 font-bold">
                            {count}
                        </span>
                    )}
                </span>
                <svg
                    className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform ${open ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {open && <div className="space-y-1 pl-1">{children}</div>}
        </div>
    );
}

function SpecCheckbox({ label, desc, checked, onChange }) {
    return (
        <label className={`flex items-start gap-2.5 cursor-pointer text-sm px-2.5 py-1.5 rounded-lg transition ${checked ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="mt-0.5 accent-green-500 w-4 h-4 cursor-pointer"
            />
            <div className="flex-1 min-w-0">
                <p className={`font-medium ${checked ? 'text-green-700' : 'text-gray-700'}`}>{label}</p>
                {desc && <p className="text-[10px] text-gray-400 mt-0.5">{desc}</p>}
            </div>
        </label>
    );
}

function parseCsv(value) {
    if (!value) return [];
    return value.split(',').map((v) => v.trim()).filter(Boolean);
}
