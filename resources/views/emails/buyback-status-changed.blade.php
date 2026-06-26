@extends('emails.layout')

@php
    $statusColors = [
        'accepted' => ['bg' => '#d1fae5', 'border' => '#10b981', 'text' => '#065f46'],
        'rejected' => ['bg' => '#fee2e2', 'border' => '#ef4444', 'text' => '#991b1b'],
        'completed' => ['bg' => '#dbeafe', 'border' => '#06b6d4', 'text' => '#155e75'],
    ];
    $colors = $statusColors[$newStatus] ?? ['bg' => '#f3f4f6', 'border' => '#9ca3af', 'text' => '#374151'];
@endphp

@section('content')
    <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; padding: 8px 20px; border-radius: 999px; background-color: {{ $colors['border'] }}; color: #ffffff; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
            {{ $statusLabel }}
        </div>
    </div>

    <h1 style="margin: 0 0 16px 0; color: #1a2332; font-size: 24px; font-weight: 700; text-align: center;">
        Cerere {{ $statusLabel }}
    </h1>

    <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
        Salut <strong>{{ $request->user->name ?? 'utilizator' }}</strong>,
    </p>

    <div style="background-color: {{ $colors['bg'] }}; border-left: 4px solid {{ $colors['border'] }}; padding: 16px 20px; border-radius: 8px; margin: 16px 0;">
        <p style="margin: 0; color: {{ $colors['text'] }}; font-size: 15px; line-height: 1.6;">
            {{ $statusMessage }}
        </p>
    </div>

    @if($request->offered_price && in_array($newStatus, ['accepted', 'completed']))
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0; background-color: #f9fafb; border-radius: 12px;">
            <tr>
                <td style="padding: 20px; text-align: center;">
                    <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Pret confirmat</p>
                    <p style="margin: 0; color: #10b981; font-size: 28px; font-weight: 700;">
                        {{ number_format($request->offered_price, 2) }} RON
                    </p>
                </td>
            </tr>
        </table>
    @endif

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
        <tr>
            <td align="center">
                <a href="{{ config('app.frontend_url', config('app.url')) }}/my-requests"
                   style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                    Vezi cererile mele
                </a>
            </td>
        </tr>
    </table>
@endsection
