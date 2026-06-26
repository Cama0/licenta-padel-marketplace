export default function ReturnPolicy() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-gradient-to-r from-[#0f1720] to-[#1a2332]">
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h1 className="font-['Oswald'] text-3xl md:text-4xl font-bold uppercase tracking-wide text-white">
                        Politica de <span className="text-gradient">Retur</span>
                    </h1>
                    <p className="text-gray-500 mt-2">Informatii despre returnarea produselor</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-12 shadow-sm space-y-8">
                    <section>
                        <h2 className="font-['Oswald'] text-lg font-bold uppercase mb-3">Dreptul de retur - 30 de zile</h2>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            Ai dreptul sa returnezi orice produs achizitionat de pe PadelMarket in termen de 30 de zile calendaristice
                            de la data primirii comenzii, fara a fi necesara justificarea deciziei. Aceasta politica se aplica
                            atat produselor noi cat si produselor refurbished.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-['Oswald'] text-lg font-bold uppercase mb-3">Conditii de retur</h2>
                        <ul className="space-y-2 text-gray-600 text-sm">
                            {[
                                'Produsul trebuie sa fie in starea in care a fost livrat, fara urme de utilizare excesiva.',
                                'Ambalajul original trebuie sa fie intact (daca a fost livrat cu ambalaj).',
                                'Toate accesoriile livrate impreuna cu produsul trebuie incluse in retur.',
                                'Produsul nu trebuie sa prezinte daune mecanice provocate de utilizator.',
                                'Cererea de retur trebuie initiata in termen de 30 de zile de la primire.',
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-['Oswald'] text-lg font-bold uppercase mb-3">Procesul de retur</h2>
                        <div className="space-y-3">
                            {[
                                { step: '1', text: 'Contacteaza-ne la contact@padelmarket.ro sau la 0721 000 000 si mentioneaza numarul comenzii.' },
                                { step: '2', text: 'Vei primi un email de confirmare cu instructiuni de trimitere si eticheta de retur.' },
                                { step: '3', text: 'Impacheteaza produsul corespunzator si trimite-l prin curier.' },
                                { step: '4', text: 'Dupa verificarea produsului, rambursarea se proceseaza in 5-10 zile lucratoare.' },
                            ].map((item) => (
                                <div key={item.step} className="flex items-start gap-3">
                                    <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1a2332] to-[#2e3946] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                                        {item.step}
                                    </span>
                                    <p className="text-gray-600 text-sm leading-relaxed">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="font-['Oswald'] text-lg font-bold uppercase mb-3">Rambursarea</h2>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            Rambursarea se face prin aceeasi metoda de plata folosita la achizitie. Costurile de transport
                            pentru retur sunt suportate de PadelMarket daca produsul prezinta defecte sau nu corespunde
                            descrierii. In caz contrar, costul de retur este in sarcina cumparatorului.
                        </p>
                    </section>

                    <div className="bg-green-50 border border-green-100 rounded-xl p-5">
                        <p className="text-green-700 text-sm">
                            <strong>Nota:</strong> Aceasta politica de retur nu afecteaza drepturile legale ale consumatorului
                            conform legislatiei din Romania (OUG 34/2014).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
