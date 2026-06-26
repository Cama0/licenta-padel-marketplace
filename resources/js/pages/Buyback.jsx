import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Buyback() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const formRef = useRef(null);

    const [brands, setBrands] = useState([]);
    const [rackets, setRackets] = useState([]);
    const [criteria, setCriteria] = useState([]);

    const [step, setStep] = useState(1);
    const [selectedBrandId, setSelectedBrandId] = useState('');
    const [selectedRacketId, setSelectedRacketId] = useState('');
    const [selectedOptions, setSelectedOptions] = useState({});
    const [priceResult, setPriceResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        api.get('/brands').then((res) => setBrands(res.data));
        api.get('/evaluation-criteria').then((res) => setCriteria(res.data));
    }, []);

    useEffect(() => {
        if (selectedBrandId) {
            api.get(`/padel-rackets?brand_id=${selectedBrandId}`).then((res) => setRackets(res.data));
            setSelectedRacketId('');
        } else {
            setRackets([]);
        }
    }, [selectedBrandId]);

    const selectedRacket = rackets.find((r) => r.id === Number(selectedRacketId));
    const allCriteriaAnswered = criteria.length > 0 && criteria.every((c) => selectedOptions[c.id]);

    const handleOptionSelect = (criterionId, optionId) => {
        setSelectedOptions((prev) => ({ ...prev, [criterionId]: optionId }));
    };

    // scroll la formular la schimbarea pasului
    const scrollToForm = () => {
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleStepChange = (newStep) => {
        setStep(newStep);
        // delay ca sa apuce sa randeze pasul nou
        setTimeout(scrollToForm, 100);
    };

    const handleCalculatePrice = async () => {
        setLoading(true);
        try {
            const res = await api.post('/buyback/calculate-price', {
                padel_racket_id: Number(selectedRacketId),
                selected_option_ids: Object.values(selectedOptions),
            });
            setPriceResult(res.data);
            handleStepChange(3);
        } catch { toast.error('Eroare la calculul pretului. Te rog incearca din nou.'); }
        finally { setLoading(false); }
    };

    const handleSubmitRequest = async () => {
        if (!user) { navigate('/login'); return; }
        setSubmitting(true);
        try {
            await api.post('/buyback/requests', {
                padel_racket_id: Number(selectedRacketId),
                selected_option_ids: Object.values(selectedOptions),
            });
            setSubmitted(true);
            toast.success('Cererea ta a fost trimisa cu succes!');
        } catch { toast.error('Eroare la trimiterea cererii.'); }
        finally { setSubmitting(false); }
    };

    const handleReset = () => {
        setStep(1); setSelectedBrandId(''); setSelectedRacketId('');
        setSelectedOptions({}); setPriceResult(null); setSubmitted(false);
        setTimeout(scrollToForm, 100);
    };

    const steps = ['Selecteaza racheta', 'Evaluare stare', 'Oferta de pret'];

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-gradient-to-r from-[#0f1720] to-[#1a2332]">
                <div className="max-w-3xl mx-auto px-4 py-12 text-center">
                    <span className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Buy-Back Program
                    </span>
                    <h1 className="font-['Oswald'] text-3xl md:text-4xl font-bold uppercase tracking-wide text-white">
                        Vinde-ti Racheta de <span className="text-gradient">Padel</span>
                    </h1>
                    <p className="text-gray-500 mt-2 max-w-xl mx-auto">
                        Completeaza formularul de evaluare si primesti o oferta de pret instant
                    </p>
                    <div className="flex items-center justify-center mt-10 gap-0">
                        {steps.map((label, i) => (
                            <div key={i} className="flex items-center">
                                <div className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border-2 transition-all ${
                                        step > i + 1 ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/20' :
                                        step === i + 1 ? 'bg-white border-white text-[#1a2332]' :
                                        'border-gray-600 text-gray-600'
                                    }`}>
                                        {step > i + 1 ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                        ) : i + 1}
                                    </div>
                                    <span className={`text-xs mt-2 font-medium ${
                                        step === i + 1 ? 'text-white' : 'text-gray-600'
                                    }`}>
                                        {label}
                                    </span>
                                </div>
                                {i < 2 && (
                                    <div className={`w-16 md:w-24 h-0.5 mx-3 mb-5 rounded-full ${step > i + 1 ? 'bg-green-500' : 'bg-gray-700'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-8" ref={formRef}>
                
                {step === 1 && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm" style={{ animation: 'slide-up 0.3s ease-out' }}>
                        <h2 className="font-['Oswald'] text-xl font-semibold uppercase tracking-wide mb-6">
                            Pasul 1: Alege racheta
                        </h2>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2">Brand</label>
                                <select
                                    value={selectedBrandId}
                                    onChange={(e) => setSelectedBrandId(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition text-gray-700"
                                >
                                    <option value="">— Alege brandul —</option>
                                    {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                            </div>

                            {selectedBrandId && (
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-3">Model</label>
                                    {rackets.length === 0 ? (
                                        <p className="text-gray-400 text-sm py-6 text-center bg-gray-50 rounded-xl border border-gray-100">
                                            Nicio racheta disponibila pentru acest brand.
                                        </p>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {rackets.map((r) => (
                                                <button
                                                    key={r.id}
                                                    onClick={() => setSelectedRacketId(String(r.id))}
                                                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                                                        selectedRacketId === String(r.id)
                                                            ? 'border-green-500 bg-green-50 shadow-md shadow-green-500/10'
                                                            : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                                                    }`}
                                                >
                                                    <p className="font-semibold text-gray-800 text-sm">{r.brand.name} {r.model}</p>
                                                    <p className="text-sm text-gray-400 mt-1">Pret baza: <span className="font-['Oswald'] text-green-600 font-semibold">{r.base_buyback_price} RON</span></p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => handleStepChange(2)}
                            disabled={!selectedRacketId}
                            className="mt-8 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3.5 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-green-500/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:from-gray-400 disabled:to-gray-500 flex items-center justify-center gap-2"
                        >
                            Continua la evaluare
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm" style={{ animation: 'slide-up 0.3s ease-out' }}>
                        <h2 className="font-['Oswald'] text-xl font-semibold uppercase tracking-wide mb-1">
                            Pasul 2: Evalueaza starea rachetei
                        </h2>
                        {selectedRacket && (
                            <p className="text-sm text-gray-400 mb-6">
                                {selectedRacket.brand.name} {selectedRacket.model} — Pret baza: <span className="font-['Oswald'] font-semibold text-green-600">{selectedRacket.base_buyback_price} RON</span>
                            </p>
                        )}

                        <div className="space-y-4">
                            {criteria.map((criterion, idx) => (
                                <div key={criterion.id} className="border border-gray-100 rounded-xl overflow-hidden">
                                    <div className="bg-gray-50 px-5 py-3.5 border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1a2332] to-[#2e3946] text-white text-xs font-bold flex items-center justify-center">
                                                {idx + 1}
                                            </span>
                                            <div>
                                                <h3 className="font-semibold text-gray-800 text-sm">{criterion.name}</h3>
                                                {criterion.description && (
                                                    <p className="text-xs text-gray-400 mt-0.5">{criterion.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3 space-y-1.5">
                                        {criterion.options.map((option) => (
                                            <label
                                                key={option.id}
                                                className={`flex items-center p-3.5 rounded-xl cursor-pointer transition-all ${
                                                    selectedOptions[criterion.id] === option.id
                                                        ? 'bg-green-50 border border-green-200 shadow-sm'
                                                        : 'border border-transparent hover:bg-gray-50'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`criterion-${criterion.id}`}
                                                    checked={selectedOptions[criterion.id] === option.id}
                                                    onChange={() => handleOptionSelect(criterion.id, option.id)}
                                                    className="accent-green-500 mr-3"
                                                />
                                                <span className="flex-grow text-sm text-gray-700">{option.label}</span>
                                                {Number(option.price_modifier_value) !== 0 && (
                                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                                                        Number(option.price_modifier_value) < 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                                                    }`}>
                                                        {option.price_modifier_type === 'percentage'
                                                            ? `${option.price_modifier_value}%`
                                                            : `${option.price_modifier_value} RON`}
                                                    </span>
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => handleStepChange(1)}
                                className="flex-1 border border-gray-200 py-3.5 rounded-xl font-semibold text-sm uppercase tracking-wider hover:bg-gray-50 transition text-gray-500 flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                Inapoi
                            </button>
                            <button
                                onClick={handleCalculatePrice}
                                disabled={!allCriteriaAnswered || loading}
                                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3.5 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-green-500/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                            >
                                {loading ? 'Se calculeaza...' : (
                                    <>
                                        Calculeaza pretul
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && priceResult && !submitted && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm" style={{ animation: 'slide-up 0.3s ease-out' }}>
                        <h2 className="font-['Oswald'] text-xl font-semibold uppercase tracking-wide mb-6 text-center">
                            Oferta noastra de pret
                        </h2>
                        <div className="bg-gradient-to-br from-[#0f1720] to-[#1a2332] rounded-2xl p-8 text-center mb-6 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20" style={{
                                backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(19, 155, 72, 0.2) 0%, transparent 60%)'
                            }} />
                            <div className="relative">
                                <p className="text-gray-500 text-sm mb-2">
                                    {priceResult.racket.brand.name} {priceResult.racket.model}
                                </p>
                                <div className="flex items-baseline justify-center gap-2">
                                    <span className="font-['Oswald'] text-6xl font-bold text-gradient">
                                        {priceResult.offered_price}
                                    </span>
                                    <span className="text-xl text-gray-500 font-medium">RON</span>
                                </div>
                                <p className="text-gray-600 text-xs mt-2">
                                    Pret de baza: {priceResult.base_price} RON
                                </p>
                            </div>
                        </div>
                        <div className="mb-6">
                            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">
                                Detalii calcul
                            </h3>
                            <div className="bg-gray-50 rounded-xl divide-y divide-gray-100 border border-gray-100">
                                <div className="flex justify-between px-5 py-3.5">
                                    <span className="text-sm text-gray-600">Pret de baza</span>
                                    <span className="font-['Oswald'] font-semibold">{priceResult.base_price} RON</span>
                                </div>
                                {priceResult.deductions.map((d, i) => (
                                    Number(d.amount) !== 0 && (
                                        <div key={i} className="flex justify-between px-5 py-3.5">
                                            <span className="text-sm text-gray-600">{d.label}</span>
                                            <span className="font-['Oswald'] font-semibold text-red-500">
                                                {Number(d.amount) > 0 ? '+' : ''}{d.amount} RON
                                                {d.type === 'percentage' && <span className="text-xs text-gray-400 ml-1">({d.value}%)</span>}
                                            </span>
                                        </div>
                                    )
                                ))}
                                <div className="flex justify-between px-5 py-4 font-bold">
                                    <span>Total oferit</span>
                                    <span className="font-['Oswald'] text-lg text-green-600">{priceResult.offered_price} RON</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleReset}
                                className="flex-1 border border-gray-200 py-3.5 rounded-xl font-semibold text-sm uppercase tracking-wider hover:bg-gray-50 transition text-gray-500"
                            >
                                Evaluare noua
                            </button>
                            <button
                                onClick={handleSubmitRequest}
                                disabled={submitting}
                                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3.5 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
                            >
                                {submitting ? 'Se trimite...' : user ? 'Trimite cererea' : 'Login pentru a trimite'}
                            </button>
                        </div>
                    </div>
                )}
                {submitted && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm" style={{ animation: 'slide-up 0.3s ease-out' }}>
                        <div className="w-16 h-16 bg-green-50 border border-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="font-['Oswald'] text-2xl font-bold uppercase text-green-600 mb-2">Cerere trimisa!</h2>
                        <p className="text-gray-500 max-w-md mx-auto mb-8">
                            Vom analiza cererea ta si te vom contacta in cel mai scurt timp.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={handleReset} className="border border-gray-200 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition text-gray-500">
                                Evaluare noua
                            </button>
                            <button onClick={() => navigate('/my-requests')} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-green-500/20">
                                Vezi cererile mele
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
