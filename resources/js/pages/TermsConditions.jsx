export default function TermsConditions() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-gradient-to-r from-[#0f1720] to-[#1a2332]">
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h1 className="font-['Oswald'] text-3xl md:text-4xl font-bold uppercase tracking-wide text-white">
                        Termeni si <span className="text-gradient">Conditii</span>
                    </h1>
                    <p className="text-gray-500 mt-2">Ultima actualizare: Aprilie 2026</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-12 shadow-sm space-y-8">
                    <section>
                        <h2 className="font-['Oswald'] text-lg font-bold uppercase mb-3">1. Informatii generale</h2>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            PadelMarket este un marketplace online dedicat echipamentelor de padel, oferind produse noi
                            si refurbished, precum si un program de buy-back pentru rachetele uzate. Prin accesarea si
                            utilizarea platformei, accepti acesti termeni si conditii in totalitate.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-['Oswald'] text-lg font-bold uppercase mb-3">2. Contul de utilizator</h2>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            Pentru a utiliza serviciul de buy-back si pentru a trimite cereri, este necesar un cont.
                            Esti responsabil pentru pastrarea confidentialitatii datelor de autentificare.
                            Informatiile furnizate la inregistrare trebuie sa fie corecte si complete.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-['Oswald'] text-lg font-bold uppercase mb-3">3. Produse si preturi</h2>
                        <ul className="space-y-2 text-gray-600 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-gray-400 mt-0.5">•</span>
                                Preturile afisate sunt in RON si includ TVA.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-gray-400 mt-0.5">•</span>
                                Produsele refurbished sunt clar marcate cu gradul de conditie (A+, A, B, C).
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-gray-400 mt-0.5">•</span>
                                Ne rezervam dreptul de a modifica preturile fara notificare prealabila.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-gray-400 mt-0.5">•</span>
                                Disponibilitatea produselor este afisata in timp real, dar poate varia.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-['Oswald'] text-lg font-bold uppercase mb-3">4. Programul Buy-Back</h2>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            Prin programul Buy-Back, utilizatorii pot vinde rachete de padel catre PadelMarket.
                            Pretul oferit este calculat automat pe baza modelului rachetei si a starii evaluate de
                            utilizator. PadelMarket isi rezerva dreptul de a ajusta pretul dupa inspectia fizica
                            a rachetei. Oferta de pret este valabila 7 zile de la emitere.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-['Oswald'] text-lg font-bold uppercase mb-3">5. Livrare</h2>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            Livrarea se efectueaza pe teritoriul Romaniei prin servicii de curierat.
                            Transportul este gratuit pentru comenzi peste 300 RON. Termenul estimat de livrare
                            este de 2-5 zile lucratoare.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-['Oswald'] text-lg font-bold uppercase mb-3">6. Garantie</h2>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            Produsele noi beneficiaza de garantia producatorului. Produsele refurbished sunt
                            acoperite de garantia PadelMarket pe o perioada de 6 luni de la achizitie.
                            Garantia acopera defecte de fabricatie si probleme de functionare in conditii
                            normale de utilizare.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-['Oswald'] text-lg font-bold uppercase mb-3">7. Protectia datelor</h2>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            Datele personale sunt prelucrate conform GDPR. Folosim informatiile tale doar
                            pentru procesarea comenzilor, gestionarea contului si comunicari legate de serviciu.
                            Nu partajam datele tale cu terti fara consimtamantul tau.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-['Oswald'] text-lg font-bold uppercase mb-3">8. Contact</h2>
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                            <p className="text-gray-600 text-sm">
                                Pentru orice intrebari legate de acesti termeni, ne poti contacta la:
                            </p>
                            <ul className="mt-2 space-y-1 text-sm text-gray-600">
                                <li><strong>Email:</strong> contact@padelmarket.ro</li>
                                <li><strong>Telefon:</strong> 0721 000 000</li>
                                <li><strong>Adresa:</strong> Bucuresti, Romania</li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
