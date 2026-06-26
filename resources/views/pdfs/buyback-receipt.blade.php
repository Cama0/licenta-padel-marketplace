@extends('pdfs.layout')

@php
    $statusBadges = [
        'pending' => ['class' => 'badge-warning', 'label' => 'In asteptare'],
        'accepted' => ['class' => 'badge-success', 'label' => 'Acceptata'],
        'rejected' => ['class' => 'badge-danger', 'label' => 'Respinsa'],
        'completed' => ['class' => 'badge-info', 'label' => 'Finalizata'],
    ];
    $statusBadge = $statusBadges[$request->status] ?? ['class' => 'badge-neutral', 'label' => $request->status];

    // Numar formatat: BB-YYYYMMDD-XXXX
    $requestNumber = 'BB-' . $request->created_at->format('Ymd') . '-' . str_pad($request->id, 4, '0', STR_PAD_LEFT);
@endphp

@section('content')
    <h1>Chitanta evaluare buy-back</h1>
    <div class="doc-meta">
        Numar cerere: <span class="doc-number">{{ $requestNumber }}</span>
        &nbsp;·&nbsp; Data: {{ $request->created_at->format('d.m.Y H:i') }}
        &nbsp;·&nbsp; <span class="badge {{ $statusBadge['class'] }}">{{ $statusBadge['label'] }}</span>
    </div>

    {{-- Vanzator (user) + Racheta --}}
    <table class="info-row">
        <tr>
            <td>
                <div class="info-block">
                    <div class="label">Vanzator</div>
                    @if($request->user)
                        <strong>{{ $request->user->name }}</strong><br>
                        {{ $request->user->email }}<br>
                        @if($request->user->phone)
                            {{ $request->user->phone }}<br>
                        @endif
                        @if($request->user->address)
                            {{ $request->user->address }}
                        @endif
                    @else
                        <em>Utilizator anonim</em>
                    @endif
                </div>
            </td>
            <td class="right">
                <div class="info-block" style="border-left-color: #f59e0b;">
                    <div class="label">Racheta evaluata</div>
                    @if($request->padelRacket)
                        <strong>{{ $request->padelRacket->brand->name ?? '' }} {{ $request->padelRacket->model }}</strong><br>
                        <span class="text-muted" style="font-size: 9px;">
                            Pret de baza catalog:
                            <strong style="color: #1a2332;">{{ number_format($request->padelRacket->base_buyback_price, 2, ',', '.') }} RON</strong>
                        </span>
                    @else
                        <em>Racheta nu mai este in catalog</em>
                    @endif
                </div>
            </td>
        </tr>
    </table>

    {{-- Tabel evaluare --}}
    <h2>Detalii evaluare</h2>
    <table class="eval-list">
        @foreach($request->selectedOptions as $option)
            <tr>
                <td class="criterion">{{ $option->criterion->name ?? 'Criteriu necunoscut' }}</td>
                <td class="answer">{{ $option->label }}</td>
                <td class="right" style="width: 100px; color: #6b7280; font-size: 10px;">
                    @if($option->price_modifier_value > 0)
                        +{{ $option->price_modifier_type === 'percentage' ? $option->price_modifier_value . '%' : number_format($option->price_modifier_value, 0) . ' RON' }}
                    @elseif($option->price_modifier_value < 0)
                        {{ $option->price_modifier_type === 'percentage' ? $option->price_modifier_value . '%' : number_format($option->price_modifier_value, 0) . ' RON' }}
                    @else
                        —
                    @endif
                </td>
            </tr>
        @endforeach
    </table>

    {{-- Pret oferit --}}
    <div style="margin-top: 25px; background: linear-gradient(135deg, #f0fdf4, #d1fae5); border: 2px solid #10b981; border-radius: 10px; padding: 18px; text-align: center;">
        <div style="font-size: 10px; text-transform: uppercase; color: #065f46; letter-spacing: 1px; margin-bottom: 6px;">
            Pret oferit pentru racheta ta
        </div>
        <div style="font-size: 28px; font-weight: bold; color: #065f46;">
            {{ number_format($request->offered_price, 2, ',', '.') }} RON
        </div>
        @if($request->status === 'pending')
            <div style="font-size: 9px; color: #065f46; margin-top: 4px;">
                * Pret estimativ, supus inspectiei fizice a rachetei
            </div>
        @endif
    </div>

    {{-- Pasi urmatori (doar pentru cereri pending sau accepted) --}}
    @if(in_array($request->status, ['pending', 'accepted']))
        <h2>Pasii urmatori</h2>
        <ol style="padding-left: 20px; font-size: 10px; line-height: 1.8;">
            @if($request->status === 'pending')
                <li>Echipa noastra evalueaza cererea ta in 24-48 ore</li>
                <li>Te contactam telefonic sau pe email pentru detalii</li>
                <li>Iti trimitem un AWB de curier gratuit</li>
                <li>Trimiti racheta in ambalajul original (sau echivalent)</li>
                <li>Inspectam racheta si confirmam pretul final</li>
                <li>Iti facem plata in maxim 3 zile lucratoare</li>
            @else
                <li><strong>Cererea ta a fost acceptata!</strong></li>
                <li>Te contactam in cel mai scurt timp pentru AWB-ul curierului</li>
                <li>Trimiti racheta gratuit prin curierul indicat</li>
                <li>Confirmam pretul final dupa inspectia fizica</li>
                <li>Plata in 3 zile lucratoare prin transfer bancar</li>
            @endif
        </ol>
    @endif

    {{-- Note legale --}}
    <div style="margin-top: 25px; padding: 12px 14px; background-color: #fffbeb; border-left: 3px solid #f59e0b; font-size: 9px; color: #92400e; border-radius: 4px;">
        <strong>Important:</strong> Pretul oferit este calculat automat pe baza informatiilor furnizate de tine si poate fi ajustat in urma inspectiei fizice a rachetei. Te rugam sa ambalezi racheta corespunzator pentru transport. Pentru intrebari legate de aceasta cerere, foloseste numarul {{ $requestNumber }} in corespondenta cu noi.
    </div>
@endsection
