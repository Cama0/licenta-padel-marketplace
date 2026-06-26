@extends('pdfs.layout')

@php
    $statusBadges = [
        'pending' => ['class' => 'badge-warning', 'label' => 'Plasata'],
        'confirmed' => ['class' => 'badge-info', 'label' => 'Confirmata'],
        'processing' => ['class' => 'badge-info', 'label' => 'In procesare'],
        'shipped' => ['class' => 'badge-info', 'label' => 'Expediata'],
        'delivered' => ['class' => 'badge-success', 'label' => 'Livrata'],
        'cancelled' => ['class' => 'badge-danger', 'label' => 'Anulata'],
    ];
    $paymentStatusBadges = [
        'pending' => ['class' => 'badge-warning', 'label' => 'In asteptare'],
        'paid' => ['class' => 'badge-success', 'label' => 'Platita'],
        'failed' => ['class' => 'badge-danger', 'label' => 'Esuata'],
        'refunded' => ['class' => 'badge-neutral', 'label' => 'Rambursata'],
    ];
    $paymentMethods = [
        'cash_on_delivery' => 'Ramburs la curier',
        'card' => 'Card online',
        'bank_transfer' => 'Transfer bancar',
    ];

    $statusBadge = $statusBadges[$order->status] ?? ['class' => 'badge-neutral', 'label' => $order->status];
    $paymentBadge = $paymentStatusBadges[$order->payment_status] ?? ['class' => 'badge-neutral', 'label' => $order->payment_status];
@endphp

@section('content')
    {{-- Titlu document --}}
    <h1>Factura proforma</h1>
    <div class="doc-meta">
        Numar comanda: <span class="doc-number">{{ $order->order_number }}</span>
        &nbsp;·&nbsp; Data: {{ $order->created_at->format('d.m.Y H:i') }}
        &nbsp;·&nbsp; <span class="badge {{ $statusBadge['class'] }}">{{ $statusBadge['label'] }}</span>
        &nbsp;<span class="badge {{ $paymentBadge['class'] }}">{{ $paymentBadge['label'] }}</span>
    </div>

    {{-- Adresa livrare + plata --}}
    <table class="info-row">
        <tr>
            <td>
                <div class="info-block">
                    <div class="label">Livrare catre</div>
                    <strong>{{ $order->shipping_name }}</strong><br>
                    {{ $order->shipping_email }}<br>
                    {{ $order->shipping_phone }}<br>
                    {{ $order->shipping_address }}<br>
                    {{ $order->shipping_city }} {{ $order->shipping_postal_code }}
                </div>
            </td>
            <td class="right">
                <div class="info-block">
                    <div class="label">Detalii plata</div>
                    <strong>{{ $paymentMethods[$order->payment_method] ?? $order->payment_method }}</strong><br>
                    Status: {{ $paymentBadge['label'] }}<br>
                    @if($order->notes)
                        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
                            <span class="label">Observatii:</span><br>
                            {{ $order->notes }}
                        </div>
                    @endif
                </div>
            </td>
        </tr>
    </table>

    {{-- Tabel produse --}}
    <h2>Produse comandate</h2>
    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 50%;">Produs</th>
                <th class="right" style="width: 15%;">Pret unitar</th>
                <th class="right" style="width: 15%;">Cantitate</th>
                <th class="right" style="width: 20%;">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
                <tr>
                    <td>
                        <strong>{{ $item->product_name }}</strong>
                        @if($item->product_slug)
                            <div class="product-meta">cod: {{ $item->product_slug }}</div>
                        @endif
                    </td>
                    <td class="right">{{ number_format($item->unit_price, 2, ',', '.') }} RON</td>
                    <td class="right">{{ $item->quantity }} buc.</td>
                    <td class="right"><strong>{{ number_format($item->subtotal, 2, ',', '.') }} RON</strong></td>
                </tr>
            @endforeach
        </tbody>
    </table>

    {{-- Totaluri --}}
    <table class="totals-table">
        <tr>
            <td class="label">Subtotal:</td>
            <td class="value">{{ number_format($order->subtotal, 2, ',', '.') }} RON</td>
        </tr>
        <tr>
            <td class="label">Transport:</td>
            <td class="value">
                @if((float) $order->shipping_cost === 0.0)
                    Gratuit
                @else
                    {{ number_format($order->shipping_cost, 2, ',', '.') }} RON
                @endif
            </td>
        </tr>
        <tr class="grand-total">
            <td class="label">TOTAL DE PLATA:</td>
            <td class="value">{{ number_format($order->total, 2, ',', '.') }} RON</td>
        </tr>
    </table>

    {{-- Note legale --}}
    <div style="margin-top: 35px; padding: 12px 14px; background-color: #fffbeb; border-left: 3px solid #f59e0b; font-size: 9px; color: #92400e; border-radius: 4px;">
        <strong>Important:</strong> Acest document este o factura proforma generata automat. Factura fiscala originala va fi livrata impreuna cu marfa. Pretul include TVA. In cazul comenzilor cu ramburs, plata se efectueaza la livrare. Conform politicii de retur, ai dreptul sa returnezi produsele in 30 zile de la primire.
    </div>
@endsection
