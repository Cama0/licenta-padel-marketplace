import { Link, useLocation } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';

export default function CompareBar() {
    const { items, count, maxItems, remove, clear } = useCompare();
    const location = useLocation();

    // pe pagina /compare e redundant
    if (location.pathname === '/compare' || count === 0) {
        return null;
    }

    return (
        <div
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-4xl"
            style={{ animation: 'slide-up 0.3s ease-out' }}
        >
            <div className="bg-[#1a2332] text-white rounded-2xl shadow-2xl shadow-black/40 border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-4 px-5 py-4 sm:px-6 sm:py-5">
                    <div className="hidden sm:flex w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>

                    <div className="flex items-center gap-3 flex-1 min-w-0 overflow-x-auto py-1 -my-1">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="relative flex-shrink-0 group"
                            >
                                <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                                    {item.image_url ? (
                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <svg className="w-7 h-7 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </div>
                                <button
                                    onClick={() => remove(item.id)}
                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg ring-2 ring-[#1a2332] transition"
                                    title={`Elimina ${item.name}`}
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}

                        {/* sloturi goale */}
                        {Array.from({ length: maxItems - count }).map((_, i) => (
                            <div
                                key={`empty-${i}`}
                                className="hidden sm:flex w-16 h-16 rounded-xl border-2 border-dashed border-white/10 items-center justify-center text-white/20 flex-shrink-0"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                        ))}
                    </div>

                    <div className="hidden md:block text-sm flex-shrink-0">
                        <p className="font-semibold text-white">{count} / {maxItems} produse</p>
                        <button
                            onClick={clear}
                            className="text-xs text-gray-400 hover:text-red-400 transition"
                        >
                            Goleste
                        </button>
                    </div>

                    <Link
                        to="/compare"
                        className={`flex-shrink-0 px-5 sm:px-6 py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all flex items-center gap-2 ${
                            count >= 2
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30'
                                : 'bg-white/10 text-gray-400 cursor-not-allowed pointer-events-none'
                        }`}
                    >
                        Compara
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {count === 1 && (
                    <div className="px-5 pb-3 text-xs text-gray-400 text-center border-t border-white/5 pt-3">
                        Adauga cel putin inca un produs pentru a-l compara
                    </div>
                )}
            </div>
        </div>
    );
}
