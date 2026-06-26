@extends('emails.layout')

@section('content')
    <h1 style="margin: 0 0 16px 0; color: #1a2332; font-size: 24px; font-weight: 700;">
        Salut, {{ $user->name }}!
    </h1>

    <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
        Bine ai venit in comunitatea <strong>PadelMarket</strong>! Contul tau a fost creat cu succes si esti gata sa explorezi cele mai bune echipamente de padel.
    </p>

    <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px 20px; border-radius: 8px; margin: 24px 0;">
        <p style="margin: 0; color: #065f46; font-size: 14px; line-height: 1.5;">
            <strong>Ce poti face acum:</strong>
        </p>
        <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #065f46; font-size: 14px; line-height: 1.8;">
            <li>Vezi catalogul de rachete noi si refurbished</li>
            <li>Foloseste ghidul nostru pentru a gasi racheta perfecta</li>
            <li>Vinde-ti racheta veche prin programul Buy-Back</li>
            <li>Bucura-te de transport gratuit la comenzi peste 500 RON</li>
        </ul>
    </div>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
        <tr>
            <td align="center">
                <a href="{{ config('app.frontend_url', config('app.url')) }}/products"
                   style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                    Exploreaza magazinul
                </a>
            </td>
        </tr>
    </table>

    <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 13px; line-height: 1.6;">
        Daca nu tu ai creat acest cont, ignora email-ul sau scrie-ne la
        <a href="mailto:contact@padelmarket.ro" style="color: #10b981; text-decoration: none;">contact@padelmarket.ro</a>.
    </p>
@endsection
