@extends('emails.layout')

@php
    $paymentLabels = [
        'cash_on_delivery' => 'Ramburs la curier',
        'card' => 'Card online',
        'bank_transfer' => 'Transfer bancar',
    ];
@endphp

@section('content')
    <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; padding: 8px 20px; border-radius: 999px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
            Comanda confirmata
        </div>
    </div>

    <h1 style="margin: 0 0 8px 0; color: #1a2332; font-size: 24px; font-weight: 700; text-align: center;">
        Comanda plasata cu succes!
    </h1>

    <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 14px; text-align: center;">
        Numar comanda: <strong style="color: #1a2332; font-family: monospace;">{{ $order->order_number }}</strong>
    </p>

    <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
        Salut <strong>{{ $order->shipping_name }}</strong>,
    </p>

    <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
        Iti multumim pentru comanda! Am primit-o si o vom procesa in cel mai scurt timp. Vei primi un email cand statusul comenzii se schimba.
    </p>

    {{-- Tabel produse --}}
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <tr style="background-color: #f9fafb;">
            <th style="text-align: left; padding: 12px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; font-weight: 600;">Produs</th>
            <th style="text-align: right; padding: 12px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; font-weight: 600;">Cant.</th>
            <th style="text-align: right; padding: 12px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; font-weight: 600;">Total</th>
        </tr>
        @foreach($order->items as $item)
            <tr style="border-top: 1px solid #f3f4f6;">
                <td style="padding: 14px 16px; font-size: 14px; color: #1a2332;">
                    {{ $item->product_name }}
                    <div style="font-size: 12px; color: #9ca3af; margin-top: 2px;">{{ number_format($item->unit_price, 2) }} RON / buc</div>
                </td>
                <td style="padding: 14px 16px; font-size: 14px; color: #4b5563; text-align: right;">{{ $item->quantity }}</td>
                <td style="padding: 14px 16px; font-size: 14px; color: #1a2332; text-align: right; font-weight: 600;">{{ number_format($item->subtotal, 2) }} RON</td>
            </tr>
        @endforeach
    </table>

    {{-- Totaluri --}}
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0;">
        <tr>
            <td style="text-align: right; padding: 4px 16px; color: #6b7280; font-size: 14px;">Subtotal:</td>
            <td style="text-align: right; padding: 4px 16px; color: #1a2332; font-size: 14px; font-weight: 600; width: 120px;">{{ number_format($order->subtotal, 2) }} RON</td>
        </tr>
        <tr>
            <td style="text-align: right; padding: 4px 16px; color: #6b7280; font-size: 14px;">Transport:</td>
            <td style="text-align: right; padding: 4px 16px; color: #1a2332; font-size: 14px; font-weight: 600;">
                @if($order->shipping_cost == 0)
                    <span style="color: #10b981;">Gratuit</span>
                @else
                    {{ number_format($order->shipping_cost, 2) }} RON
                @endif
            </td>
        </tr>
        <tr>
            <td colspan="2" style="border-top: 2px solid #e5e7eb; padding-top: 12px;"></td>
        </tr>
        <tr>
            <td style="text-align: right; padding: 4px 16px; color: #1a2332; font-size: 16px; font-weight: 700;">Total:</td>
            <td style="text-align: right; padding: 4px 16px; color: #1a2332; font-size: 20px; font-weight: 700;">{{ number_format($order->total, 2) }} RON</td>
        </tr>
    </table>

    {{-- Detalii livrare --}}
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0; background-color: #f9fafb; border-radius: 12px;">
        <tr>
            <td style="padding: 20px;">
                <h3 style="margin: 0 0 12px 0; color: #1a2332; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Adresa de livrare</h3>
                <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
                    {{ $order->shipping_name }}<br>
                    {{ $order->shipping_phone }}<br>
                    {{ $order->shipping_address }}<br>
                    {{ $order->shipping_city }} {{ $order->shipping_postal_code }}
                </p>
                <p style="margin: 16px 0 0 0; color: #4b5563; font-size: 14px;">
                    <strong>Plata:</strong> {{ $paymentLabels[$order->payment_method] ?? $order->payment_method }}
                </p>
            </td>
        </tr>
    </table>

    {{-- CTA --}}
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
        <tr>
            <td align="center">
                <a href="{{ config('app.frontend_url', config('app.url')) }}/order-confirmation/{{ $order->id }}"
                   style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                    Vezi detalii comanda
                </a>
            </td>
        </tr>
    </table>
@endsection
