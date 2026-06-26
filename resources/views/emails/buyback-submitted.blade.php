@extends('emails.layout')

@section('content')
    <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; padding: 8px 20px; border-radius: 999px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
            Buy-back
        </div>
    </div>

    <h1 style="margin: 0 0 16px 0; color: #1a2332; font-size: 24px; font-weight: 700; text-align: center;">
        Cerere primita!
    </h1>

    <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
        Salut <strong>{{ $buybackRequest->user->name ?? 'utilizator' }}</strong>,
    </p>

    <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
        Am primit cererea ta de buy-back pentru racheta. Echipa noastra va analiza informatiile si te va contacta in maxim <strong>24-48 ore</strong> cu un raspuns.
    </p>

    {{-- Detalii racheta + pret estimat --}}
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0; background-color: #f9fafb; border-radius: 12px;">
        <tr>
            <td style="padding: 20px;">
                <h3 style="margin: 0 0 12px 0; color: #1a2332; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Detalii cerere</h3>

                @if($buybackRequest->padelRacket)
                    <p style="margin: 0 0 8px 0; color: #4b5563; font-size: 14px;">
                        <strong>Racheta:</strong> {{ $buybackRequest->padelRacket->brand->name ?? '' }} {{ $buybackRequest->padelRacket->model }}
                    </p>
                @endif

                @if($buybackRequest->offered_price)
                    <p style="margin: 8px 0 0 0; padding-top: 12px; border-top: 1px solid #e5e7eb; color: #1a2332; font-size: 16px;">
                        <strong>Pret estimat:</strong>
                        <span style="color: #10b981; font-size: 20px; font-weight: 700;">
                            {{ number_format($buybackRequest->offered_price, 2) }} RON
                        </span>
                    </p>
                @endif

                <p style="margin: 12px 0 0 0; color: #9ca3af; font-size: 12px;">
                    * Pretul final poate varia in functie de inspectia fizica a rachetei.
                </p>
            </td>
        </tr>
    </table>

    {{-- Pasi urmatori --}}
    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px 20px; border-radius: 8px; margin: 24px 0;">
        <p style="margin: 0 0 8px 0; color: #92400e; font-size: 14px; font-weight: 600;">Ce urmeaza?</p>
        <ol style="margin: 0; padding-left: 20px; color: #92400e; font-size: 13px; line-height: 1.8;">
            <li>Echipa noastra evalueaza cererea</li>
            <li>Te contactam telefonic sau pe email pentru detalii</li>
            <li>Trimiti racheta prin curier (gratuit)</li>
            <li>Confirmam pretul final si efectuam plata</li>
        </ol>
    </div>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
        <tr>
            <td align="center">
                <a href="{{ config('app.frontend_url', config('app.url')) }}/my-requests"
                   style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                    Vezi cererile mele
                </a>
            </td>
        </tr>
    </table>
@endsection
