import { Link } from 'react-router-dom';

export default function HowBuyback() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-gradient-to-r from-[#0f1720] to-[#1a2332]">
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h1 className="font-['Oswald'] text-3xl md:text-4xl font-bold uppercase tracking-wide text-white">
                        Cum functioneaza <span className="text-gradient-orange">Buy-Back</span>
                    </h1>
                    <p className="text-gray-500 mt-2">Ghid complet pentru vanzarea rachetei tale</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-12 shadow-sm space-y-10">
                    <section>
                        <h2 className="font-['Oswald'] text-xl font-bold uppercase mb-6 text-center">Procesul in 3 pasi simpli</h2>
                        <div className="space-y-6">
                            {[
                                {
                                    step: '1',
                                    title: 'Selecteaza racheta ta',
                                    desc: 'Alege brandul si modelul rachetei tale din catalogul nostru. Avem in baza de date rachete de la cele mai populare branduri: Nox, Bullpadel, Head, Babolat, Siux si Adidas.',
                                    color: 'from-blue-500 to-blue-600'
                                },
                                {
                                    step: '2',
                                    title: 'Completeaza evaluarea',
                                    desc: 'Raspunde la cateva intrebari despre starea rachetei tale: starea cadrului, a suprafetei de joc, grip-ul si aspectul general. Pe baza raspunsurilor, algoritmul nostru calculeaza un pret corect instant.',
                                    color: 'from-orange-500 to-orange-600'
                                },
                                {
                                    step: '3',
                                    title: 'Primeste oferta si vinde',
                                    desc: 'Primesti o oferta de pret transparenta cu detalierea calculului. Daca esti de acord, trimite cererea si te vom contacta pentru finalizarea tranzactiei. Primesti banii rapid dupa verificarea rachetei.',
                                    color: 'from-green-500 to-green-600'
                                },
                            ].map((item) => (
                                <div key={item.step} className="flex gap-5 items-start">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-['Oswald'] text-xl font-bold flex-shrink-0 shadow-lg`}>
                                        {item.step}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h2 className="font-['Oswald'] text-xl font-bold uppercase mb-6">Intrebari frecvente</h2>
                        <div className="space-y-4">
                            {[
                                { q: 'Cat dureaza procesul?', a: 'Evaluarea online este instantanee. Dupa trimiterea cererii, te contactam in 24-48 de ore pentru finalizare.' },
                                { q: 'Cum se calculeaza pretul?', a: 'Pornim de la pretul de baza al modelului si aplicam ajustari in functie de starea rachetei. Fiecare criteriu (cadru, suprafata, grip, aspect) influenteaza pretul final.' },
                                { q: 'Ce se intampla cu racheta mea?', a: 'Racheta ta va fi reconditonata profesional si vanduta ca produs refurbished cu garantie, contribuind la economia circulara in sportul de padel.' },
                                { q: 'Pot vinde orice racheta?', a: 'Acceptam rachete de la brandurile prezente in catalogul nostru. Racheta trebuie sa fie functionala - nu acceptam rachete cu cadrul spart.' },
                            ].map((item, i) => (
                                <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                    <h3 className="font-semibold text-gray-800 text-sm mb-1">{item.q}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                    <div className="text-center pt-4">
                        <Link
                            to="/buyback"
                            className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3.5 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20"
                        >
                            Incepe evaluarea acum
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
