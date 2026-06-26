import { Link } from 'react-router-dom';

export default function AboutUs() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-gradient-to-r from-[#0f1720] to-[#1a2332]">
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h1 className="font-['Oswald'] text-3xl md:text-4xl font-bold uppercase tracking-wide text-white">
                        Despre <span className="text-gradient">PadelMarket</span>
                    </h1>
                    <p className="text-gray-500 mt-2">Povestea din spatele marketplace-ului tau de padel</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-12 shadow-sm space-y-8">
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h2 className="font-['Oswald'] text-xl font-bold uppercase">Misiunea noastra</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            PadelMarket a fost creat cu un scop simplu: sa facem echipamentul de padel accesibil tuturor jucatorilor din Romania.
                            Cream o punte intre jucatorii care vor sa isi upgrade-uiasca racheta si cei care cauta echipament de calitate la un pret redus.
                        </p>
                    </section>
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h2 className="font-['Oswald'] text-xl font-bold uppercase">Ce oferim</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { title: 'Rachete Noi', desc: 'Cele mai recente modele de la branduri de top: Nox, Bullpadel, Head, Babolat, Siux si Adidas.' },
                                { title: 'Rachete Refurbished', desc: 'Rachete reconditionate profesional, testate si certificate, cu garantie inclusa.' },
                                { title: 'Program Buy-Back', desc: 'Vinde-ti racheta veche rapid si simplu. Evaluare instant si pret corect.' },
                                { title: 'Ghid personalizat', desc: 'Recomandari de rachete in functie de stilul si nivelul tau de joc, pe baza unui chestionar scurt.' },
                            ].map((item) => (
                                <div key={item.title} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                    <h3 className="font-semibold text-gray-800 mb-1 text-sm">{item.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h2 className="font-['Oswald'] text-xl font-bold uppercase">Garantia calitatii</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            Fiecare racheta refurbished trece printr-un proces riguros de inspectie si reconditionare.
                            Verificam integritatea cadrului, starea suprafetei de joc, grip-ul si balansul.
                            Doar rachetele care trec toate testele ajung in magazinul nostru, insotite de un grad de conditie transparent (A+, A, B, C).
                        </p>
                    </section>
                    <div className="text-center pt-4">
                        <p className="text-gray-500 mb-4">Ai intrebari? Nu ezita sa ne contactezi.</p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <Link to="/products" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-green-500/20">
                                Exploreaza produsele
                            </Link>
                            <Link to="/advisor" className="border border-green-500/50 text-green-600 hover:bg-green-50 px-6 py-2.5 rounded-xl font-semibold text-sm transition">
                                Gaseste racheta perfecta
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
