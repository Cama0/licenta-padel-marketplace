@extends('emails.layout')

@php
    $statusColors = [
        'confirmed' => ['bg' => '#dbeafe', 'border' => '#3b82f6', 'text' => '#1e40af'],
        'processing' => ['bg' => '#f3e8ff', 'border' => '#8b5cf6', 'text' => '#6b21a8'],
        'shipped' => ['bg' => '#e0e7ff', 'border' => '#6366f1', 'text' => '#3730a3'],
        'delivered' => ['bg' => '#d1fae5', 'border' => '#10b981', 'text' => '#065f46'],
        'cancelled' => ['bg' => '#fee2e2', 'border' => '#ef4444', 'text' => '#991b1b'],
    ];
    $colors = $statusColors[$newStatus] ?? ['bg' => '#f3f4f6', 'border' => '#9ca3af', 'text' => '#374151'];
@endphp

@section('content')
    <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; padding: 8px 20px; border-radius: 999px; background-color: {{ $colors['border'] }}; color: #ffffff; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
            {{ $statusLabel }}
        </div>
    </div>

    <h1 style="margin: 0 0 8px 0; color: #1a2332; font-size: 24px; font-weight: 700; text-align: center;">
        Comanda {{ $statusLabel }}
    </h1>

    <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 14px; text-align: center;">
        Numar comanda: <strong style="color: #1a2332; font-family: monospace;">{{ $order->order_number }}</strong>
    </p>

    <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
        Salut <strong>{{ $order->shipping_name }}</strong>,
    </p>

    <div style="background-color: {{ $colors['bg'] }}; border-left: 4px solid {{ $colors['border'] }}; padding: 16px 20px; border-radius: 8px; margin: 16px 0;">
        <p style="margin: 0; color: {{ $colors['text'] }}; font-size: 15px; line-height: 1.6;">
            {{ $statusMessage }}
        </p>
    </div>

    {{-- Sumar comanda compact --}}
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0; background-color: #f9fafb; border-radius: 12px;">
        <tr>
            <td style="padding: 16px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                        <td style="color: #6b7280; font-size: 13px;">Produse:</td>
                        <td style="color: #1a2332; font-size: 13px; text-align: right; font-weight: 600;">
                            {{ $order->items->sum('quantity') }} {{ $order->items->sum('quantity') == 1 ? 'produs' : 'produse' }}
                        </td>
                    </tr>
                    <tr>
                        <td style="color: #6b7280; font-size: 13px; padding-top: 6px;">Total:</td>
                        <td style="color: #1a2332; font-size: 16px; text-align: right; font-weight: 700; padding-top: 6px;">
                            {{ number_format($order->total, 2) }} RON
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
        <tr>
            <td align="center">
                <a href="{{ config('app.frontend_url', config('app.url')) }}/order-confirmation/{{ $order->id }}"
                   style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                    Vezi comanda
                </a>
            </td>
        </tr>
    </table>
@endsection
