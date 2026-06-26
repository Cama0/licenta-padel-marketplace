import { useNavigate } from 'react-router-dom';

export default function Footer() {
    const navigate = useNavigate();

    const handleNavClick = (to) => {
        navigate(to);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-[#0f1720] text-gray-500 mt-auto">
            
            <div className="bg-[#141e29] border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="font-['Oswald'] text-xl font-semibold text-white uppercase tracking-wide">
                            Aboneaza-te la Newsletter
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Primeste 10% reducere la prima comanda si noutati despre padel.</p>
                    </div>
                    <div className="flex w-full md:w-auto">
                        <input
                            type="email"
                            placeholder="Adresa ta de email"
                            className="bg-white/[0.05] border border-white/10 text-white placeholder-gray-600 rounded-l-xl px-5 py-3 w-full md:w-72 focus:outline-none focus:border-green-500/50 transition text-sm"
                        />
                        <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-r-xl font-semibold text-sm uppercase tracking-wider transition-all whitespace-nowrap">
                            Aboneaza-te
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    
                    <div>
                        <div className="flex items-center gap-2.5 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/10">
                                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                            </div>
                            <span className="font-['Oswald'] text-lg font-bold text-white uppercase tracking-wider">
                                Padel<span className="text-green-400">Market</span>
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-500">
                            Marketplace-ul tau premium de echipamente de padel, noi si refurbished. Calitate garantata.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-['Oswald'] text-white font-semibold uppercase tracking-wider mb-5 text-sm">
                            Magazin
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li><button onClick={() => handleNavClick('/products?type=new')} className="hover:text-green-400 transition text-left">Produse Noi</button></li>
                            <li><button onClick={() => handleNavClick('/products?type=refurbished')} className="hover:text-green-400 transition text-left">Refurbished</button></li>
                            <li><button onClick={() => handleNavClick('/products')} className="hover:text-green-400 transition text-left">Toate Produsele</button></li>
                            <li><button onClick={() => handleNavClick('/advisor')} className="hover:text-green-400 transition text-left">Gaseste Racheta</button></li>
                            <li><button onClick={() => handleNavClick('/buyback')} className="hover:text-green-400 transition text-left">Vinde Racheta</button></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-['Oswald'] text-white font-semibold uppercase tracking-wider mb-5 text-sm">
                            Informatii
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li><button onClick={() => handleNavClick('/despre-noi')} className="hover:text-green-400 transition text-left">Despre noi</button></li>
                            <li><button onClick={() => handleNavClick('/cum-functioneaza-buyback')} className="hover:text-green-400 transition text-left">Cum functioneaza Buy-Back</button></li>
                            <li><button onClick={() => handleNavClick('/politica-retur')} className="hover:text-green-400 transition text-left">Politica de retur</button></li>
                            <li><button onClick={() => handleNavClick('/termeni-conditii')} className="hover:text-green-400 transition text-left">Termeni si conditii</button></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-['Oswald'] text-white font-semibold uppercase tracking-wider mb-5 text-sm">
                            Contact
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2.5">
                                <svg className="w-4 h-4 text-green-500/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                0721 000 000
                            </li>
                            <li className="flex items-center gap-2.5">
                                <svg className="w-4 h-4 text-green-500/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                contact@padelmarket.ro
                            </li>
                            <li className="flex items-center gap-2.5">
                                <svg className="w-4 h-4 text-green-500/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                Cluj-Napoca, Romania
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
                    <span>&copy; {new Date().getFullYear()} PadelMarket. Lucrare de licenta.</span>
                    <span className="mt-2 md:mt-0">Toate drepturile rezervate.</span>
                </div>
            </div>
        </footer>
    );
}
