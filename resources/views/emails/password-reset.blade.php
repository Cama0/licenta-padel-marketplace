@extends('emails.layout')

@section('content')
    <h1 style="margin: 0 0 16px 0; color: #1a2332; font-size: 24px; font-weight: 700;">
        Resetare parola
    </h1>

    <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
        Salut <strong>{{ $userName }}</strong>,
    </p>

    <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
        Ai cerut resetarea parolei pentru contul tau PadelMarket. Apasa pe butonul de mai jos pentru a seta o parola noua:
    </p>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
        <tr>
            <td align="center">
                <a href="{{ $resetUrl }}"
                   style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                    Reseteaza parola
                </a>
            </td>
        </tr>
    </table>

    <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px 18px; border-radius: 8px; margin: 24px 0;">
        <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.5;">
            <strong>Link valabil 60 minute.</strong> Daca nu ai cerut tu acest reset, ignora email-ul - parola ta nu va fi schimbata.
        </p>
    </div>

    <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 12px; line-height: 1.5; word-break: break-all;">
        Daca butonul nu functioneaza, copiaza acest link in browser:<br>
        <a href="{{ $resetUrl }}" style="color: #10b981; text-decoration: none;">{{ $resetUrl }}</a>
    </p>
@endsection
