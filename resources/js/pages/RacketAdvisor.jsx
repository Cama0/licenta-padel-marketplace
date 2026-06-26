import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const STEPS = [
    { key: 'welcome', type: 'info' },
    { key: 'playing_level', type: 'select', field: 'playing_levels', question: 'Ce nivel de experienta ai in padel?' },
    { key: 'playing_style', type: 'select', field: 'playing_styles', question: 'Ce stil de joc preferi?' },
    { key: 'shape', type: 'select', field: 'shapes', question: 'Ce forma de racheta preferi?' },
    { key: 'balance', type: 'select', field: 'balances', question: 'Ce tip de balans cauti?' },
    { key: 'core_hardness', type: 'select', field: 'core_hardnesses', question: 'Ce duritate a spumei preferi?' },
    { key: 'budget', type: 'select', field: 'budget_ranges', question: 'Care este bugetul tau?' },
    { key: 'product_type', type: 'select', field: 'product_types', question: 'Preferi rachete noi sau refurbished?' },
    { key: 'results', type: 'results' },
];

export default function RacketAdvisor() {
    const [filterOptions, setFilterOptions] = useState(null);
    const [messages, setMessages] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(false);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        api.get('/advisor/filter-options').then((res) => {
            setFilterOptions(res.data);
            setMessages([{
                from: 'bot',
                text: 'Salut! Sunt asistentul tau PadelMarket. Te voi ajuta sa gasesti racheta perfecta de padel. Voi pune cateva intrebari despre preferintele tale si iti voi recomanda cele mai potrivite optiuni.',
                time: new Date(),
            }, {
                from: 'bot',
                text: 'Hai sa incepem! Raspunde la intrebarile de mai jos selectand optiunea potrivita.',
                time: new Date(),
            }]);
            setCurrentStep(1);
        });
    }, []);

    // scroll doar in chat, nu in toata pagina
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, currentStep]);

    const handleSelectOption = async (stepKey,  value, label) => {
        setMessages((prev) => [...prev, {
            from: 'user',
            text: label,
            time: new Date(),
        }]);

        const newAnswers = { ...answers, [stepKey]: value };
        setAnswers(newAnswers);

        const nextStepIndex = currentStep + 1;
        const nextStep = STEPS[nextStepIndex];

        const confirmations = {
            playing_level: `Nivel: ${label}.`,
            playing_style: `Stil: ${label}.`,
            shape: `Forma: ${label}.`,
            balance: `Balans: ${label}.`,
            core_hardness: `Spuma: ${label}.`,
            budget: `Buget: ${label}.`,
            product_type: `Preferinta: ${label}.`,
        };

        setMessages((prev) => [...prev, {
            from: 'bot',
            text: confirmations[stepKey] || 'Am notat!',
            time: new Date(),
        }]);

        if (nextStep?.type === 'results' || nextStepIndex >= STEPS.length) {
            setTimeout(() => fetchRecommendations(newAnswers), 500);
        } else {
            setTimeout(() => setCurrentStep(nextStepIndex), 400);
        }
    };

    const fetchRecommendations = async (finalAnswers) => {
        setLoading(true);
        setMessages((prev) => [...prev, {
            from: 'bot',
            text: 'Analizez catalogul nostru si caut racheta perfecta pentru tine...',
            time: new Date(),
            isLoading: true,
        }]);

        try {
            const budget = finalAnswers.budget || '';
            let budgetMin = 0, budgetMax = 99999;
            if (budget.includes('-')) {
                [budgetMin, budgetMax] = budget.split('-').map(Number);
            } else if (budget.includes('+')) {
                budgetMin = parseInt(budget);
            }

            const res = await api.post('/advisor/recommend', {
                playing_style: finalAnswers.playing_style || null,
                playing_level: finalAnswers.playing_level || null,
                shape: finalAnswers.shape || null,
                balance: finalAnswers.balance || null,
                core_hardness: finalAnswers.core_hardness || null,
                budget_min: budgetMin,
                budget_max: budgetMax,
                product_type: finalAnswers.product_type || null,
            });

            setRecommendations(res.data);
            setCurrentStep(STEPS.length - 1);

            setMessages((prev) => {
                const filtered = prev.filter((m) => !m.isLoading);
                return [...filtered, {
                    from: 'bot',
                    text: res.data.summary,
                    time: new Date(),
                }];
            });
        } catch {
            setMessages((prev) => {
                const filtered = prev.filter((m) => !m.isLoading);
                return [...filtered, {
                    from: 'bot',
                    text: 'A aparut o eroare. Te rog sa incerci din nou.',
                    time: new Date(),
                }];
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRestart = () => {
        setCurrentStep(1);
        setAnswers({});
        setRecommendations(null);
        setMessages([{
            from: 'bot',
            text: 'Hai sa incercam din nou! Raspunde la intrebari pentru o noua recomandare.',
            time: new Date(),
        }]);
    };

    const currentStepData = STEPS[currentStep];

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-gradient-to-r from-[#0f1720] to-[#1a2332]">
                <div className="max-w-3xl mx-auto px-4 py-10 text-center">
                    <span className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        Ghid personalizat
                    </span>
                    <h1 className="font-['Oswald'] text-3xl font-bold uppercase tracking-wide text-white">
                        Gaseste racheta <span className="text-gradient">perfecta</span>
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Raspunde la cateva intrebari ca sa-ti recomandam racheta potrivita
                    </p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-[#1a2332] to-[#2e3946] px-5 py-3.5 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-green-500/20">
                            PM
                        </div>
                        <div>
                            <p className="text-white font-medium text-sm">PadelMarket Advisor</p>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                <span className="text-green-400 text-xs">Online</span>
                            </div>
                        </div>
                        <div className="ml-auto flex items-center gap-1.5">
                            {STEPS.filter(s => s.type === 'select').map((_, i) => (
                                <div key={i} className={`w-2 h-2 rounded-full transition-all ${
                                    i < currentStep - 1 ? 'bg-green-400' : i === currentStep - 1 ? 'bg-white' : 'bg-white/20'
                                }`} />
                            ))}
                        </div>
                    </div>
                    <div ref={chatContainerRef} className="h-[500px] overflow-y-auto p-5 space-y-4 bg-gray-50/30">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                                 style={{ animation: 'slide-up 0.2s ease-out' }}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                                    msg.from === 'user'
                                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white rounded-br-md shadow-sm shadow-green-500/10'
                                        : 'bg-white border border-gray-100 text-gray-700 rounded-bl-md shadow-sm'
                                }`}>
                                    {msg.isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                            <span className="text-sm">{msg.text}</span>
                                        </div>
                                    ) : (
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                    )}
                                    <p className={`text-[10px] mt-1 ${msg.from === 'user' ? 'text-green-200' : 'text-gray-400'}`}>
                                        {msg.time.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {currentStepData && currentStepData.type === 'select' && filterOptions && !loading && (
                            <div className="flex justify-start" style={{ animation: 'slide-up 0.3s ease-out' }}>
                                <div className="max-w-[90%]">
                                    <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm mb-3">
                                        <p className="text-sm font-medium text-gray-800">{currentStepData.question}</p>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {filterOptions[currentStepData.field]?.map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => handleSelectOption(currentStepData.key, opt.value, opt.label)}
                                                className="text-left bg-white border border-gray-100 rounded-xl px-4 py-3 hover:border-green-400 hover:shadow-md transition-all group"
                                            >
                                                <p className="font-medium text-sm text-gray-800 group-hover:text-green-600 transition">
                                                    {opt.label}
                                                </p>
                                                {opt.description && (
                                                    <p className="text-xs text-gray-400 mt-0.5">{opt.description}</p>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {currentStepData?.type === 'results' && recommendations && (
                            <div className="space-y-3" style={{ animation: 'slide-up 0.4s ease-out' }}>
                                {recommendations.recommendations.length === 0 && !recommendations.bonus_recommendation ? (
                                    <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500">Nu am gasit rachete care sa corespunda tuturor criteriilor.</p>
                                    </div>
                                ) : (
                                    <>
                                        
                                        {recommendations.bonus_recommendation && (
                                            <div style={{ animation: 'slide-up 0.3s ease-out' }}>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
                                                    <span className="text-xs font-bold uppercase tracking-widest text-amber-500 whitespace-nowrap flex items-center gap-1.5">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                                        </svg>
                                                        Recomandarea Specialistilor
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                                        </svg>
                                                    </span>
                                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
                                                </div>
                                                <RecommendationCard rec={recommendations.bonus_recommendation} rank="bonus" />
                                            </div>
                                        )}
                                        {recommendations.recommendations.map((rec, i) => (
                                            <RecommendationCard key={rec.product.id} rec={rec} rank={i + 1} />
                                        ))}
                                    </>
                                )}

                                <div className="flex justify-center pt-3">
                                    <button
                                        onClick={handleRestart}
                                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20"
                                    >
                                        Reincepe evaluarea
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ===== Recommendation Card ===== */
function RecommendationCard({ rec, rank }) {
    const product = rec.product;
    const percentage = rec.match_percentage;
    const isBonus = rank === 'bonus';

    const matchColor = isBonus ? 'text-amber-600 bg-amber-50 border-amber-300'
        : percentage >= 80 ? 'text-green-500 bg-green-50 border-green-200'
        : percentage >= 60 ? 'text-yellow-600 bg-yellow-50 border-yellow-200'
        : 'text-gray-500 bg-gray-50 border-gray-200';

    const barColor = isBonus ? 'from-amber-400 to-yellow-400'
        : percentage >= 80 ? 'from-green-400 to-green-500'
        : percentage >= 60 ? 'from-yellow-400 to-yellow-500'
        : 'from-gray-300 to-gray-400';

    return (
        <div className={`rounded-2xl overflow-hidden hover:shadow-lg transition-all ${
            isBonus
                ? 'bg-gradient-to-br from-amber-50 via-white to-amber-50 border-2 border-amber-300/60 relative'
                : 'bg-white border border-gray-100'
        }`}>
            {isBonus && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" />}

            <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        
                        {isBonus ? (
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-400/20">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                            </div>
                        ) : rank <= 3 ? (
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                                rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-yellow-900 shadow-lg shadow-yellow-400/20' :
                                rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700' :
                                'bg-gradient-to-br from-orange-300 to-orange-400 text-orange-800'
                            }`}>
                                {rank}
                            </div>
                        ) : null}
                        <div>
                            <p className={`text-[11px] font-medium uppercase tracking-wider ${isBonus ? 'text-amber-600 font-semibold' : 'text-gray-400'}`}>
                                {product.brand?.name}{isBonus ? ' — Premium Pick' : ''}
                            </p>
                            <h3 className="font-['Oswald'] text-lg font-semibold uppercase">
                                {product.name}
                            </h3>
                        </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-xl border text-sm font-bold ${matchColor}`}>
                        {percentage}%
                    </div>
                </div>
                <div className={`w-full rounded-full h-2 mb-4 ${isBonus ? 'bg-amber-100' : 'bg-gray-100'}`}>
                    <div className={`h-2 rounded-full bg-gradient-to-r ${barColor} transition-all`} style={{ width: `${percentage}%` }} />
                </div>
                {isBonus && (
                    <div className="bg-amber-50 border border-amber-200/60 rounded-xl px-4 py-2.5 mb-4">
                        <p className="text-xs text-amber-700 leading-relaxed">
                            <span className="font-semibold">Peste buget:</span> Aceasta racheta depaseste bugetul setat, dar se potriveste profilului tau de joc.
                        </p>
                    </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                    {product.shape && <SpecBadge label="Forma" value={product.shape} />}
                    {product.balance && <SpecBadge label="Balans" value={product.balance} />}
                    {product.core_hardness && <SpecBadge label="Spuma" value={product.core_hardness} />}
                    {product.playing_style && <SpecBadge label="Stil" value={product.playing_style} />}
                </div>
                {(product.power_rating || product.control_rating) && (
                    <div className="grid grid-cols-4 gap-3 mb-4">
                        <RatingBar label="Putere" value={product.power_rating} color="from-red-400 to-red-500" />
                        <RatingBar label="Control" value={product.control_rating} color="from-blue-400 to-blue-500" />
                        <RatingBar label="Spin" value={product.spin_rating} color="from-purple-400 to-purple-500" />
                        <RatingBar label="Confort" value={product.comfort_rating} color="from-green-400 to-green-500" />
                    </div>
                )}
                {rec.match_details?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {rec.match_details.map((d, i) => (
                            <span key={i} className={`text-[10px] px-2 py-0.5 rounded-lg font-medium ${
                                d.match === 'perfect' ? 'bg-green-50 text-green-700' :
                                d.match === 'partial' ? 'bg-yellow-50 text-yellow-700' :
                                'bg-red-50 text-red-600'
                            }`}>
                                {d.criterion}: {d.match === 'perfect' ? 'Perfect' : d.match === 'partial' ? 'Partial' : 'Nu'}
                            </span>
                        ))}
                    </div>
                )}
                <div className={`flex items-center justify-between pt-4 border-t ${isBonus ? 'border-amber-200/60' : 'border-gray-100'}`}>
                    <div>
                        <span className="font-['Oswald'] text-2xl font-bold text-[#1a2332]">{product.price}</span>
                        <span className="text-sm text-gray-400 ml-1">RON</span>
                        <div className="flex gap-1.5 mt-0.5">
                            {product.type === 'refurbished' && (
                                <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-lg font-medium">
                                    Refurbished {product.condition_grade}
                                </span>
                            )}
                            {product.stock > 0 ? (
                                <span className="text-[10px] text-green-600">In stoc</span>
                            ) : (
                                <span className="text-[10px] text-red-500">Indisponibil</span>
                            )}
                        </div>
                    </div>
                    <Link
                        to={`/products/${product.slug}`}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all shadow-sm text-white ${
                            isBonus
                                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-amber-500/20'
                                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-500/20'
                        }`}
                    >
                        Vezi detalii
                    </Link>
                </div>
            </div>
        </div>
    );
}

function SpecBadge({ label, value }) {
    return (
        <div className="bg-gray-50 rounded-xl px-2.5 py-2 text-center border border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</p>
            <p className="text-xs font-semibold text-gray-700 capitalize">{value}</p>
        </div>
    );
}

function RatingBar({ label, value, color }) {
    if (!value) return null;
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-gray-500">{label}</span>
                <span className="text-[10px] font-bold text-gray-700">{value}/10</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full bg-gradient-to-r ${color}`} style={{ width: `${value * 10}%` }} />
            </div>
        </div>
    );
}
