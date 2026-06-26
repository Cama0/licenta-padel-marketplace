import { Link, useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-180px)] flex items-center justify-center px-4 py-16 mesh-bg">
            <div className="max-w-2xl w-full text-center" style={{ animation: 'slide-up 0.4s ease-out' }}>
                
                <div className="relative inline-block mb-8">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-[#1a2332] to-[#0f1720] flex items-center justify-center shadow-2xl shadow-black/20 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-0.5 bg-green-400/30" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-0.5 h-full bg-green-400/30" />
                        </div>

                        <span className="font-['Oswald'] text-5xl font-bold text-white relative z-10">
                            <span className="text-gradient">4</span>
                            <span className="text-green-400 inline-block animate-bounce" style={{ animationDuration: '2s' }}>0</span>
                            <span className="text-gradient">4</span>
                        </span>
                    </div>
                    <div className="w-24 h-3 mx-auto mt-2 bg-black/10 rounded-full blur-sm" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                </div>
                <h1 className="font-['Oswald'] text-4xl md:text-5xl font-bold uppercase tracking-wide text-[#1a2332] mb-3">
                    Out of <span className="text-gradient">bounds!</span>
                </h1>
                <p className="text-gray-500 text-base md:text-lg mb-2 max-w-md mx-auto">
                    Mingea a iesit din teren — pagina pe care o cauti nu exista sau a fost mutata.
                </p>
                <p className="text-gray-400 text-sm mb-10">
                    Verifica URL-ul sau intoarce-te la una din optiunile de mai jos.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-white border-2 border-gray-200 hover:border-green-500 text-gray-700 hover:text-green-600 px-6 py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Inapoi
                    </button>
                    <Link
                        to="/"
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        Pagina principala
                    </Link>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-4">Sau exploreaza</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <QuickLink
                            to="/products"
                            label="Magazin"
                            desc="Toate rachetele"
                            icon="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            color="green"
                        />
                        <QuickLink
                            to="/advisor"
                            label="Advisor"
                            desc="Gaseste racheta"
                            icon="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            color="blue"
                        />
                        <QuickLink
                            to="/buyback"
                            label="Buy-back"
                            desc="Vinde racheta"
                            icon="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                            color="orange"
                        />
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-6">
                    Crezi ca e o eroare? Contacteaza-ne la{' '}
                    <a href="mailto:contact@padelmarket.ro" className="text-green-600 hover:underline">
                        contact@padelmarket.ro
                    </a>
                </p>
            </div>
        </div>
    );
}

function QuickLink({ to, label, desc, icon, color }) {
    const colorMap = {
        green: 'hover:border-green-300 hover:text-green-600 group-hover:bg-green-100',
        blue: 'hover:border-blue-300 hover:text-blue-600 group-hover:bg-blue-100',
        orange: 'hover:border-orange-300 hover:text-orange-600 group-hover:bg-orange-100',
    };
    const bgMap = {
        green: 'bg-green-50 text-green-600',
        blue: 'bg-blue-50 text-blue-600',
        orange: 'bg-orange-50 text-orange-600',
    };

    return (
        <Link
            to={to}
            className={`group bg-white border-2 border-gray-100 rounded-xl p-4 text-center transition-all ${colorMap[color]}`}
        >
            <div className={`w-10 h-10 rounded-xl ${bgMap[color]} flex items-center justify-center mx-auto mb-2 transition-colors`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                </svg>
            </div>
            <p className="font-['Oswald'] font-semibold uppercase text-sm text-gray-800">{label}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>
        </Link>
    );
}
